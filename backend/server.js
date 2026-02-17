const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcryptjs')
app.use(express.json());
app.use(cors());
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;

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


// Login/register usuario
  app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await Usuario.findOne({ username });

    if (user) {
      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) {
        return res.status(400).json({ success: false, message: 'Contraseña incorrecta' });
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = await Usuario.create({
        username,
        password: hashedPassword
      });
    }

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'secreto_temporal', 
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Acceso concedido',
      token,
      userId: user._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});



app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('servidor funcionando!');
});

app.get('/api/auth/login', async (req, res) => {
  try {
    const users = await Usuario.find({}, 'username _id');
    res.json({ success: true, users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Error retrieving users' });
  }
});

app.get('/recetas', async (req, res) => {
    const recetas = await Receta.find();
    res.json(recetas);
})

app.get('/usuarios', async (req, res) => {
  try{
const usuariosBD = await Usuario.find({}, 'username _id');
res.json(usuariosBD);
  } catch (error){
    res.status(500).json({mensaje: 'Error al obtener usuarios'})
  }
});

app.post('/recetas', async (req, res) => {
    const recetaNueva = new Receta(req.body);
    await recetaNueva.save();
    await actualizarArchivoRecetas();
    res.status(201).json(recetaNueva);
})

app.delete('/recetas/:id', async (req, res) => {
    await Receta.findByIdAndDelete(req.params.id);
    await actualizarArchivoRecetas();
    res.json({mensaje: "Se ha eliminado esta receta."})
})

app.put('/recetas/:id', async (req, res) => {
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




