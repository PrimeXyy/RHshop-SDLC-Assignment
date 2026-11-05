import { Router, Request, Response } from 'express';
import { memoryDb } from '../config/prisma.js';

const router = Router();

export function matchesCategory(p: any, queryCategory: string): boolean {
  if (!queryCategory) return true;
  const rawQ = String(queryCategory).trim().toLowerCase();
  const q = rawQ.replace(/ies$/, 'y').replace(/s$/, '');

  const prodCat = (p.category || '').toLowerCase();
  const prodNorm = prodCat.replace(/ies$/, 'y').replace(/s$/, '');
  const prodSub = (p.subCategory || '').toLowerCase();
  const prodName = (p.name || '').toLowerCase();
  const prodTags = (p.tags || []).map((t: string) => t.toLowerCase());

  // 1. Direct or partial match on category
  if (prodCat === rawQ || prodNorm === q || prodNorm.includes(q) || q.includes(prodNorm)) {
    return true;
  }

  // 2. Umbrella 'clothing' / 'apparel' matches all non-accessories
  if (q === 'cloth' || rawQ === 'clothing' || rawQ === 'clothes' || q === 'apparel') {
    return !prodNorm.includes('accessor') && !prodCat.includes('accessor');
  }

  // 3. 'bottoms' matches pants, shorts, chinos, trousers, jeans, overalls
  if (q === 'bottom') {
    return (
      prodNorm === 'pant' ||
      prodTags.some((t: string) => ['pant', 'pants', 'bottoms', 'jeans', 'chino', 'shorts', 'overalls'].includes(t)) ||
      prodName.includes('pant') ||
      prodName.includes('jean') ||
      prodName.includes('short')
    );
  }

  // 4. 'hoodie' matches products whose subcategory, tags, name mention hoodie or sweatshirt
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

  // 5. 'jacket' matches products whose subcategory, tags, name mention jacket, bomber, trench, coat, overshirt
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

  // 6. 'knitwear' / 'sweater' / 'cardigan' matches knitwear, sweaters, cardigans, turtlenecks
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

  // 7. 'hat' / 'hats' / 'beanie' / 'cap' matches hats, beanies, caps, berets
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

  // 8. Match in product tags
  if (prodTags.some((t: string) => t === rawQ || t === q || t.includes(q))) {
    return true;
  }

  // 9. Match in subCategory or title
  if (prodSub && (prodSub === rawQ || prodSub === q || prodSub.includes(q))) {
    return true;
  }
  if (prodName.includes(rawQ) || prodName.includes(q)) {
    return true;
  }

  return false;
}

export function formatMemoryProduct(p: any) {
  const sizes: string[] = p.availableSizes || ['XS', 'S', 'M', 'L', 'XL'];
  const colors: Array<{ name: string; hex: string }> = p.availableColors || [
    { name: 'Steel Blue', hex: '#607D8B' },
    { name: 'Charcoal', hex: '#4A4A4A' },
  ];

  const images =
    p.images && p.images.length > 0
      ? p.images.map((url: string, i: number) => ({
          _id: `img_${p.id}_${i}`,
          id: `img_${p.id}_${i}`,
          url,
          publicId: `img_${p.id}_${i}`,
        }))
      : [
          {
            _id: `img_${p.id}_1`,
            id: `img_${p.id}_1`,
            url: '/products/product_tee.png',
            publicId: `img_${p.id}_1`,
          },
          {
            _id: `img_${p.id}_2`,
            id: `img_${p.id}_2`,
            url: '/products/product_sweatpants.png',
            publicId: `img_${p.id}_2`,
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
    createdAt: p.createdAt || new Date(),
    updatedAt: p.updatedAt || new Date(),
  };
}

router.get('/', (req: Request, res: Response) => {
  let products = Array.from(memoryDb.products.values()).map(formatMemoryProduct);

  const { gender, category, size, color, minPrice, maxPrice, search, sort, isFeatured, isNewArrival } = req.query;

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
    const min = Number(minPrice);
    if (!isNaN(min)) products = products.filter((p) => p.priceInCents >= min);
  }

  if (maxPrice !== undefined) {
    const max = Number(maxPrice);
    if (!isNaN(max)) products = products.filter((p) => p.priceInCents <= max);
  }

  if (search) {
    const q = String(search).toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t: string) => t.toLowerCase().includes(q))
    );
  }

  if (isFeatured === 'true' || isFeatured === '1') {
    products = products.filter((p) => p.isFeatured);
  }

  if (isNewArrival === 'true' || isNewArrival === '1') {
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
});

router.get('/featured', (_req: Request, res: Response) => {
  const products = Array.from(memoryDb.products.values())
    .map(formatMemoryProduct)
    .filter((p) => p.isFeatured);
  res.json({ success: true, products });
});

router.get('/new-arrivals', (_req: Request, res: Response) => {
  const products = Array.from(memoryDb.products.values())
    .map(formatMemoryProduct)
    .filter((p) => p.isNewArrival);
  res.json({ success: true, products });
});

router.get('/best-sellers', (_req: Request, res: Response) => {
  const products = Array.from(memoryDb.products.values())
    .map(formatMemoryProduct)
    .sort((a, b) => b.ratings.count - a.ratings.count)
    .slice(0, 8);
  res.json({ success: true, products });
});

router.get('/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const p = memoryDb.products.get(id);
  if (!p) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }
  res.json({ success: true, product: formatMemoryProduct(p) });
});

router.post('/', (req: Request, res: Response) => {
  const data = req.body;
  const id = data.id || `prod_${Date.now()}`;
  const newProduct: any = {
    id,
    name: data.name || 'New Product',
    tagline: data.tagline || '',
    description: data.description || '',
    priceInCents: data.priceInCents || 2900,
    category: data.category || 'shirt',
    subCategory: data.subCategory || 'shirt',
    gender: data.gender || 'unisex',
    stock: data.stock || 50,
    reservedStock: 0,
    images: data.images?.map((im: any) => (typeof im === 'string' ? im : im.url)) || ['/products/product_tee.png'],
    tags: data.tags || [],
    isFeatured: !!data.isFeatured,
    isNewArrival: !!data.isNewArrival,
    isActive: data.isActive !== undefined ? data.isActive : true,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memoryDb.products.set(id, newProduct);
  res.status(201).json({ success: true, product: formatMemoryProduct(newProduct) });
});

router.put('/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const p = memoryDb.products.get(id);
  if (!p) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }
  const updated = {
    ...p,
    ...req.body,
    updatedAt: new Date(),
  };
  memoryDb.products.set(id, updated);
  res.json({ success: true, product: formatMemoryProduct(updated) });
});

router.patch('/:id/soft-delete', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const p = memoryDb.products.get(id);
  if (!p) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }
  p.isDeleted = true;
  p.deletedAt = new Date().toISOString();
  p.updatedAt = new Date();
  memoryDb.products.set(id, p);
  res.json({ success: true, product: formatMemoryProduct(p) });
});

router.patch('/:id/restore', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const p = memoryDb.products.get(id);
  if (!p) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }
  p.isDeleted = false;
  p.deletedAt = undefined;
  p.updatedAt = new Date();
  memoryDb.products.set(id, p);
  res.json({ success: true, product: formatMemoryProduct(p) });
});

export default router;
