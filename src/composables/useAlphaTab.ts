// AlphaTab播放器相关状态 - 全局

import * as AlphaTab from "@coderline/alphatab";
import { createGlobalState } from "@vueuse/core";
import userBehavior from "@/utils/log/userBehavior";
import { reactive } from "vue"
import { formatDuration } from "@/utils/format"
import usePlayerState from "./usePlayerState";

interface TrackState {
  id: number;
  name: string;
  mute: boolean;
  solo: boolean;
  volume: number;
  active: boolean;
}

class ScoreState {
  /** 标题 */
  title = "";
  /** 作曲 */
  artist = "";
  scorePosition = "";
  progress = 0;
  playPauseState = AlphaTab.synth.PlayerState.Paused;
  loadingMusicScore = false;
  trackList: TrackState[] = [];
}

/** 播放器-全局状态 */
export default createGlobalState(() => {
  let alphaTabApi: AlphaTab.AlphaTabApi | null = null;

  /** 播放器状态 */
  const playerState = usePlayerState()!;

  /** 乐谱状态 */
  const scoreState = reactive<ScoreState>(new ScoreState());

  /** 初始化乐谱播放器 */
  const init = (container: HTMLElement, settings: AlphaTab.Settings | any) => {
    const api = new AlphaTab.AlphaTabApi(container, settings);
    if (!api) {
      throw new Error("Unknown error occurred while initializing AlphaTabApi.");
    }

    alphaTabApi = api;

    /** 新音乐加载监听 */
    alphaTabApi.scoreLoaded.on((score) => {
      scoreState.title = score.title;
      scoreState.artist = score.artist;
      userBehavior.loadFile(score.title);
      _initTrackList(score);
    });

    // 更新曲谱渲染状态
    api.renderStarted.on(() => {
      scoreState.loadingMusicScore = true;
    });
    api.renderFinished.on(() => {
      scoreState.loadingMusicScore = false;
    });

    api.soundFontLoad.on((e) => {
      console.log("字体加载进度：", Math.floor((e.loaded / e.total) * 100));
      // fontLoadPercent.value = Math.floor((e.loaded / e.total) * 100);
    });

    /** 播放器就位 */
    api.playerReady.on(() => {
      playerState.value.isPlayerReady = true;
    });

    api.playerStateChanged.on((e) => {
      scoreState.playPauseState = e.state;
      if (e.state === 0) {
        userBehavior.stopPlayer(scoreState.title);
      } else if (e.state === 1) {
        logPlayingState();
      }
    });

    /** 进度条 */
    let previousTime = -1;
    api.playerPositionChanged.on((e) => {
      const currentSeconds = (e.currentTime / 1000) | 0;
      if (currentSeconds == previousTime) {
        return;
      }
      previousTime = currentSeconds;
      scoreState.scorePosition =
        formatDuration(e.currentTime) + " / " + formatDuration(e.endTime);
      scoreState.progress = (e.currentTime / e.endTime) * 100;
    });

    api.error.on((err) => {
      window.$message.error(err.message || "未知错误");
      scoreState.loadingMusicScore = false;
    });

    setPlayerStateFromStorage();
  };

  const logPlayingState = () => {
    const tracks = alphaTabApi?.tracks.map((track) => track.name) || [];
    const playingTracks = scoreState.trackList.some((t) => t.solo)
      ? scoreState.trackList.filter((t) => t.solo && !t.mute).map((t) => t.name)
      : scoreState.trackList.filter((t) => !t.mute).map((t) => t.name);
    userBehavior.startPlayer(
      scoreState.title,
      playerState.value.playbackSpeed,
      tracks,
      playingTracks
    );
  };

  /** 加载乐谱资源 */
  const loadAudioSource = (source: unknown, trackIndexes?: number[]) => {
    const res = alphaTabApi?.load(source, trackIndexes);
    if (res) {
      console.log(alphaTabApi?.playbackSpeed);
      // 加载成功，TODO: 记录历史记录
    } else {
      window.$message.error("文件加载失败，请上传gp*或musicxml");
    }
    return res;
  };

  const playPause = () => {
    if (playerState.value.isPlayerReady) {
      alphaTabApi?.playPause();
    }
  };

  const stop = () => {
    if (playerState.value.isPlayerReady) {
      alphaTabApi?.stop();
    }
  };

  const setPlaybackSpeed = (val: number) => {
    if (alphaTabApi) {
      alphaTabApi.playbackSpeed = playerState.value.playbackSpeed = val;
    }
  };

  const setScale = (val: number) => {
    if (alphaTabApi) {
      alphaTabApi.settings.display.scale = val / 100;
      alphaTabApi.updateSettings();
      alphaTabApi.render();
      playerState.value.scale = val;
    }
  };

  const setLayout = (val: AlphaTab.LayoutMode) => {
    if (alphaTabApi) {
      alphaTabApi.settings.display.layoutMode = val;
      alphaTabApi.updateSettings();
      alphaTabApi.render();
      playerState.value.layout = val;
    }
  };

  const changeCountInVolume = () => {
    if (alphaTabApi) {
      const newVal = alphaTabApi.countInVolume ? 0 : 1;
      alphaTabApi.countInVolume = playerState.value.countInVolume = newVal;
    }
  };

  const changeMetronomeVolume = () => {
    if (alphaTabApi) {
      const newVal = alphaTabApi.metronomeVolume ? 0 : 1;
      alphaTabApi.metronomeVolume = playerState.value.metronomeVolume = newVal;
    }
  };

  const changeLooping = () => {
    if (alphaTabApi) {
      alphaTabApi.isLooping = playerState.value.isLooping =
        !alphaTabApi.isLooping;
    }
  };

  const setPlayerStateFromStorage = () => {
    setPlaybackSpeed(playerState.value.playbackSpeed);
    setScale(playerState.value.scale);
    setLayout(playerState.value.layout);
    alphaTabApi!.countInVolume = playerState.value.countInVolume;
    alphaTabApi!.isLooping = playerState.value.isLooping;
    alphaTabApi!.metronomeVolume = playerState.value.metronomeVolume;
  };

  const changeTrack = (id: number) => {
    if (!alphaTabApi) return;

    const { multiTrack } = playerState.value;
    const trackInUse = new Set(alphaTabApi.tracks.map((t) => t.index));
    if (multiTrack) {
      if (trackInUse.has(id)) {
        trackInUse.size > 1 && trackInUse.delete(id);
      } else {
        trackInUse.add(id);
      }
      alphaTabApi.renderTracks(
        alphaTabApi.score!.tracks.filter((t) => trackInUse.has(t.index))
      );
    } else {
      if (!trackInUse.has(id)) {
        alphaTabApi.renderTracks(
          alphaTabApi.score!.tracks.filter((t) => t.index === id)
        );
      }
    }
    _syncTrackList();
    logPlayingState()
  };

  /** 初始化声道状态 */
  const _initTrackList = (score?: AlphaTab.AlphaTabApi["score"]) => {
    const tracks = score?.tracks || alphaTabApi?.score?.tracks || [];
    // const activeTrackList = alphaTabApi?.tracks?.map(t => t.index) || []
    scoreState.trackList = tracks.map((track) => ({
      id: track.index,
      name: track.name,
      mute: false,
      solo: false,
      volume: track.playbackInfo.volume,
      active: false,
    }));
    _syncTrackList();
  };

  /** 同步声道状态 */
  const _syncTrackList = () => {
    const tracks = alphaTabApi?.tracks || [];
    scoreState.trackList.forEach(
      (trackState) =>
        (trackState.active = tracks.some((t) => t.index === trackState.id))
    );
  };

  const triggerMute = (isMute: boolean, id: number) => {
    if (!alphaTabApi) return;
    const tracks = alphaTabApi.score?.tracks.filter((t) => t.index === id);
    if (!tracks) {
      window.$message("未知错误");
      return;
    }
    alphaTabApi.changeTrackMute(tracks, isMute);
    const trackInState = scoreState.trackList.find((t) => t.id === id);
    trackInState && (trackInState.mute = isMute);
    logPlayingState()
  };

  const triggerSolo = (isSolo: boolean, id: number) => {
    if (!alphaTabApi) return;
    const tracks = alphaTabApi.score?.tracks.filter((t) => t.index === id);
    if (!tracks) {
      window.$message("未知错误");
      return;
    }
    alphaTabApi.changeTrackSolo(tracks, isSolo);
    const trackInState = scoreState.trackList.find((t) => t.id === id);
    trackInState && (trackInState.solo = isSolo);
    logPlayingState()
  };

  const changeVolume = (id: number, volume: number) => {
    if (!alphaTabApi || !alphaTabApi.player) return;
    const tracks = alphaTabApi.score?.tracks.filter((t) => t.index === id);
    if (!tracks) {
      window.$message("未知错误");
      return;
    }
    alphaTabApi.changeTrackVolume(
      tracks,
      volume / tracks[0].playbackInfo.volume
    );
    const trackInState = scoreState.trackList.find((t) => t.id === id);
    trackInState && (trackInState.volume = volume);
  };

  const layoutOptions = [
    { label: "Vertical", value: AlphaTab.LayoutMode.Page },
    { label: "Horizontal", value: AlphaTab.LayoutMode.Horizontal },
  ];

  return {
    playerState,
    scoreState,
    layoutOptions,
    init,
    loadAudioSource,
    playPause,
    setPlaybackSpeed,
    setScale,
    setLayout,
    stop,
    changeCountInVolume,
    changeMetronomeVolume,
    changeLooping,
    changeTrack,
    triggerMute,
    triggerSolo,
    changeVolume,
  };
});
