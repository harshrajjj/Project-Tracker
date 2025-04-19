import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Task.find(JSON.parse(queryStr))
      .populate({
        path: 'assignedTo',
        select: 'name email'
      })
      .populate({
        path: 'project',
        select: 'name description'
      });

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Task.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const tasks = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      pagination,
      data: tasks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get tasks for a specific project with pagination
// @route   GET /api/projects/:projectId/tasks
// @access  Private
export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { assignedTo, sort, status, priority } = req.query;

    // Build query
    let query = { project: projectId };

    // Filter by assignedTo
    if (assignedTo === 'me') {
      query.assignedTo = req.user.id;
    }

    // Filter by status
    if (status && ['Pending', 'In Progress', 'Done'].includes(status)) {
      query.status = status;
    }

    // Filter by priority
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      query.priority = priority;
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Task.countDocuments(query);

    // Build sort object
    let sortObj = {};
    if (sort === 'priority') {
      sortObj = { priority: 1, createdAt: -1 };
    } else if (sort === 'status') {
      sortObj = { status: 1, createdAt: -1 };
    } else if (sort === 'createdAt') {
      sortObj = { createdAt: -1 };
    } else {
      sortObj = { priority: 1, createdAt: -1 }; // Default sort
    }

    // Execute query with pagination
    const tasks = await Task.find(query)
      .populate({
        path: 'assignedTo',
        select: 'name email'
      })
      .populate({
        path: 'project',
        select: 'name description'
      })
      .sort(sortObj)
      .skip(startIndex)
      .limit(limit);

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      pagination: {
        ...pagination,
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: tasks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate({
        path: 'assignedTo',
        select: 'name email'
      })
      .populate({
        path: 'project',
        select: 'name description'
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name'
        }
      });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (Admin only)
export const createTask = async (req, res) => {
  try {
    // Check if project exists
    const project = await Project.findById(req.body.project);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Add user to req.body
    req.body.createdBy = req.user.id;

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user is admin or the assigned team member
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    // If user is team member, they can only update the status
    if (req.user.role === 'team-member') {
      task = await Task.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        {
          new: true,
          runValidators: true
        }
      );
    } else {
      // Admin can update all fields
      task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Make sure user is admin
    if (req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    await Task.deleteOne({ _id: req.params.id });

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
