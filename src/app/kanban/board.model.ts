export interface Board {
  id?: string;
  title?: string;
  priority?: number;
  tasks?: Task[];
}

export interface Task {
  description?: string;
  label?: TaskLabelColor;
}

export enum TaskLabelColor {
  Puple = 'purple',
  Blue = 'blue',
  Green = 'green',
  Yellow = 'yellow',
  Red = 'red',
  Gray = 'gray',
}
