const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message_controller');

// Rota para enviar uma nova mensagem
router.post('/messages', messageController.sendMessage);

// Rota para obter mensagens entre dois usuários
router.get('/messages', messageController.getMessages);

// router.delete('/messages/:id', messageController.deleteMessage);

module.exports = router;