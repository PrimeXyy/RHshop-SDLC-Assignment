import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_PRODUCTS } from './updateCatalog.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendProductsPath = path.resolve(__dirname, '../frontend/src/data/products.ts');
const backendPrismaMjsPath = path.resolve(__dirname, '../backend/src/config/prisma.mjs');
const backendPrismaTsPath = path.resolve(__dirname, '../backend/src/config/prisma.ts');

function formatProductForFrontend(p) {
  return `  {
    id: ${JSON.stringify(p.id)},
    name: ${JSON.stringify(p.name)},
    tagline: ${JSON.stringify(p.tagline)},
    priceInCents: ${p.priceInCents},
    originalPriceInCents: ${p.originalPriceInCents},
    category: ${JSON.stringify(p.category)},
    subCategory: ${JSON.stringify(p.subCategory)},
    gender: ${JSON.stringify(p.gender)},
    rating: ${p.rating},
    reviewCount: ${p.reviewCount},
    description:
      ${JSON.stringify(p.description)},
    features: ${JSON.stringify(p.features, null, 6).replace(/\n/g, '\n    ')},
    availableSizes: ${JSON.stringify(p.availableSizes)},
    availableColors: ${JSON.stringify(p.availableColors, null, 6).replace(/\n/g, '\n    ')},
    images: ${JSON.stringify(p.images, null, 6).replace(/\n/g, '\n    ')},
    tags: ${JSON.stringify(p.tags)},
    stock: ${p.stock},
    isFeatured: ${p.isFeatured},
    isNewArrival: ${p.isNewArrival},
  }`;
}

function formatProductForBackendMjs(p) {
  return `  {
    id: ${JSON.stringify(p.id)},
    name: ${JSON.stringify(p.name)},
    tagline: ${JSON.stringify(p.tagline)},
    description: ${JSON.stringify(p.description)},
    priceInCents: ${p.priceInCents},
    originalPriceInCents: ${p.originalPriceInCents},
    category: ${JSON.stringify(p.category)},
    subCategory: ${JSON.stringify(p.subCategory)},
    gender: ${JSON.stringify(p.gender)},
    stock: ${p.stock},
    reservedStock: ${p.reservedStock || 0},
    rating: ${p.rating},
    reviewCount: ${p.reviewCount},
    features: ${JSON.stringify(p.features, null, 6).replace(/\n/g, '\n    ')},
    availableSizes: ${JSON.stringify(p.availableSizes)},
    availableColors: ${JSON.stringify(p.availableColors, null, 6).replace(/\n/g, '\n    ')},
    images: ${JSON.stringify(p.images, null, 6).replace(/\n/g, '\n    ')},
    tags: ${JSON.stringify(p.tags)},
    isFeatured: ${p.isFeatured},
    isNewArrival: ${p.isNewArrival},
    createdAt: new Date(),
    updatedAt: new Date(),
  }`;
}

// 1. Generate frontend data/products.ts
const frontendContent = `import { CatalogProduct } from '../types';

export const CATALOG_PRODUCTS: CatalogProduct[] = [
${ALL_PRODUCTS.map(formatProductForFrontend).join(',\n\n')}
];
`;
fs.writeFileSync(frontendProductsPath, frontendContent, 'utf8');
console.log('Generated', frontendProductsPath, 'with', ALL_PRODUCTS.length, 'products');

// 2. Generate backend prisma.mjs
const backendMjsContent = `export const SEEDED_PRODUCTS = [
${ALL_PRODUCTS.map(formatProductForBackendMjs).join(',\n\n')}
];

class MemoryStore {
  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.statusLogs = new Map();
    this.seedDefaults();
  }

  seedDefaults() {
    const customer = {
      id: 'cust_001',
      email: 'customer@shop.com',
      password: '$2a$10$wK2Vv3g5U7p9l3j5K9n7e.lWcZbWwKzZJ3h7l5w5v6l7k8j9h0i1.',
      name: 'Alice Customer',
      role: 'CUSTOMER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const warehouse = {
      id: 'ware_001',
      email: 'warehouse@shop.com',
      password: '$2a$10$wK2Vv3g5U7p9l3j5K9n7e.lWcZbWwKzZJ3h7l5w5v6l7k8j9h0i1.',
      name: 'Bob Warehouse',
      role: 'WAREHOUSE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const admin = {
      id: 'admin_001',
      email: 'admin@shop.com',
      password: '$2a$10$wK2Vv3g5U7p9l3j5K9n7e.lWcZbWwKzZJ3h7l5w5v6l7k8j9h0i1.',
      name: 'Charlie Admin',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(customer.id, customer);
    this.users.set(warehouse.id, warehouse);
    this.users.set(admin.id, admin);

    for (const prod of SEEDED_PRODUCTS) {
      this.products.set(prod.id, { ...prod });
    }

    const initialOrder = {
      id: 'ord_1001',
      orderNumber: 'ORD-2026-1001',
      userId: customer.id,
      status: 'PLACED',
      fulfillmentType: 'DELIVERY',
      totalAmountInCents: 4500,
      shippingAddress: {
        street: '123 Main St',
        city: 'Metropolis',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        phone: '+1-555-0199',
      },
      trackingNumber: null,
      notes: 'Initial test order placed by customer',
      createdAt: new Date(Date.now() - 60000),
      updatedAt: new Date(Date.now() - 60000),
    };

    this.orders.set(initialOrder.id, initialOrder);
    this.orderItems.set(initialOrder.id, [
      {
        id: 'item_1',
        orderId: initialOrder.id,
        productId: 'prod_tee_steel',
        name: 'Explore Every Day Graphic Tee',
        priceInCents: 2200,
        quantity: 1,
        size: 'M',
        color: 'Steel Blue',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
      },
      {
        id: 'item_2',
        orderId: initialOrder.id,
        productId: 'prod_jogger_olive',
        name: 'Kids Jogger Pant',
        priceInCents: 2300,
        quantity: 1,
        size: 'L',
        color: 'Olive',
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
      },
    ]);

    this.statusLogs.set(initialOrder.id, [
      {
        id: 'log_1',
        orderId: initialOrder.id,
        fromStatus: null,
        toStatus: 'PLACED',
        changedById: customer.id,
        changedByRole: 'CUSTOMER',
        note: 'Order created',
        createdAt: new Date(Date.now() - 60000),
      },
    ]);
  }

  reset() {
    this.users.clear();
    this.products.clear();
    this.orders.clear();
    this.orderItems.clear();
    this.statusLogs.clear();
    this.seedDefaults();
  }
}

export const memoryDb = new MemoryStore();
`;
fs.writeFileSync(backendPrismaMjsPath, backendMjsContent, 'utf8');
console.log('Generated', backendPrismaMjsPath, 'with', ALL_PRODUCTS.length, 'products');

