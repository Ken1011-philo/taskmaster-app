import type { FC } from "react";
import type { Task } from "../types/plan";

interface TaskItemProps {
  task: Task;
  onChangeTitle: (title: string) => void;
  onToggleDone: () => void;
  onRemove: () => void;
}

export const TaskItem: FC<TaskItemProps> = ({
  task,
  onChangeTitle,
  onToggleDone,
  onRemove,
}) => {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
      <button
        type="button"
        onClick={onToggleDone}
        className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs transition 
          ${
            task.done
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-slate-300 bg-white text-transparent"
          }`}
        aria-label="タスク完了チェック"
      >
        ✓
      </button>
      <input
        className={`flex-1 bg-transparent text-sm outline-none placeholder:text-slate-300 ${
          task.done ? "line-through text-slate-400" : "text-slate-800"
        }`}
        placeholder="タスクを入力"
        value={task.title}
        onChange={(e) => onChangeTitle(e.target.value)}
      />
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full px-2 py-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        削除
      </button>
    </div>
  );
};
