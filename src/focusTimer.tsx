import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./FocusTimer.css"; // ✅ 追加

const FocusTimer: React.FC = () => {
  const TOTAL_TIME = 25 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isRunning, setIsRunning] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const taskName = (location.state as { taskName?: string })?.taskName || "タスクなし";

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const percentage = ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100;

  return (
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

        <div className="button-group">
          <button
            onClick={() => setIsRunning(false)}
            className="btn btn-pause"
          >
            一時停止
          </button>
          <button
            onClick={() => navigate("/")}
            className="btn btn-neutral"
          >
            終了
          </button>
          <button
            onClick={() => setIsRunning(true)}
            className="btn btn-neutral"
          >
            再開
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
