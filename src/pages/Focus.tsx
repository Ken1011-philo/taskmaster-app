import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Focus() {
  // ======== タイマー用のステート ========
  const TOTAL_TIME = 25 * 60; // 25分
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isRunning, setIsRunning] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const taskName = (location.state as { taskName?: string })?.taskName || "タスクなし";

  // ======== 残り時間を mm:ss に整形 ========
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ======== タイマー進行ロジック ========
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const percentage = ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100;

  // ======== 画面描画 ========
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Focusページです。</h1>

      {/* --- タイマー部分 --- */}
      <div className="focus-container">
        <div className="timer-card">
          <h2 className="task-title">{taskName}</h2>

          <div className="circle-wrapper">
            <CircularProgressbar
              value={percentage}
              text={formatTime(timeLeft)}
              styles={buildStyles({
                textColor: "#000",
                pathColor: "#007bff",
                trailColor: "#eee",
                textSize: "16px",
              })}
            />
          </div>

          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="button-group mt-4 flex gap-2 justify-center">
            <Button
              variant="secondary"
              onClick={() => setIsRunning(false)}
            >
              一時停止
            </Button>
            <Button
              variant="destructive"
              onClick={() => navigate("/")}
            >
              終了
            </Button>
            <Button
              onClick={() => setIsRunning(true)}
            >
              再開
            </Button>
          </div>
        </div>
      </div>

      {/* --- 下部のshadcnボタン --- */}
      <div className="flex gap-3 mt-8 justify-center">
        <Button>shadcn 黒ボタン</Button>
        <Link to="/Do">
          <Button variant="secondary">Doへ</Button>
        </Link>
      </div>
    </main>
  );
}
