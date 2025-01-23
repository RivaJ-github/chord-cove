<!-- 乐谱播放器 -->
<script lang="ts" setup>
import useAlphaTab from "@/composables/useAlphaTab";
import { NSpin } from "naive-ui";
import Playground from "@/components/Playground/index.vue"
import PlaygroundControls from "@/components/Playground/Controls/index.vue"

const { scoreState } = useAlphaTab();
</script>

<template>
  <NSpin :show="scoreState.loadingMusicScore">
    <template #description> Score Loading ... </template>
    <div class="w-screen h-screen">
      <Playground />
      <PlaygroundControls />
    </div>
  </NSpin>
</template>
