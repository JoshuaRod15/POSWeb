
import { useState } from 'react'
import './App.css'
import { ProductCard } from './ProductCard'

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
  const lista:Array<Product> = [{
    SKU: "75001186",
    id: 39,
    image: null,
    inventory: "4",
    name: "FABULOSO MF 500ML",
    price: "21",
    saleType: ["UNIT"]
  },
  {
    SKU: "75001186",
    id: 38,
    image: null,
    inventory: "4",
    name: "FABULOSO MF 500ML",
    price: "21",
    saleType: ["UNIT"]
  },
  {
    SKU: "75001186",
    id: 37,
    image: null,
    inventory: "4",
    name: "FABULOSO MF 500ML",
    price: "21",
    saleType: ["UNIT"]
  },
  {
    SKU: "75001186",
    id: 36,
    image: null,
    inventory: "4",
    name: "FABULOSO MF 500ML",
    price: "21",
    saleType: ["UNIT"]
  },
  {
    SKU: "75001186",
    id: 35,
    image: null,
    inventory: "4",
    name: "FABULOSO MF 500ML",
    price: "21",
    saleType: ["UNIT"]
  },
  {
    SKU: "75001186",
    id: 34,
    image: null,
    inventory: "4",
    name: "FABULOSO MF 500ML",
    price: "21",
    saleType: ["UNIT"]
  },

  ]
  const [productList, setProductList] = useState<Array<Product>>(lista)

  const handleSearch = (e) => {
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
        <div className='containerTitle'> {/* Container titulo */}
          <button
            className='menuButton'    
          >☰</button>
          <h1 className='title'>PUNTO DE VENTA</h1>
        </div>
        <div>{/* Container general */}
          <section className='mainContentContainer'>{/* Container Lista-Search */}
              <div className='searchContainer'>
              <p>Todos los productos</p>
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
                </div> : productList?.map((producto) => (
                  <ProductCard
                    key={producto.id}
                    producto={producto}
                  />
                ))}
              </div>
          </section>
          <section>

          </section>
          <div>
            <section>

            </section>
            <section>

            </section>
          </div>
        </div>
    </>
  )
}

export default App
