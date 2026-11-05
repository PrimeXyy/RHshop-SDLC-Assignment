import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsTsPath = path.resolve(__dirname, '../data/products.ts');

function loadProductsFromTs() {
  const content = fs.readFileSync(productsTsPath, 'utf8');
  // Strip TypeScript types and extract the array
  const match = content.match(/export\s+const\s+CATALOG_PRODUCTS:\s*CatalogProduct\[\]\s*=\s*(\[[\s\S]*?\]);\s*$/);
  if (!match) throw new Error('Could not parse CATALOG_PRODUCTS array');
  // Evaluate the JS array object
  const fn = new Function(`return ${match[1]};`);
  return fn();
}

const CATALOG_PRODUCTS = loadProductsFromTs();

function matchesCatalogCategory(p, queryCategory) {
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

test('Storefront Catalog - Products count and core fields', () => {
  assert.strictEqual(CATALOG_PRODUCTS.length, 42, 'Should have 42 clothing items in catalog');

  for (const item of CATALOG_PRODUCTS) {
    assert.ok(item.id, 'Item must have id');
    assert.ok(item.name, 'Item must have name');
    assert.ok(item.tagline, 'Item must have tagline');
    assert.ok(item.priceInCents >= 1800, 'Item price must be realistic (>= $18)');
    assert.ok(item.priceInCents <= 11000, 'Item price must be within catalog range (<= $110)');
    assert.ok(item.category, 'Item must have category');
    assert.ok(item.gender, 'Item must have gender');
    assert.ok(item.rating >= 4.0, 'Rating must be realistic');
    assert.ok(item.availableSizes.length > 0, 'Must have available sizes');
    assert.ok(item.availableColors.length >= 2, 'Must have at least 2 available colors');
    assert.ok(item.images.length >= 2, 'Must have at least 2 high-res images');
    assert.ok(item.stock > 0, 'Must have stock');
    assert.ok(Array.isArray(item.features) && item.features.length >= 4, 'Must have features list with >= 4 items');
    assert.ok(Array.isArray(item.tags) && item.tags.length >= 4, 'Must have tags list with >= 4 items');
  }
});

test('Storefront Catalog - Men, Women, Kids gender representation', () => {
  const men = CATALOG_PRODUCTS.filter((p) => p.gender === 'men');
  const women = CATALOG_PRODUCTS.filter((p) => p.gender === 'women');
  const kids = CATALOG_PRODUCTS.filter((p) => p.gender === 'kids');
  const unisex = CATALOG_PRODUCTS.filter((p) => p.gender === 'unisex');

  assert.ok(men.length >= 10, `Expected >= 10 Men items, found ${men.length}`);
  assert.ok(women.length >= 10, `Expected >= 10 Women items, found ${women.length}`);
  assert.ok(kids.length >= 10, `Expected >= 10 Kids items, found ${kids.length}`);
  assert.ok(unisex.length >= 5, `Expected >= 5 Unisex items, found ${unisex.length}`);
});

test('Storefront Catalog - Sizes and color matrices', () => {
  const apparel = CATALOG_PRODUCTS.filter((p) => ['Shirt', 'Pant', 'Outerwear'].includes(p.category));

  for (const item of apparel) {
    const sizeSet = new Set(item.availableSizes);
    assert.ok(sizeSet.has('XS'), `Apparel ${item.id} must have XS`);
    assert.ok(sizeSet.has('S'), `Apparel ${item.id} must have S`);
    assert.ok(sizeSet.has('M'), `Apparel ${item.id} must have M`);
    assert.ok(sizeSet.has('L'), `Apparel ${item.id} must have L`);
    assert.ok(sizeSet.has('XL'), `Apparel ${item.id} must have XL`);
  }

  // All colors have valid hex
  for (const item of CATALOG_PRODUCTS) {
    for (const color of item.availableColors) {
      assert.ok(color.name, 'Color must have name');
      assert.match(color.hex, /^#[0-9A-Fa-f]{6}$/, `Color ${color.name} must have valid 6-char hex`);
    }
  }
});

test('Storefront Catalog - Comprehensive category and alias filtering', () => {
  // Shirts
  const shirts = CATALOG_PRODUCTS.filter((p) => matchesCatalogCategory(p, 'shirt'));
  const shirtsPlural = CATALOG_PRODUCTS.filter((p) => matchesCatalogCategory(p, 'shirts'));
  assert.strictEqual(shirts.length, shirtsPlural.length);
  assert.ok(shirts.length >= 6, `Expected >= 6 shirts, got ${shirts.length}`);

  // Pants
  const pants = CATALOG_PRODUCTS.filter((p) => matchesCatalogCategory(p, 'pant'));
  const pantsPlural = CATALOG_PRODUCTS.filter((p) => matchesCatalogCategory(p, 'pants'));
  assert.strictEqual(pants.length, pantsPlural.length);
  assert.ok(pants.length >= 7, `Expected >= 7 pants, got ${pants.length}`);

  // Hoodies
  const hoodies = CATALOG_PRODUCTS.filter((p) => matchesCatalogCategory(p, 'hoodie'));
  const hoodiesPlural = CATALOG_PRODUCTS.filter((p) => matchesCatalogCategory(p, 'hoodies'));
  assert.strictEqual(hoodies.length, hoodiesPlural.length);
  assert.ok(hoodies.length >= 5, `Expected >= 5 hoodies, got ${hoodies.length}`);

  // Jackets
  const jackets = CATALOG_PRODUCTS.filter((p) => matchesCatalogCategory(p, 'jacket'));
  const jacketsPlural = CATALOG_PRODUCTS.filter((p) => matchesCatalogCategory(p, 'jackets'));
  assert.strictEqual(jackets.length, jacketsPlural.length);
  assert.ok(jackets.length >= 5, `Expected >= 5 jackets, got ${jackets.length}`);

  // Knitwear & Sweaters
  const knitwear = CATALOG_PRODUCTS.filter((p) => matchesCatalogCategory(p, 'knitwear'));
  const sweaters = CATALOG_PRODUCTS.filter((p) => matchesCatalogCategory(p, 'sweater'));
  assert.ok(knitwear.length >= 5, `Expected >= 5 knitwear items, got ${knitwear.length}`);
  assert.ok(sweaters.length >= 5, `Expected >= 5 sweater items, got ${sweaters.length}`);

  // Hats & Beanies
  const hats = CATALOG_PRODUCTS.filter((p) => matchesCatalogCategory(p, 'hat'));
  const hatsPlural = CATALOG_PRODUCTS.filter((p) => matchesCatalogCategory(p, 'hats'));
  assert.strictEqual(hats.length, hatsPlural.length);
  assert.ok(hats.length >= 4, `Expected >= 4 hats/beanies, got ${hats.length}`);

  // Accessories
  const accessories = CATALOG_PRODUCTS.filter((p) => matchesCatalogCategory(p, 'accessory'));
  const accessoriesPlural = CATALOG_PRODUCTS.filter((p) => matchesCatalogCategory(p, 'accessories'));
  assert.strictEqual(accessories.length, accessoriesPlural.length);
  assert.ok(accessories.length >= 8, `Expected >= 8 accessories, got ${accessories.length}`);

  // Umbrella 'clothing' category returns all apparel (excludes bags/scarves/belts)
  const clothing = CATALOG_PRODUCTS.filter((p) => matchesCatalogCategory(p, 'clothing'));
  assert.ok(clothing.length >= 30, `Expected >= 30 clothing items, got ${clothing.length}`);
  for (const item of clothing) {
    assert.notStrictEqual(item.category, 'Accessories', 'Clothing umbrella should not include accessories');
  }
});
