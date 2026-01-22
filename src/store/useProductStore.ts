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

interface ProductState {
    products: Product[];
    isLoading: boolean;
    setProducts: (products: Product[]) => void;
    setLoading: (status: boolean) => void;
}

export const useProductsStore = create<ProductState>((set) => ({
    products: [],
    cartTotal: 0,
    isLoading: false,
    setProducts: (products) => set({products, isLoading: false}),
    setLoading: (status) => set({isLoading: status})
}))