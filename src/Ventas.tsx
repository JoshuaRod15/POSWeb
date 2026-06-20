
import './Ventas.css'

import { useEffect, useMemo, useRef, useState, useCallback  } from 'react'
import { ProductCard } from './ProductCard'
import { useProductsStore } from './store/useProductStore'
import { useCartStore } from './store/useCartStore'
import { CartCard } from './cartCard'
import PayModal from './PayModal'


function Ventas() {
  const [search, setSearch] = useState('')
  const [isPayModalOpen, setIsPayModalOpen] = useState(false)
  const lista = useProductsStore(state => state.products)
  const cart = useCartStore(state => state.cart)
  const total = useCartStore(state => state.cartTotal);
  const scannerInputRef = useRef<HTMLInputElement>(null);
  const searchBarInputRef = useRef<HTMLInputElement>(null);
  const addToCart = useCartStore((state) => state.addToCart)
  const clearCart = useCartStore((state) => state.clearCart)
  //const navigate = useNavigate();

  const focusSearchBar = useCallback(() => {
    searchBarInputRef.current?.focus()
    searchBarInputRef.current?.select()   
}, [])

  const focusScanner = () => {
    if (!isPayModalOpen) {
      scannerInputRef.current?.focus()
    }
  }

  useEffect(() => {
    focusScanner()

    const handleGlobalClick = (e: MouseEvent) => {
        const clickedElement = e.target as HTMLElement;

        if (clickedElement.id === 'searchBar' || clickedElement.closest('.pay-modal-card')) {
            return;
        }

        focusScanner()
    };
    window.addEventListener('click', handleGlobalClick)

    return () => window.removeEventListener('click', handleGlobalClick)
  }, [isPayModalOpen])

  const handleScannerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    
    if (e.key === 'F1') {
        e.preventDefault()
        focusSearchBar()
        return
    } 

    if(e.key  === 'Enter') {
      const code = e.currentTarget.value.trim();
      if(!code) return;

      const producto = lista.find(p => p.SKU === code)

      if(producto) {
        addToCart(producto)
      }else{
        alert("Producto no encontrado: " + code)
      }

      e.currentTarget.value = "";
    }
  } 

  const productList = useMemo(() => {
    if (!lista) return [];
    if (!search.trim()) return lista;

    const searchTerms = search.toUpperCase().split(' ').filter(term => term != ' ');
    return lista.filter(p => {
      const name = p.name ? p.name.toUpperCase() : "";
      const sku =  p.SKU ? p.SKU.toUpperCase() : "";

      const productData = `${name} ${sku}`

      return searchTerms.every(term => productData.includes(term))
  });
  }, [search, lista]);
  

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoValor = e.target.value
    setSearch(nuevoValor)
  } 

  const ticketData = useMemo(() => {
    return {
      // Mantenemos los campos base del ticket que tu backend espera
      // eslint-disable-next-line react-hooks/purity
      date: Date.now(),
      state: 'PAID',
      payType: 'MONEY', // Se sobreescribe en el modal según el método
      total: total,
      recivedCash: 0,
      returnedCash: 0,
      
      // Mapeamos los productos idéntico a la estructura de la app móvil
      products: cart.map(item => ({
        id: item.id,                        // Tu backend de la app usa 'id'
        SKU: item.SKU || '',
        name: item.name,
        price: parseFloat(item.price) || 0, // ¡SUPER IMPORTANTE! Debe ser número, no string
        qty: Number(item.quantity) || 1     // Tu backend de la app usa 'qty'
      }))
    };
  }, [cart, total])

  return (
    <>
        <div className='generalContainer'>{/* Container general */}
          <section className='mainContentContainer'>{/* Container Lista-Search */}
              <div className='searchContainer'>
              <p>Todos los productos</p>
              <input type="text"
                ref={scannerInputRef}
                onKeyDown={handleScannerKeyDown}
                autoFocus
                className='scannerSearch'
              />
              <div className='searchAndCleanContainer'>
                <input 
                    type='text'
                    id="searchBar"
                    ref={searchBarInputRef}
                    value={search}
                    onChange={handleSearch}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        e.preventDefault()
                        setSearch("")
                        focusScanner()
                      }
                    }}
                    placeholder='Buscar un producto...'
                />
                <button className='cleanButton'
                    onClick={() => setSearch("")}
                >Limpiar busqueda</button>
              </div>
              </div>
              <div className='listContainer'>
                {productList.length == 0 ? <div>
                  <span>🔍</span>
                  <p>No se econtraron productos</p>
                </div> : productList.map((producto) => (
                  <ProductCard
                    key={producto.id}
                    producto={producto}
                  />
                ))}
              </div>
          </section>
          <section className='ticketAndButtonContainer'>
              <button className='payButton' onClick={() => setIsPayModalOpen(true)}><p className='payButtonText'>{total< 1? "Agrega productos" : `Total $${total}`}</p></button>
            <div className='ticketContainer'>
              <div className='dropCartButtonContainer'>
                <h2>Ticket actual</h2>
                <button className='dropCartButton' onClick={() => clearCart()}>Vaciar carrtito</button>
              </div>
              <div className='ticketProductsContainer'>
                {cart.length <= 0 ? <div>
                  <p>Aun no hay productos</p> 
                </div> : cart.map((product) => (
                  <CartCard
                    key={product.id}
                    cartItem={product}
                  />
                )).reverse()}
              </div>
            </div>
          </section>
        </div>
        {/* <-- 5. Renderizado condicional del PayModal */}
        <PayModal 
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          ticket={ticketData}
          clearTicket={clearCart}
        />
    </>
  )
}

export default Ventas
