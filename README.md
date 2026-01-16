# New API 模型倍率计算器

一个用于计算 [New API](https://github.com/Calcium-Ion/new-api) 模型倍率的在线工具。基于 [models.dev](https://models.dev) 官方价格数据，自动计算适用于 New API 的模型倍率和补全倍率。

## 功能特性

### 1. 模型倍率查询

从 models.dev 官方价格数据自动计算 New API 所需的倍率配置：

- 🔍 支持模型名称搜索
- 🏷️ 按提供商筛选（OpenAI、Anthropic、Google、DeepSeek 等）
- 📊 支持按倍率、价格排序
- 📱 响应式设计，支持移动端

### 2. 配额消耗计算器

根据 Token 用量和倍率配置，计算实际配额消耗：

- 输入 Token 数量、倍率参数
- 实时计算配额点数和等价美元
- 显示详细计算公式
- 支持从模型列表快速填充倍率

### 3. 倍率转换工具

在官方价格和 New API 倍率之间双向转换：

- 官方价格 ($/1M tokens) → 模型倍率 + 补全倍率
- 模型倍率 + 补全倍率 → 官方价格

## 计算公式

基于 [New API 官方文档](https://www.newapi.ai/zh/docs/guide/console/settings/rate-settings)：

```
配额消耗 = (输入Token + 输出Token × 补全倍率) × 模型倍率 × 分组倍率
```

**换算关系：**

| 项目 | 公式 |
|------|------|
| 模型倍率 | 官方输入价格 ($/1M tokens) × 0.5 |
| 补全倍率 | 输出价格 ÷ 输入价格 |
| 配额点数 | 1 美元 = 500,000 配额 |

**示例：GPT-4o**

- 官方价格：输入 $2.50/1M，输出 $10.00/1M
- 模型倍率 = 2.50 × 0.5 = **1.25**
- 补全倍率 = 10.00 ÷ 2.50 = **4**

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录。

### 预览生产版本

```bash
npm run preview
```

## 更新模型数据

模型价格数据来自 [models.dev](https://github.com/anomalyco/models.dev) 仓库。运行以下命令获取最新数据：

```bash
npm run fetch-models
```

该命令会从 GitHub API 获取最新的模型价格信息并更新 `src/data/models.json`。

## 部署

构建后的 `dist/` 目录是纯静态文件，可部署到任意静态托管服务：

### Vercel

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Cloudflare Pages

1. 连接 Git 仓库
2. 构建命令：`npm run build`
3. 输出目录：`dist`

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

## 数据来源

- **模型价格**：[models.dev](https://models.dev) - 由社区维护的 AI 模型价格数据库
- **计算公式**：[New API 倍率设置文档](https://www.newapi.ai/zh/docs/guide/console/settings/rate-settings)

## 支持的提供商

当前已收录以下提供商的模型数据：

- OpenAI (GPT-4o, GPT-4-Turbo, o1, o3 等)
- Anthropic (Claude 4, Claude 3.5, Claude 3 等)
- Google (Gemini 2.5, Gemini 2.0, Gemini 1.5 等)
- DeepSeek (DeepSeek-V3, DeepSeek-R1 等)
- Mistral (Mistral Large, Codestral 等)
- xAI (Grok 等)
- Alibaba (Qwen 系列)
- Cohere (Command 系列)
- MiniMax

## 技术栈

- [Vite](https://vitejs.dev/) - 构建工具
- [React](https://react.dev/) - UI 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架

## 许可证

MIT
