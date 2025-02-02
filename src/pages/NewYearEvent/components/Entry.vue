<script setup lang="ts">
import { NImage } from "naive-ui";
import useStore from "../composables/useStore";
import guideImg from "~/public/assets/newYearEvent/guide.jpg";
import iconImg from "~/public/assets/newYearEvent/icon.png";

const { isTargetUsers, isEventTime, firstShow } = useStore();

const start = () => {
  firstShow.value = false;
  window.open('/new_year_event', '_blank')
};
</script>

<template>
  <div class="fixed top-0 left-0 z-2000" v-if="isTargetUsers && isEventTime">
    <div v-if="firstShow" class="w-screen h-screen bg-black" @click="start">
      <img
        class="w-full h-full object-contain object-center"
        :src="guideImg"
        alt=""
      />
      <span class="fixed bottom-12 left-0 w-full text-center text-white"
        >Click Anywhere to Open!</span
      >
    </div>
    <NImage
      v-else
      :src="iconImg"
      class="fixed bottom-12 right-0 w-12 h-12"
      alt=""
      @click="start"
      preview-disabled
    />
  </div>
</template>
