/** 字符串格式化 */

/**
 * 将时间戳转为00:00格式
 * @param milliseconds
 * @returns string
 */
export const formatDuration = (milliseconds: number) => {
  let seconds = milliseconds / 1000;
  const minutes = (seconds / 60) | 0;
  seconds = (seconds - minutes * 60) | 0;
  return (
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
};
