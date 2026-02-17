import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'

function RecetasApp() {
  const [nombreReceta, setNombre] = useState("")
  const [ingredientes, setIngredientes] = useState("")
  const [tiempoCocinar, setTiempoCocinar] = useState("")
  const [recetas, setRecetas] = useState([])
  const [recetaEditada, setnuevaReceta] = useState(null)

    
  useEffect(() => {
    agarrarRecetas();
  }, []);


  const agarrarRecetas = async() => {
    const res = await fetch("http://localhost:3000/recetas")
    const data = await res.json();
    setRecetas(data);
  }

  const nuevaReceta = (receta) => {
    setnuevaReceta(receta);
    setNombre(receta.nombre);
    setIngredientes(receta.ingredientes.join(","));
    setTiempoCocinar(receta.tiempo);
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const receta = {
      nombre: nombreReceta,
      ingredientes: ingredientes.split(","), // separa por comas
      tiempo: Number(tiempoCocinar)
    }

    try {
      
    
    if (recetaEditada) {

      await fetch(`http://localhost:3000/recetas/${recetaEditada._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(receta),
      });

      alert("Receta actualizada!");

      setnuevaReceta(null);

    } else {
      const res = await fetch("http://localhost:3000/recetas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(receta),
      });

      const data = await res.json();
      console.log("Receta creada!", data);
    }

      // Limpiar inputs
      setNombre("");
      setIngredientes("");
      setTiempoCocinar("");
      agarrarRecetas();
    } catch (error) {
      console.log("Error:", error);
    }
  }
   
  const eliminarReceta = async (id) => {
    try{
    await fetch(`http://localhost:3000/recetas/${id}`,{
      method: "DELETE"
      
    });

    agarrarRecetas();
  } catch(error){
    console.log("Error", error);
  }
  }


  return (
  <div className="contenedor">

    <div className="agregarRecetas">
      <h1>Agregar Receta</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder='Agrega Receta'
          value={nombreReceta}
          onChange={(e) => setNombre(e.target.value)}
        /><br /><br />

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

        <button type="submit">
        Agregar!
        </button>

      </form>
    </div>


    <div className="listadeRecetasBD">
      <h2>Recetas agregadas!</h2>

      {recetas.length === 0 ? (
        <p>No hay recetas aun...</p>
      ) : (
        <ul>
          {recetas.map((r) => (
            <li key={r._id} >
              <b>{r.nombre}</b> — {r.tiempo} min
              <br />
              <button onClick={() => eliminarReceta(r._id)}>Eliminar receta</button>
              <button onClick={() => nuevaReceta(r)}>Editar receta</button>
              Ingredientes: {r.ingredientes.join(", ")}
            </li>
          ))}
        </ul>
      )}
    </div>

  </div>
)
  
}
export default RecetasApp;
