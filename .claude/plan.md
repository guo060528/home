# 项目更新和音乐功能移除计划

## 任务概述
1. 更新项目依赖到最新版本
2. 删除所有音乐播放相关功能
3. 检查并修复代码bug
4. 确保GitHub Actions能正常执行

## 代码分析结果

### 音乐功能涉及的文件
通过代码审查，音乐播放功能涉及以下文件：

**核心组件：**
- `src/components/Music.vue` - 音乐控制面板组件
- `src/components/Player.vue` - APlayer播放器封装组件

**引用音乐功能的文件：**
- `src/views/Func/index.vue` - 引入Music组件（第8行，条件渲染）
- `src/components/Hitokoto.vue` - 显示"打开音乐播放器"按钮
- `src/components/Footer.vue` - 显示歌词（第4、31-39行）
- `src/components/Set.vue` - 音乐相关设置项（第25-32、34-40、52-81行）
- `src/store/index.js` - 音乐相关状态管理
- `src/api/index.js` - 音乐API（getPlayerList函数）

**依赖包：**
- `@worstone/vue-aplayer` - Vue APlayer组件
- `aplayer` - APlayer核心库
- `fetch-jsonp` - 用于音乐API的JSONP请求

**环境变量（.env）：**
- `VITE_SONG_API`
- `VITE_SONG_SERVER`
- `VITE_SONG_TYPE`
- `VITE_SONG_ID`

### GitHub Actions分析
- 文件：`.github/workflows/build.yml`
- 当前问题：使用npm install但package.json中依赖未安装
- 触发分支：dev, dev-new, master
- Node版本：18.x
- 需要.env文件（从.env.example复制，但项目中没有.env.example）

### 依赖版本更新需求
根据npm outdated输出，需要更新的包：
- pinia: 2.1.7 → 2.3.1（Latest: 3.0.4，但3.x可能有breaking changes）
- pinia-plugin-persistedstate: 3.2.1 → 3.2.3（Latest: 4.7.1）
- axios: 1.6.8 → 1.16.1
- dayjs: 1.11.10 → 1.11.21
- element-plus: 2.7.1 → 2.14.1
- vue: 3.4.24 → 3.5.35
- swiper: 11.1.1 → 11.2.10（Latest: 12.2.0）
- lodash-es: 4.17.21 → 4.18.1

### 潜在Bug
1. **Footer.vue第55行**：可选链使用不当，`import.meta.env.VITE_SITE_START?.length` 在环境变量为空字符串时会返回0而非null
2. **GitHub Actions**：缺少.env.example文件，但workflow中尝试复制它
3. **音乐功能**：VITE_SONG_ID在.env中设为空字符串，但代码中没有完全处理空ID的情况

## 实施计划

### 阶段1：删除音乐播放功能

#### 1.1 删除音乐组件文件
- 删除 `src/components/Music.vue`
- 删除 `src/components/Player.vue`

#### 1.2 修改引用音乐功能的组件

**src/views/Func/index.vue：**
- 移除Music组件导入（第34行）
- 移除Music组件使用（第8行）
- 移除playerHasId相关代码（第44-45行）

**src/components/Hitokoto.vue：**
- 移除"打开音乐播放器"按钮相关代码（第10-19行）
- 移除MusicMenu图标导入（第31行）
- 移除openMusicShow状态（第38-39行）
- 移除鼠标事件处理（第5-6行的@mouseenter/@mouseleave）
- 简化样式，移除.open-music相关样式

**src/components/Footer.vue：**
- 移除歌词显示逻辑（第4、31-39行）
- 移除MusicOne图标导入（第45行）
- 简化为只显示版权信息
- 移除.lrc相关样式

**src/components/Set.vue：**
- 移除"音乐点击是否打开面板"设置项（第25-32行）
- 移除"底栏歌词显示"设置项（第34-40行）
- 移除"播放器配置"整个折叠面板（第52-81行）
- 移除相关的storeToRefs引用（第98、99、101-103行）

#### 1.3 清理Store状态管理

**src/store/index.js：**
移除以下状态：
- musicClick
- musicIsOk
- musicVolume
- musicOpenState
- playerState
- playerTitle
- playerArtist
- playerLrc
- playerLrcShow
- playerAutoplay
- playerLoop
- playerOrder

移除以下getters：
- getPlayerLrc
- getPlayerData

移除以下actions：
- setPlayerState
- setPlayerLrc
- setPlayerData

更新persist配置，移除音乐相关的持久化路径

#### 1.4 清理API

**src/api/index.js：**
- 删除getPlayerList函数（第8-40行）
- 移除fetch-jsonp导入（第2行）

#### 1.5 清理环境变量

**.env：**
- 删除VITE_SONG_API
- 删除VITE_SONG_SERVER
- 删除VITE_SONG_TYPE
- 删除VITE_SONG_ID
- 删除相关注释

#### 1.6 更新package.json
移除依赖：
- @worstone/vue-aplayer
- aplayer
- fetch-jsonp

### 阶段2：版本更新

#### 2.1 更新主要依赖
更新以下包到推荐版本（避免breaking changes）：
- vue: ^3.5.35
- element-plus: ^2.14.1
- pinia: ^2.3.1
- pinia-plugin-persistedstate: ^3.2.3
- axios: ^1.16.1
- dayjs: ^1.11.21
- lodash-es: ^4.18.1
- swiper: ^11.2.10

#### 2.2 更新开发依赖
- vite: ^4.5.3 → 检查是否有更新
- @vitejs/plugin-vue: ^4.6.2 → 检查更新
- sass: ^1.75.0 → 检查更新
- eslint: ^8.57.0 → 保持（9.x有breaking changes）

### 阶段3：Bug修复

#### 3.1 修复Footer.vue的环境变量处理
```javascript
const startYear = ref(
  import.meta.env.VITE_SITE_START && import.meta.env.VITE_SITE_START.length >= 4
    ? import.meta.env.VITE_SITE_START.substring(0, 4)
    : null
);
```

#### 3.2 创建.env.example文件
复制.env内容，但将敏感信息替换为示例值

#### 3.3 修复.env中的VITE_SITE_START
当前值为" 2025"（前面有空格），应改为"2025"

### 阶段4：GitHub Actions优化

#### 4.1 更新workflow配置
- 确认Node版本（当前18.x，可考虑升级到20.x）
- 添加依赖缓存以加速构建
- 确保.env.example存在

#### 4.2 测试构建
本地运行构建命令确保无错误

### 阶段5：验证

#### 5.1 本地测试
- 运行 `npm install` 安装依赖
- 运行 `npm run dev` 启动开发服务器
- 检查所有功能是否正常
- 确认没有音乐相关的UI元素

#### 5.2 构建测试
- 运行 `npm run build` 确保构建成功
- 检查构建产物

#### 5.3 代码质量检查
- 运行 `npm run lint` 检查代码规范
- 运行 `npm run format` 格式化代码

## 风险评估

### 高风险
- 删除音乐功能可能影响用户体验（但这是需求）
- 版本更新可能引入breaking changes

### 中风险
- Store状态清理可能遗漏某些引用
- 样式调整可能影响布局

### 低风险
- 环境变量清理
- 依赖包移除

## 回滚策略
- 所有更改在dev-new分支进行
- 提交前确保本地测试通过
- 分阶段提交，便于回滚

## 预期结果
1. ✅ 项目中完全移除音乐播放功能
2. ✅ 所有依赖更新到稳定的最新版本
3. ✅ 修复已知bug
4. ✅ GitHub Actions能正常构建和部署
5. ✅ 代码通过lint检查
6. ✅ 应用能正常运行，UI完整（除音乐功能外）
