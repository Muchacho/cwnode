const express = require('express');
const router = express.Router();
const {getAll, getTheater, getAllTheaterInfo, addTheater, deleteTheater, updateTheater, getTheatersWithAreas, addArea} = require('../controllers/theatersController');
const {getActor, getActorsByTheater, addActor, updActor, delActor} = require('../controllers/actorsController');
const {auth, checkRole} = require('../middleware/auth');

router.get('/', getAll);
router.get('/theaterInfo/:id', getAllTheaterInfo);
router.get('/withAreas', auth, checkRole, getTheatersWithAreas)
router.get('/:id', getTheater);
router.post('/add', auth, checkRole, addTheater);
router.post('/delete/:id', auth, checkRole, deleteTheater);
router.post('/update', auth, checkRole, updateTheater);
router.post('/addArea/:id', auth, checkRole, addArea);

router.get('/actor/:id', getActor);
router.get('/actors/:id', getActorsByTheater);
router.post('/addActor/:id', auth, checkRole, addActor);
router.post('/updActor/:id', auth, checkRole, updActor);
router.post('/delActor/:id', auth, checkRole, delActor);


module.exports = router;