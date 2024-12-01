const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  username: { type: String, required: true },
  conteudo: { type: String, required: true },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const reviewSchema = new mongoose.Schema({
  tituloFilme: String,
  bannerFilme: String,
  descricao: String,
  assistidoPor: Array,
  autorAvatar: String,
  autorReview: String,
  nota: Number,
  comentarios: [comentarioSchema],
  privado: {
    type: Boolean,
    default: false,
  },
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
