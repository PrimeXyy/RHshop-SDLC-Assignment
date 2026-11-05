import { memoryDb } from '../config/prisma.mjs';
import {
  validateStateTransition,
  getAvailableNextStates,
} from '../stateMachine/orderStateMachine.mjs';

let orderCounter = 1002;

export async function createOrder(req, res) {
  const userId = req.user?.id || 'cust_001';
  const {
    items,
    fulfillmentType = 'DELIVERY',
    shippingAddress,
    notes,
    totalAmountInCents,
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    return;
  }

  const orderId = `ord_${Date.now()}`;
  const orderNumber = `ORD-2026-${orderCounter++}`;

  const calculatedTotal =
    totalAmountInCents ||
    items.reduce((sum, it) => sum + (it.priceInCents || 2500) * (it.quantity || 1), 0);

  const order = {
    id: orderId,
    orderNumber,
    userId,
    status: 'PLACED',
    fulfillmentType,
    totalAmountInCents: calculatedTotal,
    shippingAddress: shippingAddress || {
      street: '456 Sample Ave',
      city: 'Portland',
      state: 'OR',
      postalCode: '97201',
      country: 'USA',
    },
    trackingNumber: null,
    notes: notes || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  memoryDb.orders.set(orderId, order);

  const itemRecords = items.map((it, index) => {
    const prodId = it.productId || it.product || `prod_${index}`;
    const prod = memoryDb.products.get(prodId);

    let resolvedImg = it.image;
    if (
      !resolvedImg ||
      resolvedImg.includes('1521572267360') ||
      resolvedImg.includes('1506629082955')
    ) {
      if (prod && Array.isArray(prod.images) && prod.images.length > 0) {
        resolvedImg = prod.images[0];
      } else {
        resolvedImg = '/products/product_tee.png';
      }
    }

    const resolvedName = (it.name && it.name !== 'Sample Product')
      ? it.name
      : (prod?.name || 'RH Classic Essential Tee');

    return {
      id: `item_${orderId}_${index}`,
      orderId,
      productId: prodId,
      name: resolvedName,
      priceInCents: it.priceInCents || prod?.priceInCents || 2200,
      quantity: it.quantity || 1,
      size: it.size || 'M',
      color: it.color || 'Standard',
      image: resolvedImg || '/products/product_tee.png',
    };
  });
  memoryDb.orderItems.set(orderId, itemRecords);

  for (const it of itemRecords) {
    const prod = memoryDb.products.get(it.productId);
    if (prod) {
      prod.reservedStock += it.quantity;
    }
  }

  const initialLog = {
    id: `log_${Date.now()}`,
    orderId,
    fromStatus: null,
    toStatus: 'PLACED',
    changedById: userId,
    changedByRole: req.user?.role || 'CUSTOMER',
    note: 'Order placed by customer',
    createdAt: new Date(),
  };
  memoryDb.statusLogs.set(orderId, [initialLog]);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully. Ticket submitted to warehouse queue.',
    order: {
      ...order,
      items: itemRecords,
      statusHistory: [initialLog],
    },
  });
}

export async function getOrderById(req, res) {
  const { id } = req.params;
  const order = memoryDb.orders.get(id);

  if (!order) {
    res.status(404).json({ success: false, message: `Order ${id} not found.` });
    return;
  }

  if (req.user?.role === 'CUSTOMER' && order.userId !== req.user.id) {
    res.status(403).json({ success: false, message: 'Unauthorized to view this order.' });
    return;
  }

  const items = memoryDb.orderItems.get(id) || [];
  const statusHistory = memoryDb.statusLogs.get(id) || [];
  const user = memoryDb.users.get(order.userId);

  const availableNextStates = getAvailableNextStates(
    order.status,
    req.user?.role || 'CUSTOMER',
    order.fulfillmentType
  );

  res.json({
    success: true,
    order: {
      ...order,
      user: user ? { id: user.id, name: user.name, email: user.email } : null,
      items,
      statusHistory,
      availableNextStates,
    },
  });
}

