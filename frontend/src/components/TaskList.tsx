
import React from 'react';
import { useTask } from '@/contexts/TaskContext';
import TaskItem from './TaskItem';
import EmptyTaskList from './EmptyTaskList';

const TaskList = () => {
  const { filteredTasks, activeList } = useTask();
  const tasks = filteredTasks(activeList);
  
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (tasks.length === 0) {
    return <EmptyTaskList />;
  }

  return (
    <div className="px-8 py-4">
      {incompleteTasks.length > 0 && (
        <div className="mb-6">
          <div className="space-y-1">
            {incompleteTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-500 mb-2">Completed</div>
          <div className="space-y-1">
            {completedTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
