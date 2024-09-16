const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie_controller');

//rota para criar o filme
router.post('/', movieController.criarFilmes);
//rota para buscar todos os filmes
router.get('/', movieController.buscarFilmes);
router.post('/verificacaoFilme', movieController.verificaFilme);

module.exports = router;