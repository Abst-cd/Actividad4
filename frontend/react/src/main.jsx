import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './Components/Login.jsx'
import './Components/Login.css';

function Log() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      {loggedIn ? (
        <App />
      ) : (
     
        <Login onLoginSuccess={() => setLoggedIn(true)} />
      )}
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <Log />
  </StrictMode>,
)