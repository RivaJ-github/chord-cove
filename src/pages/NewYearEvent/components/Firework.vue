<script setup lang="ts">
import { onMounted, ref } from "vue";
import { loadScript } from "@/utils/scripts";
import useStore from "../composables/useStore";
import { logHub, delay } from "@/utils"

const { letterShowen } = useStore();

const $close = ref();

const letter = [
  "新年好，朋友们～",
  "过去的一年，我们在各自的生活中努力前行，经历了欢笑、经历了挑战、经历了悲伤。过去的每时每刻，都已成为我们生命中不可磨灭的一部分。感谢有你们的陪伴，让过去的美好温暖未来的生活，将过去的挫折化为继续前进的力量。",
  "新的一年，希望我们都能遇到更多美好的事物。愿在追求梦想的道路上，不再有迷茫和困惑。",
  "也愿你们的生活中，总是充满欢声笑语。希望你们能遇到更多志同道合的朋友，一起分享生活中的点滴，创造更多难忘的回忆。愿你们的每一天，都能被爱与希望所包围，让心灵始终感受到温暖与安宁。",
  "最后，衷心祝愿你们的新的一年，温暖而热烈～",
  "疯狂地点击屏幕吧～",
];

const dynamicContent = ref<any[]>([]);

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

  if (audioContext && audioSource) {
    // 确保音频上下文是激活状态
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    try {
      audioSource.start(0);
    } catch (e) {
      console.log("Audio already started");
    }

    document.addEventListener(
      "click",
      () => {
        console.log('click', audioContext)
        if (audioContext.state === "suspended") {
          audioContext.resume();
        }
      },
      { once: true }
    );
  }
};

const typeWriter = async (delay = 120) => {
  for (let i = 0; i < letter.length; i++) {
    dynamicContent.value.push({
      text: "",
      hideCursor: false,
    });

    for (let j = 0; j < letter[i].length; j++) {
      dynamicContent.value[i].text += letter[i][j];
      await new Promise((r) => setTimeout(r, delay));
    }
    await new Promise((r) => setTimeout(r, 800));
  }
};

onMounted(() => {
  logHub('Firework Opened')

  loadScript("https://yun.tuisnake.com/fitymberbf622qfcnlocf.js")
    .then(async () => {
      await delay(500)
      if (!letterShowen.value) {
        await typeWriter();
        logHub('Letter received')
      }
    })
    .then(() => {
      letterShowen.value = true;
    });
  initBackgroundMusic();
});
</script>

<template>
  <div class="fixed inset-0 z-60">
    <div class="absolute top-8 left-4 text-white" style="font-size: 1rem">
      <div
        v-for="(item, index) in dynamicContent"
        :key="index"
        :class="`textLine ${item.hideCursor ? 'hideCursor' : ''}`"
      >
        {{ item.text }}
      </div>
    </div>
    <div class="loading-init">
      <div class="loading-init__header"></div>
      <div class="loading-init__status"></div>
    </div>
    <div class="stage-container remove">
      <div class="canvas-container">
        <canvas id="trails-canvas"></canvas>
        <canvas id="main-canvas"></canvas>
      </div>
      <div class="controls">
        <div class="btn pause-btn">
          <svg fill="white" width="24" height="24">
            <use href="#icon-pause" xlink:href="#icon-pause"></use>
          </svg>
        </div>
        <div class="btn sound-btn">
          <svg fill="white" width="24" height="24">
            <use href="#icon-sound-off" xlink:href="#icon-sound-off"></use>
          </svg>
        </div>
        <div class="btn settings-btn">
          <svg fill="white" width="24" height="24">
            <use href="#icon-settings" xlink:href="#icon-settings"></use>
          </svg>
        </div>
      </div>
      <div class="hide menu">
        <div class="menu__inner-wrap">
          <div class="menu__header">设置</div>
          <form>
            <div class="form-option form-option--select">
              <label class="shell-type-label">烟花类型</label>
              <select class="shell-type"></select>
            </div>
            <div class="form-option form-option--select">
              <label class="shell-size-label">烟花大小</label>
              <select class="shell-size"></select>
            </div>
            <div class="form-option form-option--select">
              <label class="quality-ui-label">画质</label>
              <select class="quality-ui"></select>
            </div>
            <div class="form-option form-option--select">
              <label class="sky-lighting-label">照亮天空</label>
              <select class="sky-lighting"></select>
            </div>
            <div class="form-option form-option--select">
              <label class="scaleFactor-label">缩放</label>
              <select class="scaleFactor"></select>
            </div>
            <div class="form-option form-option--checkbox">
              <label class="word-shell-label">文字烟花</label>
              <input class="word-shell" type="checkbox" />
            </div>
            <div class="form-option form-option--checkbox">
              <label class="auto-launch-label">自动放烟花</label>
              <input class="auto-launch" type="checkbox" />
            </div>
            <div
              class="form-option form-option--checkbox form-option--finale-mode"
            >
              <label class="finale-mode-label">同时放更多的烟花</label>
              <input class="finale-mode" type="checkbox" />
            </div>
            <div class="form-option form-option--checkbox">
              <label class="hide-controls-label">隐藏控制按钮</label>
              <input class="hide-controls" type="checkbox" />
            </div>
            <div
              class="form-option form-option--checkbox form-option--fullscreen"
            >
              <label class="fullscreen-label">全屏</label>
              <input class="fullscreen" type="checkbox" />
            </div>
            <div class="form-option form-option--checkbox">
              <label class="long-exposure-label">保留烟花的火花</label>
              <input class="long-exposure" type="checkbox" />
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="help-modal">
      <div class="help-modal__overlay"></div>
      <div class="help-modal__dialog">
        <div class="help-modal__header"></div>
        <div class="help-modal__body"></div>
        <button ref="$close" type="button" class="help-modal__close-btn">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@rem: 200rem;

