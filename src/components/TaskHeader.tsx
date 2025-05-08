
import React from 'react';
import { format } from 'date-fns';
import { useTask } from '@/contexts/TaskContext';
import { Calendar, ListPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TaskHeader = () => {
  const { activeList, taskLists } = useTask();
  const today = new Date();
  const activeListDetails = taskLists.find(list => list.id === activeList);

  return (
    <div className={`px-8 py-6 ${activeList === 'myDay' ? 'bg-gradient-todo text-white' : 'bg-white'}`}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{activeListDetails?.name || 'Tasks'}</h1>
          {activeList === 'myDay' && (
            <p className="text-sm opacity-80 mt-1">
              {format(today, 'EEEE, MMMM d')}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {activeList === 'myDay' && (
            <Button size="icon" variant="outline" className="bg-white/20 hover:bg-white/30 border-white/30">
              <Calendar className="h-5 w-5" />
            </Button>
          )}
          <Button size="icon" variant="outline" className={activeList === 'myDay' ? "bg-white/20 hover:bg-white/30 border-white/30" : ""}>
            <ListPlus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskHeader;
