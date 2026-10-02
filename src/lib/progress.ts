// コースの進み具合（この端末だけに保存する目印。学習記録そのものではない）
const KEY = "wise_course_progress_v1";

export type Progress = Record<string, string[]>; // courseId -> 完了したステップのキー

export function loadProgress(): Progress {
  try {
    const raw = window.localStorage.getItem(KEY);
    const v = raw ? JSON.parse(raw) : {};
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

export function saveProgress(p: Progress) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* 保存できない端末でも画面は動かす */
  }
}
