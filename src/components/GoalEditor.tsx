import type { FC } from "react";

interface GoalEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const GoalEditor: FC<GoalEditorProps> = ({ value, onChange }) => {
  return (
    <section className="mb-6">
      <h2 className="text-sm font-semibold text-slate-500 mb-2">
        目的（ゴール）
      </h2>
      <textarea
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        placeholder="例：数学レポートを期日までに提出する"
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="mt-1 text-xs text-slate-400">
        1〜2行で「何を達成したいか」を書きます。あとで Do
        ページの指標になります。
      </p>
    </section>
  );
};
