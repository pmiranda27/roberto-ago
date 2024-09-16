const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  tituloFilme: String,
  bannerFilme: String,
  descricao: String,
  assistidoPor: Array,
  nota: Number,
  comentarios: Array
});

const Review = mongoose.model('review', reviewSchema);
module.exports = Review;