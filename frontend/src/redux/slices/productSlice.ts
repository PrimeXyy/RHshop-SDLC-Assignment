import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ProductState, ProductFilters, Product } from '../../types/product';
import * as productApi from '../../api/product';
import * as adminApi from '../../api/admin';
import { CATALOG_PRODUCTS } from '../../data/products';

export const defaultCatalogProducts: Product[] = CATALOG_PRODUCTS.map((cp) => {
  const gender = (cp.gender || 'unisex').toLowerCase() as 'men' | 'women' | 'kids' | 'unisex';
  const category = cp.category.toLowerCase();
  const subCategory = cp.subCategory?.toLowerCase() || category;
  const tags = cp.tags && cp.tags.length > 0 ? cp.tags : [category, gender];
  return {
    _id: cp.id,
    id: cp.id,
    name: cp.name,
    tagline: cp.tagline,
    description: cp.description,
    priceInCents: cp.priceInCents,
    compareAtPriceInCents: cp.originalPriceInCents,
    category,
    subCategory,
    gender,
    brand: 'RHshop',
    tags,
    isFeatured: !!cp.isFeatured,
    isNewArrival: !!cp.isNewArrival,
    isActive: true,
    isDeleted: false,
    ratings: {
      average: cp.rating,
      count: cp.reviewCount,
      distribution: { 1: 0, 2: 1, 3: 5, 4: 20, 5: Math.max(0, cp.reviewCount - 26) },
    },
    images: cp.images.map((url, i) => ({
      _id: `img_${cp.id}_${i}`,
      id: `img_${cp.id}_${i}`,
      url,
      publicId: `img_${cp.id}_${i}`,
    })),
    variants: cp.availableSizes.flatMap((size) =>
      cp.availableColors.map((color) => ({
        _id: `var_${cp.id}_${size}_${color.name}`,
        id: `var_${cp.id}_${size}_${color.name}`,
        size,
        color: color.name,
        colorHex: color.hex,
        stock: Math.floor(cp.stock / (cp.availableSizes.length * cp.availableColors.length)) || 5,
        reservedStock: 0,
        sku: `${cp.id}-${size}-${color.name}`.toUpperCase(),
      }))
    ),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

function matchesCatalogCategory(p: Product, queryCategory: string): boolean {
  if (!queryCategory) return true;
  const rawQ = String(queryCategory).trim().toLowerCase();
  const q = rawQ.replace(/ies$/, 'y').replace(/s$/, '');

  const prodCat = (p.category || '').toLowerCase();
  const prodNorm = prodCat.replace(/ies$/, 'y').replace(/s$/, '');
  const prodSub = (p.subCategory || '').toLowerCase();
  const prodName = (p.name || '').toLowerCase();
  const prodTags = (p.tags || []).map((t) => t.toLowerCase());

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
      prodTags.some((t) => ['pant', 'pants', 'bottoms', 'jeans', 'chino', 'shorts', 'overalls'].includes(t)) ||
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
  if (prodTags.some((t) => t === rawQ || t === q || t.includes(q))) {
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

const initialState: ProductState = {
  items: defaultCatalogProducts,
  featuredItems: defaultCatalogProducts.filter((p) => p.isFeatured),
  newArrivals: defaultCatalogProducts.filter((p) => p.isNewArrival),
  bestSellers: [...defaultCatalogProducts].sort((a, b) => b.ratings.count - a.ratings.count).slice(0, 8),
  currentProduct: null,
  pagination: { page: 1, limit: 16, total: defaultCatalogProducts.length, pages: Math.ceil(defaultCatalogProducts.length / 16) || 1 },
  filters: {},
  isLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchPublic',
  async (
    params: ProductFilters & { page?: number; limit?: number }
  ) => {
    try {
      return await productApi.listProducts(params);
    } catch {
      let list = [...defaultCatalogProducts];
      if (params.gender) {
        const g = params.gender.toLowerCase();
        list = list.filter((p) => p.gender.toLowerCase() === g || p.gender === 'unisex');
      }
      if (params.category) {
        list = list.filter((p) => matchesCatalogCategory(p, params.category!));
      }
      if (params.size) {
        const s = params.size.toLowerCase();
        list = list.filter((p) => p.variants.some((v) => v.size.toLowerCase() === s));
      }
      if (params.color) {
        const clr = params.color.toLowerCase();
        list = list.filter((p) => p.variants.some((v) => v.color.toLowerCase() === clr));
      }
      if (params.minPrice !== undefined) {
        list = list.filter((p) => p.priceInCents >= (params.minPrice ?? 0));
      }
      if (params.maxPrice !== undefined) {
        list = list.filter((p) => p.priceInCents <= (params.maxPrice ?? Infinity));
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      if (params.isFeatured) {
        list = list.filter((p) => p.isFeatured);
      }
      if (params.isNewArrival) {
        list = list.filter((p) => p.isNewArrival);
      }
      if (params.sort === 'price-asc' || params.sort === 'price_asc') {
        list.sort((a, b) => a.priceInCents - b.priceInCents);
      } else if (params.sort === 'price-desc' || params.sort === 'price_desc') {
        list.sort((a, b) => b.priceInCents - a.priceInCents);
      } else if (params.sort === 'name_asc' || params.sort === 'name-asc') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else if (params.sort === 'name_desc' || params.sort === 'name-desc') {
        list.sort((a, b) => b.name.localeCompare(a.name));
      } else if (params.sort === 'rating') {
        list.sort((a, b) => b.ratings.average - a.ratings.average);
      } else if (params.sort === 'newest') {
        list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      } else if (params.sort === 'popular') {
        list.sort((a, b) => b.ratings.count - a.ratings.count);
      }

      const page = params.page || 1;
      const limit = params.limit || 16;
      const total = list.length;
      const pages = Math.ceil(total / limit) || 1;
      const start = (page - 1) * limit;
      return {
        products: list.slice(start, start + limit),
        pagination: { page, limit, total, pages },
      };
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async () => {
    try {
      const { products } = await productApi.getFeaturedProducts();
      return products;
    } catch {
      return defaultCatalogProducts.filter((p) => p.isFeatured);
    }
  }
);

export const fetchNewArrivals = createAsyncThunk(
  'products/fetchNewArrivals',
  async () => {
    try {
      const { products } = await productApi.getNewArrivals();
      return products;
    } catch {
      return defaultCatalogProducts.filter((p) => p.isNewArrival);
    }
  }
);

export const fetchBestSellers = createAsyncThunk(
  'products/fetchBestSellers',
  async () => {
    try {
      const { products } = await productApi.getBestSellers();
      return products;
    } catch {
      return [...defaultCatalogProducts].sort((a, b) => b.ratings.count - a.ratings.count).slice(0, 8);
    }
  }
);

export const fetchAdminProducts = createAsyncThunk(
  'products/fetchAdmin',
  async (
    params: { page?: number; limit?: number; search?: string; includeDeleted?: boolean; category?: string; gender?: string; isActive?: boolean },
    { rejectWithValue }
  ) => {
    try {
      return await adminApi.adminListProducts(params);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      return rejectWithValue(msg ?? 'Failed to fetch products');
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const { product } = await productApi.getProduct(id);
      return product;
    } catch {
      const fallback = defaultCatalogProducts.find((p) => p._id === id || p.id === id);
      if (fallback) return fallback;
      return rejectWithValue('Failed to fetch product');
    }
  }
);

export const createProductThunk = createAsyncThunk(
  'products/create',
  async (body: Parameters<typeof productApi.createProduct>[0], { rejectWithValue }) => {
    try {
      const { product } = await productApi.createProduct(body);
      return product;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      return rejectWithValue(msg ?? 'Failed to create product');
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  'products/update',
  async (
    { id, body }: { id: string; body: Parameters<typeof productApi.updateProduct>[1] },
    { rejectWithValue }
  ) => {
    try {
      const { product } = await productApi.updateProduct(id, body);
      return product;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      return rejectWithValue(msg ?? 'Failed to update product');
    }
  }
);

export const softDeleteProductThunk = createAsyncThunk(
  'products/softDelete',
  async (id: string, { rejectWithValue }) => {
    try {
      const { product } = await productApi.softDeleteProduct(id);
      return product;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      return rejectWithValue(msg ?? 'Failed to delete product');
    }
  }
);

export const restoreProductThunk = createAsyncThunk(
  'products/restore',
  async (id: string, { rejectWithValue }) => {
    try {
      const { product } = await productApi.restoreProduct(id);
      return product;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      return rejectWithValue(msg ?? 'Failed to restore product');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters(state, action: { payload: ProductFilters }) {
      state.filters = action.payload;
    },
    clearCurrentProduct(state) {
      state.currentProduct = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state: ProductState) => {
      state.isLoading = true;
      state.error = null;
    };
    const rejected = (state: ProductState, action: { payload: unknown }) => {
      state.isLoading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(fetchProducts.pending, pending)
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, rejected);

    builder
      .addCase(fetchFeaturedProducts.pending, pending)
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredItems = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, rejected);

    builder
      .addCase(fetchNewArrivals.pending, (state) => { state.error = null; })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => { state.newArrivals = action.payload; })
      .addCase(fetchNewArrivals.rejected, (state, action) => { state.error = action.payload as string; });

    builder
      .addCase(fetchBestSellers.pending, (state) => { state.error = null; })
      .addCase(fetchBestSellers.fulfilled, (state, action) => { state.bestSellers = action.payload; })
      .addCase(fetchBestSellers.rejected, (state, action) => { state.error = action.payload as string; });

    builder
      .addCase(fetchAdminProducts.pending, pending)
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdminProducts.rejected, rejected);

    builder
      .addCase(fetchProduct.pending, pending)
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, rejected);

    builder
      .addCase(createProductThunk.pending, pending)
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createProductThunk.rejected, rejected);

    builder
      .addCase(updateProductThunk.pending, pending)
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.currentProduct?._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProductThunk.rejected, rejected);

    builder
      .addCase(softDeleteProductThunk.pending, pending)
      .addCase(softDeleteProductThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(softDeleteProductThunk.rejected, rejected);

    builder
      .addCase(restoreProductThunk.pending, pending)
      .addCase(restoreProductThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(restoreProductThunk.rejected, rejected);
  },
});

export const { setFilters, clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
