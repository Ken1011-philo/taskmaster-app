export interface Task {
  id: string;
  title: string;
  done: boolean;
}

export interface Subgoal {
  id: string;
  title: string;
  tasks: Task[];
}

export interface PlanState {
  goalTitle: string;
  subgoals: Subgoal[];
}
