import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './Components/Login.css'
import './index.css'
function Root() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <App loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
