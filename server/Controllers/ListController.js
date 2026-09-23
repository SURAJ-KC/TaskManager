const List = require('../models/List');

// POST /boards/:id/lists
const createList = async (req, res) => {
  try {
    const { title, position } = req.body;
    const list = await List.create({
      title,
      position: position || 0,
      boardId: req.params.id,
    });
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error creating list' });
  }
};

// PATCH /lists/:id
const updateList = async (req, res) => {
  try {
    const list = await List.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error updating list' });
  }
};

// DELETE /lists/:id
const deleteList = async (req, res) => {
  try {
    await List.findByIdAndDelete(req.params.id);
    res.json({ message: 'List deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting list' });
  }
};

// PATCH /lists/:id/reorder
const reorderList = async (req, res) => {
  try {
    const { position } = req.body;
    const list = await List.findByIdAndUpdate(req.params.id, { position }, { new: true });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error reordering list' });
  }
};

module.exports = { createList, updateList, deleteList, reorderList };