const express = require('express');
const router = express.Router();
const {getUserInfo, getCart, getTicket, changePassword, deleteTicket, deleteUser, updateUser} = require('../controllers/userController');
const {login, register} = require('../controllers/authController');
const {auth} = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);


router.get('/', auth, getUserInfo);
router.get('/cart', auth, getCart);
router.get('/ticket/:id', auth, getTicket);
router.post('/update', auth, updateUser);
router.post('/changePassword', auth, changePassword);
router.post('/unbookedTicked/:id', auth, deleteTicket);
router.post('/delete', auth, deleteUser);


module.exports = router;