// 3. Generate backend prisma.ts
const backendTsContent = `import { Role, OrderStatus, FulfillmentType } from '../stateMachine/orderStateMachine.js';

export interface UserRecord {
  id: string;
  email: string;
  password: string; // bcrypt hash
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemRecord {
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

export interface OrderStatusLogRecord {
  id: string;
  orderId: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  changedById?: string;
  changedByRole?: Role;
  note?: string;
  createdAt: Date;
}

export interface ProductRecord {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  priceInCents: number;
  originalPriceInCents?: number;
  category: string;
  subCategory?: string;
  gender?: string;
  stock: number;
  reservedStock: number;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  availableSizes?: string[];
  availableColors?: { name: string; hex: string }[];
  images?: string[];
  tags?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  totalAmountInCents: number;
  shippingAddress: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  trackingNumber: string | null;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const SEEDED_PRODUCTS: ProductRecord[] = [
${ALL_PRODUCTS.map(formatProductForBackendMjs).join(',\n\n')}
];

export class MemoryStore {
  users = new Map<string, UserRecord>();
  products = new Map<string, ProductRecord>();
  orders = new Map<string, OrderRecord>();
  orderItems = new Map<string, OrderItemRecord[]>();
  statusLogs = new Map<string, OrderStatusLogRecord[]>();

  constructor() {
    this.seedDefaults();
  }

  seedDefaults() {
    const customer: UserRecord = {
      id: 'cust_001',
      email: 'customer@shop.com',
      password: '$2a$10$wK2Vv3g5U7p9l3j5K9n7e.lWcZbWwKzZJ3h7l5w5v6l7k8j9h0i1.',
      name: 'Alice Customer',
      role: 'CUSTOMER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const warehouse: UserRecord = {
      id: 'ware_001',
      email: 'warehouse@shop.com',
      password: '$2a$10$wK2Vv3g5U7p9l3j5K9n7e.lWcZbWwKzZJ3h7l5w5v6l7k8j9h0i1.',
      name: 'Bob Warehouse',
      role: 'WAREHOUSE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const admin: UserRecord = {
      id: 'admin_001',
      email: 'admin@shop.com',
      password: '$2a$10$wK2Vv3g5U7p9l3j5K9n7e.lWcZbWwKzZJ3h7l5w5v6l7k8j9h0i1.',
      name: 'Charlie Admin',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(customer.id, customer);
    this.users.set(warehouse.id, warehouse);
    this.users.set(admin.id, admin);

    // Seed all 42 catalog products with inventory
    for (const prod of SEEDED_PRODUCTS) {
      this.products.set(prod.id, { ...prod });
    }

    // Seed sample initial order
    const initialOrder: OrderRecord = {
      id: 'ord_1001',
      orderNumber: 'ORD-2026-1001',
      userId: customer.id,
      status: 'PLACED',
      fulfillmentType: 'DELIVERY',
      totalAmountInCents: 4500,
      shippingAddress: {
        street: '123 Main St',
        city: 'Metropolis',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        phone: '+1-555-0199',
      },
      trackingNumber: null,
      notes: 'Initial test order placed by customer',
      createdAt: new Date(Date.now() - 60000),
      updatedAt: new Date(Date.now() - 60000),
    };

    this.orders.set(initialOrder.id, initialOrder);
    this.orderItems.set(initialOrder.id, [
      {
        id: 'item_1',
        orderId: initialOrder.id,
        productId: 'prod_tee_steel',
        name: 'Explore Every Day Graphic Tee',
        priceInCents: 2200,
        quantity: 1,
        size: 'M',
        color: 'Steel Blue',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
      },
      {
        id: 'item_2',
        orderId: initialOrder.id,
        productId: 'prod_jogger_olive',
        name: 'Kids Jogger Pant',
        priceInCents: 2300,
        quantity: 1,
        size: 'L',
        color: 'Olive',
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
      },
    ]);

    this.statusLogs.set(initialOrder.id, [
      {
        id: 'log_1',
        orderId: initialOrder.id,
        fromStatus: null,
        toStatus: 'PLACED',
        changedById: customer.id,
        changedByRole: 'CUSTOMER',
        note: 'Order created',
        createdAt: new Date(Date.now() - 60000),
      },
    ]);
  }

  reset() {
    this.users.clear();
    this.products.clear();
    this.orders.clear();
    this.orderItems.clear();
    this.statusLogs.clear();
    this.seedDefaults();
  }
}

export const memoryDb = new MemoryStore();
`;
fs.writeFileSync(backendPrismaTsPath, backendTsContent, 'utf8');
console.log('Generated', backendPrismaTsPath, 'with', ALL_PRODUCTS.length, 'products');
