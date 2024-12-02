const mongoose = require("mongoose");

const comentarioSchema = new mongoose.Schema({
  username: { type: String, required: true },
  conteudo: { type: String, required: true },
  avatar: { type: String },
  filmeId: { type: mongoose.Schema.Types.ObjectId, required: true },
  tituloFilme: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const ComentarioModel = mongoose.model("Comentario", comentarioSchema);

module.exports = ComentarioModel;
