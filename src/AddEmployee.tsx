import { useState } from 'react';
import axios from 'axios';

export default function AltaEmpleado() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Recuperas el token del admin que guardaste en el login (LocalStorage, Context, etc.)
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImlhdCI6MTc4MDc3MTA3MX0.brE9C-WEkqA6hPLKUwcl4ixH43IPaiy87EvmrFTQrKs'

    try {
      const respuesta = await axios.post(
        'http://localhost:3000/user/createEmployee', // Tu ruta local
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}` // 👈 Clave para que el JwtAuthGuard te deje pasar
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