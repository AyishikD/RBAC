const express = require('express');
const { registerUser, loginUser, promoteUser, getAllUsers, deleteUser, demoteUser } = require('../controllers/userController');
const { authenticate, authorize, logout } = require('../utils/auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/promote', authenticate, authorize(['Admin']), promoteUser);
router.post('/logout', authenticate, logout);
router.delete('/delete', authenticate, deleteUser);
router.post('/demote', authenticate, authorize(['Admin']), demoteUser);
router.get('/', authenticate, authorize(['Admin']), getAllUsers);
router.delete('/', authenticate, authorize(['Admin']), deleteUser);

module.exports = router;
