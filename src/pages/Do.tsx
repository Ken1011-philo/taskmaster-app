import React from "react";
import { useNavigate } from "react-router-dom";
import "./Do.css";

import { useDoPageData } from "../hooks/useDopageData";
import type { DoRepo, Task, TodayStats } from "../types/do";

/* =========================================================
 * 開発用の in-memory リポジトリ（永続なし・localStorage不使用）
 * 本番では Supabase 等の実装に差し替えるだけでOK
 * =======================================================*/
const inMemoryRepo: DoRepo = (() => {
  let tasks: Task[] = []; // 必要ならテストで差し込む（永続しない）

  const getNextTask = async () => {
    const pending = tasks.filter((t) => !t.completed);
    pending.sort(
      (a, b) =>
        (b.plannedBlocks - b.doneBlocks) - (a.plannedBlocks - a.doneBlocks)
    );
    return pending[0] ?? null;
  };

  const getTodayStats = async () => {
    const planned = tasks.reduce((s, t) => s + t.plannedBlocks, 0);
    const done = tasks.reduce((s, t) => s + t.doneBlocks, 0);
    return {
      completedCount: tasks.filter((t) => t.completed).length,
      blockRate: planned ? done / planned : 0,
      streakDays: 1,
    } satisfies TodayStats;
  };

  // （任意）テスト時に外から差し込めるように dev-only API を窓口に出す
  // @ts-expect-error dev helper
  window.__seedDoTasks = (seed: Task[]) => {
    tasks = [...seed];
  };

  return { getNextTask, getTodayStats };
})();

/* =========================
 *  純UIコンポーネント
 * =======================*/
const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={["skel", className].filter(Boolean).join(" ")} />
);

const NowTaskCardSkeleton: React.FC = () => (
  <section className="nowcard container">
    <div className="nowcard__inner">
      <Skeleton className="nowcard__title" />
      <Skeleton className="nowcard__subtitle" />
      <div className="nowcard__progress">
        <div className="progress__track"><div className="progress__fill" /></div>
        <Skeleton className="progress__value" />
      </div>
      <div className="nowcard__buttons">
        <Skeleton className="btn--lg" />
        <Skeleton className="btn--md" />
        <Skeleton className="btn--md" />
      </div>
    </div>
  </section>
);

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="progress__track">
    <div className="progress__fill" style={{ width: `${Math.round(value * 100)}%` }} />
  </div>
);

const NowTaskCard: React.FC<{
  title: string;
  progress: number; // 0..1
  valueText?: string;
  onStart: () => void;
}> = ({ title, progress, valueText, onStart }) => (
  <section className="nowcard container">
    <div className="nowcard__inner">
      <h2 className="nowcard__title">{title}</h2>
      <p className="nowcard__subtitle">今日の進捗</p>
      <div className="nowcard__progress">
        <ProgressBar value={progress} />
        <span className="progress__value">{valueText}</span>
      </div>
      <div className="nowcard__buttons">
        <button className="btn btn--lg" onClick={onStart}>タスク開始</button>
        <button className="btn btn--md" disabled>タスク終了</button>
        <button className="btn btn--md" disabled>気が散った</button>
      </div>
    </div>
  </section>
);

const TodayStatsView: React.FC<{ stats: TodayStats }> = ({ stats }) => (
  <section className="today container">
    <h2 className="today__heading">今日の記録</h2>
    <div className="today__grid">
      <div className="today__item"><span className="today__value">完了{stats.completedCount}</span></div>
      <div className="today__item"><span className="today__value">ブロック完遂率 {Math.round(stats.blockRate * 100)}%</span></div>
      <div className="today__item"><span className="today__value">連続{stats.streakDays}日</span></div>
    </div>
  </section>
);

const TodayStatsSkeleton: React.FC = () => (
  <section className="today container">
    <h2 className="today__heading">今日の記録</h2>
    <div className="today__grid">
      <div className="today__item"><Skeleton className="today__value" /></div>
      <div className="today__item"><Skeleton className="today__value" /></div>
      <div className="today__item"><Skeleton className="today__value" /></div>
    </div>
  </section>
);

const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="page"><main className="main">{children}</main></div>
);

/* =========================
 *  ページ本体（UIだけ）
 * =======================*/
const Dopage: React.FC = () => {
  const navigate = useNavigate();
  const { state, reload } = useDoPageData(inMemoryRepo);
  // ← return の直前など、コンポーネント内の上の方に追加
  const isReady = state.status === "ready";
  const task = isReady ? state.task : null; // ここで絞り込む


  return (
    <PageShell>
      {state.status === "loading" && (
        <>
          <NowTaskCardSkeleton />
          <TodayStatsSkeleton />
        </>
      )}

      {state.status === "error" && (
        <>
          <section className="nowcard container">
            <div className="nowcard__inner">
              <h2 className="nowcard__title">読み込みに失敗しました</h2>
              <div className="nowcard__buttons">
                <button className="btn btn--lg" onClick={reload}>再試行</button>
              </div>
            </div>
          </section>
          <TodayStatsSkeleton />
        </>
      )}

      {isReady && (
        <>
          {task ? (
            <NowTaskCard
              title={task.title}
              progress={task.plannedBlocks ? task.doneBlocks / task.plannedBlocks : 0}
              valueText={`${task.doneBlocks}/${task.plannedBlocks}`}
              onStart={() => navigate(`/focus?taskId=${task.id}`)}
            />
          ) : (
            // ここはあなたの既存の空表示でOK（操作は変更しない方針のまま）
            <section className="nowcard container">
              <div className="nowcard__inner">
                <h2 className="nowcard__title">今日はやるタスクがありません</h2>
              </div>
            </section>
          )}

          {state.stats ? <TodayStatsView stats={state.stats} /> : <TodayStatsSkeleton />}
        </>
      )}
    </PageShell>
  );
};

export default Dopage;
