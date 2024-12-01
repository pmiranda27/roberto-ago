const mongoose = require('mongoose');

class ComentarioModel {
  constructor(id, author, conteudo, avatar) {
    this._id = id,
    this.author = author;
    this.conteudo = conteudo;
    this.avatar = avatar;
  }
}

module.exports = ComentarioModel;