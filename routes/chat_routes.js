const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat_controller');


router.post('/', chatController.mandarMensagem);

router.post('/', chatController.buscarMensagens);

router.post('/', chatController.apagarMensagem);

module.exports = router;apaga