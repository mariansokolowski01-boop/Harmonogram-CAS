export type TaskType = 'purchase' | 'cutting' | 'assembly' | 'welding' | 'painting' | 'shipment';

export interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  correctionDate?: string;
  isCompleted?: boolean;
  type: TaskType;
}

export interface Module {
  id: string;
  name: string;
  tasks: Task[];
}
