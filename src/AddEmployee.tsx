import { useState } from 'react';
import axios from 'axios';

export default function AltaEmpleado() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const respuesta = await axios.post(
        `${API_URL}/user/createEmployee`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setMensaje(`¡Empleado ${respuesta.data.name} creado con éxito!`);
      setFormData({ name: '', email: '', password: '' }); // Limpiar formulario
    } catch (error) {
      setMensaje(`Error: ${error}, 'No se pudo crear'}`);
    }
  };

  return (
    <div className="container-alta">
      <h2>Registrar Nuevo Repartidor / Cajero</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Nombre del trabajador"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required 
        />
        <input 
          type="email" 
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required 
        />
        <input 
          type="password" 
          placeholder="Contraseña de acceso"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required 
        />
        <button type="submit">Guardar Empleado</button>
      </form>
      {mensaje && <p className="alerta">{mensaje}</p>}
    </div>
  );
}