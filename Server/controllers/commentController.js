import Comment from '../models/Comment.js';
import Task from '../models/Task.js';

// @desc    Get comments for a task
// @route   GET /api/tasks/:taskId/comments
// @access  Private
export const getTaskComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Check if task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const comments = await Comment.find({ task: taskId })
      .populate({
        path: 'user',
        select: 'name'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Add comment to task
// @route   POST /api/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text, task } = req.body;

    // Check if task exists
    const taskExists = await Task.findById(task);
    if (!taskExists) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Create comment
    const comment = await Comment.create({
      text,
      task,
      user: req.user.id
    });

    // Populate user information
    await comment.populate({
      path: 'user',
      select: 'name'
    });

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Make sure user is comment owner
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      {
        new: true,
        runValidators: true
      }
    ).populate({
      path: 'user',
      select: 'name'
    });

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Make sure user is comment owner or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await Comment.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
