const express = require('express');
const router = express.Router();
const {getAll, getShow, addShow, deleteShow, updateShow} = require('../controllers/showsController');
const {auth, checkRole} = require('../middleware/auth');

router.get('/', getAll);
router.get('/:id', getShow);
router.post('/add', auth, checkRole,  addShow);
router.post('/delete', auth, checkRole, deleteShow);
router.post('/update', auth, checkRole, updateShow);


module.exports = router;