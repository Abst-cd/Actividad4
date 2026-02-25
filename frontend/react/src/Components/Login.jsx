import { useState, useEffect } from "react";
import "./Login.css";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  

  const handleLogin = async (event) => {
    event.preventDefault(); 
    setError("");
   
    
    try {
      
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
      // 1. Guardamos el token (Sin el asterisco)
      localStorage.setItem('token', data.token); 
      
      console.log("Login exitoso, token guardado.");
      
      // 2. Avisamos a la App que ya estamos logueados
      onLoginSuccess(); 
    } else {
      setError(data.message || "Error en login");
    }
  } catch (err) {
    console.error("Error durante login:", err);
    setError("Error en la conexión al servidor");
  }
    
  };

  return (
    
    <div id="Login-container">
    <div id="hero">RECETARIO</div>
      <h1 id="login-title">Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" id="login-button">
          Login
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
