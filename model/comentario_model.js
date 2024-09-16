const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  conteudo: {
    type: String,
    required: true,
  },
  tituloFilme: {
    type: String,
    required: true,
  }
});

const Comentario = mongoose.model('comentarios', comentarioSchema);
module.exports = Comentario;