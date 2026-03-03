# OpenClaw 安装部署教程

## 一、部署方式总览

### 按小白友好程度分类

| 分类 | 方式 | 难度 | 适合人群 |
|------|------|------|----------|
| 🐣 **纯小白** | EasyClaw UI 版 | ⭐ | 不想懂技术，只想用起来 |
| 🐥 **小白** | 安装器脚本 + Mac mini | ⭐ | 有 Mac 电脑，想本地运行 |
| 🐤 **进阶** | npm/pnpm 全局安装 | ⭐⭐ | 有点技术基础 |
| 🦅 **老手** | Docker / 云平台一键部署 | ⭐⭐⭐ | 想服务器托管/24h运行 |
| 🛠️ **开发者** | 源代码安装 | ⭐⭐⭐ | 开发者/贡献者 |

---

## 二、🐣 最简单：EasyClaw（推荐小白）

> EasyClaw 是基于 OpenClaw 的简单模式 UI 层，通过自然语言规则交互，无需配置 skills 或 workflows。

```bash
# 安装 EasyClaw
git clone https://github.com/gaoyangz77/easyclaw.git
cd easyclaw
npm install
npm start
```

**特点：**
- 🌟 112+ Stars
- 🎨 Web UI 界面
- 📝 自然语言配置规则
- 🔄 Agent 可自我进化、适应主人

**GitHub:** https://github.com/gaoyangz77/easyclaw

---

## 三、🐥 小白友好：Mac mini 本地安装

### 方式一：安装器脚本（最简单）

```bash
# Mac 打开终端，运行：
curl -fsSL https://openclaw.ai/install.sh | bash
```

然后按提示操作即可。

### 方式二：Mac mini + 树莓派组合
- Mac mini 作为主力处理
- 树莓派作为消息入口（可选）

---

## 四、🦅 老手之选：云平台一键部署

### 1. Fly.io（推荐）

免费额度充足，全球分布，一键部署：

```bash
# 安装 flyctl
brew install flyctl

# 部署
fly launch
fly deploy
```

详细教程：[https://docs.openclaw.ai/zh-CN/install/fly](https://docs.openclaw.ai/zh-CN/install/fly)

### 2. Railway

```bash
# 通过 GitHub 授权一键部署
# 1. 访问 https://railway.app
# 2. New Project → Deploy from GitHub repo
# 3. 选择 openclaw 仓库
```

### 3. Render

免费 tier 可用，详见：[https://docs.openclaw.ai/zh-CN/install/render](https://docs.openclaw.ai/zh-CN/install/render)

### 4. 一键部署链接

| 平台 | 一键部署 |
|------|----------|
| Fly.io | [Deploy](https://fly.io/launch/github/openclaw/openclaw) |
| Railway | [Deploy](https://railway.app/new?template=https://github.com/openclaw/openclaw) |

---

## 五、🛠️ 进阶：本地手动安装

### 1. 安装器脚本

```bash
# macOS / Linux
curl -fsSL https://openclaw.ai/install.sh | bash

# Windows (PowerShell)
iwr -useb https://openclaw.ai/install.ps1 | iex

# 然后初始化
openclaw onboard --install-daemon
```

### 2. npm/pnpm 全局安装

```bash
# npm
npm install -g openclaw@latest

# pnpm
pnpm add -g openclaw@latest
pnpm approve-builds -g  # 批准构建脚本
pnpm add -g openclaw@latest

# 初始化
openclaw onboard --install-daemon
```

**遇到 sharp 构建问题？**
```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

### 3. Docker 部署

```bash
docker pull openclaw/openclaw

docker run -d \
  --name openclaw \
  -v ~/.openclaw:/home/node/.openclaw \
  -p 8080:8080 \
  openclaw/openclaw
```

---

## 六、🛠️ 开发者：从源代码安装

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm build
openclaw onboard --install-daemon
```

---

## 七、VPS 远程托管

适用于需要 24/7 运行、不依赖本地电脑的场景。

### 支持的平台：
- **Fly.io** - 免费额度，全球访问
- **Railway** - 按需付费
- **Render** - 免费 tier
- **Hetzner** - 欧洲 VPS，性价比高
- **GCP** - Google Cloud
- **DigitalOcean** - VPS

详细教程：[https://docs.openclaw.ai/zh-CN/vps](https://docs.openclaw.ai/zh-CN/vps)

---

## 八、安装后检查

```bash
# 健康检查
openclaw doctor

# 查看状态
openclaw status

# 打开仪表板
openclaw dashboard
```

---

## 九、系统要求

| 方式 | 要求 |
|------|------|
| 安装器/npm | Node.js >= 22 |
| 源代码 | Node.js >= 22 + pnpm |
| Docker | Docker 已安装 |
| 云平台 | 浏览器 + GitHub 账号 |

---

## 十、推荐选择

| 你是谁 | 推荐方案 |
|--------|----------|
| 🎯 不想懂技术 | **EasyClaw** |
| 🖥️ 有 Mac 想本地用 | **安装器脚本** |
| 🌍 想 24/7 运行 | **Fly.io 一键部署** |
| 💻 开发者 | **源代码安装** |

---

## 十一、常见问题

**Q: 找不到 openclaw 命令？**
```bash
# 添加到 PATH (~/.zshrc)
export PATH="$(npm prefix -g)/bin:$PATH"
source ~/.zshrc
```

**Q: 如何更新？**
```bash
openclaw update
```

**Q: 如何卸载？**
```bash
openclaw uninstall
```

---

> 📖 更多文档：[OpenClaw 官方安装文档](https://docs.openclaw.ai/zh-CN/install)
