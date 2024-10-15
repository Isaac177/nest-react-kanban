export interface Note {
  id: string;
  title: string;
  content: string;
  column: 'To Do' | 'In Progress' | 'Done';
  tags?: string[];
  dueDate?: string;
  priority: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  assignedTo?: string;
}
