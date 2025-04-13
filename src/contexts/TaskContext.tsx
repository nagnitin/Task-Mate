
import React, { createContext, useContext, useState, useEffect } from "react";
import { Task, TaskCategory, SubTask, TaskPriority } from "@/types/task";
import { initialTasks, availableCategories } from "@/lib/mock-data";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  categories: TaskCategory[];
  searchQuery: string;
  selectedCategory: TaskCategory | "All";
  darkMode: boolean;
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: TaskCategory | "All") => void;
  toggleDarkMode: () => void;
  addSubTask: (taskId: string, title: string) => void;
  updateSubTask: (taskId: string, subTask: SubTask) => void;
  deleteSubTask: (taskId: string, subTaskId: string) => void;
  toggleSubTaskCompletion: (taskId: string, subTaskId: string) => void;
  shareTask: (taskId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | "All">("All");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Filter tasks based on search query and selected category
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = selectedCategory === "All" || task.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date(),
      priority: task.priority || 'medium',
      tags: task.tags || [],
      subtasks: task.subtasks || []
    };
    
    setTasks(prevTasks => [newTask, ...prevTasks]);
    toast({
      title: "Task added",
      description: `"${task.title}" has been added to your tasks.`
    });
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    toast({
      title: "Task updated",
      description: `"${updatedTask.title}" has been updated.`
    });
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: taskToDelete ? `"${taskToDelete.title}" has been deleted.` : "Task has been deleted.",
      variant: "destructive"
    });
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
    
    const targetTask = tasks.find(task => task.id === id);
    if (targetTask) {
      toast({
        title: targetTask.completed ? "Task marked as incomplete" : "Task completed",
        description: `"${targetTask.title}" has been ${targetTask.completed ? "marked as incomplete" : "marked as complete"}.`
      });
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    toast({
      title: darkMode ? "Light Mode Activated" : "Dark Mode Activated",
      description: darkMode ? "Switched to light mode" : "Switched to dark mode"
    });
  };

  // Subtask management functions
  const addSubTask = (taskId: string, title: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              subtasks: [...task.subtasks, { id: uuidv4(), title, completed: false }] 
            } 
          : task
      )
    );
  };

  const updateSubTask = (taskId: string, updatedSubTask: SubTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              subtasks: task.subtasks.map(subtask => 
                subtask.id === updatedSubTask.id ? updatedSubTask : subtask
              ) 
            } 
          : task
      )
    );
  };

  const deleteSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              subtasks: task.subtasks.filter(subtask => subtask.id !== subTaskId) 
            } 
          : task
      )
    );
  };

  const toggleSubTaskCompletion = (taskId: string, subTaskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              subtasks: task.subtasks.map(subtask => 
                subtask.id === subTaskId 
                  ? { ...subtask, completed: !subtask.completed } 
                  : subtask
              ) 
            } 
          : task
      )
    );
  };

  // Share task function
  const shareTask = (taskId: string) => {
    const taskToShare = tasks.find(task => task.id === taskId);
    
    if (taskToShare) {
      const taskDetails = `Task: ${taskToShare.title}\nDue: ${taskToShare.dueDate ? new Date(taskToShare.dueDate).toLocaleDateString() : 'No due date'}\nDescription: ${taskToShare.description}`;
      
      // In a real app, this would handle actual sharing via an API
      // For now, we'll just copy to clipboard and show a toast
      navigator.clipboard.writeText(taskDetails);
      
      toast({
        title: "Task shared",
        description: "Task details copied to clipboard for sharing"
      });
    }
  };

  const contextValue: TaskContextType = {
    tasks,
    filteredTasks,
    categories: availableCategories,
    searchQuery,
    selectedCategory,
    darkMode,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    setSearchQuery,
    setSelectedCategory,
    toggleDarkMode,
    addSubTask,
    updateSubTask,
    deleteSubTask,
    toggleSubTaskCompletion,
    shareTask
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
