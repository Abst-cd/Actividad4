const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB conectada'))
  .catch(err => console.log('Error de conexion:', err));

  const recetaSchema = new mongoose.Schema({
  nombre: String,
  ingredientes: [String],
  tiempo: Number
});

const Receta = mongoose.model('Receta', recetaSchema);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('servidor funcionando!');
});

app.get('/recetas', async (req, res) => {
    const recetas = await Receta.find();
    res.json(recetas);
})

app.post('/recetas', async (req, res) => {
    const recetaNueva = new Receta(req.body);
    await recetaNueva.save();
    res.status(201).json(recetaNueva);
})

app.delete('/recetas/:id', async (req, res) => {
    await Receta.findByIdAndDelete(req.params.id);
    res.json({mensaje: "Se ha eliminado esta receta."})
})

app.put('/recetas/:id', async (req, res) => {
    console.log("put detected")
  try {
    const recetaActualizada = await Receta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(recetaActualizada);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar receta" });
  }
});
