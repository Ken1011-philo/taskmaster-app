import React, { useEffect, useMemo, useReducer, useState } from "react";

// =========================
// Types
// =========================
export type ID = string;
export type Task = { id: ID; title: string; completed: boolean };
export type Subgoal = { id: ID; title: string; tasks: Task[] };
export type State = { subgoals: Subgoal[] };

type Action =
  | { type: "ADD_SUBGOAL"; title: string }
  | { type: "REMOVE_SUBGOAL"; id: ID }
  | { type: "RENAME_SUBGOAL"; id: ID; title: string }
  | { type: "ADD_TASK"; subgoalId: ID; title: string }
  | { type: "REMOVE_TASK"; subgoalId: ID; taskId: ID }
  | { type: "TOGGLE_TASK"; subgoalId: ID; taskId: ID }
  | { type: "RENAME_TASK"; subgoalId: ID; taskId: ID; title: string }
  | { type: "HYDRATE"; payload: State };

const uid = (): ID =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

// =========================
// Reducer
// =========================
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "ADD_SUBGOAL":
      return {
        subgoals: [
          ...state.subgoals,
          { id: uid(), title: action.title.trim(), tasks: [] },
        ],
      };
    case "REMOVE_SUBGOAL":
      return { subgoals: state.subgoals.filter((g) => g.id !== action.id) };
    case "RENAME_SUBGOAL":
      return {
        subgoals: state.subgoals.map((g) =>
          g.id === action.id ? { ...g, title: action.title } : g
        ),
      };
    case "ADD_TASK":
      return {
        subgoals: state.subgoals.map((g) =>
          g.id === action.subgoalId
            ? {
                ...g,
                tasks: [
                  ...g.tasks,
                  { id: uid(), title: action.title.trim(), completed: false },
                ],
              }
            : g
        ),
      };
    case "REMOVE_TASK":
      return {
        subgoals: state.subgoals.map((g) =>
          g.id === action.subgoalId
            ? { ...g, tasks: g.tasks.filter((t) => t.id !== action.taskId) }
            : g
        ),
      };
    case "TOGGLE_TASK":
      return {
        subgoals: state.subgoals.map((g) =>
          g.id === action.subgoalId
            ? {
                ...g,
                tasks: g.tasks.map((t) =>
                  t.id === action.taskId ? { ...t, completed: !t.completed } : t
                ),
              }
            : g
        ),
      };
    case "RENAME_TASK":
      return {
        subgoals: state.subgoals.map((g) =>
          g.id === action.subgoalId
            ? {
                ...g,
                tasks: g.tasks.map((t) =>
                  t.id === action.taskId ? { ...t, title: action.title } : t
                ),
              }
            : g
        ),
      };
    default:
      return state;
  }
};

// =========================
// Forms
// =========================
const SubgoalForm: React.FC<{ onAdd: (title: string) => void }> = ({
  onAdd,
}) => {
  const [title, setTitle] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const t = title.trim();
        if (!t) return;
        onAdd(t);
        setTitle("");
      }}
      className="flex gap-2 items-center"
    >
      <input
        id="new-subgoal"
        className="border rounded px-2 py-1 flex-1"
        placeholder="サブゴールのタイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit" className="px-3 py-1 rounded bg-black text-white">
        追加
      </button>
    </form>
  );
};

const TaskForm: React.FC<{ onAdd: (title: string) => void; subgoalId: ID }> = ({
  onAdd,
  subgoalId,
}) => {
  const [title, setTitle] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const t = title.trim();
        if (!t) return;
        onAdd(t);
        setTitle("");
      }}
      className="flex gap-2"
    >
      <input
        id={`new-task-${subgoalId}`}
        className="border rounded px-2 py-1 flex-1"
        placeholder="タスクを追加"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit" className="px-2 py-1 rounded border">
        ＋
      </button>
    </form>
  );
};

// =========================
// Item Lines
// =========================
const TaskItem: React.FC<{
  task: Task;
  onToggle: () => void;
  onRemove: () => void;
  onRename: (title: string) => void;
}> = ({ task, onToggle, onRemove, onRename }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.title);
  useEffect(() => setValue(task.title), [task.title]);

  return (
    <li className="flex items-center gap-2">
      <input type="checkbox" checked={task.completed} onChange={onToggle} />
      {editing ? (
        <input
          className="border rounded px-2 py-1 flex-1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onRename(value.trim());
              setEditing(false);
            } else if (e.key === "Escape") {
              setEditing(false);
              setValue(task.title);
            }
          }}
          autoFocus
        />
      ) : (
        <span
          className={
            task.completed ? "line-through opacity-60 flex-1" : "flex-1"
          }
        >
          {task.title}
        </span>
      )}
      {editing ? (
        <>
          <button
            className="text-sm px-2 py-1 border rounded"
            onClick={() => {
              onRename(value.trim());
              setEditing(false);
            }}
          >
            保存
          </button>
          <button
            className="text-sm px-2 py-1"
            onClick={() => {
              setEditing(false);
              setValue(task.title);
            }}
          >
            キャンセル
          </button>
        </>
      ) : (
        <>
          <button
            className="text-sm px-2 py-1 border rounded"
            onClick={() => setEditing(true)}
          >
            編集
          </button>
          <button className="text-sm px-2 py-1" onClick={onRemove}>
            削除
          </button>
        </>
      )}
    </li>
  );
};

