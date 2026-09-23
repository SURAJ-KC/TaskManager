const Task = require('../models/Task');
const List = require('../models/List');

const findOwnedTask = (taskId, userId) => Task.findOne({ _id: taskId }).populate({
  path: 'listId',
  populate: { path: 'boardId', match: { owner: userId } },
});

// POST /lists/:id/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const list = await List.findOne({ _id: req.params.id }).populate({
      path: 'boardId',
      match: { owner: req.user._id },
    });
    if (!list || !list.boardId) return res.status(404).json({ message: 'List not found' });
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
    const task = await findOwnedTask(req.params.id, req.user._id);
    if (!task || !task.listId || !task.listId.boardId) return res.status(404).json({ message: 'Task not found' });
    await task.populate('assignedTo', 'username email');
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task' });
  }
};

// PATCH /tasks/:id
const updateTask = async (req, res) => {
  try {
    const existingTask = await findOwnedTask(req.params.id, req.user._id);
    if (!existingTask || !existingTask.listId || !existingTask.listId.boardId) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (req.body.listId) {
      const destinationList = await List.findOne({ _id: req.body.listId }).populate({
        path: 'boardId',
        match: { owner: req.user._id },
      });
      if (!destinationList || !destinationList.boardId) {
        return res.status(404).json({ message: 'Destination list not found' });
      }
    }
    const task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

// DELETE /tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await findOwnedTask(req.params.id, req.user._id);
    if (!task || !task.listId || !task.listId.boardId) return res.status(404).json({ message: 'Task not found' });
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
    const existingTask = await findOwnedTask(req.params.id, req.user._id);
    if (!existingTask || !existingTask.listId || !existingTask.listId.boardId) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userIds },
      { new: true }
    ).populate('assignedTo', 'username email');
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error assigning users to task' });
  }
};

module.exports = { createTask, getTaskDetails, updateTask, deleteTask, assignTask };