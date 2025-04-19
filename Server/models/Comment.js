import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Comment', CommentSchema);
