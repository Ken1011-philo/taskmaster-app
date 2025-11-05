import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-80 text-center">
        <h2 className="text-lg font-semibold mb-6">{taskName}</h2>

        <div className="w-48 h-48 mx-auto mb-6">
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

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div
            className="bg-blue-500 h-2.5 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setIsRunning(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          >
            一時停止
          </button>
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 px-4 py-2 rounded-full hover:bg-gray-100"
          >
            終了
          </button>
          <button
            onClick={() => setIsRunning(true)}
            className="text-gray-600 px-4 py-2 rounded-full hover:bg-gray-100"
          >
            再開
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
