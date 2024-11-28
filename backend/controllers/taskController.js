const fs = require('fs');

const tasksFile = './data/tasks.json';

const loadTasks = () => JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
const saveTasks = (tasks) => fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));

// Get All Tasks
exports.getAllTasks = (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
};

// Create Task
exports.createTask = (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const tasks = loadTasks();
  tasks.push({ id: tasks.length + 1, title, description, creator: req.user.username });
  saveTasks(tasks);

  res.status(201).json({ message: 'Task created successfully' });
};

// Delete Task
exports.deleteTask = (req, res) => {
  const taskId = parseInt(req.params.id);

  let tasks = loadTasks();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (req.user.role !== 'Admin' && task.creator !== req.user.username) {
    return res.status(403).json({ message: 'Permission denied' });
  }

  tasks = tasks.filter((t) => t.id !== taskId);
  saveTasks(tasks);

  res.json({ message: 'Task deleted successfully' });
};
