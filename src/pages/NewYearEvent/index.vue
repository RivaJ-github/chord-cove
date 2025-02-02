<script setup lang="ts">
import Firework from "./components/Firework.vue";
import { onMounted } from "vue";

let audioContext: any, audioSource: any;
const initBackgroundMusic = async () => {
  try {
    // 创建独立的音频上下文
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    // 加载音频
    const response = await fetch(
      "https://yun.dui88.com/jjq/videos/wf2pd5exu_ccq8lealslb.m4a"
    );
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // 创建并配置音频源
    // 如果存在之前的音源，先断开连接
    if (audioSource) {
      try {
        audioSource.disconnect();
      } catch (e) {
        console.log("Previous source already disconnected");
      }
    }
    // 创建新的音源
    audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(audioContext.destination);
    audioSource.loop = true;
  } catch (error) {
    console.error("Error initializing background music:", error);
  }
};

onMounted(() => {
  initBackgroundMusic();
});
</script>

<template>
  <Firework/>
</template>
