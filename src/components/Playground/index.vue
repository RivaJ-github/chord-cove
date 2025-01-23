<script lang="ts" setup>
import useAlphaTab from '@/composables/useAlphaTab';
import { getLastFile, initDB } from '@/db';
import { ref, onMounted } from 'vue';

const playerDom = ref<HTMLElement>();

const { init, loadAudioSource } = useAlphaTab();

onMounted(() => {
  // initialize alphatab
  const settings = {
    // file: "回不去的夏天-总谱.gp",
    player: {
      enablePlayer: true,
      soundFont: "./assets/soundfont/sonivox.sf2",
      // "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2",
      scrollElement: playerDom.value!.parentNode, // this is the element to scroll during playback
    },
  };
  init(playerDom.value!, settings);

  initDB().then(getLastFile).then(loadAudioSource)
});
</script>

<template>
  <div class="w-full pbc overflow-y-auto">
    <div ref="playerDom"></div>
  </div>
</template>

<style lang="less" scoped>
.pbc {
  height: calc(100% - 3rem);
  padding-bottom: 4rem;
}
</style>
