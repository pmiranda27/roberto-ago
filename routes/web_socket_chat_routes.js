const webSocketChat = require('../controllers/web_socket_chat');
const express = require('express');
const router = express.Router();

router.use('connectwebsocket-chat', webSocketChat)

module.exports = router;