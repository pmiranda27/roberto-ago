const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review_controller');

router.post('/', reviewController.Review);

router.post('/quantidadeUsuario', reviewController.QuantidadeReviews)


router.get('/', reviewController.GetReviews)
router.get('/get-reviews-por-filme', reviewController.GetReviewsPorFilme);

router.get('/get-review-por-id', reviewController.GetReviewPorId);
router.get('/get-reviews-por-usuario', reviewController.GetReviewsPorUsuario);
router.get('/get-comentarios-por-username', reviewController.GetComentariosPorUsername);
router.get('/get-comentarios-por-id', reviewController.GetComentariosPorId);

router.post('/send-comment-review', reviewController.SendCommentReview);

module.exports = router;