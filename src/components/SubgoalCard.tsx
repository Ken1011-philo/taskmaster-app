import type { FC } from "react";
import type { Subgoal } from "../types/plan";
import { TaskItem } from "./TaskItem";

interface SubgoalCardProps {
  subgoal: Subgoal;
  index: number;
  onChangeTitle: (title: string) => void;
  onRemove: () => void;
  onAddTask: () => void;
  onChangeTaskTitle: (taskId: string, title: string) => void;
  onToggleTaskDone: (taskId: string) => void;
  onRemoveTask: (taskId: string) => void;
}

export const SubgoalCard: FC<SubgoalCardProps> = ({
  subgoal,
  index,
  onChangeTitle,
  onRemove,
  onAddTask,
  onChangeTaskTitle,
  onToggleTaskDone,
  onRemoveTask,
}) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex flex-1 flex-col">
          <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            サブゴール {index + 1}
          </span>
          <input
            className="mt-1 w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none"
            placeholder="例：図の清書を終わらせる"
            value={subgoal.title}
            onChange={(e) => onChangeTitle(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full px-3 py-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          削除
        </button>
      </div>

      <div className="space-y-2">
        {subgoal.tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onChangeTitle={(title) => onChangeTaskTitle(task.id, title)}
            onToggleDone={() => onToggleTaskDone(task.id)}
            onRemove={() => onRemoveTask(task.id)}
          />
        ))}
      </div>

      <div className="mt-3 flex justify-between">
        <button
          type="button"
          onClick={onAddTask}
          className="rounded-xl border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          ＋ タスクを追加
        </button>
      </div>
    </section>
  );
};
