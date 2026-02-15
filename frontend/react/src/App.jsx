import { useState } from 'react'
import './App.css'

function App() {
  const [nombreReceta, setNombre] = useState("")
  const [ingredientes, setIngredientes] = useState("")
  const [tiempoCocinar, setTiempoCocinar] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const receta = {
      nombre: nombreReceta,
      ingredientes: ingredientes.split(","), // separa por comas
      tiempo: Number(tiempoCocinar)
    }

    try {
      const res = await fetch("http://localhost:3000/recetas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(receta),
      })

      const data = await res.json();
      console.log("Receta creada!", data)

      // Limpiar inputs
      setNombre("");
      setIngredientes("");
      setTiempoCocinar("");
    } catch (error) {
      console.log("Error:", error);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Agregar Receta</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder='Agrega Receta'
          value={nombreReceta}
          onChange={(e) => setNombre(e.target.value)}
        /> <br /><br />
        <input
          placeholder="Ingredientes"
          value={ingredientes}
          onChange={(e) => setIngredientes(e.target.value)}
        /><br/><br/>
        <input
          placeholder="Tiempo a cocinar (minutos)"
          type="number"
          value={tiempoCocinar}
          onChange={(e) => setTiempoCocinar(e.target.value)}
        /><br /><br />
        <button type="submit" id="botonagregarReceta">Agregar!</button>
      </form>
    </div>
  )
}

export default App
