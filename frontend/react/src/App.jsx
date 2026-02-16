import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import RecetasApp from "./RecetasApp";

function App({ loggedIn, setLoggedIn }) {
  return (
    <Routes>

      <Route
        path="/login"
        element={
          loggedIn
            ? <Navigate to="/dashboard" />
            : <Login onLoginSuccess={() => setLoggedIn(true)} />
        }
      />

      <Route
        path="/dashboard"
        element={
          loggedIn
            ? <RecetasApp />
            : <Navigate to="/login" />
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
}

export default App;
