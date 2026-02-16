const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcryptjs')
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
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const Usuario = mongoose.model('Usuario', userSchema);


// Login usuario
app.post('/api/auth/register-and-login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
    }

    const existingUser = await Usuario.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'El usuario ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await Usuario.create({
      username,
      password: hashedPassword
    });

    res.status(201).json({ 
      success: true, 
      message: 'Usuario creado y login exitoso', 
      userId: newUser._id 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en el servidor', error });
  }
});



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


