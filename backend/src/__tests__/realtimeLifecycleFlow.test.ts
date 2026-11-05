import test from 'node:test';
import assert from 'node:assert';
import { memoryDb } from '../config/prisma.js';
import {
  createOrder,
  getOrderStatus,
  updateOrderStatus,
} from '../controllers/orderController.js';
import {
  getFulfillmentQueue,
  acceptOrder,
} from '../controllers/fulfillmentController.js';
import { getLiveMetrics } from '../controllers/adminMetricsController.js';

test('Real-Time Lifecycle Flow - End-to-End Simulation', async () => {
  memoryDb.reset();

  const customerUser = memoryDb.users.get('cust_001')!;
  const warehouseUser = memoryDb.users.get('ware_001')!;
  const adminUser = memoryDb.users.get('admin_001')!;

  // 1. Customer places order
  const createReq: any = {
    user: customerUser,
    body: {
      fulfillmentType: 'DELIVERY',
      items: [
        {
          productId: 'prod_tee_1',
          name: 'Minimalist Crew Tee',
          priceInCents: 3500,
          quantity: 2,
          size: 'M',
          color: 'White',
        },
      ],
      shippingAddress: {
        street: '789 Sunset Blvd',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'USA',
      },
      totalAmountInCents: 7000,
    },
  };

  let createdOrder: any = null;
  const createRes: any = {
    status: (code: number) => ({
      json: (data: any) => {
        assert.strictEqual(code, 201);
        createdOrder = data.order;
      },
    }),
  };

  await createOrder(createReq, createRes);
  assert.ok(createdOrder);
  assert.strictEqual(createdOrder.status, 'PLACED');
  assert.strictEqual(createdOrder.totalAmountInCents, 7000);

  // 2. Warehouse screen polls fulfillment queue
  const queueReq: any = {
    user: warehouseUser,
    query: {},
  };

  let queueData: any = null;
  const queueRes: any = {
    json: (data: any) => {
      queueData = data;
    },
  };

  await getFulfillmentQueue(queueReq, queueRes);
  assert.ok(queueData);
  assert.strictEqual(queueData.success, true);
  const foundTicket = queueData.queue.find((o: any) => o.id === createdOrder.id);
  assert.ok(foundTicket, 'New order ticket MUST appear in fulfillment queue within poll cycle');
  assert.strictEqual(foundTicket.status, 'PLACED');

  // 3. Warehouse accepts order (PLACED -> PROCESSING)
  const acceptReq: any = {
    user: warehouseUser,
    params: { id: createdOrder.id },
  };

  let acceptResult: any = null;
  const acceptRes: any = {
    status: (code: number) => ({
      json: (data: any) => {
        assert.strictEqual(code, 200);
        acceptResult = data;
      },
    }),
    json: (data: any) => {
      acceptResult = data;
    },
  };

  await acceptOrder(acceptReq, acceptRes);
  assert.ok(acceptResult);
  assert.strictEqual(acceptResult.order.status, 'PROCESSING');

  // 4. Customer polls order status tracker
  const trackerReq: any = {
    params: { id: createdOrder.id },
  };

  let trackerData: any = null;
  const trackerRes: any = {
    json: (data: any) => {
      trackerData = data;
    },
  };

  await getOrderStatus(trackerReq, trackerRes);
  assert.ok(trackerData);
  assert.strictEqual(trackerData.status, 'PROCESSING', 'Customer tracker must immediately reflect PROCESSING');

  // 5. Warehouse transitions order to SHIPPED with tracking number
  const shipReq: any = {
    user: warehouseUser,
    params: { id: createdOrder.id },
    body: {
      nextStatus: 'SHIPPED',
      trackingNumber: 'TRK-9876543210-US',
      note: 'Dispatched via Express Delivery',
    },
  };

  let shipResult: any = null;
  const shipRes: any = {
    status: (code: number) => ({
      json: (data: any) => {
        assert.strictEqual(code, 200);
        shipResult = data;
      },
    }),
    json: (data: any) => {
      shipResult = data;
    },
  };

  await updateOrderStatus(shipReq, shipRes);
  assert.ok(shipResult);
  assert.strictEqual(shipResult.order.status, 'SHIPPED');
  assert.strictEqual(shipResult.order.trackingNumber, 'TRK-9876543210-US');

  // 6. Customer tracker poll reflects SHIPPED
  await getOrderStatus(trackerReq, trackerRes);
  assert.strictEqual(trackerData.status, 'SHIPPED');
  assert.strictEqual(trackerData.trackingNumber, 'TRK-9876543210-US');

  // 7. Warehouse transitions order to DELIVERED
  const deliverReq: any = {
    user: warehouseUser,
    params: { id: createdOrder.id },
    body: {
      nextStatus: 'DELIVERED',
      note: 'Signed by recipient at door',
    },
  };

  await updateOrderStatus(deliverReq, shipRes);
  assert.strictEqual(shipResult.order.status, 'DELIVERED');

  // 8. Admin polls Live Metrics & Inventory Telemetry
  const adminReq: any = {
    user: adminUser,
  };

  let metricsData: any = null;
  const adminRes: any = {
    json: (data: any) => {
      metricsData = data;
    },
  };

  await getLiveMetrics(adminReq, adminRes);
  assert.ok(metricsData);
  assert.strictEqual(metricsData.success, true);
  assert.ok(metricsData.metrics.totalOrders >= 2);
  assert.strictEqual(metricsData.metrics.statusBreakdown.DELIVERED >= 1, true);
  assert.ok(Array.isArray(metricsData.metrics.inventory), 'Metrics must include catalog inventory telemetry');
  assert.ok(Array.isArray(metricsData.metrics.recentOrders), 'Metrics must include recent orders for arrival alerts');
});

