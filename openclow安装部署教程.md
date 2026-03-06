# OpenClaw 安装部署教程

## 前言：你需要知道你需要以下成本！

OpenClaw本身是个开源的项目，是免费的，但部署使用龙虾是有成本的。

| 成本项 | 做什么 | 傲雪建议 |
|------|------|------|
| **OpenClaw服务端** | 安装部署龙虾的执行环境：自己旧电脑 Or 云服务器。收费方式：按月/年 | 我家是MacMini。但推荐大家选云服务器，减少网络相关的运维，现成的公网IP你后面做自动化发布等也会需要。 一年一两百的费用也很划算|
| **大模型服务** |龙虾理解你说的话做任务，需要大模型服务。收费方式：按量/订阅  | 尽可能用好的模型不抽卡。我是前期有开发使用需要不同的优秀模型做不同任务，用的模型集成平台，ClaudeCode/GPT5/Gemini 都能用，事情不多的免费额度也够，具体看下面|
| **各种可能的SKILL** | 99%是免费的|有部分用了别人自有服务的可能会有成本 |


## 一、官方参考资料（务必认准，太多龙虾域名的网站冒出来，鱼龙混杂）

### 🌐 OpenClaw官方网站（免费：和SKILL相关支持）

| 名称 | 地址 | 说明 |
|------|------|------|
| **OpenClaw 官网** | https://openclaw.ai | 官方网站 |
| **OpenClaw 文档** | https://docs.openclaw.ai | 官方文档（中文） |
| **ClawHub 技能市场** | https://clawhub.com | Skills 技能库 ，搜了下clawhub也是一堆A货，大家认准这个网站|
| **GitHub 仓库** | https://github.com/openclaw/openclaw | 源代码 |
| **Discord 社区** | https://discord.com/invite/clawd | 社区交流 |


### 🌐 云服务推荐（收费，一个月30足够）


| 名称 | 地址 | 说明 |
|------|------|------|
| **腾讯云OpenClaw入口** | [https://openclaw.ai ](https://cloud.tencent.com/act/pro/lighthouse-moltbot?from=29437&Is=home)|腾讯云龙虾安装入口|
| **阿里云OpenClaw入口** | https://www.aliyun.com/benefit/scene/moltbot?spm=5176.42028462.J_E6lQbksm_Obit3Bf0Tx1p.d_primary.2ea5154a97uqIc&scm=20140722.M_10976299.P_177.MO_5556-ID_10963004-MID_10963004-CID_37520-ST_15696-PA_se@1022753309-V_1 | 阿里云龙虾安装入口 |


### 🌐 Token流量费 （收费，费用看个人情况）

我只付费过下面两个：

** MiniMax ** ：https://platform.minimaxi.com/subscribe/coding-plan?code=7VkLpV71yy&source=link
** 顶尖大模型集成平台（GPT5/ClaudeCode/Gemini） ** ：https://www.univibe.cc/console/auth?type=register&invite=BVWMUO

集成平台有免费额度可以先用，我是手头有开发任务，之前买的MAX套餐，现在也能用在龙虾上，开心！

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
| 🐣 **纯小白** | EasyClaw UI 版 | ⭐ | 不想懂技术，只想用起来，但傅盛大佬展示的扩展功能也是要花时间处理的，买了龙虾养龙虾也是重服务模式，但部署容易后，一些能力的使用还是一样有门槛 |
| 🐤 **适中主推** | | 云服务厂商推的一键安装⭐⭐ | 先用起来比较推荐这个模式，没那么复杂，扩展性依赖厂商自己的迭代 |
| 🐥 **扩展好** | 开源官方安装 + 服务器 | ⭐⭐⭐ | 就算是小白，只要愿意看官方文档，不是只想等靠要的，都可以，扩展性高 |

---


## 三、🦅 云服务厂商

### 为什么选云服务厂商？
- 集成服务一键部署更方便
- 推广有优惠

### 云服务器安装步骤 （给自己预留好时间，看文档做部署）

#### 1. 购买服务器 
- 访问腾讯云的龙虾部署教程 https://cloud.tencent.com/developer/article/2624973
- 教程中会让你采购服务器，新手如果看到99/年的套餐就直接下手，很便宜了。

#### 2. 参考各大云服务厂商的OpenClaw一键安装或者自行安装（能自行装更推荐）
- 跟着教程走/各大厂商也有合作活动，比如腾讯的CodeBudy会更便宜，不过1个月那种其实是不够的。。

---

## 六、本地安装（Mac/PC）

### 1. 安装脚本（第一步：打开Terminal）


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


## 十、推荐选择

| 场景 | 推荐方案 |
|------|----------|
| 🎯 不想懂技术 | **EasyClaw** |
| 🖥️ 服务器 | **腾讯云/阿里云 ** |
| 🖥️ 本地用 | **安装器脚本** |

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
