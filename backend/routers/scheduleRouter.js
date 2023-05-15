const express = require('express');
const router = express.Router();
const {getSchedule, getScheduleItem, addSchedule, deleteSchedule, updateSchedule, bookTicket, getTickets} = require('../controllers/scheduleController');
const {auth, checkRole} = require('../middleware/auth');

router.get('/', getSchedule);
router.get('/:id', getScheduleItem);
router.get('/getTickets/:id', getTickets)
// router.post('/add', addSchedule);
router.post('/add', auth, checkRole,  addSchedule);
router.post('/delete/:id', auth, checkRole, deleteSchedule);
router.post('/update/:id', auth, checkRole, updateSchedule);
router.post('/bookTicket', auth, bookTicket);


module.exports = router;