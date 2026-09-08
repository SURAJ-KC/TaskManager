const Board = require('../models/Board');
const List = require('../models/List');
const Task = require('../models/Task');

// Get all boards for the authenticated user
const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ owner: req.user._id }).sort('-createdAt');
    res.json(boards);
  } catch (error) {
    console.error("Error fetching boards:", error);
    res.status(500).json({ message: "Error fetching boards" });
  }
};

// Create a new board
const createBoard = async (req, res) => {
  try {
    const { title, description } = req.body;
    const board = new Board({
      title,
      description,
      owner: req.user._id,
    });
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ message: "Error creating board" });
  }
};

// Get single board with lists and tasks
const getBoardDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const board = await Board.findOne({ _id: id, owner: req.user._id });
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const lists = await List.find({ boardId: id }).sort('position');
    const listIds = lists.map(list => list._id);
    const tasks = await Task.find({ listId: { $in: listIds } });

    res.json({ board, lists, tasks });
  } catch (error) {
    console.error("Error loading board data:", error);
    res.status(500).json({ message: "Error loading board data" });
  }
};

// Update board title / description
const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBoard = await Board.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedBoard) return res.status(404).json({ message: "Board not found" });
    res.json(updatedBoard);
  } catch (error) {
    console.error("Error updating board:", error);
    res.status(500).json({ message: "Error updating board" });
  }
};

// Delete board, its lists, and its tasks
const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const board = await Board.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!board) return res.status(404).json({ message: "Board not found" });
    const lists = await List.find({ boardId: board._id });
    const listIds = lists.map(l => l._id);
    await Task.deleteMany({ listId: { $in: listIds } });
    await List.deleteMany({ boardId: board._id });
    res.json({ message: "Board deleted successfully" });
  } catch (error) {
    console.error("Error deleting board:", error);
    res.status(500).json({ message: "Error deleting board" });
  }
};

// Create a new list/column
const createList = async (req, res) => {
  try {
    const { id: boardId } = req.params;
    const { title } = req.body;

    const board = await Board.findOne({ _id: boardId, owner: req.user._id });
    if (!board) return res.status(404).json({ message: "Board not found" });
    
    const count = await List.countDocuments({ boardId });
    const list = new List({
      title,
      boardId,
      position: count,
    });
    await list.save();
    res.status(201).json(list);
  } catch (error) {
    console.error("Error creating list:", error);
    res.status(500).json({ message: "Error creating list" });
  }
};

// Update list title
const updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await List.findOne({ _id: id }).populate('boardId');
    if (!list || !list.boardId || String(list.boardId.owner) !== String(req.user._id)) {
      return res.status(404).json({ message: "List not found" });
    }
    const updatedList = await List.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
    if (!updatedList) return res.status(404).json({ message: "List not found" });
    res.json(updatedList);
  } catch (error) {
    console.error("Error updating list:", error);
    res.status(500).json({ message: "Error updating list" });
  }
};

// Delete a list and all tasks inside it
const deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await List.findOne({ _id: id }).populate('boardId');
    if (!list || !list.boardId || String(list.boardId.owner) !== String(req.user._id)) {
      return res.status(404).json({ message: "List not found" });
    }
    await Task.deleteMany({ listId: list._id });
    await List.findByIdAndDelete(list._id);
    res.json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Error deleting list:", error);
    res.status(500).json({ message: "Error deleting list" });
  }
};

// Reorder list position
const reorderList = async (req, res) => {
  try {
    const { id } = req.params;
    const { position } = req.body;
    const existingList = await List.findOne({ _id: id }).populate('boardId');
    if (!existingList || !existingList.boardId || String(existingList.boardId.owner) !== String(req.user._id)) {
      return res.status(404).json({ message: "List not found" });
    }
    const list = await List.findByIdAndUpdate(id, { position }, { new: true });
    res.json(list);
  } catch (error) {
    console.error("Error reordering list:", error);
    res.status(500).json({ message: "Error reordering list" });
  }
};

module.exports = {
  getBoards,
  createBoard,
  getBoardDetails,
  updateBoard,
  deleteBoard,
  createList,
  updateList,
  deleteList,
  reorderList,
};