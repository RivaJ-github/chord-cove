import { logHub } from "./";

const pageLoad = () => logHub("Page Load");
const pageShow = () => logHub("Page Show");
const pageHide = () => logHub("Page Hide");
const pageClose = () => logHub("Page Close");

const loadFile = (title: string) =>
  logHub({ title, behavior: "乐谱加载" });

const startPlayer = (title: string, speed: number, tracks: string[], volumes: string[]) =>
  logHub({ title, speed, tracks, volumes, behavior: "开始播放" });

const pausePlayer = (title: string) => logHub({ title, behavior: "暂停播放" });

const stopPlayer = (title: string) => logHub({ title, behavior: "停止播放" });

export default {
  pageLoad,
  pageShow,
  pageHide,
  pageClose,
  loadFile,
  startPlayer,
  pausePlayer,
  stopPlayer,
};
