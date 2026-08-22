const Comment = require('../models/comment');
const Task = require('../models/Task');

// Add a new comment to a task
const addComment = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const { text } = req.body;
    const userId = req.user._id; // Assumes authMiddleware attaches req.user

    // 1. Basic validation
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text cannot be empty' });
    }

    // 2. Check if the target task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // 3. Create the comment
    const newComment = await Comment.create({
      text,
      taskId,
      userId,
    });

    // 4. Populate author details before sending response
    const populatedComment = await newComment.populate('userId', 'name email avatar');

    res.status(201).json({
      message: 'Comment added successfully',
      comment: populatedComment,
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
};

// Get all comments for a specific task
const getCommentsByTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;

    const comments = await Comment.find({ taskId })
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

// Delete a comment by ID
const deleteComment = async (req, res) => {
  try {
    const { id: commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await Comment.findByIdAndDelete(commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Error deleting comment' });
  }
};

module.exports = {
  addComment,
  getCommentsByTask,
  deleteComment,
};