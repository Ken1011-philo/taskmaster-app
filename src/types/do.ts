// src/types/do.ts

/** Doページで扱うタスク1件分 */
export interface Task {
  /** Plan側の Task.id をそのまま引き継ぐ想定 */
  id: string;
  /** タスク名（Plan側の title を流用） */
  title: string;

  /**
   * このタスクに割り当てた「ブロック数」
   * ひとまず 1 タスク = 1 ブロック という運用なら 1 固定でもOK
   */
  plannedBlocks: number;

  /**
   * 実際に消化したブロック数
   * ブロック単位で進捗管理するなら 0〜plannedBlocks の範囲
   */
  doneBlocks: number;

  /** タスクが完了しているかどうか */
  completed: boolean;
}

/** 「今日の記録」で表示する集計値 */
export interface TodayStats {
  /** 完了したタスク数 */
  completedCount: number;

  /**
   * ブロック完遂率（0〜1）
   * 画面では Math.round(blockRate * 100) で % 表示している
   */
  blockRate: number;

  /** 連続達成日数（とりあえず数値ならOK） */
  streakDays: number;
}

/**
 * Doページが使うリポジトリのインターフェース
 * 本番では Supabase など、開発中は in-memory 実装を差し替える
 */
export interface DoRepo {
  /** 今やるべき次のタスクを1件返す（無ければ null） */
  getNextTask(): Promise<Task | null>;

  /** 今日の集計値を返す */
  getTodayStats(): Promise<TodayStats>;
}
