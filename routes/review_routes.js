const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review_controller');

router.post('/', reviewController.Review);

router.post('/quantidadeUsuario', reviewController.QuantidadeReviews)

router.get('/', reviewController.GetReviews)

module.exports = router;


