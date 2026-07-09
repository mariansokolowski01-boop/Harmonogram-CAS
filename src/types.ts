export type TaskType = 'purchase' | 'cutting' | 'assembly' | 'welding' | 'painting' | 'shipment' | 'outfitting';

export interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCompleted?: boolean;
  progress?: number | null;
  type: TaskType;
}

export interface Module {
  id: string;
  name: string;
  tasks: Task[];
}
