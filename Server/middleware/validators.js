import { body, validationResult } from 'express-validator';

// Validation middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
export const registerValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot be more than 50 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please include a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

export const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please include a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];

// Project validation rules
export const projectValidation = [
  body('name')
    .notEmpty().withMessage('Project name is required')
    .isLength({ max: 100 }).withMessage('Project name cannot be more than 100 characters'),
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage('Description cannot be more than 500 characters'),
  validate
];

// Task validation rules
export const taskValidation = [
  body('title')
    .notEmpty().withMessage('Task title is required')
    .isLength({ max: 100 }).withMessage('Task title cannot be more than 100 characters')
    .trim().escape(),
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage('Description cannot be more than 500 characters')
    .trim().escape(),
  body('priority')
    .isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  body('status')
    .isIn(['Pending', 'In Progress', 'Done']).withMessage('Status must be Pending, In Progress, or Done'),
  body('assignedTo')
    .notEmpty().withMessage('Assigned user is required')
    .isMongoId().withMessage('Invalid user ID format'),
  body('project')
    .notEmpty().withMessage('Project is required')
    .isMongoId().withMessage('Invalid project ID format'),
  validate
];

// Task update validation rules (less strict than creation)
export const taskUpdateValidation = [
  body('title')
    .optional()
    .isLength({ max: 100 }).withMessage('Task title cannot be more than 100 characters')
    .trim().escape(),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot be more than 500 characters')
    .trim().escape(),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Done']).withMessage('Status must be Pending, In Progress, or Done'),
  body('assignedTo')
    .optional()
    .isMongoId().withMessage('Invalid user ID format'),
  validate
];

// Comment validation rules
export const commentValidation = [
  body('text')
    .notEmpty().withMessage('Comment text is required')
    .isLength({ max: 500 }).withMessage('Comment cannot be more than 500 characters')
    .trim().escape(),
  body('task')
    .notEmpty().withMessage('Task ID is required')
    .isMongoId().withMessage('Invalid task ID format'),
  validate
];

// Comment update validation rules
export const commentUpdateValidation = [
  body('text')
    .notEmpty().withMessage('Comment text is required')
    .isLength({ max: 500 }).withMessage('Comment cannot be more than 500 characters')
    .trim().escape(),
  validate
];

// Project update validation rules
export const projectUpdateValidation = [
  body('name')
    .optional()
    .isLength({ max: 100 }).withMessage('Project name cannot be more than 100 characters')
    .trim().escape(),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot be more than 500 characters')
    .trim().escape(),
  validate
];
