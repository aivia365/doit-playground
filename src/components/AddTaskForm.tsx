
import React, { useState, KeyboardEvent } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { Plus } from 'lucide-react';

const AddTaskForm = () => {
  const [title, setTitle] = useState('');
  const { addTask, activeList } = useTask();

  const handleAddTask = () => {
    if (title.trim()) {
      addTask({
        title: title.trim(),
        completed: false,
        lists: [activeList as any],
      });
      setTitle('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className="sticky bottom-0 border-t bg-white p-4 flex gap-3 items-center">
      <div className="flex items-center justify-center w-6 h-6">
        <Plus className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="flex-grow border-none outline-none text-base placeholder:text-gray-400"
        placeholder="Add a task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default AddTaskForm;
