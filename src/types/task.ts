
export type TaskCategory = 
  | 'Work'
  | 'Personal'
  | 'Health'
  | 'Shopping'
  | 'Education'
  | 'Finance'
  | 'Other';

export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  category: TaskCategory;
  completed: boolean;
  createdAt: Date;
  priority: TaskPriority;
  tags: string[];
  subtasks: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}
