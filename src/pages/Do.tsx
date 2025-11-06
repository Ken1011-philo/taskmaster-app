import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import "./Do.css";

/** プレーンな矩形のスケルトン */
const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={["skel", className].filter(Boolean).join(" ")} />
);


/** 中央カード（Skeleton表示のみ） */
const NowTaskCardSkeleton: React.FC = () => {
  return (
    <section className="nowcard container">
      <div className="nowcard__inner">

        {/* 見出し（「今やるのはこれだけ」） */}
        <Skeleton className="nowcard__title" />

        {/* 説明行（タスク名相当） */}
        <Skeleton className="nowcard__subtitle" />

        {/* 進捗・右に小さな値（2/10 相当） */}
        <div className="nowcard__progress">
          <div className="progress__track">
            <div className="progress__fill" />
          </div>
          <Skeleton className="progress__value" />
        </div>

        {/* ボタン3つのダミー */}
        <div className="nowcard__buttons">
          <Skeleton className="btn--lg" />
          <Skeleton className="btn--md" />
          <Skeleton className="btn--md" />
        </div>
      </div>
    </section>
  );
};

const TodayStats: React.FC = () => (
  <section className="today container">
    <h2 className="today__heading">今日の記録</h2>
    <div className="today__grid">
      <div className="today__item">
        <span className="today__value">完了1</span>
      </div>
      <div className="today__item">
        <span className="today__value">ブロック完遂率 80%</span>
      </div>
      <div className="today__item">
        <span className="today__value">連続3日</span>
      </div>
    </div>
  </section>
);

const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="page">
    <main className="main">{children}</main>
  </div>
);

const Do: React.FC = () => {
  return (
    <PageShell>
      <NowTaskCardSkeleton />
      <TodayStats />
    </PageShell>
  );
};

export default Do;

