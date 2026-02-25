const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const autenticarToken = require('../middleware/auth.js');
const verificarRol = require('../middleware/verifRoles.js');

const app = express();
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

const authController = require('../backend/Controllers/authController.js');
app.post('/api/auth/login', authController.login)

app.get('/', (req, res) => {
    res.send('servidor funcionando!');
});

app.get('/api/auth/login', autenticarToken, verificarRol('admin'), async (req, res) => {
  try {
    const users = await Usuario.find({}, 'username _id');
    res.json({ success: true, users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Error retrieving users' });
  }
});

app.get('/recetas', autenticarToken, async (req, res) => {
    const recetas = await Receta.find();
    res.json(recetas);
})

app.get('/usuarios', autenticarToken, verificarRol('admin'), async (req, res) => {
  try{
const usuariosBD = await Usuario.find({}, 'username _id');
res.json(usuariosBD);
  } catch (error){
    res.status(500).json({mensaje: 'Error al obtener usuarios'})
  }
});

app.post('/recetas', autenticarToken, async (req, res) => {
    const recetaNueva = new Receta(req.body);
    await recetaNueva.save();
    await actualizarArchivoRecetas();
    res.status(201).json(recetaNueva);
})

app.delete('/recetas/:id', autenticarToken,  async (req, res) => {
    await Receta.findByIdAndDelete(req.params.id);
    await actualizarArchivoRecetas();
    res.json({mensaje: "Se ha eliminado esta receta."})
})

app.put('/recetas/:id', autenticarToken, async (req, res) => {
  try {
    const recetaActualizada = await Receta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    await actualizarArchivoRecetas();

    res.json(recetaActualizada);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar receta" });
  }
});

async function actualizarArchivoRecetas() {
  try {
    const recetas = await Receta.find();

    await fs.writeFile(
      'recetas.json',
      JSON.stringify(recetas, null, 2)
    );

    console.log('Archivo recetas.json actualizado');
  } catch (error) {
    console.error('Error actualizando JSON:', error);
  }
}

module.exports = app;


