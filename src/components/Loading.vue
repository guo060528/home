<template>
  <Transition name="loading-fade">
    <div v-if="!store.imgLoadStatus" id="loader-wrapper">
      <div class="loader">
        <div class="loader-text">
          <span class="name">
            {{ siteName }}
          </span>
          <span class="tip"> 加载中 </span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { mainStore } from "@/store";

const store = mainStore();

// 配置
const siteName = import.meta.env.VITE_SITE_NAME;
</script>

<style lang="scss" scoped>
#loader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background: #333;
  overflow: hidden;
  .loader {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .loader-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #fff;
      font-size: 24px;
      .tip {
        margin-top: 6px;
        font-size: 18px;
        opacity: 0.6;
      }
    }
  }
}

// 淡出过渡
.loading-fade-leave-active {
  transition: opacity 0.4s ease-out;
}

.loading-fade-leave-to {
  opacity: 0;
}
</style>
