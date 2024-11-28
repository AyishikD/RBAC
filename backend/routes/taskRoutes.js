const express = require('express');
const { getAllTasks, createTask, deleteTask } = require('../controllers/taskController');
const { authenticate, authorize } = require('../utils/auth');
const router = express.Router();

router.get('/', authenticate, getAllTasks);
router.post('/', authenticate, authorize(['Admin', 'User']), createTask);
router.delete('/:id', authenticate, deleteTask);

module.exports = router;
