import mongoose, { Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [5, 'Description must be at least 5 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['todo', 'in-progress', 'completed'],
      message: '{VALUE} is not a valid status'
    },
    default: 'todo'
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: '{VALUE} is not a valid priority'
    },
    default: 'medium'
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return !value || value > new Date();
      },
      message: 'Due date must be in the future'
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

// Add index for better query performance
taskSchema.index({ status: 1, priority: 1 });

export const Task = mongoose.model<ITask>('Task', taskSchema);