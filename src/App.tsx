import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from "./SideBar";
import Ventas from "./Ventas";
import AddProduct from "./AddProduct";
import axios from "axios";
import { getProducts } from "./services/productService";
import EditProduct from "./EditProduct";
import Login from "./Login";

function App(){
  const [isOpen, setIsOpen] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCheckingAuth(false);
        return;
      }

      try {
        // Tu llamada de verificación que ya tenías
        const API_URL = import.meta.env.VITE_API_URL;
        await axios.get(`${API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setIsAuthenticated(true);
        // Aprovechamos para cargar productos una sola vez al iniciar
        await getProducts(token); 
      } catch (error) {
        console.error("Token expirado o inválido", error);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyToken();
  }, []);

  if (checkingAuth) return <div>Cargando sistema...</div>;

  return(
    <Router>
      {!isAuthenticated ? (
        <Login setAuth={setIsAuthenticated} />
      ) : (
        <>
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} setAuth={setIsAuthenticated}/>

      <div className='containerTitle'>
      <button className='menuButton' onClick={() => setIsOpen(true)}>☰</button>
      <h1 className='title'>PUNTO DE VENTA</h1>
      </div>

      <Routes>
        <Route path="/" element={<Ventas />} />
        <Route path="/agregar-producto" element={<AddProduct />} />
        <Route path="/editar-producto" element={<EditProduct />}/>
        <Route path="/login" element={<Login setAuth={() => false}/>}/>
      </Routes>
      </>)}
    </Router>
    

  )
}

export default App