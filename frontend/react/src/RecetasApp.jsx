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


  const agarrarRecetas = async () => {
  try {
    const token = localStorage.getItem('token'); 

    if (!token){
      console.error("no hay token disponible");
      return;
    }
    const res = await fetch("http://localhost:3000/recetas", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const text = await res.text(); // para ver mensaje exacto
      throw new Error(text);
    }

    const data = await res.json();
    setRecetas(data);

  } catch (err) {
    console.error("Error agarrando recetas:", err);
  }
};

  const nuevaReceta = (receta) => {
    setnuevaReceta(receta);
    setNombre(receta.nombre);
    setIngredientes(receta.ingredientes.join(","));
    setTiempoCocinar(receta.tiempo);
  }

const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');

  // 1. Preparar el objeto (Lógica de datos)
  const receta = {
    nombre: nombreReceta,
    ingredientes: ingredientes.split(",").map(i => i.trim()), // Limpia espacios extra
    tiempo: Number(tiempoCocinar)
  };

  // 2. Determinar URL y Método (Lógica de configuración)
  const url = recetaEditada 
    ? `http://localhost:3000/recetas/${recetaEditada._id}` 
    : "http://localhost:3000/recetas";
  
  const method = recetaEditada ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method: method,
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(receta),
    });

    // 3. Manejo de respuesta único
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error en la operación");
    }

    // 4. Éxito
    alert(recetaEditada ? "Receta actualizada!" : "Receta creada!");
    
    // Limpieza de estado
    setnuevaReceta(null);
    setNombre("");
    setIngredientes("");
    setTiempoCocinar("");
    agarrarRecetas();

  } catch (error) {
    console.error("Error en el submit:", error);
    alert(error.message);
  }
};

  const eliminarReceta = async (id) => {
    try{
    const token = localStorage.getItem('token');  
    await fetch(`http://localhost:3000/recetas/${id}`,{
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` } 
      
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
        {recetaEditada ? "Guardar cambios" : "Agregar!"}
        </button>
      {recetaEditada && (
    <button 
      type="button" 
      onClick={() => {
        setnuevaReceta(null); 
        setNombre("");
        setIngredientes("");
        setTiempoCocinar("");
      }}
      style={{ marginLeft: '10px', backgroundColor: 'gray' }}
    >
      Cancelar Edicion
    </button>
      )}
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
