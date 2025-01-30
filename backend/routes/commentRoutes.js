// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middlewares/auth');

router.post('/', auth, commentController.postComment);
router.get('/:fileId', commentController.getComments);

module.exports = router;