export async function getOrderStatus(req, res) {
  const { id } = req.params;
  const order = memoryDb.orders.get(id);

  if (!order) {
    res.status(404).json({ success: false, message: `Order ${id} not found.` });
    return;
  }

  const statusHistory = memoryDb.statusLogs.get(id) || [];
  const latestLog = statusHistory[statusHistory.length - 1];

  res.json({
    success: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    fulfillmentType: order.fulfillmentType,
    trackingNumber: order.trackingNumber,
    updatedAt: order.updatedAt,
    latestNote: latestLog?.note || null,
    statusHistory,
    isTerminal: ['COMPLETED', 'DELIVERED', 'CANCELLED'].includes(order.status),
  });
}

export async function getAllOrders(req, res) {
  let orders = Array.from(memoryDb.orders.values());

  const { status, search, from, to } = req.query;

  if (status) {
    const rawSt = String(status).trim().toLowerCase();
    const statusMap = {
      pending: ['PLACED'],
      confirmed: ['CONFIRMED'],
      processing: ['PROCESSING', 'READY_FOR_PICKUP'],
      shipped: ['SHIPPED'],
      delivered: ['DELIVERED', 'COMPLETED'],
      cancelled: ['CANCELLED'],
    };

    orders = orders.filter((o) => {
      if (o.status.toLowerCase() === rawSt) return true;
      if (statusMap[rawSt]?.includes(o.status)) return true;
      return false;
    });
  }

  if (search) {
    const q = String(search).toLowerCase();
    orders = orders.filter((o) => {
      if (o.orderNumber.toLowerCase().includes(q)) return true;
      const user = memoryDb.users.get(o.userId);
      if (user && (user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q))) {
        return true;
      }
      return false;
    });
  }

  if (from) {
    const fromDate = new Date(String(from));
    if (!isNaN(fromDate.getTime())) {
      orders = orders.filter((o) => o.createdAt >= fromDate);
    }
  }

  if (to) {
    const toDate = new Date(String(to));
    if (!isNaN(toDate.getTime())) {
      orders = orders.filter((o) => o.createdAt <= toDate);
    }
  }

  orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 50);
  const total = orders.length;
  const pages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const paginated = orders.slice(start, start + limit);

  const mapToClientStatus = (st) => {
    switch (st) {
      case 'PLACED': return 'pending';
      case 'CONFIRMED': return 'confirmed';
      case 'PROCESSING': return 'processing';
      case 'READY_FOR_PICKUP': return 'processing';
      case 'SHIPPED': return 'shipped';
      case 'DELIVERED': case 'COMPLETED': return 'delivered';
      case 'CANCELLED': return 'cancelled';
      default: return st.toLowerCase();
    }
  };

  const formattedOrders = paginated.map((o) => {
    const user = memoryDb.users.get(o.userId);
    const items = memoryDb.orderItems.get(o.id) || [];
    const statusHistory = memoryDb.statusLogs.get(o.id) || [];
    return {
      _id: o.id,
      id: o.id,
      orderNumber: o.orderNumber,
      user: {
        _id: user?.id || o.userId,
        id: user?.id || o.userId,
        name: user?.name || 'Customer',
        email: user?.email || 'customer@shop.com',
      },
      items: items.map((it) => ({
        _id: it.id,
        id: it.id,
        product: it.productId,
        productId: it.productId,
        name: it.name,
        priceInCents: it.priceInCents,
        quantity: it.quantity,
        size: it.size,
        color: it.color,
        image: it.image || '/products/product_tee.png',
      })),
      shippingAddress: o.shippingAddress,
      paymentResult: { status: 'paid', paidAt: o.createdAt.toISOString() },
      itemsTotalInCents: o.totalAmountInCents,
      shippingPriceInCents: 0,
      taxAmountInCents: 0,
      totalAmountInCents: o.totalAmountInCents,
      status: o.status,
      orderStatus: mapToClientStatus(o.status),
      fulfillmentType: o.fulfillmentType,
      trackingNumber: o.trackingNumber,
      notes: o.notes,
      statusHistory,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    };
  });

  res.json({
    success: true,
    orders: formattedOrders,
    pagination: { page, limit, total, pages },
  });
}

