import { create } from "zustand";

export interface Product {
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
    addProduct: (product: Product) => void;
    updateProduct: (id: number, updatedData: Partial<Product>) => void;
}

export const useProductsStore = create<ProductState>((set) => ({
    products: [],
    cartTotal: 0,
    isLoading: false,
    setProducts: (products) => set({products, isLoading: false}),
    setLoading: (status) => set({isLoading: status}),
    addProduct: (product) => 
      set((state) => ({
        products: [product, ...state.products],
      })),
    updateProduct: (id, updatedData) => 
      set((state) => ({
        products: state.products.map((p) => 
        p.id === id? {...p, ...updatedData} : p
        ),
      }))
}))