import { useCallback, useEffect, useState } from "react";
import type { DoRepo, Task, TodayStats } from "../types/do.js";

type State =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; task: Task | null; stats: TodayStats | null };

export function useDoPageData(repo: DoRepo) {
  const [state, setState] = useState<State>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const [task, stats] = await Promise.all([
        repo.getNextTask(),
        repo.getTodayStats(),
      ]);
      setState({ status: "ready", task, stats });
    } catch {
      setState({ status: "error", error: "load_failed" });
    }
  }, [repo]);

  useEffect(() => {
    load();
    const onVis = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [load]);

  return { state, reload: load };
}