const SubgoalCard: React.FC<{
  subgoal: Subgoal;
  dispatch: React.Dispatch<Action>;
}> = ({ subgoal, dispatch }) => {
  const [title, setTitle] = useState(subgoal.title);
  const [editing, setEditing] = useState(false);

  useEffect(() => setTitle(subgoal.title), [subgoal.title]);

  const left = useMemo(
    () => subgoal.tasks.filter((t) => !t.completed).length,
    [subgoal.tasks]
  );

  return (
    <div className="border rounded p-4 space-y-3">
      <div className="flex items-center gap-2">
        {editing ? (
          <input
            className="border rounded px-2 py-1 flex-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                dispatch({
                  type: "RENAME_SUBGOAL",
                  id: subgoal.id,
                  title: title.trim(),
                });
                setEditing(false);
              } else if (e.key === "Escape") {
                setEditing(false);
                setTitle(subgoal.title);
              }
            }}
            autoFocus
          />
        ) : (
          <h3 className="font-semibold flex-1">{subgoal.title}</h3>
        )}
        <span className="text-xs text-gray-500">残: {left}</span>
        {editing ? (
          <button
            className="text-sm px-2 py-1 border rounded"
            onClick={() => {
              dispatch({
                type: "RENAME_SUBGOAL",
                id: subgoal.id,
                title: title.trim(),
              });
              setEditing(false);
            }}
          >
            保存
          </button>
        ) : (
          <button
            className="text-sm px-2 py-1 border rounded"
            onClick={() => setEditing(true)}
          >
            タイトル編集
          </button>
        )}
        <button
          className="text-sm px-2 py-1"
          onClick={() => dispatch({ type: "REMOVE_SUBGOAL", id: subgoal.id })}
        >
          削除
        </button>
      </div>

      <TaskForm
        onAdd={(taskTitle) =>
          dispatch({
            type: "ADD_TASK",
            subgoalId: subgoal.id,
            title: taskTitle,
          })
        }
        subgoalId={subgoal.id}
      />

      <ul className="space-y-2">
        {subgoal.tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() =>
              dispatch({
                type: "TOGGLE_TASK",
                subgoalId: subgoal.id,
                taskId: task.id,
              })
            }
            onRemove={() =>
              dispatch({
                type: "REMOVE_TASK",
                subgoalId: subgoal.id,
                taskId: task.id,
              })
            }
            onRename={(newTitle) =>
              dispatch({
                type: "RENAME_TASK",
                subgoalId: subgoal.id,
                taskId: task.id,
                title: newTitle,
              })
            }
          />
        ))}
      </ul>
    </div>
  );
};

// =========================
// Persistence helpers
// =========================
const STORAGE_KEY = "subgoals_tasks_v1";
const load = (): State | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as State;
    // quick schema guard
    if (!parsed || !Array.isArray(parsed.subgoals)) return null;
    return parsed;
  } catch {
    return null;
  }
};

// =========================
// App (Default Export)
// =========================
export default function Plan() {
  const [state, dispatch] = useReducer(reducer, { subgoals: [] });

  // hydrate once
  useEffect(() => {
    const s = load();
    if (s) dispatch({ type: "HYDRATE", payload: s });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totalTasks = useMemo(
    () => state.subgoals.reduce((acc, g) => acc + g.tasks.length, 0),
    [state.subgoals]
  );
  const completedTasks = useMemo(
    () =>
      state.subgoals.reduce(
        (acc, g) => acc + g.tasks.filter((t) => t.completed).length,
        0
      ),
    [state.subgoals]
  );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">サブゴール × タスク Todo</h1>
        <p className="text-sm text-gray-600">
          サブゴールを作成し、その中にタスクを追加できます。ローカルに自動保存されます。
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="font-semibold">サブゴールを追加</h2>
        <SubgoalForm
          onAdd={(title) => dispatch({ type: "ADD_SUBGOAL", title })}
        />
      </section>

      <section className="space-y-4">
        <div className="text-sm text-gray-600">
          合計タスク: {completedTasks}/{totalTasks}
        </div>
        {state.subgoals.length === 0 ? (
          <p className="text-gray-500">
            まだサブゴールがありません。上のフォームから追加してください。
          </p>
        ) : (
          <div className="space-y-4">
            {state.subgoals.map((g) => (
              <SubgoalCard key={g.id} subgoal={g} dispatch={dispatch} />
            ))}
          </div>
        )}
      </section>

      <footer className="text-xs text-gray-400 pt-6 border-t">
        React + TypeScript + useReducer / localStorage 永続化
      </footer>
    </div>
  );
}
