const express = require('express');
const router = express.Router();
const {getAll, getTheater, getAllTheaterInfo, addTheater, deleteTheater, updateTheater} = require('../controllers/theatersController');
const {getActor, addActor, updActor, delActor} = require('../controllers/actorsController');
const {auth, checkRole} = require('../middleware/auth');

router.get('/', getAll);
router.get('/theaterInfo/:id', getAllTheaterInfo);
router.get('/:id', getTheater);
router.post('/add', auth, checkRole, addTheater);
router.post('/delete', auth, checkRole, deleteTheater);
router.post('/update', auth, checkRole, updateTheater);
router.get('/actor/:id', getActor);
router.post('/addActor', auth, checkRole, addActor);
router.post('/updActor', auth, checkRole, updActor);
router.post('/delActor', auth, checkRole, delActor);


module.exports = router;