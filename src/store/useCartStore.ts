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
    cartTotal: number;
    addToCart: (product:Product) => void;
    removeFromCart: (product: Product) => void;
    removeOne: (product: Product) => void;
    clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
    cart:[],
    cartTotal: 0,
    addToCart: (product) => set((state) => {
        const itemExist = state.cart.find((item) => item.id === product.id);
        let newCart;
        if (itemExist) {
            newCart = state.cart.map((item) => 
                    item.id === product.id ? {...item, quantity: item.quantity + 1} : item
                );
            }else {
                newCart = [...state.cart, {...product, quantity: 1}]
            }

            const newTotal = newCart.reduce((acc, item) => {
                return acc + (item.quantity * parseFloat(item.price))
            }, 0)
            return {
                cart : newCart,
                cartTotal: newTotal
            }
        
    }),
    removeFromCart: (product) => set((state) => {
        const itemExist =  state.cart.find((item) => item.id === product.id)
        let newCart;

        if (itemExist) {
            newCart = state.cart.filter((item) => 
                item.id !== product.id
            )
        }else {
            newCart = state.cart
        }

        const newTotal = newCart.reduce((acc, item) => {
            return acc + (item.quantity * parseFloat(item.price))
            
            
        }, 0)

        return {
            cart: newCart,
            cartTotal: newTotal
        }
    }),
    removeOne: (product) => set((state) => {
        const itemExist = state.cart.find((item) => item.id === product.id)
        let newCart;

        if (itemExist) {
            newCart = state.cart.map((item) => 
                item.id === product.id ? {...item, quantity: item.quantity - 1} : item
            )
        } else {
            newCart = [...state.cart, {...product, quantity: 1}]
            
        }

        const newTotal = newCart.reduce((acc, item) => {
            return acc + (item.quantity * parseFloat(item.price))
        }, 0)

        return{
            cart: newCart,
            cartTotal: newTotal
        }

    }),
    clearCart: () => set({cart: [], cartTotal: 0})
}))