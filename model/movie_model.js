// importar a lib do meu banco de dados
const mongoose = require('mongoose');

// Criar um objeto do tipo Schema
const moviesSchema = new mongoose.Schema({
  id: Number,
  nome: String,
  duracao: Number,
  categoria: String,
  classificacaoIndicativa : String,
  detalhes: {
    diretor: String,
    produtora: String,
    atores: String,
    avalicacoes: {
      media: Number,
    },
  },
  imagem: String,
});

const Movie = mongoose.model('filmes', moviesSchema);
module.exports = Movie;