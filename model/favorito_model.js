const mongoose = require('mongoose');

const favoritoSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Referência ao modelo de Usuário
      required: true
    },
    movieId: {
      type: String,  // ID do filme (por exemplo, de uma API como TMDB)
      required: true
    },
    title: {
      type: String,  // Título do filme
      required: true
    },
    posterPath: {
      type: String,  // URL para a imagem do poster do filme
    },
    releaseDate: {
      type: Date,  // Data de lançamento do filme
    },
    addedAt: {
      type: Date,
      default: Date.now  // Data em que o filme foi adicionado como favorito
    }
});

const favorito = mongoose.model('favorito', favoritoSchema);
module.exports = favorito;