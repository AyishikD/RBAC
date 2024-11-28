const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersFile = './data/users.json';

const loadUsers = () => JSON.parse(fs.readFileSync(usersFile, 'utf8'));
const saveUsers = (users) => fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

// Register User
exports.registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required' });
  }

  if (role === 'Admin' && !password.startsWith('admin')) {
    return res.status(400).json({ message: 'Admin password must start with "admin"' });
  }

  const users = loadUsers();
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword, role });
  saveUsers(users);

  res.status(201).json({ message: 'User registered successfully' });
};

// Login User
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  const users = loadUsers();
  const user = users.find((u) => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

// Promote User to Admin
exports.promoteUser = (req, res) => {
  const { username } = req.body;

  const users = loadUsers();
  const user = users.find((u) => u.username === username);

  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'Admin') return res.status(400).json({ message: 'User is already an Admin' });

  user.role = 'Admin';
  saveUsers(users);

  res.json({ message: `${username} is now an Admin` });
};

// Demote User (Admin to User)
exports.demoteUser = (req, res) => {
    const { username } = req.body;
  
    const users = loadUsers();
    const user = users.find((u) => u.username === username);
    const currentUser = req.user;  // The logged-in user who is attempting the demotion
  
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Ensure the user being demoted is an Admin
    if (user.role !== 'Admin') return res.status(400).json({ message: 'User is not an Admin' });
    // Prevent regular Admins (who were promoted) from demoting other Admins
    if (currentUser.username !== "adminuser" && currentUser.role === "Admin") {
      return res.status(403).json({ message: 'You do not have permission to demote the original Admin' });
    }
  
    // Demote the user to regular "User" role
    user.role = 'User';
    saveUsers(users);
  
    res.json({ message: `${username} has been demoted to User` });
  };
  
  

// Get All Users
exports.getAllUsers = (req, res) => {
  const users = loadUsers();
  res.json(users.map(({ password, ...rest }) => rest)); // Exclude password
};

// Delete User (Admin Only)
// Delete User (Admin or Self)
exports.deleteUser = (req, res) => {
    const { username } = req.body; // Username to delete
    const users = loadUsers(); // Load all users
    const currentUser = req.user; // The logged-in user making the request
  
    const userIndex = users.findIndex((u) => u.username === username);
  
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });
  
    const userToDelete = users[userIndex];
  
    // Prevent deletion of the original Admin
    if (userToDelete.isOriginalAdmin) {
      return res.status(400).json({ message: 'Cannot delete the original Admin' });
    }
  
    // Allow users to delete themselves
    if (currentUser.username === username) {
      users.splice(userIndex, 1);
      saveUsers(users);
      return res.json({ message: `Your account (${username}) has been deleted successfully.` });
    }
  
    // Ensure the logged-in user is an Admin for deleting others
    if (currentUser.role !== 'Admin') {
      return res.status(403).json({ message: 'Permission denied. Only Admins can delete other users.' });
    }
  
    // Admin deletes another user
    users.splice(userIndex, 1);
    saveUsers(users);
  
    res.json({ message: `${username} has been deleted successfully.` });
  };
  