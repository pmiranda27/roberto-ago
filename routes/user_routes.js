const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');

router.post('/verify-auth', userController.verificarAutenticacao);

//Rota para cadastro de usuario
router.post('/register', userController.criarUsuario);

router.post('/login', userController.login);
router.post('/verify-email', userController.verificarEmail);

router.post('/enviar-mensagem', userController.enviarMensagem);

router.get('/lista-usuarios', userController.buscarUsuarios);
router.post('/lista-notificacoes', userController.buscarNotificacoes);

router.post('/enviar-notificacao', userController.criarNotificacao);
router.post('/remover-notificacao', userController.removerNotificacao);
router.post('/responder-notificacao', userController.responderNotificacao);

router.post('/add-friend', userController.adicionarAmigo);

router.post('/remove-friend', userController.removerAmigo);

router.post('/amigos', userController.buscarAmigos);


router.post('/verificacao', userController.verificarEmail);

router.post('/delete', userController.deletarUsuario);
router.post('/atualizar-avatar', userController.atualizarAvatar);
router.post('/atualizar-email', userController.atualizarEmail);
router.post('/atualizar-bio', userController.atualizarBio);
router.post('/atualizar-senha', userController.atualizarSenha);

router.get('/avatar-usuario', userController.buscarAvatar);
router.get('/descricao-usuario', userController.buscarDescricao)

router.post('/detalhes-usuario', userController.detalhesUsuario);

module.exports = router;