# OpenClaw 安装部署教程

## 一、部署方式总览

| 方式 | 难度 | 适用场景 | 推荐度 |
|------|------|----------|--------|
| 安装器脚本 | ⭐ | 个人用户快速上手 | ⭐⭐⭐⭐⭐ |
| npm/pnpm 全局安装 | ⭐⭐ | 已有 Node 环境 | ⭐⭐⭐⭐ |
| Docker | ⭐⭐ | 容器化部署 | ⭐⭐⭐ |
| 源代码 | ⭐⭐⭐ | 开发者/贡献者 | ⭐⭐ |
| VPS 远程托管 | ⭐⭐⭐ | 24/7 运行无电脑 | ⭐⭐⭐ |
| 云平台 (Fly/Render/Railway) | ⭐⭐⭐ | 免费托管 | ⭐⭐⭐ |

---

## 二、本地安装（推荐）

### 1. 安装器脚本（最简单）

```bash
# macOS / Linux
curl -fsSL https://openclaw.ai/install.sh | bash

# Windows (PowerShell)
iwr -useb https://openclaw.ai/install.ps1 | iex
```

**安装后运行新手引导：**
```bash
openclaw onboard --install-daemon
```

---

### 2. 全局安装（手动）

```bash
# 通过 npm
npm install -g openclaw@latest

# 或通过 pnpm
pnpm add -g openclaw@latest
pnpm approve-builds -g  # 批准构建脚本
pnpm add -g openclaw@latest

# 然后初始化
openclaw onboard --install-daemon
```

**遇到 sharp 构建问题？**
```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

---

### 3. 从源代码（开发者）

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm build
openclaw onboard --install-daemon
```

---

## 三、Docker 部署

```bash
# 拉取镜像
docker pull openclaw/openclaw

# 运行
docker run -d \
  --name openclaw \
  -v ~/.openclaw:/home/node/.openclaw \
  -p 8080:8080 \
  openclaw/openclaw
```

---

## 四、VPS 远程托管

适用于需要 24/7 运行、不依赖本地电脑的场景。

### 支持的平台：
- **Fly.io** - 免费额度，适合全球访问
- **Railway** - 按需付费，易上手
- **Render** - 免费 tier 可用
- **Hetzner** - 欧洲 VPS，性价比高
- **GCP** - Google Cloud

详细教程见：[https://docs.openclaw.ai/zh-CN/vps](https://docs.openclaw.ai/zh-CN/vps)

---

## 五、安装后检查

```bash
# 健康检查
openclaw doctor

# 查看状态
openclaw status

# 打开仪表板
openclaw dashboard
```

---

## 六、系统要求

- Node.js >= 22
- macOS / Linux / Windows (WSL2)
- pnpm（仅源码安装需要）

---

## 七、常见问题

**Q: 找不到 openclaw 命令？**
```bash
# 检查 PATH
echo $PATH
npm prefix -g  # 查看全局安装路径

# 添加到 PATH (~/.zshrc 或 ~/.bashrc)
export PATH="$(npm prefix -g)/bin:$PATH"
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

## 八、推荐选择

| 场景 | 推荐方案 |
|------|----------|
| 第一次尝试 | 安装器脚本 |
| 已有 Node 环境 | npm 全局安装 |
| 开发者/想参与贡献 | 源代码 |
| 需要 24/7 运行 | Fly.io / VPS |
| 想在服务器运行 | Docker |

---

> 文档参考：[OpenClaw 官方安装文档](https://docs.openclaw.ai/zh-CN/install)
