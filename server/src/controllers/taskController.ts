import { Request, Response } from 'express';
import { Task, ITask } from '../models/Task';
import mongoose from 'mongoose';

// Get all tasks with filtering and sorting
export const getTasks = async (req: Request, res: Response) => {
  try {
    const { status, priority, sort = '-createdAt' } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .sort(sort as string)
      .lean()
      .exec();

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get a single task
export const getTask = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }

    const task = await Task.findById(req.params.id).lean().exec();
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const task = new Task(req.body);
    const validationError = task.validateSync();
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(validationError.errors).map(err => err.message)
      });
    }

    const savedTask = await task.save();
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: savedTask
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating task',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating task',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }

    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 