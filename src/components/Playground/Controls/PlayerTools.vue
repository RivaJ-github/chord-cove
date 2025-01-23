<script lang="ts" setup>
import useAlphaTab from "@/composables/useAlphaTab";
import { NIcon, NModal, NForm, NFormItem, NSwitch, NSlider, NSelect } from "naive-ui";
import { ref } from "vue";

const {
  playerState,
  layoutOptions,
  setScale,
  setLayout,
  changeCountInVolume,
  changeMetronomeVolume,
  changeLooping,
} = useAlphaTab();

const visible = ref(false);
const handleClick = () => {
  visible.value = true;
};

const formatTooltip = (value: number) => `${value}%`
const scaleMarks = {
  25: '25%',
  100: '100%',
  200: '200%',
}
</script>

<template>
  <NIcon :size="24" @click="handleClick">
    <svg
      viewBox="0 0 24 24"
      class="vNseN iDiU7 undefined YEJsU"
      id="scoreSettingsButton_svg"
    >
      <path
        d="M5.75 12a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zM12 10.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zm7.5 0a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"
        id="scoreSettingsButton_path"
      ></path>
    </svg>
  </NIcon>
  <NModal v-model:show="visible" title="播放器设置" preset="card" transform-origin="center" class="max-w-112">
    <NForm label-placement="left" label-width="auto">
      <NFormItem label="预备拍">
        <NSwitch v-model:value="playerState.countInVolume" :checked-value="1" :unchecked-value="0" :on-update:value="changeCountInVolume" />
      </NFormItem>
      <NFormItem label="节拍器">
        <NSwitch v-model:value="playerState.metronomeVolume" :checked-value="1" :unchecked-value="0" :on-update:value="changeMetronomeVolume" />
      </NFormItem>
      <NFormItem label="循环">
        <NSwitch v-model:value="playerState.isLooping" :on-update:value="changeLooping" />
      </NFormItem>
      <NFormItem label="缩放">
        <NSlider v-model:value="playerState.scale" :step="25" :min="25" :max="200" :format-tooltip="formatTooltip" :on-update:value="setScale" :marks="scaleMarks" />
      </NFormItem>
      <NFormItem label="布局">
        <NSelect v-model:value="playerState.layout" :options="layoutOptions" :on-update:value="setLayout" />
      </NFormItem>
    </NForm>
  </NModal>
</template>
