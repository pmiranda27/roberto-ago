const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review_controller');

router.post('/', reviewController.Review);
//rota para buscar todos os produtos

module.exports = router;


