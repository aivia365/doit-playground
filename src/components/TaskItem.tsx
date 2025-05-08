
import React, { useState } from 'react';
import { Task } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Check, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTaskCompletion, updateTask, deleteTask, addTaskToList, removeTaskFromList } = useTask();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [editedDueDate, setEditedDueDate] = useState<Date | undefined>(task.dueDate);
  const [isImportant, setIsImportant] = useState(task.lists.includes('important'));
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const handleToggleComplete = () => {
    toggleTaskCompletion(task.id);
  };

  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      updateTask(task.id, {
        title: editedTitle,
        description: editedDescription || undefined,
        dueDate: editedDueDate
      });
      setIsEditing(false);
    }
  };

  const handleToggleImportant = () => {
    setIsImportant(!isImportant);
    if (isImportant) {
      removeTaskFromList(task.id, 'important');
    } else {
      addTaskToList(task.id, 'important');
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setEditedDueDate(date);
    setDatePickerOpen(false);
  };

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group",
      task.completed && "opacity-60"
    )}>
      <div
        className={cn("task-checkbox", task.completed && "checked")}
        onClick={handleToggleComplete}
      >
        {task.completed && <Check className="w-4 h-4" />}
      </div>

      {isEditing ? (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <Input 
                value={editedTitle} 
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Task title"
                autoFocus
              />
              <Textarea 
                value={editedDescription} 
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Description (optional)"
                className="min-h-[100px]"
              />
              <div>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <Calendar className="mr-2 h-4 w-4" />
                      {editedDueDate ? format(editedDueDate, 'PPP') : "Add due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={editedDueDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              <Button onClick={handleSaveEdit} disabled={!editedTitle.trim()}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <>
          <div 
            className="flex-grow cursor-pointer" 
            onClick={() => setIsEditing(true)}
          >
            <div className={cn("line-clamp-1", task.completed && "line-through")}>
              {task.title}
            </div>
            {(task.description || task.dueDate) && (
              <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                {task.dueDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(task.dueDate, 'MMM d')}
                  </span>
                )}
                {task.description && <span className="line-clamp-1">{task.description}</span>}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleImportant}
            className={cn(
              "opacity-0 group-hover:opacity-100 transition-opacity",
              isImportant && "opacity-100 text-yellow-500"
            )}
          >
            <Star className="h-5 w-5" fill={isImportant ? "currentColor" : "none"} />
          </Button>
        </>
      )}
    </div>
  );
};

export default TaskItem;
