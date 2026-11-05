import { Response } from 'express';
import { memoryDb } from '../config/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { matchesCategory, formatMemoryProduct } from '../routes/productRoutes.js';

export async function getLiveMetrics(req: AuthenticatedRequest, res: Response): Promise<void> {
  const orders = Array.from(memoryDb.orders.values());

  const totalOrders = orders.length;
  const totalRevenueInCents = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmountInCents, 0);

  const statusBreakdown = {
    PLACED: orders.filter((o) => o.status === 'PLACED').length,
    PROCESSING: orders.filter((o) => o.status === 'PROCESSING').length,
    READY_FOR_PICKUP: orders.filter((o) => o.status === 'READY_FOR_PICKUP').length,
    SHIPPED: orders.filter((o) => o.status === 'SHIPPED').length,
    COMPLETED: orders.filter((o) => o.status === 'COMPLETED').length,
    DELIVERED: orders.filter((o) => o.status === 'DELIVERED').length,
    CANCELLED: orders.filter((o) => o.status === 'CANCELLED').length,
  };

  const activeBacklog =
    statusBreakdown.PLACED + statusBreakdown.PROCESSING + statusBreakdown.READY_FOR_PICKUP;

  // Compute product inventory telemetry
  const inventory = Array.from(memoryDb.products.values()).map((p) => {
    const availableStock = Math.max(0, p.stock - p.reservedStock);
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      priceInCents: p.priceInCents,
      stock: p.stock,
      reservedStock: p.reservedStock,
      availableStock,
      isLowStock: availableStock <= 15,
    };
  });

  const totalInventoryUnits = inventory.reduce((sum, p) => sum + p.stock, 0);
  const totalReservedUnits = inventory.reduce((sum, p) => sum + p.reservedStock, 0);

  // Recent 10 orders for Admin queue change detection & arrival alerts
  const recentOrders = [...orders]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10)
    .map((o) => {
      const user = memoryDb.users.get(o.userId);
      const items = memoryDb.orderItems.get(o.id) || [];
      return {
        id: o.id,
        orderNumber: o.orderNumber,
        userId: o.userId,
        customerName: user?.name || 'Customer',
        status: o.status,
        fulfillmentType: o.fulfillmentType,
        totalAmountInCents: o.totalAmountInCents,
        itemCount: items.reduce((sum, it) => sum + it.quantity, 0),
        createdAt: o.createdAt,
      };
    });

  // Recent 8 activity logs
  const recentActivity: any[] = [];
  for (const logs of memoryDb.statusLogs.values()) {
    for (const log of logs) {
      const order = memoryDb.orders.get(log.orderId);
      recentActivity.push({
        id: log.id,
        orderId: log.orderId,
        orderNumber: order?.orderNumber || log.orderId,
        fromStatus: log.fromStatus,
        toStatus: log.toStatus,
        changedByRole: log.changedByRole,
        note: log.note,
        createdAt: log.createdAt,
      });
    }
  }

  recentActivity.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({
    success: true,
    serverTime: new Date().toISOString(),
    metrics: {
      totalOrders,
      totalRevenueInCents,
      activeBacklog,
      statusBreakdown,
      totalInventoryUnits,
      totalReservedUnits,
      inventory,
      recentOrders,
      recentActivity: recentActivity.slice(0, 8),
    },
  });
}

/**
 * Admin Dashboard Stats (/api/admin/stats)
 */
export async function getAdminStats(req: AuthenticatedRequest, res: Response): Promise<void> {
  const orders = Array.from(memoryDb.orders.values());
  const products = Array.from(memoryDb.products.values());
  const users = Array.from(memoryDb.users.values());

  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmountInCents, 0);

  const pendingOrders = orders.filter((o) =>
    ['PLACED', 'PENDING', 'PROCESSING', 'READY_FOR_PICKUP'].includes(o.status)
  ).length;

  const totalUsers = users.length;
  const totalProducts = products.length;

  // Low stock products (available stock <= 15)
  const lowStockItems: any[] = [];
  for (const p of products) {
    const available = Math.max(0, p.stock - p.reservedStock);
    if (available <= 15) {
      lowStockItems.push({
        productId: p.id,
        variantId: `var_${p.id}_0`,
        name: p.name,
        image: p.images?.[0] || '/products/product_tee.png',
        size: p.availableSizes?.[0] || 'M',
        color: typeof p.availableColors?.[0] === 'object' ? p.availableColors[0].name : 'Standard',
        stock: p.stock,
        reservedStock: p.reservedStock,
        availableStock: available,
      });
    }
  }

  const mapToClientStatus = (st: string): string => {
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

  const recentOrders = [...orders]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10)
    .map((o) => {
      const user = memoryDb.users.get(o.userId);
      const items = memoryDb.orderItems.get(o.id) || [];
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
        itemsTotalInCents: o.totalAmountInCents,
        shippingPriceInCents: 0,
        taxAmountInCents: 0,
        totalAmountInCents: o.totalAmountInCents,
        status: o.status,
        orderStatus: mapToClientStatus(o.status),
        fulfillmentType: o.fulfillmentType,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
      };
    });

  res.json({
    success: true,
    totalRevenue,
    totalOrders,
    pendingOrders,
    totalUsers,
    totalProducts,
    lowStockCount: lowStockItems.length,
    lowStockItems,
    recentOrders,
  });
}

/**
 * Admin Products Listing (/api/admin/products)
 */
export async function getAdminProducts(req: AuthenticatedRequest, res: Response): Promise<void> {
  let products = Array.from(memoryDb.products.values()).map(formatMemoryProduct);

  const { search, category, gender, isActive, includeDeleted } = req.query;

  if (category) {
    products = products.filter((p) => matchesCategory(p, String(category)));
  }

  if (gender) {
    const g = String(gender).toLowerCase();
    products = products.filter((p) => p.gender.toLowerCase() === g || p.gender === 'unisex');
  }

  if (search) {
    const q = String(search).toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags || []).some((t: string) => t.toLowerCase().includes(q))
    );
  }

  if (isActive !== undefined) {
    const active = isActive === 'true' || isActive === '1';
    products = products.filter((p) => p.isActive === active);
  }

  if (includeDeleted !== 'true' && includeDeleted !== '1') {
    products = products.filter((p) => !p.isDeleted);
  }

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 20);
  const total = products.length;
  const pages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const paginated = products.slice(start, start + limit);

  res.json({
    success: true,
    products: paginated,
    pagination: { page, limit, total, pages },
  });
}

/**
 * Admin Users Listing (/api/admin/users)
 */
export async function getAdminUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
  let users = Array.from(memoryDb.users.values()).map((u) => ({
    _id: u.id,
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role.toLowerCase(),
    createdAt: '2026-01-10T08:00:00.000Z',
  }));

  const { search } = req.query;
  if (search) {
    const q = String(search).toLowerCase();
    users = users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 20);
  const total = users.length;
  const pages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const paginated = users.slice(start, start + limit);

  res.json({
    success: true,
    users: paginated,
    pagination: { page, limit, total, pages },
  });
}