.hide {
  opacity: 0;
  visibility: hidden;
}

.blur {
  filter: blur(12px);
  filter: blur(12px);
}

.container {
  display: box;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}

.loadingInit {
  width: 100%;
  align-self: center;
  text-align: center;
  text-transform: uppercase;
}

.loadingInit_header {
  font-size: 2.2em;
}

.loadingInit_status {
  margin-top: 1em;
  font-size: 0.8em;
  opacity: 0.75;
}

.stageContainer {
  overflow: hidden;
  box-sizing: initial;
  border: 1px solid #222;
  margin: -1px;
}

@media (max-width: 840px) {
  .stageContainer {
    border: none;
    margin: 0;
  }
}

.canvasContainer {
  width: 100%;
  height: 100%;
  transition: filter 0.3s;
  transition: filter 0.3s;
  transition: filter 0.3s;
  transition: filter 0.3s, -webkit-filter 0.3s;
}

.canvasContainer canvas {
  position: absolute;
  mix-blend-mode: lighten;
  transform: translateZ(0);
  transform: translateZ(0);
}

.canvas-container {
  width: 100%;
  height: 100%;
  transition: filter 0.3s;
  transition: filter 0.3s;
  transition: filter 0.3s;
  transition: filter 0.3s, -webkit-filter 0.3s;
}

.canvas-container canvas {
  position: absolute;
  mix-blend-mode: lighten;
  transform: translateZ(0);
  transform: translateZ(0);
}

.controls {
  position: absolute;
  top: -100px;
  width: 100%;
  padding-bottom: 50px;
  display: box;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  transition: opacity 0.3s, visibility 0.3s;
  transition: opacity 0.3s, visibility 0.3s;
}

@media (min-width: 840px) {
  .controls {
    visibility: visible;
  }

  .controls.hide:hover {
    opacity: 1;
  }
}

.menu {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.42);
  transition: opacity 0.3s, visibility 0.3s;
  transition: opacity 0.3s, visibility 0.3s;
}

.menu_innerWrap {
  display: box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transition: opacity 0.3s;
  transition: opacity 0.3s;
}

.menu_header {
  margin-top: auto;
  margin-bottom: 8px;
  padding-top: 16px;
  font-size: 2em;
  text-transform: uppercase;
}

.menu_subheader {
  margin-bottom: auto;
  padding-bottom: 12px;
  font-size: 0.86em;
  opacity: 0.8;
}

