import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const MAX_CART_QUANTITY = 20;

export interface CartItem {
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  quantity: number;
  swatch: string;
}

interface StoreState {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,

      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: Math.min(MAX_CART_QUANTITY, i.quantity + 1) }
                  : i
              ),
            };
          }
          return { cart: [...state.cart, { ...item, quantity: 1 }] };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart:
            quantity <= 0
              ? state.cart.filter((i) => i.id !== id)
              : state.cart.map((i) =>
                  i.id === id
                    ? { ...i, quantity: Math.min(MAX_CART_QUANTITY, Math.floor(quantity)) }
                    : i
                ),
        })),

      clearCart: () => set({ cart: [] }),

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getCartCount: () => {
        const { cart } = get();
        return cart.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'sniff-solve-cart',
      version: 2,
      partialize: (state) => ({ cart: state.cart }),
      migrate: (persistedState) => {
        const state = persistedState as { cart?: unknown } | null;
        const cart = Array.isArray(state?.cart)
          ? state.cart
              .filter((item): item is CartItem => {
                if (!item || typeof item !== 'object') return false;
                const candidate = item as Partial<CartItem>;
                return (
                  typeof candidate.id === 'string' &&
                  typeof candidate.name === 'string' &&
                  typeof candidate.price === 'number' &&
                  Number.isFinite(candidate.price) &&
                  candidate.price > 0
                );
              })
              .map((item) => ({
                ...item,
                subtitle: typeof item.subtitle === 'string' ? item.subtitle : undefined,
                swatch: typeof item.swatch === 'string' ? item.swatch : '#C8892F',
                quantity: Math.min(
                  MAX_CART_QUANTITY,
                  Math.max(1, Math.floor(Number(item.quantity) || 1))
                ),
              }))
          : [];
        return { ...(persistedState as object), cart } as StoreState;
      },
    }
  )
);
