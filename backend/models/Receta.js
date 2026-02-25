const mongoose = require('mongoose');

const recetaSchema = new mongoose.Schema({
  nombre: String,
  ingredientes: [String],
  tiempo: Number
});

module.exports = mongoose.model('Receta', recetaSchema);