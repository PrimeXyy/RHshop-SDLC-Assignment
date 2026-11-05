import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CatalogProduct } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: CatalogProduct, size?: string, color?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotalInCents: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  populateDemoCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'rhshop_cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return [
      {
        id: 'prod_tee_steel-M-Steel_Blue',
        productId: 'prod_tee_steel',
        name: 'Explore Every Day Graphic Tee',
        priceInCents: 2200,
        quantity: 1,
        size: 'M',
        color: 'Steel Blue',
        image: '/products/product_tee.png',
        maxStock: 80,
      },
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore quota errors
    }
  }, [items]);

  const addToCart = (
    product: CatalogProduct,
    size: string = product.availableSizes[0] || 'M',
    color: string = product.availableColors[0]?.name || 'Standard',
    quantity: number = 1
  ) => {
    setItems((prev) => {
      const cartItemId = `${product.id}-${size}-${color.replace(/\s+/g, '_')}`;
      const existing = prev.find((item) => item.id === cartItemId);

      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.maxStock) }
            : item
        );
      }

      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        name: product.name,
        priceInCents: product.priceInCents,
        quantity,
        size,
        color,
        image: product.images[0] || '',
        maxStock: product.stock,
      };

      return [...prev, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: Math.min(quantity, item.maxStock) } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const populateDemoCart = () => {
    setItems([
      {
        id: 'prod_tee_steel-M-Steel_Blue',
        productId: 'prod_tee_steel',
        name: 'Explore Every Day Graphic Tee',
        priceInCents: 2200,
        quantity: 1,
        size: 'M',
        color: 'Steel Blue',
        image: '/products/product_tee.png',
        maxStock: 80,
      },
      {
        id: 'prod_jogger_olive-L-Olive',
        productId: 'prod_jogger_olive',
        name: 'Kids Jogger Pant',
        priceInCents: 2500,
        quantity: 1,
        size: 'L',
        color: 'Olive',
        image: '/products/product_sweatpants.png',
        maxStock: 35,
      },
    ]);
  };

  const subtotalInCents = items.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotalInCents,
        totalItems,
        isCartOpen,
        setIsCartOpen,
        toggleCart,
        populateDemoCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
