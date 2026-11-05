import test from 'node:test';
import assert from 'node:assert';
import { memoryDb, SEEDED_PRODUCTS } from '../config/prisma.mjs';

function matchesCategory(p, queryCategory) {
  if (!queryCategory) return true;
  const rawQ = String(queryCategory).trim().toLowerCase();
  const q = rawQ.replace(/ies$/, 'y').replace(/s$/, '');

  const prodCat = (p.category || '').toLowerCase();
  const prodNorm = prodCat.replace(/ies$/, 'y').replace(/s$/, '');
  const prodSub = (p.subCategory || '').toLowerCase();
  const prodName = (p.name || '').toLowerCase();
  const prodTags = (p.tags || []).map((t) => t.toLowerCase());

  if (prodCat === rawQ || prodNorm === q || prodNorm.includes(q) || q.includes(prodNorm)) {
    return true;
  }
  if (q === 'cloth' || rawQ === 'clothing' || rawQ === 'clothes' || q === 'apparel') {
    return !prodNorm.includes('accessor') && !prodCat.includes('accessor');
  }
  if (q === 'bottom') {
    return (
      prodNorm === 'pant' ||
      prodTags.some((t) => ['pant', 'pants', 'bottoms', 'jeans', 'chino', 'shorts', 'overalls'].includes(t)) ||
      prodName.includes('pant') ||
      prodName.includes('jean') ||
      prodName.includes('short')
    );
  }
  if (q === 'hoodie' || rawQ === 'hoodies' || rawQ === 'sweatshirts' || rawQ === 'sweatshirt') {
    return (
      prodSub === 'hoodie' ||
      prodTags.includes('hoodie') ||
      prodTags.includes('hoodies') ||
      prodTags.includes('sweatshirt') ||
      prodName.includes('hoodie') ||
      prodName.includes('sweatshirt')
    );
  }
  if (q === 'jacket' || rawQ === 'jackets' || q === 'coat' || rawQ === 'coats') {
    return (
      prodSub === 'jacket' ||
      prodTags.includes('jacket') ||
      prodTags.includes('jackets') ||
      prodTags.includes('coat') ||
      prodName.includes('jacket') ||
      prodName.includes('bomber') ||
      prodName.includes('trench') ||
      prodName.includes('coat')
    );
  }
  if (q === 'knitwear' || q === 'knit' || q === 'sweater' || rawQ === 'sweaters' || q === 'cardigan') {
    return (
      prodSub === 'knitwear' ||
      prodTags.includes('knitwear') ||
      prodTags.includes('knit') ||
      prodTags.includes('sweater') ||
      prodName.includes('knit') ||
      prodName.includes('sweater') ||
      prodName.includes('cardigan') ||
      prodName.includes('turtleneck')
    );
  }
  if (q === 'hat' || rawQ === 'hats' || q === 'beanie' || q === 'cap' || q === 'beret') {
    return (
      prodSub === 'hat' ||
      prodTags.includes('hat') ||
      prodTags.includes('hats') ||
      prodTags.includes('beanie') ||
      prodTags.includes('cap') ||
      prodName.includes('hat') ||
      prodName.includes('beanie') ||
      prodName.includes('cap') ||
      prodName.includes('beret')
    );
  }
  if (prodTags.some((t) => t === rawQ || t === q || t.includes(q))) {
    return true;
  }
  if (prodSub && (prodSub === rawQ || prodSub === q || prodSub.includes(q))) {
    return true;
  }
  if (prodName.includes(rawQ) || prodName.includes(q)) {
    return true;
  }
  return false;
}

