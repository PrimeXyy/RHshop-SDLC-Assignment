import { memoryDb } from '../config/prisma.mjs';
import { validateStateTransition, getAvailableNextStates } from '../stateMachine/orderStateMachine.mjs';

export async function getFulfillmentQueue(req, res) {
  const statusFilter = req.query.status;

  let orders = Array.from(memoryDb.orders.values());

  if (statusFilter) {
    orders = orders.filter((o) => o.status === statusFilter);
  } else {
    orders = orders.filter((o) => ['PLACED', 'PROCESSING', 'READY_FOR_PICKUP', 'SHIPPED'].includes(o.status));
  }

  orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const enrichedOrders = orders.map((order) => {
    const user = memoryDb.users.get(order.userId);
    const items = memoryDb.orderItems.get(order.id) || [];
    const availableNextStates = getAvailableNextStates(
      order.status,
      req.user?.role || 'WAREHOUSE',
      order.fulfillmentType
    );

    return {
      ...order,
      customerName: user?.name || 'Customer',
      customerEmail: user?.email || '',
      items,
      itemCount: items.reduce((sum, it) => sum + it.quantity, 0),
      availableNextStates,
    };
  });

  const counts = {
    totalActive: enrichedOrders.length,
    newTickets: enrichedOrders.filter((o) => o.status === 'PLACED').length,
    inProcessing: enrichedOrders.filter((o) => o.status === 'PROCESSING').length,
    readyForPickup: enrichedOrders.filter((o) => o.status === 'READY_FOR_PICKUP').length,
    shipped: enrichedOrders.filter((o) => o.status === 'SHIPPED').length,
  };

  res.json({
    success: true,
    serverTime: new Date().toISOString(),
    queue: enrichedOrders,
    counts,
  });
}

export async function acceptOrder(req, res) {
  const { id } = req.params;
  const order = memoryDb.orders.get(id);

  if (!order) {
    res.status(404).json({ success: false, message: `Order ${id} not found.` });
    return;
  }

  const role = req.user?.role || 'WAREHOUSE';
  const validation = validateStateTransition(order.status, 'PROCESSING', role, order.fulfillmentType);

  if (!validation.valid) {
    res.status(400).json({ success: false, message: validation.error });
    return;
  }

  order.status = 'PROCESSING';
  order.updatedAt = new Date();

  const logs = memoryDb.statusLogs.get(order.id) || [];
  logs.push({
    id: `log_${Date.now()}`,
    orderId: order.id,
    fromStatus: 'PLACED',
    toStatus: 'PROCESSING',
    changedById: req.user?.id || 'warehouse_staff',
    changedByRole: role,
    note: 'Order accepted by warehouse fulfillment team',
    createdAt: new Date(),
  });
  memoryDb.statusLogs.set(order.id, logs);

  res.json({
    success: true,
    message: `Order ${order.orderNumber} is now PROCESSING`,
    order,
  });
}

export async function dispatchOrder(req, res) {
  const { id } = req.params;
  const { trackingNumber, carrier } = req.body || {};
  const order = memoryDb.orders.get(id);

  if (!order) {
    res.status(404).json({ success: false, message: `Order ${id} not found.` });
    return;
  }

  const targetStatus = order.fulfillmentType === 'PICKUP' ? 'READY_FOR_PICKUP' : 'SHIPPED';
  const role = req.user?.role || 'WAREHOUSE';
  const validation = validateStateTransition(order.status, targetStatus, role, order.fulfillmentType);

  if (!validation.valid) {
    res.status(400).json({ success: false, message: validation.error });
    return;
  }

  const prev = order.status;
  order.status = targetStatus;
  order.updatedAt = new Date();
  if (trackingNumber) order.trackingNumber = trackingNumber;

  const logs = memoryDb.statusLogs.get(order.id) || [];
  logs.push({
    id: `log_${Date.now()}`,
    orderId: order.id,
    fromStatus: prev,
    toStatus: targetStatus,
    changedById: req.user?.id || 'warehouse_staff',
    changedByRole: role,
    note: trackingNumber ? `Dispatched via ${carrier || 'Carrier'}. Tracking: ${trackingNumber}` : `Staged as ${targetStatus}`,
    createdAt: new Date(),
  });
  memoryDb.statusLogs.set(order.id, logs);

  res.json({
    success: true,
    message: `Order ${order.orderNumber} is now ${targetStatus}`,
    order,
  });
}

