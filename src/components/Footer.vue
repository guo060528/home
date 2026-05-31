<template>
  <footer id="footer" :class="store.footerBlur ? 'blur' : null">
    <div class="power">
      <span>
        <span :class="startYear < fullYear ? 'c-hidden' : 'hidden'">Copyright&nbsp;</span>
        &copy;
        <span v-if="startYear < fullYear" class="site-start">
          {{ startYear }}
          -
        </span>
        {{ fullYear }}
        <a :href="siteUrl">{{ siteAuthor }}</a>
      </span>
      <!-- 以下信息请不要修改哦 -->
      <span class="hidden">
        &amp;&nbsp;Made&nbsp;by
        <a :href="config.github" target="_blank">
          {{ config.author }}
        </a>
      </span>
      <!-- 站点备案 -->
      <span>
        &amp;
        <a v-if="siteIcp" href="https://beian.miit.gov.cn" target="_blank">
          {{ siteIcp }}
        </a>
      </span>
    </div>
  </footer>
</template>

<script setup>
import { mainStore } from "@/store";
import config from "@/../package.json";

const store = mainStore();
const fullYear = new Date().getFullYear();

// 加载配置数据
const startYear = ref(
  import.meta.env.VITE_SITE_START && import.meta.env.VITE_SITE_START.trim().length >= 4
    ? import.meta.env.VITE_SITE_START.trim().substring(0, 4)
    : null,
);
const siteIcp = ref(import.meta.env.VITE_SITE_ICP);
const siteAuthor = ref(import.meta.env.VITE_SITE_AUTHOR);
const siteUrl = computed(() => {
  const url = import.meta.env.VITE_SITE_URL;
  if (!url) return "https://www.imsyy.top";
  // 判断协议前缀
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "//" + url;
  }
  return url;
});
</script>

<style lang="scss" scoped>
#footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 46px;
  line-height: 46px;
  text-align: center;
  z-index: 0;
  font-size: 14px;
  // 文字不换行
  word-break: keep-all;
  white-space: nowrap;
  .power {
    animation: fade 0.3s;
  }
  &.blur {
    backdrop-filter: blur(10px);
    background: rgb(0 0 0 / 25%);
    font-size: 16px;
  }
  @media (max-width: 720px) {
    font-size: 0.9rem;
    &.blur {
      font-size: 0.9rem;
    }
  }
  @media (max-width: 560px) {
    .c-hidden {
      display: none;
    }
  }
  @media (max-width: 480px) {
    .hidden {
      display: none;
    }
  }
}
</style>
