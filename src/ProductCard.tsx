import './ProductCard.css'
import { useCartStore } from './store/useCartStore';
interface Product {
    SKU:string,
    id:number,
    image:string | null,
    inventory: string,
    name:string,
    price:string,
    saleType:Array<string>
}

interface Props {
    producto: Product;
  }

export const ProductCard = ({producto}: Props) => {

    const addToCart = useCartStore(state => state.addToCart)

    return(
        <button className="cardContainer" 
            onClick={() => addToCart(producto)}
        >
            <div>
                {producto.image?
                    <img src={producto.image} alt="" />:
                    <span>📦</span>
                }
            </div>
            <h3 className='nameText'>{producto.name}</h3>
            <h3 className='priceText'>{producto.saleType[0] == "LOOSE" ? "$" +producto.price+ "/kg" : "$"+producto.price}</h3>
        </button>
    )
}