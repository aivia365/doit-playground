
import React from 'react';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';

const EmptyTaskList = () => {
  const { activeList, taskLists } = useTask();
  const activeListDetails = taskLists.find(list => list.id === activeList);

  const getEmptyMessage = () => {
    switch (activeList) {
      case 'myDay':
        return {
          title: "Focus on your day",
          description: "Get things done with My Day, a list that refreshes every day.",
          buttonText: "Add task to My Day"
        };
      case 'important':
        return {
          title: "Important tasks",
          description: "Mark tasks with a star to add them to this list.",
          buttonText: "Add important task"
        };
      case 'planned':
        return {
          title: "Planned tasks",
          description: "Tasks with due dates appear here.",
          buttonText: "Add planned task"
        };
      default:
        return {
          title: `${activeListDetails?.name || 'Tasks'} is empty`,
          description: "Add your first task to get started!",
          buttonText: "Add a task"
        };
    }
  };

  const message = getEmptyMessage();

  return (
    <div className="flex flex-col items-center justify-center flex-grow py-20">
      {activeList === 'myDay' ? (
        <div className="focus-card p-8 rounded-xl text-center w-80 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="empty-list-calendar-icon">
              <span className="sparkles"></span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">{message.title}</h2>
          <p className="text-white/80 mb-4">{message.description}</p>
          <Button 
            variant="outline" 
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            {message.buttonText}
          </Button>
        </div>
      ) : (
        <div className="text-center w-80 animate-slide-in">
          <h2 className="text-xl font-medium text-gray-700 mb-2">{message.title}</h2>
          <p className="text-gray-500 mb-4">{message.description}</p>
          <Button>{message.buttonText}</Button>
        </div>
      )}
    </div>
  );
};

export default EmptyTaskList;
