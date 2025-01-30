// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', userController.resetPassword);

router.post('/uploadProfile', auth, upload.single('profilePicture'), userController.uploadProfile);
router.put('/editProfile', auth, userController.editProfile);
router.put('/changePassword', auth, userController.changePassword);

module.exports = router;
