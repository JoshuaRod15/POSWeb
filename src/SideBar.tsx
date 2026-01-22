import './Sidebar.css'

interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SideBarProps) => {
    if(!isOpen) return null;

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
                    <button>
                        <span>🏠</span> Inicio
                    </button>
                    <button>
                        <span>➕</span> Agregar Producto
                    </button>
                    <button>
                        <span>✏️</span> Editar Producto
                    </button>
                </nav>
            </div>
        </div>
    )
}