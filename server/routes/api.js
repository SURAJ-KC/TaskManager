const express = require('express');

const { globalSearch } = require('../Controllers/searchController');



const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { getBoards, createBoard, getBoardDetails, updateBoard, deleteBoard } = require('../Controllers/boardController');
const { createList, updateList, deleteList, reorderList } = require('../Controllers/boardController');
const { createTask, getTaskDetails, updateTask, deleteTask, assignTask } = require('../Controllers/taskController');
const { addComment, getCommentsByTask, deleteComment } = require('../Controllers/commentController');



// All routes are protected by JWT authentication
router.use(protect);

// Board Routes
router.get('/boards', getBoards);
router.post('/boards', createBoard);
router.get('/boards/:id', getBoardDetails);
router.patch('/boards/:id', updateBoard);
router.delete('/boards/:id', deleteBoard);

// List Routes
router.post('/boards/:id/lists', createList);
router.patch('/lists/:id', updateList);
router.delete('/lists/:id', deleteList);
router.patch('/lists/:id/reorder', reorderList);

// Task Routes
router.post('/lists/:id/tasks', createTask);
router.get('/tasks/:id', getTaskDetails);
router.patch('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.patch('/tasks/:id/assign', assignTask);

// Comment Routes
router.post('/tasks/:id/comments', addComment);
router.get('/tasks/:id/comments', getCommentsByTask);
router.delete('/comments/:id', deleteComment);

// Search Route
router.get('/search', protect, globalSearch);

module.exports = router;