export async function completeOrder(req, res) {
  const { id } = req.params;
  const { note } = req.body || {};
  const order = memoryDb.orders.get(id);

  if (!order) {
    res.status(404).json({ success: false, message: `Order ${id} not found.` });
    return;
  }

  const role = req.user?.role || 'WAREHOUSE';
  const validation = validateStateTransition(order.status, 'COMPLETED', role, order.fulfillmentType);

  if (!validation.valid) {
    res.status(400).json({ success: false, message: validation.error });
    return;
  }

  const prev = order.status;
  order.status = 'COMPLETED';
  order.updatedAt = new Date();

  const items = memoryDb.orderItems.get(order.id) || [];
  for (const it of items) {
    const prod = memoryDb.products.get(it.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - it.quantity);
      prod.reservedStock = Math.max(0, prod.reservedStock - it.quantity);
    }
  }

  const logs = memoryDb.statusLogs.get(order.id) || [];
  logs.push({
    id: `log_${Date.now()}`,
    orderId: order.id,
    fromStatus: prev,
    toStatus: 'COMPLETED',
    changedById: req.user?.id || 'warehouse_staff',
    changedByRole: role,
    note: note || 'Customer collected order at pickup counter',
    createdAt: new Date(),
  });
  memoryDb.statusLogs.set(order.id, logs);

  res.json({
    success: true,
    message: `Order ${order.orderNumber} is now COMPLETED`,
    order,
  });
}

export async function deliverOrder(req, res) {
  const { id } = req.params;
  const { note } = req.body || {};
  const order = memoryDb.orders.get(id);

  if (!order) {
    res.status(404).json({ success: false, message: `Order ${id} not found.` });
    return;
  }

  const role = req.user?.role || 'WAREHOUSE';
  const validation = validateStateTransition(order.status, 'DELIVERED', role, order.fulfillmentType);

  if (!validation.valid) {
    res.status(400).json({ success: false, message: validation.error });
    return;
  }

  const prev = order.status;
  order.status = 'DELIVERED';
  order.updatedAt = new Date();

  const items = memoryDb.orderItems.get(order.id) || [];
  for (const it of items) {
    const prod = memoryDb.products.get(it.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - it.quantity);
      prod.reservedStock = Math.max(0, prod.reservedStock - it.quantity);
    }
  }

  const logs = memoryDb.statusLogs.get(order.id) || [];
  logs.push({
    id: `log_${Date.now()}`,
    orderId: order.id,
    fromStatus: prev,
    toStatus: 'DELIVERED',
    changedById: req.user?.id || 'warehouse_staff',
    changedByRole: role,
    note: note || 'Delivery confirmed by carrier',
    createdAt: new Date(),
  });
  memoryDb.statusLogs.set(order.id, logs);

  res.json({
    success: true,
    message: `Order ${order.orderNumber} is now DELIVERED`,
    order,
  });
}

export async function transitionFulfillmentOrderStatus(req, res) {
  const { id } = req.params;
  const { nextStatus, trackingNumber, note } = req.body || {};

  const order = memoryDb.orders.get(id);
  if (!order) {
    res.status(404).json({ success: false, message: `Order ${id} not found.` });
    return;
  }

  const role = req.user?.role || 'WAREHOUSE';
  const validation = validateStateTransition(order.status, nextStatus, role, order.fulfillmentType);

  if (!validation.valid) {
    res.status(400).json({
      success: false,
      message: validation.error,
      currentStatus: order.status,
      allowedNextStates: validation.allowedNextStates,
    });
    return;
  }

  const prev = order.status;
  order.status = nextStatus;
  order.updatedAt = new Date();
  if (trackingNumber) order.trackingNumber = trackingNumber;

  const items = memoryDb.orderItems.get(order.id) || [];
  if (nextStatus === 'CANCELLED') {
    for (const it of items) {
      const prod = memoryDb.products.get(it.productId);
      if (prod) {
        prod.reservedStock = Math.max(0, prod.reservedStock - it.quantity);
      }
    }
  } else if (nextStatus === 'COMPLETED' || nextStatus === 'DELIVERED') {
    for (const it of items) {
      const prod = memoryDb.products.get(it.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - it.quantity);
        prod.reservedStock = Math.max(0, prod.reservedStock - it.quantity);
      }
    }
  }

  const logs = memoryDb.statusLogs.get(order.id) || [];
  logs.push({
    id: `log_${Date.now()}`,
    orderId: order.id,
    fromStatus: prev,
    toStatus: nextStatus,
    changedById: req.user?.id || 'warehouse_staff',
    changedByRole: role,
    note: note || `Status transitioned from ${prev} to ${nextStatus}`,
    createdAt: new Date(),
  });
  memoryDb.statusLogs.set(order.id, logs);

  const availableNextStates = getAvailableNextStates(order.status, role, order.fulfillmentType);

  res.json({
    success: true,
    message: `Order ${order.orderNumber} successfully transitioned to ${nextStatus}`,
    order: {
      ...order,
      items,
      statusHistory: logs,
      availableNextStates,
    },
  });
}
