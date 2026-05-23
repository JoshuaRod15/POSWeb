import './EditProduct.css'
import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { useProductsStore, type Product } from "./store/useProductStore"
import { ProductCard } from "./ProductCard";
import axios from 'axios';

export default function EditProduct() {
    const lista = useProductsStore((state) => state.products)
    const [search, setSearch] = useState('')
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token")
    
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const scannerInputRef = useRef<HTMLInputElement>(null);

    // Estado unificado para el formulario
    const [form, setForm] = useState({
        id: '',
        name: '',
        SKU: '',
        price: '',
        inventory: '',
        saleType: 'UNIT' // Simplificado a string para el estado interno
    });

    const focusScanner = useCallback(() => {
        // Pequeño delay para asegurar que el DOM esté listo tras cerrar modales
        setTimeout(() => scannerInputRef.current?.focus(), 100);
    }, []);

    useEffect(() => {
        focusScanner();
    }, [focusScanner, editModalVisible]); // Re-enfoca cuando cambia la visibilidad del modal

    const openEditModal = (producto: Product) => {
        setForm({
            id: producto.id.toString(),
            name: producto.name,
            SKU: producto.SKU,
            price: producto.price.toString(),
            inventory: producto.inventory?.toString() || '0',
            saleType: Array.isArray(producto.saleType) ? producto.saleType[0] : producto.saleType
        });
        setEditModalVisible(true);
    };

    const handleScannerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            const code = e.currentTarget.value.trim();
            if(!code) return;
            
            const producto = lista.find(p => p.SKU === code);
            if(producto) {
                openEditModal(producto);
            } else {
                alert("Producto no encontrado: " + code);
            }
            e.currentTarget.value = "";
        }
    }

    const handleSaveProduct = async () => {
        if(!form.name.trim() || !form.SKU.trim() || !form.price.toString().trim()){
            alert("Error: Completa todos los campos obligatorios");
            return;
        }

        setIsSaving(true);
        try {
            const updatedProduct = {
                name: form.name.toUpperCase().trim(),
                SKU: form.SKU,
                price: Number(form.price),
                inventory: Number(form.inventory),
                saleType: [form.saleType], // Convertimos a array para el backend
            };

            await axios.patch(`${API_URL}/product/${form.id}`, updatedProduct, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert("✅ Producto actualizado con éxito");
            setEditModalVisible(false);
            // Aquí deberías llamar a una función de refresh de tu store
        } catch (error) {
            console.error(error);
            alert("❌ Error: No se pudo guardar el producto");
        } finally {
            setIsSaving(false);
        }
    };

    const productList = useMemo(() => {
        if (!lista) return [];
        if (!search.trim()) return lista;
        const terms = search.toUpperCase().split(' ').filter(t => t !== '');
        return lista.filter(p => {
            const data = `${p.name} ${p.SKU}`.toUpperCase();
            return terms.every(term => data.includes(term));
        });
    }, [search, lista]);

    return (
        <div className="edit-page-container">
            <div className="header-actions">
                <h3 className='mainText'>Gestión de Inventario</h3>
                <div className='searchAndCleanContainer'>
                    <input 
                        type='text'
                        id="searchBar"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='🔍 Buscar por nombre o SKU...'
                    />
                    {search && (
                        <button className='cleanButton' onClick={() => setSearch("")}>
                            Limpiar
                        </button>
                    )}
                </div>
            </div>

            {/* Input invisible para scanner */}
            <input 
                type="text"
                ref={scannerInputRef}
                onKeyDown={handleScannerKeyDown}
                className='scanner-hidden-input'
            />

            <div className='listContainer'>
                {productList.length === 0 ? (
                    <div className="no-results">
                        <p>No se encontraron productos</p>
                    </div>
                ) : (
                    productList.map((producto) => (
                        <div key={producto.id} onClick={() => openEditModal(producto)} className="card-wrapper">
                            <ProductCard producto={producto} />
                        </div>
                    ))
                )}
            </div>

            {editModalVisible && (
                <div className="modalEditOverlay" onClick={() => setEditModalVisible(false)}>
                    <div className="editModal" onClick={(e) => e.stopPropagation()}>
                        <div className="modalContent">
                            <h2 className="modalTitle">Editar Producto</h2>

                            <div className="formGroup">
                                <label className="formLabel">Nombre del Producto *</label>
                                <input
                                    className="formInput"
                                    value={form.name}
                                    onChange={(e) => setForm({...form, name: e.target.value})}
                                />
                            </div>

                            <div className="form-row-double">
                                <div className="formGroup">
                                    <label className="formLabel">SKU / Código *</label>
                                    <input
                                        className="formInput"
                                        value={form.SKU}
                                        onChange={(e) => setForm({...form, SKU: e.target.value})}
                                    />
                                </div>
                                <div className="formGroup">
                                    <label className="formLabel">Precio *</label>
                                    <input
                                        className="formInput"
                                        type="number"
                                        value={form.price}
                                        onChange={(e) => setForm({...form, price: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="formGroup">
                                <label className="formLabel">Tipo de Venta</label>
                                <div className="saleTypeContainer">
                                    <button
                                        className={`saleTypeButton ${form.saleType === "UNIT" ? "active" : ""}`}
                                        onClick={() => setForm({...form, saleType: "UNIT"})}
                                    >
                                        📦 Unidad
                                    </button>
                                    <button
                                        className={`saleTypeButton ${form.saleType === "LOOSE" ? "active" : ""}`}
                                        onClick={() => setForm({...form, saleType: "LOOSE"})}
                                    >
                                        ⚖️ Granel (Kg)
                                    </button>
                                </div>
                            </div>

                            <div className="modalButtons">
                                <button className="cancelButton" onClick={() => setEditModalVisible(false)}>
                                    Cancelar
                                </button>
                                <button 
                                    className="saveButton" 
                                    onClick={handleSaveProduct}
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Guardando..." : "Guardar Cambios"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}