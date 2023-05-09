const express = require('express');
const router = express.Router();
const {getUserInfo, getCart, changePassword, deleteUser} = require('../controllers/userController');
const {login, register} = require('../controllers/authController');
const {auth} = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);


router.get('/', auth, getUserInfo);
router.get('/cart', auth, getCart);
router.post('/changePassword', auth, changePassword);
router.post('/delete', auth, deleteUser);


module.exports = router;