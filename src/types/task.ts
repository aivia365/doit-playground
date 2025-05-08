
export type TaskPriority = "low" | "medium" | "high";
export type TaskListType = "myDay" | "important" | "planned" | "assignedToMe" | "tasks" | "custom";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  description?: string;
  dueDate?: Date;
  priority?: TaskPriority;
  lists: TaskListType[];
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
}

export interface TaskList {
  id: TaskListType | string;
  name: string;
  icon?: string;
  count?: number;
  isDefault?: boolean;
}
