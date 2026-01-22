import axios from "axios";
import { useProductsStore } from "../store/useProductStore";

export async function getProducts(token:string) {
    const API_URL = import.meta.env.VITE_API_URL
    const {setProducts} = useProductsStore.getState();

    try{
        const res = await axios.get(`${API_URL}/product`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
    });
    setProducts(res.data)
    } catch (error) {
        console.error(`Error al traer los productos`, error)
    }
}