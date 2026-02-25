const Receta = require('../models/Receta');
const fs = require('fs').promises;

async function actualizarArchivoRecetas() {
  try {
    const recetas = await Receta.find();
    await fs.writeFile('recetas.json', JSON.stringify(recetas, null, 2));
    console.log('Archivo recetas.json actualizado');
  } catch (error) {
    console.error('Error actualizando JSON:', error);
  }
}

exports.getRecetas = async (req, res) => {
  const recetas = await Receta.find();
  res.json(recetas);
};

exports.createReceta = async (req, res) => {
  const recetaNueva = new Receta(req.body);
  await recetaNueva.save();
  await actualizarArchivoRecetas();
  res.status(201).json(recetaNueva);
};

exports.deleteReceta = async (req, res) => {
  await Receta.findByIdAndDelete(req.params.id);
  await actualizarArchivoRecetas();
  res.json({ mensaje: "Se ha eliminado esta receta." });
};

exports.updateReceta = async (req, res) => {
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
};