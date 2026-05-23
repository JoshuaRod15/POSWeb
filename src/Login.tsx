import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

interface LoginProps {
    setAuth: (auth: boolean) => void;
}

export default function Login({setAuth}: LoginProps){
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try{
            const res = await axios.post(`${API_URL}/auth/login`, { user, password });
            const token = res.data.access_token;

            localStorage.setItem("token", token)

            setAuth(true)
            navigate("/")
        }catch (err){
            setError(`Usuario o contarseña incorrectos, ${err}`)
        }
    }

    return(
        <div className="loginContainer">
            <form className="loginCard" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        {error && <p className="errorText">{error}</p>}
        
        <input 
          type="text" 
          placeholder="Usuario" 
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        
        <button type="submit" className="loginButton">Entrar</button>
      </form>
    </div>
    )
}