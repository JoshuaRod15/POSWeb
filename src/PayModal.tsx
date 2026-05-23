import { useMemo, useState } from "react";
import axios from "axios";
import './PayModal.css'


const generateSmartSuggestions = (total: number): number[] => {
    const denominations = [2, 5, 10, 20, 50, 100, 200, 500]
    const suggestions = new Set<number>()
    const minDiff = 1
    for (const d of denominations) {
        const rounded = Math.ceil(total / d) * d;
        if (rounded - total >= minDiff) {
            suggestions.add(rounded);
        }
    }

    for (const d of denominations) {
        if (d > total) suggestions.add(d)
    }
    return Array.from(suggestions).sort((a,b) => a - b);
} 

interface TicketProduct {
    id: number;
    SKU: string;
    name: string;
    price: number;
    qty: number;
}

interface PayModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: {
        date: number;
        state: string;
        payType: string;
        total: number;
        recivedCash: number;
        returnedCash: number;
        products: TicketProduct[];
    };
    clearTicket: () => void;
}

export default function PayModal({ isOpen, onClose, ticket, clearTicket }: PayModalProps) {
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    const [recivedCash, setRecivedCash] = useState(ticket.total.toString());
    const [loading, setLoading] = useState(false);
    const [showChangeModal, setShowChangeModal] = useState(false);
    const [changeAmount, setChangeAmount] = useState(0);

    const suggestions = useMemo(() => {
        return generateSmartSuggestions(ticket.total).slice(0, 4);
    }, [ticket.total]);

    if (!isOpen) return null;

    const handlePayWithCard = async () => {
        if (loading) return;
        setLoading(true);
        try {
            // Estructura idéntica a la app móvil para tarjeta
            const newTicket = { 
                ...ticket, 
                payType: 'CARD', 
                state: 'PAID' 
            };
    
            await axios.post(`${API_URL}/ticket`, newTicket, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            alert('💳 Pago con Tarjeta Procesado');
            clearTicket();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Error al procesar el ticket con tarjeta');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCashVerification = () => {
        const cashValue = Number(recivedCash);
        if (isNaN(cashValue) || cashValue < ticket.total) {
            alert('El dinero recibido es menor al importe total');
            return;
        }
        const cambio = cashValue - ticket.total;
        setChangeAmount(cambio);
        setShowChangeModal(true);
    };

    const handleConfirmCashPay = async () => {
        if (loading) return;
        setLoading(true);
        try {
            // Estructura idéntica a la app móvil para efectivo
            const newTicket = { 
                ...ticket, 
                payType: 'MONEY',
                state: 'PAID', 
                recivedCash: Number(recivedCash), 
                returnedCash: changeAmount 
            };
            
            await axios.post(`${API_URL}/ticket`, newTicket, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            alert('💵 Pago en Efectivo Procesado');
            clearTicket();
            setShowChangeModal(false);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Error al registrar el ticket en efectivo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-pay-overlay">
            <div className="pay-modal-card">
                <div className="pay-modal-header">
                    <h2>Procesar Cobro</h2>
                    <button className="close-x-btn" onClick={onClose}>×</button>
                </div>

                {!showChangeModal ? (
                    <div className="pay-modal-body">
                        {/* Importe Total */}
                        <div className="total-display">
                            <span className="total-currency">$</span>
                            <span className="total-value">{ticket.total}</span>
                            <p className="total-label">Total a Pagar</p>
                        </div>

                        {/* Input de Efectivo */}
                        <div className="cash-input-section">
                            <label>Efectivo Recibido</label>
                            <div className="cash-input-wrapper">
                                <span className="input-currency-symbol">$</span>
                                <input
                                    type="number"
                                    value={recivedCash}
                                    onChange={(e) => setRecivedCash(e.target.value)}
                                    className="cash-field"
                                    autoFocus
                                    onFocus={(e) => e.target.select()}
                                />
                            </div>
                        </div>

                        {/* Sugerencias Rápidas */}
                        <div className="suggestions-grid">
                            {suggestions.map((amount, index) => (
                                <button
                                    type="button"
                                    key={index}
                                    className="suggestion-chip"
                                    onClick={() => setRecivedCash(amount.toString())}
                                >
                                    ${amount}
                                </button>
                            ))}
                        </div>

                        {/* Métodos de Pago */}
                        <div className="pay-actions-group">
                            <button 
                                className="card-pay-btn" 
                                onClick={handlePayWithCard} 
                                disabled={loading}
                            >
                                💳 Tarjeta
                            </button>
                            <button 
                                className="cash-pay-btn" 
                                onClick={handleOpenCashVerification}
                                disabled={loading}
                            >
                                💵 Efectivo (Cobrar)
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Sub-pantalla interna: Cambio a entregar */
                    <div className="change-display-body">
                        <div className="change-alert-box">
                            <p className="change-title">CAMBIO A ENTREGAR</p>
                            <h1 className="change-value">${changeAmount.toFixed(2)}</h1>
                        </div>
                        <div className="change-actions">
                            <button className="back-btn" onClick={() => setShowChangeModal(false)}>
                                Regresar
                            </button>
                            <button className="confirm-btn" onClick={handleConfirmCashPay} disabled={loading}>
                                {loading ? "Registrando..." : "🛒 Finalizar y Abrir Caja"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}