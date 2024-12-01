const mongoose = require('mongoose');
const ComentarioModel = require('./comentario_model');


const reviewSchema = new mongoose.Schema({
  tituloFilme: String,
  bannerFilme: String,
  descricao: String,
  assistidoPor: Array,
  autorAvatar: String,
  autorReview: String,
  nota: Number,
  comentarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comentario' }],
  privado: {
    type: Boolean,
    default: false
  }
});

const Review = mongoose.model('review', reviewSchema);
module.exports = Review;