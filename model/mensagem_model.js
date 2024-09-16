const mongoose = require("mongoose");

class MensagemModel {
  constructor(conteudo, isUserMessage){
    this.conteudo = conteudo;
    this.isUserMessage = isUserMessage;
  }
}

module.exports = MensagemModel;