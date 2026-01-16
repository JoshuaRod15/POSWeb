import { create } from "zustand";

interface Product {
    SKU:string,
    id:number,
    image:string | null,
    inventory: string,
    name:string,
    price:string,
    saleType:Array<string>
  }

interface CartItem extends Product{
    quantity: number
}

interface CartState {
    cart: CartItem[],
    addToCart: (product:Product) => void;
    clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
    cart:[],
    addToCart: (product) => set((state) => {
        const itemExist = state.cart.find((item) => item.id === product.id);
        if (itemExist) {
            return{
                cart: state.cart.map((item) => 
                    item.id === product.id ? {...item, quantity: item.quantity + 1} : item
                ),
            };
        }
        return{cart: [...state.cart, {...product, quantity: 1}]}
    }),
    clearCart: () => set({cart: []})
}))