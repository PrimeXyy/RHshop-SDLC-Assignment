import test from 'node:test';
import assert from 'node:assert';

/**
 * Pure functions extracted from Cart and Checkout logic
 */
function calculateOrderTotals(items, fulfillmentType, discountPercent = 0) {
  const subtotalInCents = items.reduce(
    (sum, item) => sum + item.priceInCents * item.quantity,
    0
  );

  const discountAmount = Math.round((subtotalInCents * discountPercent) / 100);
  const discountedSubtotal = subtotalInCents - discountAmount;

  const isFreeShipping = discountedSubtotal >= 5000 || fulfillmentType === 'PICKUP' || discountedSubtotal === 0;
  const shippingFee = isFreeShipping ? 0 : 500; // $5.00

  const estimatedTax = Math.round(discountedSubtotal * 0.0825);
  const grandTotalInCents = discountedSubtotal + shippingFee + estimatedTax;

  return {
    subtotalInCents,
    discountAmount,
    discountedSubtotal,
    shippingFee,
    estimatedTax,
    grandTotalInCents,
    isFreeShipping,
  };
}

function buildOrderPayload(items, fulfillmentType, customer, shippingAddress, notes) {
  return {
    fulfillmentType,
    items: items.map((it) => ({
      productId: it.productId,
      name: it.name,
      priceInCents: it.priceInCents,
      quantity: it.quantity,
      size: it.size,
      color: it.color,
      image: it.image,
    })),
    shippingAddress: {
      street: shippingAddress.street,
      city: shippingAddress.city,
      state: shippingAddress.state,
      postalCode: shippingAddress.postalCode,
      country: 'USA',
      phone: customer.phone,
    },
    notes: notes || `Order placed via Storefront (${fulfillmentType})`,
  };
}

test('Storefront Cart - Single Item Subtotal and Grand Total with Shipping', () => {
  const items = [
    {
      productId: 'prod_tee_steel',
      name: 'Explore Every Day Graphic Tee',
      priceInCents: 2200,
      quantity: 1,
      size: 'M',
      color: 'Steel Blue',
    },
  ];

  const totals = calculateOrderTotals(items, 'DELIVERY');
  assert.strictEqual(totals.subtotalInCents, 2200); // $22.00
  assert.strictEqual(totals.shippingFee, 500); // $5.00 shipping under $50
  assert.strictEqual(totals.isFreeShipping, false);
  assert.strictEqual(totals.estimatedTax, Math.round(2200 * 0.0825)); // 182 cents
  assert.strictEqual(totals.grandTotalInCents, 2200 + 500 + 182); // 2882 cents ($28.82)
});

test('Storefront Cart - In-Store Pickup waives shipping fee regardless of subtotal', () => {
  const items = [
    {
      productId: 'prod_tee_steel',
      name: 'Explore Every Day Graphic Tee',
      priceInCents: 2200,
      quantity: 1,
      size: 'M',
      color: 'Steel Blue',
    },
  ];

  const totals = calculateOrderTotals(items, 'PICKUP');
  assert.strictEqual(totals.shippingFee, 0, 'In-store pickup must have zero shipping fee');
  assert.strictEqual(totals.isFreeShipping, true);
});

test('Storefront Cart - Free Shipping threshold applied over $50 for Delivery', () => {
  const items = [
    {
      productId: 'prod_jacket_denim',
      name: 'Vintage Wash Denim Trucker Jacket',
      priceInCents: 6800, // $68.00
      quantity: 1,
      size: 'L',
      color: 'Washed Indigo',
    },
  ];

  const totals = calculateOrderTotals(items, 'DELIVERY');
  assert.strictEqual(totals.subtotalInCents, 6800);
  assert.strictEqual(totals.shippingFee, 0, 'Subtotal >= $50 receives free shipping');
  assert.strictEqual(totals.isFreeShipping, true);
});

test('Storefront Cart - Promo Code 10% Discount Computation', () => {
  const items = [
    {
      productId: 'prod_hoodie_sage',
      name: 'Kids Crewneck Sweatshirt',
      priceInCents: 3200,
      quantity: 2, // $64.00
      size: 'M',
      color: 'Sage',
    },
  ];

  const totals = calculateOrderTotals(items, 'DELIVERY', 10);
  assert.strictEqual(totals.subtotalInCents, 6400);
  assert.strictEqual(totals.discountAmount, 640); // 10% of $64.00 = $6.40
  assert.strictEqual(totals.discountedSubtotal, 5760); // $57.60
  assert.strictEqual(totals.shippingFee, 0); // Still > $50, so free shipping
});

test('Storefront Checkout - Order Payload conforms to Backend API contract', () => {
  const items = [
    {
      productId: 'prod_tee_steel',
      name: 'Explore Every Day Graphic Tee',
      priceInCents: 2200,
      quantity: 1,
      size: 'M',
      color: 'Steel Blue',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
    },
  ];

  const payload = buildOrderPayload(
    items,
    'DELIVERY',
    { phone: '+1-555-0144' },
    {
      street: '100 University Ave',
      city: 'San Jose',
      state: 'CA',
      postalCode: '95192',
    },
    'Leave at porch'
  );

  assert.strictEqual(payload.fulfillmentType, 'DELIVERY');
  assert.strictEqual(payload.items.length, 1);
  assert.strictEqual(payload.items[0].productId, 'prod_tee_steel');
  assert.strictEqual(payload.items[0].priceInCents, 2200);
  assert.strictEqual(payload.shippingAddress.city, 'San Jose');
  assert.strictEqual(payload.shippingAddress.postalCode, '95192');
  assert.strictEqual(payload.shippingAddress.phone, '+1-555-0144');
});