function formatMemoryProduct(p) {
  const sizes = p.availableSizes || ['XS', 'S', 'M', 'L', 'XL'];
  const colors = p.availableColors || [
    { name: 'Steel Blue', hex: '#607D8B' },
    { name: 'Charcoal', hex: '#4A4A4A' },
  ];

  const images =
    p.images && p.images.length > 0
      ? p.images.map((url, i) => ({
          _id: `img_${p.id}_${i}`,
          id: `img_${p.id}_${i}`,
          url,
          publicId: `img_${p.id}_${i}`,
        }))
      : [
          {
            _id: `img_${p.id}_1`,
            id: `img_${p.id}_1`,
            url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
            publicId: `img_${p.id}_1`,
          },
        ];

  const variants = sizes.flatMap((size) =>
    colors.map((color) => {
      const colorName = typeof color === 'string' ? color : color.name;
      const colorHex = typeof color === 'string' ? '#4682B4' : color.hex;
      return {
        _id: `var_${p.id}_${size}_${colorName}`,
        id: `var_${p.id}_${size}_${colorName}`,
        size,
        color: colorName,
        colorHex,
        stock: Math.floor(p.stock / (sizes.length * colors.length)) || 5,
        reservedStock: 0,
        sku: `${p.id}-${size}-${colorName}`.toUpperCase(),
      };
    })
  );

  const tags =
    p.tags && p.tags.length > 0
      ? p.tags
      : [p.category?.toLowerCase() || 'apparel', p.gender?.toLowerCase() || 'unisex'];

  return {
    _id: p.id,
    id: p.id,
    name: p.name,
    tagline: p.tagline || '',
    description: p.description || '',
    priceInCents: p.priceInCents,
    compareAtPriceInCents: p.originalPriceInCents || Math.round(p.priceInCents * 1.25),
    category: p.category?.toLowerCase() || 'shirt',
    subCategory: p.subCategory?.toLowerCase() || p.category?.toLowerCase() || 'shirt',
    gender: p.gender?.toLowerCase() || 'unisex',
    brand: 'RHshop',
    tags,
    isFeatured: p.isFeatured !== undefined ? p.isFeatured : true,
    isNewArrival: p.isNewArrival !== undefined ? p.isNewArrival : false,
    isActive: true,
    isDeleted: false,
    ratings: {
      average: p.rating || 4.8,
      count: p.reviewCount || 120,
      distribution: { 1: 0, 2: 1, 3: 5, 4: 24, 5: 90 },
    },
    images,
    variants,
  };
}

