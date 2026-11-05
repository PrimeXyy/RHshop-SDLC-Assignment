export type Role = 'CUSTOMER' | 'ADMIN' | 'WAREHOUSE';

export type OrderStatus =
  | 'PLACED'
  | 'PROCESSING'
  | 'READY_FOR_PICKUP'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'DELIVERED'
  | 'CANCELLED';

export type FulfillmentType = 'PICKUP' | 'DELIVERY';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  priceInCents: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

export interface OrderStatusLog {
  id: string;
  orderId: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  changedById?: string;
  changedByRole?: Role;
  note?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName?: string;
  customerEmail?: string;
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  totalAmountInCents: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  trackingNumber?: string | null;
  notes?: string | null;
  items: OrderItem[];
  itemCount?: number;
  statusHistory?: OrderStatusLog[];
  availableNextStates?: OrderStatus[];
  createdAt: string;
  updatedAt: string;
}

export interface FulfillmentQueueResponse {
  success: boolean;
  serverTime: string;
  queue: Order[];
  counts: {
    totalActive: number;
    newTickets: number;
    inProcessing: number;
    readyForPickup: number;
    shipped: number;
  };
}

export interface OrderStatusResponse {
  success: boolean;
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  trackingNumber?: string | null;
  updatedAt: string;
  latestNote?: string | null;
  statusHistory: OrderStatusLog[];
  isTerminal: boolean;
}

export interface ProductInventory {
  id: string;
  name: string;
  category: string;
  priceInCents: number;
  stock: number;
  reservedStock: number;
  availableStock: number;
  isLowStock: boolean;
}

export interface LiveMetricsResponse {
  success: boolean;
  serverTime: string;
  metrics: {
    totalOrders: number;
    totalRevenueInCents: number;
    activeBacklog: number;
    statusBreakdown: Record<OrderStatus, number>;
    totalInventoryUnits: number;
    totalReservedUnits: number;
    inventory: ProductInventory[];
    recentOrders: Order[];
    recentActivity: Array<{
      id: string;
      orderId: string;
      orderNumber: string;
      fromStatus: OrderStatus | null;
      toStatus: OrderStatus;
      changedByRole?: Role;
      note?: string;
      createdAt: string;
    }>;
  };
}

export interface CatalogProduct {
  id: string;
  name: string;
  tagline: string;
  priceInCents: number;
  originalPriceInCents?: number;
  category: 'Shirt' | 'Pant' | 'Outerwear' | 'Accessories' | string;
  subCategory?: string;
  gender?: 'men' | 'women' | 'kids' | 'unisex';
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  availableSizes: string[];
  availableColors: { name: string; hex: string }[];
  images: string[];
  stock: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  tags?: string[];
}

export interface CartItem {
  id: string; // unique item id (e.g. prod_id + size + color)
  productId: string;
  name: string;
  priceInCents: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  maxStock: number;
}

