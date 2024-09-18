const mongoose = require('mongoose');

// Definindo o esquema para a mensagem
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Criando o modelo de mensagem
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