export async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { trackingNumber, note } = req.body;
  const rawStatus = String(req.body.nextStatus || req.body.status || '').toUpperCase();
  const statusMapping = {
    PENDING: 'PLACED',
    CONFIRMED: 'CONFIRMED',
    PROCESSING: 'PROCESSING',
    READY_FOR_PICKUP: 'READY_FOR_PICKUP',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
  };
  const nextStatus = statusMapping[rawStatus] || rawStatus;

  const order = memoryDb.orders.get(id);
  if (!order) {
    res.status(404).json({ success: false, message: `Order ${id} not found.` });
    return;
  }

  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required prior to state transition.' });
    return;
  }

  const actorRole = req.user.role;

  if (actorRole === 'CUSTOMER') {
    if (order.userId !== req.user.id) {
      res.status(403).json({ success: false, message: 'Unauthorized: You can only modify your own orders.' });
      return;
    }
    if (nextStatus !== 'CANCELLED') {
      res.status(403).json({ success: false, message: 'Unauthorized: Customers may only cancel orders.' });
      return;
    }
    if (order.status !== 'PLACED') {
      res.status(400).json({ success: false, message: 'Orders can only be cancelled while in PLACED status.' });
      return;
    }
  }

  const validation = validateStateTransition(
    order.status,
    nextStatus,
    actorRole,
    order.fulfillmentType
  );

  if (!validation.valid) {
    res.status(400).json({
      success: false,
      message: validation.error,
      currentStatus: order.status,
      allowedNextStates: validation.allowedNextStates,
    });
    return;
  }

  const fromStatus = order.status;
  order.status = nextStatus;
  order.updatedAt = new Date();

  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }

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

  const log = {
    id: `log_${Date.now()}`,
    orderId: order.id,
    fromStatus,
    toStatus: nextStatus,
    changedById: req.user.id,
    changedByRole: actorRole,
    note: note || `Status transitioned from ${fromStatus} to ${nextStatus}`,
    createdAt: new Date(),
  };

  const currentLogs = memoryDb.statusLogs.get(order.id) || [];
  currentLogs.push(log);
  memoryDb.statusLogs.set(order.id, currentLogs);

  const availableNextStates = getAvailableNextStates(
    order.status,
    actorRole,
    order.fulfillmentType
  );

  const mapToClientStatus = (st) => {
    switch (st) {
      case 'PLACED': return 'pending';
      case 'CONFIRMED': return 'confirmed';
      case 'PROCESSING': return 'processing';
      case 'READY_FOR_PICKUP': return 'processing';
      case 'SHIPPED': return 'shipped';
      case 'DELIVERED': case 'COMPLETED': return 'delivered';
      case 'CANCELLED': return 'cancelled';
      default: return st.toLowerCase();
    }
  };

  res.json({
    success: true,
    message: `Order ${order.orderNumber} successfully transitioned to ${nextStatus}`,
    order: {
      _id: order.id,
      id: order.id,
      ...order,
      orderStatus: mapToClientStatus(order.status),
      items,
      statusHistory: currentLogs,
      availableNextStates,
    },
  });
}

export async function cancelOrder(req, res) {
  const { id } = req.params;
  const { reason } = req.body || {};
  const order = memoryDb.orders.get(id);

  if (!order) {
    res.status(404).json({ success: false, message: `Order ${id} not found.` });
    return;
  }

  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  if (req.user.role === 'CUSTOMER' && order.userId !== req.user.id) {
    res.status(403).json({ success: false, message: 'Unauthorized: You can only cancel your own orders.' });
    return;
  }

  if (order.status !== 'PLACED') {
    res.status(400).json({
      success: false,
      message: `Orders cannot be cancelled once in ${order.status} status. Only PLACED orders can be cancelled.`,
    });
    return;
  }

  const fromStatus = order.status;
  order.status = 'CANCELLED';
  order.updatedAt = new Date();

  const items = memoryDb.orderItems.get(order.id) || [];
  for (const it of items) {
    const prod = memoryDb.products.get(it.productId);
    if (prod) {
      prod.reservedStock = Math.max(0, prod.reservedStock - it.quantity);
    }
  }

  const logs = memoryDb.statusLogs.get(order.id) || [];
  const log = {
    id: `log_${Date.now()}`,
    orderId: order.id,
    fromStatus,
    toStatus: 'CANCELLED',
    changedById: req.user.id,
    changedByRole: req.user.role,
    note: reason || 'Customer requested order cancellation',
    createdAt: new Date(),
  };
  logs.push(log);
  memoryDb.statusLogs.set(order.id, logs);

  res.json({
    success: true,
    message: `Order ${order.orderNumber} successfully cancelled`,
    order: {
      ...order,
      items,
      statusHistory: logs,
      availableNextStates: [],
    },
  });
}
