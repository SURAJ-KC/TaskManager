const Board = require('../models/Board');
const Task = require('../models/Task');
const List = require('../models/List');

const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.json({ boards: [], tasks: [] });
    }

    const searchRegex = new RegExp(q, 'i');

    // 1. Search user's boards
    const boards = await Board.find({
      owner: req.user._id,
      $or: [{ title: searchRegex }, { description: searchRegex }],
    }).limit(5);

    // 2. Find user's boards to isolate tasks belonging to this user
    const userBoards = await Board.find({ owner: req.user._id }).select('_id');
    const boardIds = userBoards.map((b) => b._id);

    const userLists = await List.find({ boardId: { $in: boardIds } }).select('_id boardId');
    const listIds = userLists.map((l) => l._id);

    // 3. Search tasks inside those lists
    const tasks = await Task.find({
      listId: { $in: listIds },
      $or: [{ title: searchRegex }, { description: searchRegex }],
    })
      .populate('listId', 'title boardId')
      .populate('assignedTo', 'name email')
      .limit(10);

    res.json({ boards, tasks });
  } catch (error) {
    console.error('Error during global search:', error);
    res.status(500).json({ message: 'Error performing search' });
  }
};

module.exports = {
  globalSearch,
};