
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskListType, TaskList } from '@/types/task';
import { toast } from 'sonner';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  addTaskToList: (taskId: string, listType: TaskListType) => void;
  removeTaskFromList: (taskId: string, listType: TaskListType) => void;
  filteredTasks: (listType: TaskListType | string) => Task[];
  getTasksCount: (listType: TaskListType | string) => number;
  activeList: string;
  setActiveList: (list: string) => void;
  taskLists: TaskList[];
  addTaskList: (name: string) => void;
  deleteTaskList: (id: string) => void;
}

const defaultLists: TaskList[] = [
  { id: "myDay", name: "My Day", icon: "sun", isDefault: true },
  { id: "important", name: "Important", icon: "star", isDefault: true },
  { id: "planned", name: "Planned", icon: "calendar", isDefault: true },
  { id: "assignedToMe", name: "Assigned to me", icon: "user", isDefault: true },
  { id: "tasks", name: "Tasks", icon: "home", isDefault: true },
];

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        return parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }));
      } catch (e) {
        console.error("Failed to parse tasks from localStorage:", e);
        return [];
      }
    }
    return [];
  });

  const [taskLists, setTaskLists] = useState<TaskList[]>(() => {
    const savedLists = localStorage.getItem('taskLists');
    if (savedLists) {
      try {
        const parsedLists = JSON.parse(savedLists);
        return [...defaultLists, ...parsedLists.filter((list: TaskList) => !defaultLists.some(dl => dl.id === list.id))];
      } catch (e) {
        console.error("Failed to parse task lists from localStorage:", e);
        return defaultLists;
      }
    }
    return defaultLists;
  });

  const [activeList, setActiveList] = useState<string>("myDay");

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const customLists = taskLists.filter(list => !defaultLists.some(dl => dl.id === list.id));
    localStorage.setItem('taskLists', JSON.stringify(customLists));
  }, [taskLists]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setTasks(prev => [...prev, newTask]);
    toast.success("Task added");
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      )
    );
    toast.success("Task updated");
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success("Task deleted");
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date() } : task
      )
    );
  };

  const addTaskToList = (taskId: string, listType: TaskListType) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? 
          { ...task, lists: [...new Set([...task.lists, listType])], updatedAt: new Date() } : 
          task
      )
    );
  };

  const removeTaskFromList = (taskId: string, listType: TaskListType) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? 
          { ...task, lists: task.lists.filter(l => l !== listType), updatedAt: new Date() } : 
          task
      )
    );
  };

  const filteredTasks = (listType: TaskListType | string) => {
    return tasks.filter(task => task.lists.includes(listType as TaskListType));
  };

  const getTasksCount = (listType: TaskListType | string) => {
    return filteredTasks(listType).filter(task => !task.completed).length;
  };

  const addTaskList = (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    if (taskLists.some(list => list.id === id)) {
      toast.error("List with this name already exists");
      return;
    }
    const newList: TaskList = { id, name, icon: "list" };
    setTaskLists(prev => [...prev, newList]);
    toast.success("List created");
  };

  const deleteTaskList = (id: string) => {
    if (defaultLists.some(list => list.id === id)) {
      toast.error("Cannot delete default list");
      return;
    }
    setTaskLists(prev => prev.filter(list => list.id !== id));
    // Remove all tasks from this list
    setTasks(prev => 
      prev.map(task => ({
        ...task, 
        lists: task.lists.filter(list => list !== id as TaskListType),
        updatedAt: new Date()
      }))
    );
    if (activeList === id) {
      setActiveList("myDay");
    }
    toast.success("List deleted");
  };

  const value: TaskContextType = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    addTaskToList,
    removeTaskFromList,
    filteredTasks,
    getTasksCount,
    activeList,
    setActiveList,
    taskLists,
    addTaskList,
    deleteTaskList
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
