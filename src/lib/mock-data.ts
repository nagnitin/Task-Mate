
import { Task, TaskCategory } from "@/types/task";
import { v4 as uuidv4 } from "uuid";

// Helper function to create a date with a specific offset from today
const dateWithOffset = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

// Initial mock tasks
export const initialTasks: Task[] = [
  {
    id: uuidv4(),
    title: "Complete TaskMate Project",
    description: "Finish the TaskMate to-do list application with all required features.",
    dueDate: dateWithOffset(2),
    category: "Work",
    completed: false,
    createdAt: new Date(),
    priority: "high",
    tags: ["project", "development"],
    subtasks: []
  },
  {
    id: uuidv4(),
    title: "Buy groceries",
    description: "Milk, eggs, bread, and vegetables for the week.",
    dueDate: dateWithOffset(1),
    category: "Shopping",
    completed: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    priority: "medium",
    tags: ["personal", "weekly"],
    subtasks: []
  },
  {
    id: uuidv4(),
    title: "Morning run",
    description: "30 minutes jogging in the park.",
    dueDate: dateWithOffset(0),
    category: "Health",
    completed: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    priority: "low",
    tags: ["fitness"],
    subtasks: []
  },
  {
    id: uuidv4(),
    title: "Pay electricity bill",
    description: "Pay the monthly electricity bill online.",
    dueDate: dateWithOffset(3),
    category: "Finance",
    completed: false,
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    priority: "high",
    tags: ["bills", "monthly"],
    subtasks: []
  },
  {
    id: uuidv4(),
    title: "Read React documentation",
    description: "Study the latest React hooks and features.",
    dueDate: dateWithOffset(5),
    category: "Education",
    completed: false,
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000),
    priority: "medium",
    tags: ["learning", "programming"],
    subtasks: []
  }
];

// Available categories
export const availableCategories: TaskCategory[] = [
  "Work",
  "Personal",
  "Health", 
  "Shopping",
  "Education",
  "Finance",
  "Other"
];