test('Real-Time Lifecycle Flow - In-Store Pickup Lifecycle & Inventory Deduction', async () => {
  memoryDb.reset();

  const customerUser = memoryDb.users.get('cust_001')!;
  const warehouseUser = memoryDb.users.get('ware_001')!;
  const prod = memoryDb.products.get('prod_jogger_olive')!;
  const initialStock = prod.stock;
  const initialReserved = prod.reservedStock;

  // 1. Customer places PICKUP order
  const createReq: any = {
    user: customerUser,
    body: {
      fulfillmentType: 'PICKUP',
      items: [
        {
          productId: 'prod_jogger_olive',
          name: 'Kids Jogger Pant',
          priceInCents: 2500,
          quantity: 2,
          size: 'L',
          color: 'Olive',
        },
      ],
      totalAmountInCents: 5000,
    },
  };

  let order: any = null;
  const resHandler: any = {
    status: () => ({
      json: (d: any) => { order = d.order; },
    }),
    json: (d: any) => { order = d.order; },
  };

  await createOrder(createReq, resHandler);
  assert.strictEqual(order.status, 'PLACED');
  assert.strictEqual(order.fulfillmentType, 'PICKUP');
  assert.strictEqual(prod.reservedStock, initialReserved + 2, 'Stock must be reserved upon order placement');

  // 2. Warehouse accepts order -> PROCESSING
  const acceptReq: any = { user: warehouseUser, params: { id: order.id } };
  const { acceptOrder, completeOrder } = await import('../controllers/fulfillmentController.js');
  await acceptOrder(acceptReq, resHandler);
  assert.strictEqual(order.status, 'PROCESSING');

  // 3. Warehouse stages for pickup -> READY_FOR_PICKUP
  const { transitionFulfillmentOrderStatus } = await import('../controllers/fulfillmentController.js');
  const stageReq: any = {
    user: warehouseUser,
    params: { id: order.id },
    body: { nextStatus: 'READY_FOR_PICKUP', note: 'Staged at counter A3' },
  };
  await transitionFulfillmentOrderStatus(stageReq, resHandler);
  assert.strictEqual(order.status, 'READY_FOR_PICKUP');

  // 4. Warehouse completes order when customer collects -> COMPLETED
  const completeReq: any = { user: warehouseUser, params: { id: order.id } };
  await completeOrder(completeReq, resHandler);
  assert.strictEqual(order.status, 'COMPLETED');
  assert.strictEqual(prod.stock, initialStock - 2, 'Physical stock must be deducted upon completion');
  assert.strictEqual(prod.reservedStock, initialReserved, 'Reserved stock must be cleared upon completion');
});

test('Real-Time Lifecycle Flow - Customer Cancellation Releases Reserved Stock', async () => {
  memoryDb.reset();

  const customerUser = memoryDb.users.get('cust_001')!;
  const prod = memoryDb.products.get('prod_hoodie_sage')!;
  const initialStock = prod.stock;
  const initialReserved = prod.reservedStock;

  // 1. Customer places order
  const createReq: any = {
    user: customerUser,
    body: {
      fulfillmentType: 'DELIVERY',
      items: [
        {
          productId: 'prod_hoodie_sage',
          name: 'Kids Crewneck Sweatshirt',
          priceInCents: 3200,
          quantity: 1,
        },
      ],
      totalAmountInCents: 3200,
    },
  };

  let order: any = null;
  const resHandler: any = {
    status: () => ({
      json: (d: any) => { order = d.order; },
    }),
    json: (d: any) => { order = d.order; },
  };

  await createOrder(createReq, resHandler);
  assert.strictEqual(order.status, 'PLACED');
  assert.strictEqual(prod.reservedStock, initialReserved + 1, 'Stock must be reserved');

  // 2. Customer cancels order while in PLACED
  const { cancelOrder } = await import('../controllers/orderController.js');
  const cancelReq: any = {
    user: customerUser,
    params: { id: order.id },
    body: { reason: 'Changed mind before shipping' },
  };

  await cancelOrder(cancelReq, resHandler);
  assert.strictEqual(order.status, 'CANCELLED');
  assert.strictEqual(prod.reservedStock, initialReserved, 'Reserved stock must be released on cancellation');
  assert.strictEqual(prod.stock, initialStock, 'Physical stock should remain untouched on cancellation');
});
