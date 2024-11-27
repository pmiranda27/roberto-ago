const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  tituloFilme: String,
  bannerFilme: String,
  filmeId: mongoose.ObjectId,
  descricao: String,
  assistidoPor: Array,
  nota: Number,
  autorReview: String,
  comentarios: Array,
  privado: {
    type: Boolean,
    default: false
  }
});

const Review = mongoose.model('review', reviewSchema);
module.exports = Review;