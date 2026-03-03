# OpenClaw 安装部署教程

## 一、官方参考资料

### 🌐 OpenClaw官方网站

| 名称 | 地址 | 说明 |
|------|------|------|
| **OpenClaw 官网** | https://openclaw.ai | 官方网站 |
| **OpenClaw 文档** | https://docs.openclaw.ai | 官方文档（中文） |
| **ClawHub 技能市场** | https://clawhub.com | Skills 技能库 ，搜了下clawhub也是一堆A货，大家认准这个网站|
| **GitHub 仓库** | https://github.com/openclaw/openclaw | 源代码 |
| **Discord 社区** | https://discord.com/invite/clawd | 社区交流 |


### 🌐 其他官方网站

| 名称 | 地址 | 说明 |
|------|------|------|
| **OpenClaw 官网** | https://openclaw.ai | 官方网站 |
| **OpenClaw 文档** | https://docs.openclaw.ai | 官方文档（中文） |
| **ClawHub 技能市场** | https://clawhub.com | Skills 技能库 ，百度直接搜clawhub也会冒出一堆A货，大家认准这个网址|
| **GitHub 仓库** | https://github.com/openclaw/openclaw | 源代码 |
| **Discord 社区** | https://discord.com/invite/clawd | 社区交流 |

---

### 📚 官方文档目录

- **安装指南**: https://docs.openclaw.ai/zh-CN/install
- **配置参考**: https://docs.openclaw.ai/zh-CN/gateway/configuration
- **消息渠道**: https://docs.openclaw.ai/zh-CN/channels/index
- **工具 Skill**: https://docs.openclaw.ai/zh-CN/tools/skills
- **API 参考**: https://docs.openclaw.ai/zh-CN/reference/rpc

---

## 二、部署方式总览

### 按小白友好程度分类

| 分类 | 方式 | 难度 | 适合人群 |
|------|------|------|----------|
| 🐣 **纯小白** | EasyClaw UI 版 | ⭐ | 不想懂技术，只想用起来，但傅盛大佬展示的扩展功能也是要花时间处理的，买了龙虾养龙虾也是重服务模式 |
| 🐤 **适中主推** | | 云服务厂商推的一键安装⭐⭐ | 先用起来比较推荐这个模式，没那么复杂，扩展性依赖厂商自己的迭代 |
| 🐥 **扩展好** | 开源官方安装 + 服务器 | ⭐⭐⭐ | 只要愿意看官方文档，小白勇猛点也一样可以，扩展性高 |

---

## 三、🐣 最简单：EasyClaw（推荐小白）

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

## 四、🦅 云服务厂商

### 为什么选云服务厂商？
- 集成服务一键部署更方便
- 推广有优惠

### 腾讯云服务器安装步骤

#### 1. 购买服务器
- 访问 https://cloud.tencent.com
- 选择轻量应用服务器（Lighthouse）或 CVM
- 推荐配置：2核4G / 4核8G
- 系统选择：Ubuntu 22.04 或 CentOS 8

#### 2. 连接服务器
```bash
# Mac 打开终端
ssh root@你的服务器IP

# Windows 使用 Putty 或 Xshell
```

#### 3. 安装 Docker（推荐）

```bash
# Ubuntu/Debian
apt update && apt install -y docker.io docker-compose
systemctl start docker
systemctl enable docker

# CentOS
yum install -y docker
systemctl start docker
systemctl enable docker
```

#### 4. 部署 OpenClaw

```bash
# 方式一：Docker 部署
docker pull openclaw/openclaw

docker run -d \
  --name openclaw \
  -v ~/.openclaw:/home/node/.openclaw \
  -p 8080:8080 \
  -e OPENCLAW_API_KEY=your_api_key \
  openclaw/openclaw

# 方式二：安装器脚本
curl -fsSL https://openclaw.ai/install.sh | bash
```

#### 5. 配置域名（可选）
- 腾讯云 DNS 解析
- 配置 HTTPS 证书

---

## 五、云平台一键部署

### 1. Fly.io（推荐）

免费额度充足，全球分布：

```bash
# 安装 flyctl
brew install flyctl

# 部署
fly launch
fly deploy
```

**一键部署：** https://fly.io/launch/github/openclaw/openclaw

### 2. Railway

```bash
# 1. 访问 https://railway.app
# 2. New Project → Deploy from GitHub repo
# 3. 选择 openclaw 仓库
```

**一键部署：** https://railway.app/new?template=https://github.com/openclaw/openclaw

### 3. Render

详细教程：https://docs.openclaw.ai/zh-CN/install/render

---

## 六、本地安装（Mac/PC）

### 1. 安装器脚本

```bash
# macOS / Linux
curl -fsSL https://openclaw.ai/install.sh | bash

# Windows (PowerShell)
iwr -useb https://openclaw.ai/install.ps1 | iex

# 初始化
openclaw onboard --install-daemon
```

### 2. npm/pnpm 全局安装

```bash
# npm
npm install -g openclaw@latest

# pnpm
pnpm add -g openclaw@latest
pnpm approve-builds -g
pnpm add -g openclaw@latest
```

---

## 七、🛠️ 开发者：源代码安装

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm build
openclaw onboard --install-daemon
```

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

| 场景 | 推荐方案 |
|------|----------|
| 🎯 不想懂技术 | **EasyClaw** |
| 🖥️ 国内服务器 | **腾讯云 + Docker** |
| 🖥️ 有 Mac 想本地用 | **安装器脚本** |
| 🌍 想 24/7 运行 | **腾讯云 / Fly.io** |
| 💻 开发者 | **源代码安装** |

---

## 十一、常见问题

**Q: 找不到 openclaw 命令？**
```bash
# 添加到 PATH
export PATH="$(npm prefix -g)/bin:$PATH"
source ~/.zshrc
```

**Q: 国内服务器访问慢？**
- 使用国内镜像源
- 腾讯云 COS 存储

**Q: 如何更新？**
```bash
openclaw update
```

---

> 📖 更多文档：[OpenClaw 官方文档](https://docs.openclaw.ai/zh-CN)
> 🎯 技能市场：[ClawHub](https://clawhub.com)
