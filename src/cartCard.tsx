import './CartCard.css'
import { useCartStore } from './store/useCartStore';
interface cartItem {
    SKU:string,
    id:number,
    image:string | null,
    inventory: string,
    name:string,
    price:string,
    saleType:Array<string>
    quantity: number
}

interface Props {
    cartItem: cartItem;
  }

export const CartCard = ({cartItem}: Props) => {
    const productTotal = parseFloat(cartItem.price) * cartItem.quantity
    const removeFromCart = useCartStore(state => state.removeFromCart)
    const removeOne = useCartStore((state) => state.removeOne)
    const addToCart = useCartStore((state) => state.addToCart)


    return(
        <div className="mainContainer">
            <div className='imageContainer'>
                <span>{cartItem.image? 
                    <img src={cartItem.image} alt="" />:
                    <span>📦</span>
                }</span>
            </div>
            <div className='namePriceContainer'>
                <p>{cartItem.name}</p>
                <p>cantidad: {cartItem.quantity}</p>
                <p>${cartItem.price}</p>
                
            </div>
            <div className='totalTrashContainer'>
                <div className='plusLessButtonsContainer'>
                    <button
                        onClick={() => ( cartItem.quantity === 1? removeFromCart(cartItem) : removeOne(cartItem)
                        )}
                        className='lessButton'
                    >-</button>
                    <p>${productTotal}</p>
                    <button
                        onClick={() => addToCart(cartItem)}
                        className='plusButton'
                    >+</button>
                </div>
                <button
                    onClick={() => removeFromCart(cartItem)}
                    className='trashButton'
                >🗑️</button>
            </div>
        </div>
    )
}
