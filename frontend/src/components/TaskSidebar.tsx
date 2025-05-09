
import React, { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Sun, Star, Calendar, User, Home, Plus, Search, List
} from 'lucide-react';
import UserProfile from './UserProfile';

const TaskSidebar = () => {
  const { 
    taskLists, 
    getTasksCount, 
    activeList, 
    setActiveList, 
    addTaskList,
    deleteTaskList
  } = useTask();
  const [newListName, setNewListName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getIcon = (icon: string | undefined) => {
    switch (icon) {
      case 'sun': return <Sun className="w-5 h-5" />;
      case 'star': return <Star className="w-5 h-5" />;
      case 'calendar': return <Calendar className="w-5 h-5" />;
      case 'user': return <User className="w-5 h-5" />;
      case 'home': return <Home className="w-5 h-5" />;
      default: return <List className="w-5 h-5" />;
    }
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      addTaskList(newListName);
      setNewListName('');
      setIsDialogOpen(false);
    }
  };

  const handleDeleteList = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTaskList(id);
  };

  return (
    <div className="w-64 h-screen flex flex-col border-r bg-white">
      <div className="p-4">
        <UserProfile />
      </div>
      
      <div className="relative mx-4 mb-4">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search"
          className="pl-9 pr-4 py-2 w-full rounded-md border bg-white"
        />
      </div>
      
      <div className="flex-grow overflow-y-auto">
        {taskLists.map((list) => (
          <div
            key={list.id}
            className={cn(
              "sidebar-item",
              activeList === list.id && "active"
            )}
            onClick={() => setActiveList(list.id.toString())}
          >
            {getIcon(list.icon)}
            <span>{list.name}</span>
            {getTasksCount(list.id) > 0 && (
              <span className="count">{getTasksCount(list.id)}</span>
            )}
            {!list.isDefault && (
              <Button
                variant="ghost" 
                size="icon"
                className="ml-auto p-0 h-5 w-5 text-gray-400 hover:text-red-500"
                onClick={(e) => handleDeleteList(list.id.toString(), e)}
              >
                &times;
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="sidebar-item mt-auto border-t py-3">
            <Plus className="w-5 h-5" />
            <span>New list</span>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new list</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="List name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="mt-2"
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateList} disabled={!newListName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskSidebar;
