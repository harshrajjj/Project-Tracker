import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
    maxlength: [100, 'Project name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
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

// Cascade delete tasks when a project is deleted
ProjectSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  await this.model('Task').deleteMany({ project: this._id });
  next();
});

ProjectSchema.pre('deleteOne', { document: false, query: true }, async function(next) {
  const doc = await this.model.findOne(this.getFilter());
  if (doc) {
    await doc.model('Task').deleteMany({ project: doc._id });
  }
  next();
});

// Reverse populate with tasks
ProjectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  justOne: false
});

export default mongoose.model('Project', ProjectSchema);
