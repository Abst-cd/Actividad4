import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './Components/Login.jsx'
import './Components/Login.css';

function Log() {
  // --- PASO 1: Estado para saber si el usuario está logueado ---
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      {loggedIn ? (
        // --- PASO 2: Si está logueado, muestra el Recetario ---
        <App />
      ) : (
        // --- PASO 3: Si NO está logueado, muestra el Login ---
        // Pasamos la función para cambiar el estado cuando sea exitoso
        <Login onLoginSuccess={() => setLoggedIn(true)} />
      )}
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* --- PASO 4: Renderiza el gestor Log --- */}
    <Log />
  </StrictMode>,
)