import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a task title'],
    trim: true,
    maxlength: [100, 'Task title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Done'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Cascade delete comments when a task is deleted
TaskSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  await this.model('Comment').deleteMany({ task: this._id });
  next();
});

TaskSchema.pre('deleteOne', { document: false, query: true }, async function(next) {
  const doc = await this.model.findOne(this.getFilter());
  if (doc) {
    await doc.model('Comment').deleteMany({ task: doc._id });
  }
  next();
});

// Reverse populate with comments
TaskSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'task',
  justOne: false
});

export default mongoose.model('Task', TaskSchema);
