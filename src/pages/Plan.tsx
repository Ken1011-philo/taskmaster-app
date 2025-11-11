import { GoalEditor } from "../components/GoalEditor";
import { SubgoalCard } from "../components/SubgoalCard";
import { usePlanState } from "../hooks/usePlanState";

export default function PlanPage() {
  const {
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
  } = usePlanState();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ナビゲーションバーエリア（他ページでも共通化予定） */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-xl bg-slate-900 text-center text-xs font-bold text-white">
              F
            </span>
            <span className="text-sm font-semibold text-slate-800">
              FocusDo
            </span>
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-[2px] text-[11px] text-slate-500">
              Plan
            </span>
          </div>
          <nav className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-white">
              Plan
            </span>
            <span className="rounded-full px-3 py-1 text-slate-500 hover:bg-slate-100">
              Do
            </span>
            <span className="rounded-full px-3 py-1 text-slate-500 hover:bg-slate-100">
              setting
            </span>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 lg:flex-row">
        {/* 左側：目的 & 説明 */}
        <section className="w-full lg:w-1/3 lg:pr-4">
          <h1 className="mb-2 text-base font-semibold text-slate-900">
            Plan（ブロック計画）
          </h1>
          <p className="mb-4 text-xs leading-relaxed text-slate-500">
            目的 → サブゴール → タスク の順に分解して、
            「次にやる一歩」をはっきりさせるためのページです。
            入力内容はブラウザに自動保存されます。
          </p>

          <GoalEditor value={plan.goalTitle} onChange={setGoalTitle} />

          <div className="mt-4 flex flex-col gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-600">
              ブロック計画法のルール
            </span>
            <ul className="list-disc pl-4">
              <li>目的を1つに絞る</li>
              <li>サブゴールを3〜5個ほどに分ける</li>
              <li>各サブゴールに必要なタスクを具体的に書く</li>
              <li>Doページで「今やる一つだけ」を選び、集中する</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={clearAll}
            className="mt-4 rounded-xl border border-rose-200 px-3 py-1.5 text-xs text-rose-500 hover:bg-rose-50"
          >
            すべてリセット（ローカル保存をクリア）
          </button>
        </section>

        {/* 右側：サブゴール & タスク */}
        <section className="w-full space-y-3 lg:w-2/3">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-slate-500">
              サブゴールとタスク
            </h2>
            <button
              type="button"
              onClick={addSubgoal}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              ＋ サブゴールを追加
            </button>
          </div>

          {plan.subgoals.map((sg, index) => (
            <SubgoalCard
              key={sg.id}
              subgoal={sg}
              index={index}
              onChangeTitle={(title) => updateSubgoalTitle(sg.id, title)}
              onRemove={() => removeSubgoal(sg.id)}
              onAddTask={() => addTask(sg.id)}
              onChangeTaskTitle={(taskId, title) =>
                updateTaskTitle(sg.id, taskId, title)
              }
              onToggleTaskDone={(taskId) => toggleTaskDone(sg.id, taskId)}
              onRemoveTask={(taskId) => removeTask(sg.id, taskId)}
            />
          ))}

          {plan.subgoals.length === 0 && (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-400">
              まずは「＋ サブゴールを追加」から始めてください。
            </p>
          )}

          <p className="pt-2 text-[11px] text-slate-400">
            入力したPlanは Doページ と FocusTimerページ で参照されます。
          </p>
        </section>
      </main>
    </div>
  );
}
