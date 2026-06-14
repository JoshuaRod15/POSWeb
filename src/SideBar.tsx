import { Link } from 'react-router-dom';
import './Sidebar.css'

interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
    setAuth: (auth: boolean) => void;
}

export const Sidebar = ({ isOpen, onClose, setAuth }: SideBarProps) => {
    if(!isOpen) return null;

    const handleLogOut = () => {
        localStorage.removeItem('token')
        setAuth(false)
        onClose()
    }

    return(
        <div onClick={onClose} className="modalOverlay">
            <div onClick={(e) => e.stopPropagation()} className='sideMenu'>
                <div className='menuHeader'>
                    <h2>Menu POS</h2>
                    <button
                        onClick={onClose}
                    >x</button>
                </div>

                <nav className='menuItems'>
                    <Link to={"/"} onClick={onClose}>
                        <span>🏠</span> Inicio
                    </Link>
                    <Link to={"/agregar-producto"} onClick={onClose}>
                        <span>➕</span> Agregar Producto
                    </Link>
                    <Link to={"/editar-producto"}>
                        <span>✏️</span> Editar Producto
                    </Link>
                    <Link to={"/agregar-empleado"}>
                        <span>✏️</span> Agregar Empleado
                    </Link>
                </nav>

                <div className='closeSesionContainer'>
                    <button onClick={handleLogOut} className='closeSesionButton'>
                        Cerrar Sesion
                    </button>
                </div>
            </div>
        </div>
    )
}