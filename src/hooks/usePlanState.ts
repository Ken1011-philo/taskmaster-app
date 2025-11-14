import { useEffect, useState } from "react";
import type { PlanState, Subgoal, Task } from "../types/plan";

const STORAGE_KEY = "focusdo-plan-v1";

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const defaultState: PlanState = {
  goalTitle: "",
  subgoals: [
    {
      id: createId(),
      title: "",
      tasks: [
        {
          id: createId(),
          title: "",
          done: false,
        },
      ],
    },
  ],
};

// localStorage から読んだ unknown を PlanState に寄せる
function normalize(raw: unknown): PlanState {
  if (!raw || typeof raw !== "object") return defaultState;

  const rawPlan = raw as {
    goalTitle?: unknown;
    subgoals?: unknown;
  };

  const goalTitle =
    typeof rawPlan.goalTitle === "string" ? rawPlan.goalTitle : "";

  const subgoals: Subgoal[] = Array.isArray(rawPlan.subgoals)
    ? rawPlan.subgoals.map((s): Subgoal => {
        const rawSubgoal = s as {
          id?: unknown;
          title?: unknown;
          tasks?: unknown;
        };

        const id =
          typeof rawSubgoal.id === "string" ? rawSubgoal.id : createId();
        const title =
          typeof rawSubgoal.title === "string" ? rawSubgoal.title : "";

        const tasks: Task[] = Array.isArray(rawSubgoal.tasks)
          ? rawSubgoal.tasks.map((t): Task => {
              const rawTask = t as {
                id?: unknown;
                title?: unknown;
                done?: unknown;
              };
              return {
                id: typeof rawTask.id === "string" ? rawTask.id : createId(),
                title: typeof rawTask.title === "string" ? rawTask.title : "",
                done: typeof rawTask.done === "boolean" ? rawTask.done : false,
              };
            })
          : [];

        return { id, title, tasks };
      })
    : [];

  return {
    goalTitle,
    subgoals: subgoals.length ? subgoals : defaultState.subgoals,
  };
}

export function usePlanState() {
  // ★ 初回レンダー時に一度だけ localStorage から読む
  const [plan, setPlan] = useState<PlanState>(() => {
    if (typeof window === "undefined") return defaultState; // SSR対策（Viteならほぼ不要だけど保険）

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState;
      const parsed: unknown = JSON.parse(raw);
      return normalize(parsed);
    } catch (e) {
      console.warn("Failed to load plan from localStorage", e);
      return defaultState;
    }
  });

  // ★ plan が変わったときだけ保存する
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch (e) {
      console.warn("Failed to save plan to localStorage", e);
    }
  }, [plan]);

  const setGoalTitle = (title: string) =>
    setPlan((prev) => ({ ...prev, goalTitle: title }));

  const addSubgoal = () =>
    setPlan((prev) => ({
      ...prev,
      subgoals: [
        ...prev.subgoals,
        {
          id: createId(),
          title: "",
          tasks: [],
        },
      ],
    }));

  const updateSubgoalTitle = (id: string, title: string) =>
    setPlan((prev) => ({
      ...prev,
      subgoals: prev.subgoals.map((sg) =>
        sg.id === id ? { ...sg, title } : sg
      ),
    }));

  const removeSubgoal = (id: string) =>
    setPlan((prev) => ({
      ...prev,
      subgoals: prev.subgoals.filter((sg) => sg.id !== id),
    }));

  const addTask = (subgoalId: string) =>
    setPlan((prev) => ({
      ...prev,
      subgoals: prev.subgoals.map((sg) =>
        sg.id === subgoalId
          ? {
              ...sg,
              tasks: [
                ...sg.tasks,
                {
                  id: createId(),
                  title: "",
                  done: false,
                },
              ],
            }
          : sg
      ),
    }));

  const updateTaskTitle = (subgoalId: string, taskId: string, title: string) =>
    setPlan((prev) => ({
      ...prev,
      subgoals: prev.subgoals.map((sg) =>
        sg.id === subgoalId
          ? {
              ...sg,
              tasks: sg.tasks.map((t) =>
                t.id === taskId ? { ...t, title } : t
              ),
            }
          : sg
      ),
    }));

  const toggleTaskDone = (subgoalId: string, taskId: string) =>
    setPlan((prev) => ({
      ...prev,
      subgoals: prev.subgoals.map((sg) =>
        sg.id === subgoalId
          ? {
              ...sg,
              tasks: sg.tasks.map((t) =>
                t.id === taskId ? { ...t, done: !t.done } : t
              ),
            }
          : sg
      ),
    }));

  const removeTask = (subgoalId: string, taskId: string) =>
    setPlan((prev) => ({
      ...prev,
      subgoals: prev.subgoals.map((sg) =>
        sg.id === subgoalId
          ? {
              ...sg,
              tasks: sg.tasks.filter((t) => t.id !== taskId),
            }
          : sg
      ),
    }));

  const clearAll = () => setPlan(defaultState);

  return {
    plan,
    setGoalTitle,
    addSubgoal,
    updateSubgoalTitle,
    removeSubgoal,
    addTask,
    updateTaskTitle,
    toggleTaskDone,
    removeTask,
    clearAll,
  };
}
