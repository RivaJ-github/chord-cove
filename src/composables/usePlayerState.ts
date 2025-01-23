import * as AlphaTab from "@coderline/alphatab";
import { useLocalStorage } from "@vueuse/core";

export default () => {
  return useLocalStorage(
    "playerState",
    {
      isLooping: false,
      /** 播放器准备状态 */
      isPlayerReady: false,
      playbackSpeed: 1,
      countInVolume: 0,
      metronomeVolume: 0,
      multiTrack: false,
      scale: 100,
      layout: AlphaTab.LayoutMode.Page
    },
    { mergeDefaults: true }
  );
};
