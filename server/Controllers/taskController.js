const Task = require('../models/Task');

// POST /lists/:id/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      listId: req.params.id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

// GET /tasks/:id
const getTaskDetails = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task' });
  }
};

// PATCH /tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

// DELETE /tasks/:id
const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

// PATCH /tasks/:id/assign
const assignTask = async (req, res) => {
  try {
    const { userIds } = req.body; // Expects an array of User ObjectIds
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userIds },
      { new: true }
    ).populate('assignedTo', 'name email');
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error assigning users to task' });
  }
};

module.exports = { createTask, getTaskDetails, updateTask, deleteTask, assignTask };