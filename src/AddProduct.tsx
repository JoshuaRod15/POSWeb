import './AddProduct.css'
import { useState } from "react"
import { useProductsStore } from "./store/useProductStore"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function AddProduct() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        SKU: "",
        saleType: "UNIT",
        price: "",
        inventory: ""
    });

    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [isSaving, setIsSaving] = useState(false);

    const allProducts = useProductsStore((state) => state.products);
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    const addProductToStore = useProductsStore((state) => state.addProduct)

    // Validaciones Centralizadas
    const getErrors = () => {
        const errors: { [key: string]: string } = {};
        if (!form.name.trim()) errors.name = "El nombre es obligatorio";
        if (form.name.length > 0 && form.name.length < 3) errors.name = "Nombre muy corto";
        if (!form.price || parseFloat(form.price) <= 0) errors.price = "Precio inválido";
        if (form.SKU.trim() && allProducts.some(p => p.SKU === form.SKU.trim())) {
            errors.SKU = "Este SKU ya existe";
        }
        return errors;
    };

    const errors = getErrors();
    const isFormInvalid = Object.keys(errors).length > 0 || !form.name || !form.price;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormInvalid) return;

        setIsSaving(true);
        try {
            const productToSend = {
                ...form,
                name: form.name.trim().toUpperCase(),
                SKU: form.SKU.trim() || `GEN-${Date.now()}`,
                saleType: [form.saleType], // Mantenemos tu esquema de array
                price: Number(form.price),
                inventory: Number(form.inventory) || 0,
            };

            const res = await axios.post(`${API_URL}/product`, productToSend, {
                headers: { Authorization: `Bearer ${token}` },
            });

            addProductToStore(res.data)
            
            // En lugar de un alert, podrías usar un Toast (notificación)
            alert("✅ Producto guardado exitosamente");
            navigate('/editar-producto'); // Redirección tras éxito
        } catch (error) {
            console.error(error);
            alert("❌ No se pudo guardar el producto");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="add-product-page">
            <div className="header-section">
                <h2 className='mainText'>Nuevo Producto</h2>
                <p className='subText'>Completa los campos para registrar un artículo en el inventario.</p>
            </div>

            <form className="addProductForm" onSubmit={handleSave}>
                <div className='form-card'>
                    <div className='infoContainer'>
                        <h3 className='section-title'>📦 Información General</h3>
                        
                        <div className="input-group">
                            <label>Nombre del producto <span className="required">*</span></label>
                            <input 
                                name="name"
                                type="text" 
                                className={`form-input ${(touched.name && errors.name) ? 'inputError' : ''}`}
                                value={form.name} 
                                onChange={handleChange}
                                onBlur={() => handleBlur('name')}
                                placeholder="Ej: Coca Cola 600ml"
                            />
                            {touched.name && errors.name && <span className="error-msg">{errors.name}</span>}
                        </div>
                        
                        <div className="input-group">
                            <label>SKU / Código de Barras</label>
                            <input 
                                name="SKU"
                                type="text" 
                                className={`form-input ${(touched.SKU && errors.SKU) ? 'inputError' : ''}`}
                                value={form.SKU} 
                                onChange={handleChange} 
                                onBlur={() => handleBlur('SKU')}
                                placeholder='Escanea o escribe el código'
                            />
                            {touched.SKU && errors.SKU && <span className="error-msg">{errors.SKU}</span>}
                        </div>
                    </div>

                    <div className='saleTypeContainer'>
                        <h3 className='section-title'>🛒 Tipo de Venta</h3>
                        <div className='type-selector'>
                            <button 
                                type="button"
                                className={`type-btn ${form.saleType === "UNIT" ? "active" : ""}`} 
                                onClick={() => setForm(prev => ({...prev, saleType: "UNIT"}))}
                            >
                                <span className="icon">📦</span>
                                <div className="btn-text">
                                    <p className="btn-title">Por Unidad</p>
                                    <p className="btn-desc">Piezas individuales</p>
                                </div>
                            </button>
                            <button 
                                type="button"
                                className={`type-btn ${form.saleType === "LOOSE" ? "active" : ""}`} 
                                onClick={() => setForm(prev => ({...prev, saleType: "LOOSE"}))}
                            >
                                <span className="icon">⚖️</span>
                                <div className="btn-text">
                                    <p className="btn-title">A Granel</p>
                                    <p className="btn-desc">Venta por peso (Kg)</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className='pricingContainer'>
                        <h3 className='section-title'>💰 Precios e Inventario</h3>
                        <div className='form-row'>
                            <div className="input-group">
                                <label>Precio de Venta <span className="required">*</span></label>
                                <div className="price-input-wrapper">
                                    <span className="currency">$</span>
                                    <input 
                                        name="price"
                                        type="number" 
                                        className={`form-input price-field ${(touched.price && errors.price) ? 'inputError' : ''}`}
                                        value={form.price} 
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('price')}
                                        placeholder='0.00'
                                    />
                                </div>
                                {touched.price && errors.price && <span className="error-msg">{errors.price}</span>}
                            </div>
                            <div className="input-group">
                                <label>Stock Inicial</label>
                                <input 
                                    name="inventory"
                                    type="number" 
                                    className='form-input' 
                                    value={form.inventory} 
                                    onChange={handleChange}
                                    placeholder='0'
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="actions-bar">
                    <button 
                        type="submit" 
                        className='save-btn' 
                        disabled={isFormInvalid || isSaving}
                    >
                        {isSaving ? (
                            <div className="loader"></div>
                        ) : (
                            "Registrar Producto"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}