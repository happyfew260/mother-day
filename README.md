# 母亲节快乐 · 2026.05.10（高级感静态网页）

一页温柔、优雅、真挚的母亲节祝福静态网页：渐变光晕背景、康乃馨花瓣飘落、滚动浮现、留言引文展示，移动端优先适配，可一键部署到 GitHub Pages。

## 主要特性

- **纪念日期标识**：页面醒目展示「2026年5月10日 母亲节 / 2026.05.10」
- **高级感氛围**：多层径向渐变 + 微光粒子 + 磨砂玻璃卡片 + 淡金描边
- **流畅微交互**：按钮柔光扩散、卡片悬停上浮、文字呼吸感动画
- **花瓣飘落系统（TS）**：`PetalSystem` 使用 `requestAnimationFrame` 驱动，随机大小/透明度/速度/摆动
- **滚动浮现（TS）**：`ScrollReveal` 使用 `IntersectionObserver`
- **滚动渐变（TS）**：`ScrollColorShift` 监听滚动写入 CSS 变量 `--shift`
- **留言板（TS）**：`MessageBoard` 展开输入、提交生成引文、单条删除、重置清空

## 技术栈

- HTML5（语义化结构）
- CSS3（自定义属性 / Grid / Flex / 渐变 / 关键帧 / 过渡）
- TypeScript（严格模式，零框架）
- Vite（构建打包到 `dist/`，JS/CSS 默认带哈希命名）

## 目录结构

```text
mother-day/
├── src/
│   ├── ts/          TypeScript 源码
│   ├── css/         样式
│   └── assets/      静态资源（可自行放入照片/图标）
├── dist/            构建输出（运行 build 后生成）
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.js
```

## 本地运行

> 需要 Node.js（推荐 20+）

```bash
npm install
npm run dev
```

然后打开终端输出的本地地址即可预览。

## 构建打包

```bash
npm run build
```

构建产物会输出到 `dist/`，可直接用于静态托管。

## 部署到 GitHub Pages（GitHub Actions 自动部署）

本项目已包含 `.github/workflows/deploy.yml`：

1. 将仓库默认分支设为 `main`
2. 推送代码到 GitHub（`git push origin main`）
3. 等待 Actions 执行完成后，会生成/更新 `gh-pages` 分支
4. 在 GitHub 仓库设置中启用 Pages：
   - **Settings → Pages**
   - **Source** 选择 `Deploy from a branch`
   - **Branch** 选择 `gh-pages` / `(root)`

### 关于路径（base）说明

`vite.config.js` 中已设置 `base: './'`，通常能在 GitHub Pages 的子路径下正常加载资源。

如果你想使用固定仓库名路径（例如仓库叫 `mother-day`），也可以改成：

```js
base: '/mother-day/'
```

## 给妈妈的祝福语（可直接复制）

> 妈妈，母亲节快乐。谢谢你把爱藏进每一次细心的叮咛里，把温柔留给了家。愿你的每一天都被善意拥抱，愿你在自己的世界里，也一直闪闪发光。

---

Made with love by **Your Name**.

