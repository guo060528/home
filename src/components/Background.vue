<template>
  <div :class="store.backgroundShow ? 'cover show' : 'cover'">
    <img
      v-show="store.imgLoadStatus"
      :src="bgUrl"
      class="bg"
      alt="cover"
      decoding="async"
      fetchpriority="high"
      @load="imgLoadComplete"
      @error.once="imgLoadError"
    />
    <div v-show="store.imgLoadStatus" :class="store.backgroundShow ? 'gray hidden' : 'gray'" />
    <Transition name="fade" mode="out-in">
      <a
        v-if="store.backgroundShow && store.coverType != '3'"
        class="down"
        :href="bgUrl"
        target="_blank"
      >
        下载壁纸
      </a>
    </Transition>
  </div>
</template>

<script setup>
import { mainStore } from "@/store";
import { Error } from "@icon-park/vue-next";

const store = mainStore();
const bgUrl = ref(null);
const emit = defineEmits(["loadComplete"]);

// 更换壁纸链接
const changeBg = (type) => {
  if (type == 0) {
    bgUrl.value = "https://bingw.jasonzeng.dev/?resolution=1920x1080&index=random";
  } else if (type == 1) {
    // 每日一图（必应官方壁纸，302 跳转）
    bgUrl.value = "https://api.paugram.com/bing/";
  } else if (type == 3) {
    // 随机动漫
    bgUrl.value = "https://t.mwm.moe/pc";
  } else {
    // 本地壁纸已移除，兼容旧版持久化的默认壁纸选项，统一回退到随机风景
    bgUrl.value = "https://bingw.jasonzeng.dev/?resolution=1920x1080&index=random";
  }
};

// 图片加载完成
const imgLoadComplete = () => {
  // 壁纸 API 加载完成后立即显示主界面（无渐入动画）
  store.setImgLoadStatus(true);
  // 加载完成事件（欢迎语、默哀模式）
  emit("loadComplete");
};

// 图片显示失败
const imgLoadError = () => {
  console.error("壁纸加载失败：", bgUrl.value);
  ElMessage({
    message: "壁纸加载失败，已临时切换壁纸源",
    icon: h(Error, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
  // 本地壁纸已移除，回退到备用在线壁纸源（避免和当前失败的源重复）
  bgUrl.value =
    bgUrl.value === "https://api.paugram.com/bing/"
      ? "https://bingw.jasonzeng.dev/?resolution=1920x1080&index=random"
      : "https://api.paugram.com/bing/";
};

// 监听壁纸切换
watch(
  () => store.coverType,
  (value) => {
    changeBg(value);
  },
);

onMounted(() => {
  // 加载壁纸
  changeBg(store.coverType);
});
</script>

<style lang="scss" scoped>
.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: 0.25s;
  z-index: -1;

  &.show {
    z-index: 1;
  }

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    backface-visibility: hidden;
    animation: fade 0.4s ease;
  }
  .gray {
    opacity: 1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image:
      radial-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.5) 100%),
      radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%);

    transition: 1.5s;
    &.hidden {
      opacity: 0;
      transition: 1.5s;
    }
  }
  .down {
    font-size: 16px;
    color: white;
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: block;
    padding: 20px 26px;
    border-radius: 8px;
    background-color: #00000030;
    width: 120px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      transform: scale(1.05);
      background-color: #00000060;
    }
    &:active {
      transform: scale(1);
    }
  }
}
</style>
