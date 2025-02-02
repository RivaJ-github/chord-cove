<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { createDiscreteApi } from "naive-ui";
import userBehavior from "./utils/log/userBehavior";
import visibilitychange from "./utils/visibilitychange";
import webConfig from "@/config";
import { getVersion } from "@/apis"

const discreteApi = createDiscreteApi(["message", "dialog"]);
window.$message = discreteApi.message;
window.$dialog = discreteApi.dialog;

let clearListener: Function | undefined;

const checkVersion = () => {
  /** 版本更新提示 */
  const { version } = webConfig;

  getVersion().then((backendVersion) => {
    if (version < backendVersion) {
      console.log(backendVersion);
      window.$dialog.info({
        content: "Chord Cove has a new version available!",
        negativeText: "Later",
        positiveText: "Try Now",
        onPositiveClick: () => {
          window.location.reload();
        },
      });
    }
  });
};

onMounted(() => {
  userBehavior.pageLoad();
  checkVersion();
  clearListener = visibilitychange(userBehavior.pageHide, () => {
    userBehavior.pageShow();

    checkVersion();
  });
});

onUnmounted(() => {
  clearListener?.();
  userBehavior.pageClose();
});
</script>

<template>
  <router-view />
</template>