function filterProducts(all, query = {}) {
  let products = all.map(formatMemoryProduct);
  const { gender, category, size, color, minPrice, maxPrice, search, sort, isFeatured, isNewArrival, page = 1, limit = 20 } = query;

  if (gender) {
    const g = String(gender).toLowerCase();
    products = products.filter((p) => p.gender === g || p.gender === 'unisex');
  }

  if (category) {
    products = products.filter((p) => matchesCategory(p, String(category)));
  }

  if (size) {
    const s = String(size).toLowerCase();
    products = products.filter((p) => p.variants.some((v) => v.size.toLowerCase() === s));
  }

  if (color) {
    const clr = String(color).toLowerCase();
    products = products.filter((p) => p.variants.some((v) => v.color.toLowerCase() === clr));
  }

  if (minPrice !== undefined) {
    products = products.filter((p) => p.priceInCents >= Number(minPrice));
  }

  if (maxPrice !== undefined) {
    products = products.filter((p) => p.priceInCents <= Number(maxPrice));
  }

  if (search) {
    const q = String(search).toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (isFeatured === 'true' || isFeatured === true) {
    products = products.filter((p) => p.isFeatured);
  }

  if (isNewArrival === 'true' || isNewArrival === true) {
    products = products.filter((p) => p.isNewArrival);
  }

  if (sort === 'price-asc' || sort === 'price_asc') {
    products.sort((a, b) => a.priceInCents - b.priceInCents);
  } else if (sort === 'price-desc' || sort === 'price_desc') {
    products.sort((a, b) => b.priceInCents - a.priceInCents);
  } else if (sort === 'name_asc' || sort === 'name-asc') {
    products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'name_desc' || sort === 'name-desc') {
    products.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sort === 'rating') {
    products.sort((a, b) => b.ratings.average - a.ratings.average);
  } else if (sort === 'newest') {
    products.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
  } else if (sort === 'popular') {
    products.sort((a, b) => b.ratings.count - a.ratings.count);
  }

  const pNum = Math.max(1, Number(page));
  const lNum = Math.max(1, Number(limit));
  const total = products.length;
  const pages = Math.ceil(total / lNum) || 1;
  const start = (pNum - 1) * lNum;
  return {
    products: products.slice(start, start + lNum),
    pagination: { page: pNum, limit: lNum, total, pages },
  };
}

test('Product Catalog - MemoryDb seeds comprehensive clothing items', () => {
  memoryDb.reset();
  const allProducts = Array.from(memoryDb.products.values());
  assert.strictEqual(allProducts.length, 42, 'Must seed exactly 42 clothing items in memoryDb');
  assert.strictEqual(SEEDED_PRODUCTS.length, 42);
});

test('Product Catalog - Multi-Gender coverage (Men, Women, Kids)', () => {
  memoryDb.reset();
  const allProducts = Array.from(memoryDb.products.values());

  const menProducts = allProducts.filter((p) => p.gender === 'men');
  const womenProducts = allProducts.filter((p) => p.gender === 'women');
  const kidsProducts = allProducts.filter((p) => p.gender === 'kids');
  const unisexProducts = allProducts.filter((p) => p.gender === 'unisex');

  assert.ok(menProducts.length >= 10, `Men collection should have >= 10 items, found ${menProducts.length}`);
  assert.ok(womenProducts.length >= 10, `Women collection should have >= 10 items, found ${womenProducts.length}`);
  assert.ok(kidsProducts.length >= 10, `Kids collection should have >= 10 items, found ${kidsProducts.length}`);
  assert.ok(unisexProducts.length >= 5, `Unisex collection should have >= 5 items, found ${unisexProducts.length}`);
});

test('Product Catalog - Diverse Categories (Shirts, Pants, Outerwear, Hoodies, Knitwear, Accessories)', () => {
  memoryDb.reset();
  const allProducts = Array.from(memoryDb.products.values());

  const shirts = allProducts.filter((p) => matchesCategory(p, 'shirt'));
  const pants = allProducts.filter((p) => matchesCategory(p, 'pant'));
  const hoodies = allProducts.filter((p) => matchesCategory(p, 'hoodie'));
  const jackets = allProducts.filter((p) => matchesCategory(p, 'jacket'));
  const knitwear = allProducts.filter((p) => matchesCategory(p, 'knitwear'));
  const hats = allProducts.filter((p) => matchesCategory(p, 'hat'));
  const accessories = allProducts.filter((p) => matchesCategory(p, 'accessory'));

  assert.ok(shirts.length >= 6, `Shirts should have >= 6 items, found ${shirts.length}`);
  assert.ok(pants.length >= 7, `Pants should have >= 7 items, found ${pants.length}`);
  assert.ok(hoodies.length >= 5, `Hoodies should have >= 5 items, found ${hoodies.length}`);
  assert.ok(jackets.length >= 5, `Jackets should have >= 5 items, found ${jackets.length}`);
  assert.ok(knitwear.length >= 5, `Knitwear should have >= 5 items, found ${knitwear.length}`);
  assert.ok(hats.length >= 4, `Hats should have >= 4 items, found ${hats.length}`);
  assert.ok(accessories.length >= 8, `Accessories should have >= 8 items, found ${accessories.length}`);
});

test('Product Catalog - Variant matrices with XS-XL sizes, colors, and SKUs', () => {
  memoryDb.reset();
  const allProducts = Array.from(memoryDb.products.values());

  for (const p of allProducts) {
    const formatted = formatMemoryProduct(p);
    assert.ok(formatted.variants.length > 0, `Product ${p.id} must have non-empty variants`);
    assert.ok(formatted.images.length >= 2, `Product ${p.id} must have at least 2 images`);
    assert.ok(formatted.priceInCents > 0, `Product ${p.id} must have positive priceInCents`);
    assert.ok(formatted.description.length > 20, `Product ${p.id} must have rich description`);

    // Apparel items must include standard sizes XS through XL
    if (['Shirt', 'Pant', 'Outerwear'].includes(p.category)) {
      const sizes = new Set(formatted.variants.map((v) => v.size));
      assert.ok(sizes.has('XS'), `Apparel ${p.id} must include size XS`);
      assert.ok(sizes.has('S'), `Apparel ${p.id} must include size S`);
      assert.ok(sizes.has('M'), `Apparel ${p.id} must include size M`);
      assert.ok(sizes.has('L'), `Apparel ${p.id} must include size L`);
      assert.ok(sizes.has('XL'), `Apparel ${p.id} must include size XL`);
    }

    // Every variant must have an uppercase SKU, positive stock, and colorHex
    for (const v of formatted.variants) {
      assert.strictEqual(v.sku, v.sku.toUpperCase(), 'Variant SKU must be uppercase');
      assert.ok(v.colorHex.startsWith('#'), 'ColorHex must be valid hex code');
      assert.ok(v.stock >= 0, 'Variant stock must be non-negative');
    }
  }
});

test('Product Catalog - Query filtering by gender, category, size, price, and new arrivals', () => {
  memoryDb.reset();
  const all = Array.from(memoryDb.products.values());

  // Filter Men
  const menRes = filterProducts(all, { gender: 'men' });
  for (const p of menRes.products) {
    assert.ok(p.gender === 'men' || p.gender === 'unisex');
  }

  // Filter Women
  const womenRes = filterProducts(all, { gender: 'women' });
  for (const p of womenRes.products) {
    assert.ok(p.gender === 'women' || p.gender === 'unisex');
  }

  // Filter Kids
  const kidsRes = filterProducts(all, { gender: 'kids' });
  for (const p of kidsRes.products) {
    assert.ok(p.gender === 'kids' || p.gender === 'unisex');
  }

  // Filter Category: shirt vs shirts
  const shirtRes = filterProducts(all, { category: 'shirt' });
  const shirtsRes = filterProducts(all, { category: 'shirts' });
  assert.strictEqual(shirtRes.products.length, shirtsRes.products.length);

  // Filter Category: hoodie vs hoodies
  const hoodieRes = filterProducts(all, { category: 'hoodie' });
  const hoodiesRes = filterProducts(all, { category: 'hoodies' });
  assert.strictEqual(hoodieRes.products.length, hoodiesRes.products.length);
  assert.ok(hoodieRes.products.length >= 5);

  // Filter Category: knitwear
  const knitRes = filterProducts(all, { category: 'knitwear' });
  assert.ok(knitRes.products.length >= 5);

  // Filter Category: jackets
  const jacketRes = filterProducts(all, { category: 'jacket' });
  assert.ok(jacketRes.products.length >= 5);

  // Filter Category: hats
  const hatRes = filterProducts(all, { category: 'hat' });
  assert.ok(hatRes.products.length >= 4);

  // Filter New Arrivals
  const newArrivalsRes = filterProducts(all, { isNewArrival: 'true' });
  assert.ok(newArrivalsRes.products.length >= 10);
  for (const p of newArrivalsRes.products) {
    assert.strictEqual(p.isNewArrival, true);
  }

  // Filter Size
  const sizeMRes = filterProducts(all, { size: 'M' });
  assert.ok(sizeMRes.pagination.total >= 30, `Expected total >= 30 with size M, got ${sizeMRes.pagination.total}`);

  // Filter Color
  const oliveRes = filterProducts(all, { color: 'olive' });
  assert.ok(oliveRes.products.length >= 10);

  // Filter Price Range: $30 to $60 (3000 - 6000 cents)
  const priceRes = filterProducts(all, { minPrice: 3000, maxPrice: 6000 });
  for (const p of priceRes.products) {
    assert.ok(p.priceInCents >= 3000 && p.priceInCents <= 6000);
  }

  // Sorting
  const sortAsc = filterProducts(all, { sort: 'price_asc' });
  for (let i = 1; i < sortAsc.products.length; i++) {
    assert.ok(sortAsc.products[i].priceInCents >= sortAsc.products[i - 1].priceInCents);
  }

  const sortName = filterProducts(all, { sort: 'name_asc' });
  for (let i = 1; i < sortName.products.length; i++) {
    assert.ok(sortName.products[i].name.localeCompare(sortName.products[i - 1].name) >= 0);
  }
});
