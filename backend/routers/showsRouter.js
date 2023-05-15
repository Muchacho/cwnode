const express = require('express');
const router = express.Router();
const {getAll, getShow, addShow, deleteShow, updateShow, addComment, getComments} = require('../controllers/showsController');
const {auth, checkRole} = require('../middleware/auth');

router.get('/', getAll);
router.get('/:id', getShow);
router.post('/add', auth, checkRole,  addShow);
router.post('/delete/:id', auth, checkRole, deleteShow);
router.post('/update/:id', auth, checkRole, updateShow);
router.post('/comment/:id', auth, addComment);
router.get('/comments/:id', getComments);



module.exports = router;