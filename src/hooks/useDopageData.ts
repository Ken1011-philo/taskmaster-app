// src/hooks/useDopageData.ts
import { useCallback, useEffect, useState } from "react";
import type { DoRepo, Task as DoTask, TodayStats } from "../types/do";
import { usePlanState } from "./usePlanState";
import type { PlanState, Task as PlanTask } from "../types/plan";

// -----------------------------
// Doページ用の state 型
// -----------------------------
type DoPageState =
  | {
      status: "loading";
      task: null;
      stats: null;
    }
  | {
      status: "ready";
      task: DoTask | null;
      stats: TodayStats | null;
    }
  | {
      status: "error";
      task: null;
      stats: null;
      message?: string;
    };

// -----------------------------
// Plan → DoTask 変換ヘルパー
// -----------------------------

function mapPlanTaskToDoTask(planTask: PlanTask): DoTask {
  return {
    id: planTask.id,
    title: planTask.title,
    // 仮ルール：1タスク = ブロック1個
    plannedBlocks: 1,
    doneBlocks: planTask.done ? 1 : 0,
    completed: planTask.done,
  } as DoTask;
}

/** PlanState 全体から DoTask 配列を作る */
function flattenPlanTasks(plan: PlanState): DoTask[] {
  const result: DoTask[] = [];
  for (const sg of plan.subgoals) {
    for (const t of sg.tasks) {
      result.push(mapPlanTaskToDoTask(t));
    }
  }
  return result;
}

/** 「今やるタスク」を1つ選ぶ（単純に最初の未完タスク） */
function pickNextTask(tasks: DoTask[]): DoTask | null {
  const pending = tasks.filter((t) => !t.completed);
  if (!pending.length) return null;
  // 必要ならここで優先度ソートを入れてもOK
  return pending[0];
}

/** TodayStats を Plan ベースで計算 */
function buildTodayStats(tasks: DoTask[]): TodayStats {
  const planned = tasks.reduce((sum, t) => sum + t.plannedBlocks, 0);
  const done = tasks.reduce((sum, t) => sum + t.doneBlocks, 0);

  return {
    completedCount: tasks.filter((t) => t.completed).length,
    blockRate: planned ? done / planned : 0,
    // 本来は別管理だが、今はダミーで1日
    streakDays: 1,
  };
}

// -----------------------------
// 公開 hook
// -----------------------------

export function useDoPageData(_repo: DoRepo) {
  const { plan } = usePlanState();
  const [state, setState] = useState<DoPageState>({
    status: "loading",
    task: null,
    stats: null,
  });

  const loadFromPlan = useCallback(() => {
    try {
      // ★ ユニオン型に合わせて「loading用の形」を直指定する
      setState({
        status: "loading",
        task: null,
        stats: null,
      });

      const tasks = flattenPlanTasks(plan);
      const nextTask = pickNextTask(tasks);
      const stats = buildTodayStats(tasks);

      setState({
        status: "ready",
        task: nextTask,
        stats,
      });
    } catch (e) {
      console.error(e);
      setState({
        status: "error",
        task: null,
        stats: null,
        message: e instanceof Error ? e.message : "unknown error",
      });
    }
  }, [plan]);

  useEffect(() => {
    loadFromPlan();
  }, [loadFromPlan]);

  const reload = useCallback(() => {
    loadFromPlan();
  }, [loadFromPlan]);

  return { state, reload };
}
