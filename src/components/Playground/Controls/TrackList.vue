<script lang="ts" setup>
import {
  NIcon,
  NDrawer,
  NDrawerContent,
  NSwitch,
  NFlex,
  NButton,
  NSlider,
} from "naive-ui";

import { Guitar, VolumeUp, VolumeMute } from "@vicons/fa";
import useAlphaTab from "@/composables/useAlphaTab";
import { ref } from "vue";

const { playerState, scoreState, triggerSolo, triggerMute, changeTrack, changeVolume } = useAlphaTab();

const visible = ref(false);
const handleClick = () => {
  visible.value = true;
};

const railStyle = () => ({
  background: "#36ad6a",
});
</script>

<template>
  <NIcon :size="24" @click="handleClick">
    <svg viewBox="0 0 24 24">
      <path
        d="M20.125 9.5V3.25a.625.625 0 10-1.25 0V9.5A1.875 1.875 0 0017 11.375V14.5a1.875 1.875 0 001.875 1.875v4.375a.624.624 0 101.25 0v-4.375A1.875 1.875 0 0022 14.5v-3.125A1.875 1.875 0 0020.125 9.5zm.625 5a.624.624 0 01-.625.625h-1.25a.624.624 0 01-.625-.625v-3.125a.624.624 0 01.625-.625h1.25a.624.624 0 01.625.625V14.5zM12.625 5.75v-2.5a.625.625 0 10-1.25 0v2.5A1.875 1.875 0 009.5 7.625v3.125a1.875 1.875 0 001.875 1.875v8.125a.624.624 0 101.25 0v-8.125A1.875 1.875 0 0014.5 10.75V7.625a1.875 1.875 0 00-1.875-1.875zm.625 5a.624.624 0 01-.625.625h-1.25a.624.624 0 01-.625-.625V7.625A.625.625 0 0111.375 7h1.25a.625.625 0 01.625.625v3.125zM5.125 11.375V3.25a.625.625 0 00-1.25 0v8.125A1.875 1.875 0 002 13.25v3.125a1.875 1.875 0 001.875 1.875v2.5a.625.625 0 101.25 0v-2.5A1.875 1.875 0 007 16.375V13.25a1.875 1.875 0 00-1.875-1.875zm.625 5a.625.625 0 01-.625.625h-1.25a.625.625 0 01-.625-.625V13.25a.625.625 0 01.625-.625h1.25a.625.625 0 01.625.625v3.125z"
      ></path>
    </svg>
  </NIcon>
  <NDrawer v-model:show="visible" placement="left" width="300">
    <NDrawerContent body-content-style="padding: 0">
      <template #header>
        <NFlex justify="space-between" size="small">
          <span>音轨</span>
          <NSwitch
            :rail-style="railStyle"
            v-model:value="playerState.multiTrack"
          >
            <template #checked> 复音轨 </template>
            <template #unchecked> 单音轨 </template>
          </NSwitch>
        </NFlex>
      </template>
      <div
        class="track grid grid-cols-[auto,1fr] grid-rows-[auto,auto] gap-2-5px p-5px"
        :class="{ active: track.active }"
        v-for="track in scoreState.trackList"
        :key="track.id"
        @click="changeTrack(track.id)"
      >
        <NIcon
          class="track_icon h-16 w-16 flex items-center justify-center"
          :size="32"
        >
          <Guitar />
        </NIcon>
        <span class="track_name font-500 leading-none">{{ track.name }}</span>
        <NFlex class="track_controls" align="center" size="small" :wrap="false">
          <NButton
            type="error"
            size="tiny"
            :ghost="!track.mute"
            @click.stop="triggerMute(!track.mute, track.id)"
            >Mute</NButton
          >
          <NButton
            type="success"
            size="tiny"
            :ghost="!track.solo"
            @click.stop="triggerSolo(!track.solo, track.id)"
            >Solo</NButton
          >
          <NIcon>
            <VolumeUp v-if="!track.mute && track.volume" />
            <VolumeMute v-else />
          </NIcon>
          <NSlider v-model:value="track.volume" :max="16" :on-update:value="(volume) => changeVolume(track.id, volume)" @click.stop="() =>{}"></NSlider>
        </NFlex>
      </div>
    </NDrawerContent>
  </NDrawer>
</template>

<style lang="less" scoped>
.track {
  grid-template-areas: "c d" "c e";
  transition: background 0.2s;
  cursor: pointer;
  --primary-color: #36ad6a;

  &_icon {
    grid-area: c;
    justify-content: center;
    opacity: 0.5;
    transition: opacity 0.2s;
  }

  &_name {
    grid-area: d;
  }

  &_controls {
    opacity: 0.8;
    grid-area: e;
  }

  &.active {
    background: #00000008;

    .track_icon {
      opacity: 1;
      color: var(--primary-color);
    }

    .track_controls {
      opacity: 1;
    }
  }

  &:hover {
    background: #0000001a;
  }
}
</style>
