
import React from 'react';
import TaskSidebar from '@/components/TaskSidebar';
import TaskHeader from '@/components/TaskHeader';
import TaskList from '@/components/TaskList';
import AddTaskForm from '@/components/AddTaskForm';
import { TaskProvider } from '@/contexts/TaskContext';

const Index = () => {
  return (
    <TaskProvider>
      <div className="flex h-screen overflow-hidden">
        <TaskSidebar />
        <div className="flex flex-col flex-grow overflow-hidden">
          <TaskHeader />
          <div className="flex-grow overflow-y-auto">
            <TaskList />
          </div>
          <AddTaskForm />
        </div>
      </div>
    </TaskProvider>
  );
};

export default Index;
