const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  email: String,
  avaliacao: String,
});

const Chat = mongoose.model('chat', chatSchema);
module.exports = Chat;