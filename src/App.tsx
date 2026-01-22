
import { useEffect, useRef, useState } from 'react'
import './App.css'
import { ProductCard } from './ProductCard'
//import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getProducts } from './services/productService'
import { useProductsStore } from './store/useProductStore'
import { useCartStore } from './store/useCartStore'
import { CartCard } from './cartCard'
import { Sidebar } from './SideBar'


interface Product {
  SKU:string,
  id:number,
  image:string | null,
  inventory: string,
  name:string,
  price:string,
  saleType:Array<string>
}

function App() {
  const [search, setSearch] = useState('')
  const [checkingAuth, setCheckingAuth] = useState(true)
  const lista = useProductsStore(state => state.products)
  const [productList, setProductList] = useState<Array<Product>>([])
  const cart = useCartStore(state => state.cart)
  const total = useCartStore(state => state.cartTotal);
  const scannerInputRef = useRef<HTMLInputElement>(null);
  const addToCart = useCartStore((state) => state.addToCart)
  const clearCart = useCartStore((state) => state.clearCart)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  //const navigate = useNavigate();

  const focusScanner = () => {
    scannerInputRef.current?.focus()
  }

  useEffect(() => {
    focusScanner()

    const handleGlobalClick = () => focusScanner();
    window.addEventListener('click', handleGlobalClick)

    return () => window.removeEventListener('click', handleGlobalClick)
  }, [])

  useEffect(() =>  { {/* Efecto para hacer la validacion del token y mandar llamar los productos*/}
  const verifyAuth = async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTc2ODU3Nzg4NH0.HLMoEb7dgUc7ClqnflDCWK9bWZ39CK_3vKWhnfyDMBg';
    const API_URL = import.meta.env.VITE_API_URL

    /* if(!token){
      setCheckingAuth(false)
      navigate('/login');
      return
    } */

    try {
      const res = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}`}
      });
      if(res.status != 200){
        throw new Error('Token Invalido')
      }

      console.log('token valido');

      await getProducts(token)
      
    } catch (error) {
      console.log(error);
    }finally{
      setCheckingAuth(false)
    }
  }

  verifyAuth();
}, [])

  useEffect(() => { {/* efecto para tener la lista actualizada si cambia */}
    if(lista.length > 0) {
      setProductList(lista)
    }
  }, [lista])

  const handleScannerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  
  if (checkingAuth) {
    return <div>Verificando sesion...</div>
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoValor = e.target.value
    setSearch(nuevoValor)
    searchFilter(nuevoValor)
  }

  function searchFilter(textoABuscar:string){
      if (textoABuscar == null){setProductList(productList)}
      else{
        const filteredProds = lista.filter(products => {
          
          return products.name.includes(textoABuscar.toUpperCase())
        })
        setProductList(filteredProds)
      }
  }
  return (
    <>
        <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}></Sidebar>

        <div className='containerTitle'> {/* Container titulo */}
          <button
            className='menuButton' 
            onClick={() => setIsMenuOpen(true)}   
          >☰</button>
          <h1 className='title'>PUNTO DE VENTA</h1>
        </div>
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
              <input 
                type='text'
                id="searchBar"
                value={search}
                onChange={handleSearch}
                placeholder='Buscar un producto...'
              />
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
              <button className='payButton'><p className='payButtonText'>{total< 1? "Agrega productos" : `Total $${total}`}</p></button>
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
    </>
  )
}

export default App