.menu form {
  width: 100%;
  max-width: 400px;
  padding: 0 10px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.menu .formOption {
  display: box;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  margin: 16px 0;
  transition: opacity 0.3s;
  transition: opacity 0.3s;
}

.menu .formOption label {
  display: block;
  width: 50%;
  padding-right: 12px;
  text-align: right;
  text-transform: uppercase;
  user-select: none;
  user-select: none;
  user-select: none;
  user-select: none;
}

.menu .formOption_select select {
  display: block;
  width: 50%;
  height: 30px;
  font-size: 1rem;
  font-family: "Russo One", arial, sans-serif;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.06em;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.menu .formOption_select select option {
  background-color: black;
}

.menu .formOption_checkbox input {
  display: block;
  width: 26px;
  height: 26px;
  margin: 0;
  opacity: 0.5;
}

@media (max-width: 840px) {
  .menu .formOption select,
  .menu .formOption input {
    outline: none;
  }
}

.closeMenuBtn {
  position: absolute;
  top: 0;
  right: 0;
}

.btn {
  opacity: 0.16;
  width: 50px;
  height: 50px;
  display: box;
  display: flex;
  user-select: none;
  user-select: none;
  user-select: none;
  user-select: none;
  cursor: default;
  transition: opacity 0.3s;
  transition: opacity 0.3s;
}

.btn_bright {
  opacity: 0.5;
}

@media (min-width: 840px) {
  .btn:hover {
    opacity: 0.32;
  }

  .btn_bright:hover {
    opacity: 0.75;
  }
}

.btn svg {
  display: block;
  margin: auto;
}

.credits {
  margin-top: auto;
  margin-bottom: 10px;
  padding-top: 6px;
  font-size: 0.8em;
  opacity: 0.75;
}

.credits a {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
}

.credits a:hover,
.credits a:active {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: underline;
}

.helpModal {
  display: box;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  visibility: hidden;
  transition-property: visibility;
  transition-property: visibility;
  transition-duration: 0.25s;
  transition-duration: 0.25s;
}

.helpModal_overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
  transition-property: opacity;
  transition-property: opacity;
  transition-timing-function: ease-in;
  transition-timing-function: ease-in;
  transition-duration: 0.25s;
  transition-duration: 0.25s;
}

.helpModal_dialog {
  display: box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  max-width: 400px;
  max-height: calc(100vh - 100px);
  margin: 10px;
  padding: 20px;
  border-radius: 0.3em;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transform: scale(0.9, 0.9);
  transform: scale(0.9, 0.9);
  transition-property: opacity, -webkit-transform;
  transition-property: opacity, -webkit-transform;
  transition-property: opacity, transform;
  transition-property: opacity, transform, -webkit-transform;
  transition-timing-function: ease-in;
  transition-timing-function: ease-in;
  transition-duration: 0.25s;
  transition-duration: 0.25s;
}

@media (min-width: 840px) {
  .helpModal_dialog {
    font-size: 1.25rem;
    max-width: 500px;
  }
}

.helpModal_header {
  font-size: 1.75em;
  text-transform: uppercase;
  text-align: center;
}

.helpModal_body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  margin: 1em 0;
  padding: 1em 0;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.75);
}

.helpModal_closeBtn {
  flex-shrink: 0;
  outline: none;
  border: none;
  border-radius: 2px;
  padding: 0.25em 0.75em;
  margin-top: 0.36em;
  font-family: "Russo One", arial, sans-serif;
  font-size: 1em;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background-color: rgba(255, 255, 255, 0.25);
  transition: color 0.3s, background-color 0.3s;
  transition: color 0.3s, background-color 0.3s;
}

.helpModal_closeBtn:hover,
.helpModal_closeBtn:active,
.helpModal_closeBtn:focus {
  color: #fff;
  background-color: #09f;
}

.helpModal.active {
  visibility: visible;
  transition-duration: 0.4s;
  transition-duration: 0.4s;
}

.helpModal.active .helpModal_overlay {
  opacity: 1;
  transition-timing-function: ease-out;
  transition-timing-function: ease-out;
  transition-duration: 0.4s;
  transition-duration: 0.4s;
}

.helpModal.active .helpModal_dialog {
  opacity: 1;
  transform: scale(1, 1);
  transform: scale(1, 1);
  transition-timing-function: ease-out;
  transition-timing-function: ease-out;
  transition-duration: 0.4s;
  transition-duration: 0.4s;
}

.textLine {
  white-space: pre-line;
  text-shadow: 0 0 5px rgba(100, 100, 100, 0.5);
  margin-bottom: 4px;
  position: relative;
  padding-top: 0.3rem;
  width: 58vw;

  &:last-child {
    &::after {
      content: "";
      position: absolute;
      bottom: 0px;
      width: 12px;
      height: 20px;
      background-color: #fff;
      margin-left: 4px;
      animation: cursor-blink 1s infinite;
      opacity: 0;
      transition: opacity 0.3s;
    }
  }
}

.hideCursor {
  &:last-child::after {
    display: none;
  }
}

@keyframes cursor-blink {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

.contentWrapper {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.typeWords {
  position: fixed;
  top: 20px;
  left: 20px;
  text-align: left;
  color: #fff;
  font-weight: 600;
  font-size: 38 / @rem;
  width: 100%;
  padding: 60px 60px 20px 0px;
  z-index: 999;
}

.wxReady {
  .typeWords {
    // 确保在微信环境下正确渲染
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;

    position: fixed;
    top: 20px;
    left: 20px;
    text-align: left;
    color: #fff;
    font-weight: 600;
    font-size: 38 / @rem;
    width: 100%;
    padding: 60px 60px 20px 0px;
    z-index: 999;
  }
}

.textLine {
  // ... 原有样式
  position: relative;
  opacity: 1;
  visibility: visible;
  transform: none;
  -webkit-transform: none;
}
</style>
