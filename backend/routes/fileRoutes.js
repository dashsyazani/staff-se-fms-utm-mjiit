// routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/upload', auth, upload.single('file'), fileController.uploadFile);
router.get('/', auth, fileController.getFiles);
router.delete('/:id', auth, fileController.deleteFile);
router.get('/public', fileController.getPublicFiles);
router.put('/:id', auth, fileController.updateFile);

module.exports = router;
