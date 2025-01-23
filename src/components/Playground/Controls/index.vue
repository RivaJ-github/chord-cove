<script lang="ts" setup>
import {
  AudioFileFilled,
  PauseOutlined,
  PlayArrowFilled,
  HourglassFullFilled,
  HourglassDisabledFilled,
} from "@vicons/material";
import { StopCircle } from "@vicons/ionicons5";
import { Retweet } from "@vicons/fa";
import {
  NIcon,
  NSpace,
  NPopselect,
  NButton,
  NMarquee,
  NProgress,
  NFlex,
  NTooltip,
} from "naive-ui";
import TrackList from "./TrackList.vue";
import PlayerTools from "./PlayerTools.vue";
import * as AlphaTab from "@coderline/alphatab";
import useAlphaTab from "@/composables/useAlphaTab";
import { computed } from "vue";
import useSizeCheck, { Size } from "@/composables/useSizeCheck";
import { saveHistoryFile } from "@/db";

const {
  playerState,
  scoreState,
  layoutOptions,
  loadAudioSource,
  playPause,
  stop,
  setPlaybackSpeed,
  setScale,
  setLayout,
  changeCountInVolume,
  changeMetronomeVolume,
  changeLooping,
} = useAlphaTab();

const title = computed(() => {
  if (!scoreState.title) {
    return scoreState.artist;
  }
  if (!scoreState.artist) {
    return scoreState.title;
  }
  return `${scoreState.title}-${scoreState.artist}`;
});

/** 打开文件 */
const handleOpenAudioFile = () => {
  const t = document.createElement("input");
  t.type = "file";
  (t.accept =
    "application/octet-stream,.gp,.gp3,.gp4,.gp5,.gpx,.musicxml,.mxml,.xml,.capx"),
    (t.onchange = () => {
      if (t.files?.length !== 1) return;
      const fr = new FileReader();
      fr.onload = (e) => {
        if (!e.target || !e.target.result) return
        saveHistoryFile(t.files![0].name, e.target.result as ArrayBuffer)
        loadAudioSource(e.target.result, [0]);
      };
      fr.readAsArrayBuffer(t.files[0]);
    }),
    document.body.appendChild(t),
    t.click(),
    document.body.removeChild(t);
};

const playbackSpeedOptions = Array.from({ length: 11 }).map((_, index) => {
  const value = index * 0.1 + 0.5;
  return {
    label: `x${value.toFixed(1)}`,
    value,
  };
});

const scaleOptions = Array.from({ length: 8 }).map((_, index) => {
  const value = (index + 1) * 25;
  return {
    label: `${value}%`,
    value,
  };
});

const mediaSize = useSizeCheck();

const iconSize = 24;
</script>

<template>
  <NFlex
    class="fixed bottom-0 left-0 right-0 bg-theme shadow-t-lg z-2"
    vertical
    :size="0"
  >
    <NProgress
      type="line"
      :percentage="scoreState.progress"
      :show-indicator="false"
      :color="{ stops: ['#b2fffc', '#64dd17'] }"
    />
    <client-only>
      <NSpace
        class="h-10 mx-2"
        align="center"
        justify="space-between"
        :wrap="false"
      >
        <NSpace :size="12" align="center" justify="space-around" :wrap="false">
          <NTooltip trigger="hover">
            <template #trigger>
              <NIcon :size="iconSize" @click="handleOpenAudioFile">
                <AudioFileFilled />
              </NIcon>
            </template>
            Open File
          </NTooltip>
          <NTooltip trigger="hover">
            <template #trigger>
              <NIcon :size="iconSize" @click="stop">
                <StopCircle />
              </NIcon>
            </template>
            Stop
          </NTooltip>
          <NTooltip trigger="hover">
            <template #trigger>
              <NIcon :size="iconSize" @click="playPause">
                <PlayArrowFilled
                  v-if="
                    scoreState.playPauseState ===
                    AlphaTab.synth.PlayerState.Paused
                  "
                />
                <PauseOutlined v-else />
              </NIcon>
            </template>
            Play/Pause
          </NTooltip>
          <NPopselect
            v-model:value="playerState.playbackSpeed"
            :options="playbackSpeedOptions"
            trigger="hover"
            size="small"
            :on-update:value="setPlaybackSpeed"
          >
            <NButton size="small"
              >x{{ playerState.playbackSpeed.toFixed(1) }}</NButton
            >
          </NPopselect>
        </NSpace>

        <NSpace :size="12" align="center" justify="space-around" :wrap="false" v-if="mediaSize !== Size.SMALL">
          <NMarquee class="min-w-24 max-w-36" :speed="24">
            <template #default>
              <span class="px-4">{{ title }}</span>
            </template>
          </NMarquee>
          <span class="whitespace-nowrap">{{ scoreState.scorePosition }}</span>
        </NSpace>

        <NSpace :size="12" align="center" justify="space-around" :wrap="false">
          <TrackList />

          <template v-if="mediaSize === Size.LARGE">
            <NTooltip trigger="hover">
              <template #trigger>
                <NIcon :size="iconSize" @click="changeCountInVolume">
                  <HourglassFullFilled
                    class="text-primary"
                    v-if="playerState.countInVolume"
                  />
                  <HourglassDisabledFilled v-else />
                </NIcon>
              </template>
              Count-In
            </NTooltip>
            <NTooltip trigger="hover">
              <template #trigger>
                <NIcon
                  :size="iconSize"
                  :class="{ 'text-primary': playerState.metronomeVolume }"
                  @click="changeMetronomeVolume"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    id="mdi-metronome"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12,1.75L8.57,2.67L4.06,19.53C4.03,19.68 4,19.84 4,20C4,21.11 4.89,22 6,22H18C19.11,22 20,21.11 20,20C20,19.84 19.97,19.68 19.94,19.53L18.58,14.42L17,16L17.2,17H13.41L16.25,14.16L14.84,12.75L10.59,17H6.8L10.29,4H13.71L15.17,9.43L16.8,7.79L15.43,2.67L12,1.75M11.25,5V14.75L12.75,13.25V5H11.25M19.79,7.8L16.96,10.63L16.25,9.92L14.84,11.34L17.66,14.16L19.08,12.75L18.37,12.04L21.2,9.21L19.79,7.8Z"
                    />
                  </svg>
                </NIcon>
              </template>
              节拍器
            </NTooltip>
            <NTooltip trigger="hover">
              <template #trigger>
                <NIcon
                  :size="iconSize"
                  :class="{ 'text-primary': playerState.isLooping }"
                  @click="changeLooping"
                >
                  <Retweet />
                </NIcon>
              </template>
              Looping
            </NTooltip>
            <NTooltip trigger="hover">
              <template #trigger>
                <NPopselect
                  v-model:value="playerState.scale"
                  :options="scaleOptions"
                  trigger="hover"
                  size="small"
                  :on-update:value="setScale"
                >
                  <NButton size="small">{{ playerState.scale }}%</NButton>
                </NPopselect>
              </template>
              Scale
            </NTooltip>
            <NPopselect
              v-model:value="playerState.layout"
              :options="layoutOptions"
              trigger="hover"
              size="small"
              :on-update:value="setLayout"
            >
              <NButton size="small">{{
                playerState.layout === AlphaTab.LayoutMode.Page
                  ? "Vertical"
                  : "Horizontal"
              }}</NButton>
            </NPopselect>
          </template>
          <PlayerTools v-else />
        </NSpace>
      </NSpace>
    </client-only>
  </NFlex>
</template>
