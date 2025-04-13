
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types/task';
import { format, startOfDay, subDays, isWithinInterval } from 'date-fns';

interface TaskAnalyticsProps {
  tasks: Task[];
}

const TaskAnalytics: React.FC<TaskAnalyticsProps> = ({ tasks }) => {
  // Generate data for tasks completed per day (last 7 days)
  const generateDailyData = () => {
    const today = startOfDay(new Date());
    const dailyData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const formattedDate = format(date, 'EEE');
      
      const tasksForDay = tasks.filter(task => {
        if (!task.completed) return false;
        const completedDate = new Date(task.createdAt);
        return isWithinInterval(completedDate, {
          start: startOfDay(date),
          end: new Date(date.setHours(23, 59, 59, 999))
        });
      });
      
      dailyData.push({
        name: formattedDate,
        tasks: tasksForDay.length,
      });
    }
    
    return dailyData;
  };
  
  // Category distribution data
  const generateCategoryData = () => {
    const categoryCount: Record<string, number> = {};
    
    tasks.forEach(task => {
      if (categoryCount[task.category]) {
        categoryCount[task.category]++;
      } else {
        categoryCount[task.category] = 1;
      }
    });
    
    return Object.keys(categoryCount).map(category => ({
      name: category,
      value: categoryCount[category],
    }));
  };
  
  // Priority distribution data
  const generatePriorityData = () => {
    const priorityCount = {
      high: 0,
      medium: 0,
      low: 0,
    };
    
    tasks.forEach(task => {
      if (task.priority) {
        priorityCount[task.priority]++;
      }
    });
    
    return [
      { name: 'High', value: priorityCount.high, color: '#ef4444' },
      { name: 'Medium', value: priorityCount.medium, color: '#f59e0b' },
      { name: 'Low', value: priorityCount.low, color: '#10b981' },
    ];
  };
  
  const dailyData = generateDailyData();
  const categoryData = generateCategoryData();
  const priorityData = generatePriorityData();
  
  // Statistics for completion rates
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#60a5fa', '#93c5fd', '#a3a3a3'];

  return (
    <div className="space-y-6">
      <Card className="dark:glass-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Task Completion Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-100 dark:bg-taskmate-darkmode-accent p-4 rounded-lg text-center">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-300">Total Tasks</h3>
              <p className="text-3xl font-bold">{totalTasks}</p>
            </div>
            <div className="bg-slate-100 dark:bg-taskmate-darkmode-accent p-4 rounded-lg text-center">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-300">Completed</h3>
              <p className="text-3xl font-bold">{completedTasks}</p>
            </div>
            <div className="bg-slate-100 dark:bg-taskmate-darkmode-accent p-4 rounded-lg text-center">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-300">Completion Rate</h3>
              <p className="text-3xl font-bold">{completionRate.toFixed(0)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="dark:glass-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Tasks Completed (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(23, 23, 23, 0.8)', 
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff' 
                  }} 
                />
                <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="dark:glass-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(23, 23, 23, 0.8)', 
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskAnalytics;
