<div align="center">
  <img src="public/banner-wstudio.jpg" alt="W简历" />

  <h1>W简历</h1>

  <p>W简历（W简历）是一款免费开源的简历构建工具，让您轻松创建、更新和分享专业简历。</p>

  <p><strong>立即开始</strong></p>

  <p>
    <img src="https://img.shields.io/github/package-json/v/amruthpillai/reactive-resume?style=flat-square" alt="版本">
    <img src="https://img.shields.io/github/stars/amruthpillai/Reactive-Resume?style=flat-square" alt="GitHub Stars">
    <img src="https://img.shields.io/github/license/amruthpillai/Reactive-Resume?style=flat-square" alt="许可证" />
    <img src="https://img.shields.io/docker/pulls/amruthpillai/reactive-resume?style=flat-square" alt="Docker Pulls" />
  </p>
</div>

---

W简历让简历制作变得简单高效。选择模板、填写信息、导出 PDF——基础使用无需注册。如需更多控制，您可以在自己的服务器上自托管整个应用。

以隐私为核心设计原则，W简历让您完全掌控自己的数据。代码库完全开源，采用 MIT 许可证，无追踪、无广告、无隐藏费用。

## 功能特点

**简历制作**

- 实时预览，边写边看效果
- 多种导出格式（PDF、JSON）
- 拖拽调整模块顺序
- 自定义模块，支持任意内容类型
- 富文本编辑器，支持格式设置

**模板**

- 专业设计的简历模板
- 支持 A4 和 Letter 纸张尺寸
- 可自定义颜色、字体和间距
- 支持自定义 CSS 高级样式

**隐私与控制**

- 可在自己的服务器上自托管
- 默认无追踪或分析
- 随时导出完整数据
- 一键永久删除数据

**其他功能**

- 多语言支持（简体中文、繁体中文、英文、越南语）
- 通过唯一链接分享简历
- 支持 JSON Resume 格式导入
- 暗黑模式支持
- 管理员后台管理

## 模板预览

<table>
  <tr>
    <td align="center">
      <img src="public/templates/jpg/azurill.jpg" alt="Azurill" width="150" />
      <br /><sub><b>Azurill</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/jpg/bronzor.jpg" alt="Bronzor" width="150" />
      <br /><sub><b>Bronzor</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/jpg/chikorita.jpg" alt="Chikorita" width="150" />
      <br /><sub><b>Chikorita</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/jpg/ditto.jpg" alt="Ditto" width="150" />
      <br /><sub><b>Ditto</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/templates/jpg/gengar.jpg" alt="Gengar" width="150" />
      <br /><sub><b>Gengar</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/jpg/glalie.jpg" alt="Glalie" width="150" />
      <br /><sub><b>Glalie</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/jpg/kakuna.jpg" alt="Kakuna" width="150" />
      <br /><sub><b>Kakuna</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/jpg/lapras.jpg" alt="Lapras" width="150" />
      <br /><sub><b>Lapras</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/templates/jpg/leafish.jpg" alt="Leafish" width="150" />
      <br /><sub><b>Leafish</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/jpg/onyx.jpg" alt="Onyx" width="150" />
      <br /><sub><b>Onyx</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/jpg/pikachu.jpg" alt="Pikachu" width="150" />
      <br /><sub><b>Pikachu</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/jpg/rhyhorn.jpg" alt="Rhyhorn" width="150" />
      <br /><sub><b>Rhyhorn</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/templates/jpg/ditgar.jpg" alt="Ditgar" width="150" />
      <br /><sub><b>Ditgar</b></sub>
    </td>
  </tr>
</table>

## 快速开始

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/xk103295870-alt/AI-CV.git
cd AI-CV

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问应用
open http://localhost:3000
```

### Docker 部署（生产环境）

#### 部署依赖

##### 1. 系统环境要求

| 组件 | 版本要求 | 说明 |
|------|----------|------|
| **Docker** | 20.10+ | 容器运行时 |
| **Docker Compose** | 2.0+ | 多容器编排 |

##### 2. Docker 容器服务

**核心服务（必须）：**

| 容器名 | 镜像 | 端口 | 用途 |
|--------|------|------|------|
| **postgres** | `postgres:latest` | 5432 | PostgreSQL 数据库 |
| **browserless** | `ghcr.io/browserless/chromium:latest` | 4000 | PDF/图片生成服务 |
| **reactive_resume** | 本地构建 | 3000 | 主应用服务 |

**可选服务：**

| 容器名 | 镜像 | 端口 | 用途 |
|--------|------|------|------|
| **seaweedfs** | `chrislusf/seaweedfs:latest` | 8333 | 对象存储（可用本地存储替代） |

##### 3. 服务器资源建议

| 资源 | 最低配置 | 推荐配置 |
|------|----------|----------|
| CPU | 2 核 | 4 核 |
| 内存 | 4 GB | 8 GB |
| 磁盘 | 20 GB | 50 GB+ |
| 网络 | 1 Mbps | 5 Mbps+ |

> **注意**：Browserless (Chromium) 容器内存占用较大，如服务器内存不足（< 4GB），建议关闭该服务或使用外部 PDF 生成方案。

##### 4. 必需配置文件

| 文件 | 必须 | 说明 |
|------|------|------|
| `.env` | ✅ 是 | 环境变量配置（**部署前必须创建**） |
| `compose.yml` | ✅ 是 | Docker Compose 配置文件 |

---

**⚠️ 重要提示：部署前必须创建 .env 文件**

```bash
# 克隆仓库
git clone https://github.com/xk103295870-alt/AI-CV.git
cd AI-CV

# 创建 .env 配置文件（必须步骤）
cat > .env << 'EOF'
# 应用配置
APP_URL=http://localhost:3000
APP_SECRET=your-super-secret-key-change-in-production

# 数据库配置
POSTGRES_URL=postgres://postgres:postgres@postgres:5432/postgres

# 存储配置（本地存储）
STORAGE_TYPE=local
STORAGE_LOCAL_DIR=/app/data/uploads

# PDF 打印服务
PRINTER_TOKEN=1234567890
PRINTER_ENDPOINT=ws://browserless:3000?token=1234567890

# 功能开关
FLAG_DISABLE_SIGNUPS=false
FLAG_DISABLE_EMAIL_AUTH=false
EOF

# 启动所有服务
docker compose up -d

# 访问应用
open http://localhost:3000
```

**常见问题：**
- 如果提示 `.env file not found`，说明没有创建 .env 文件
- 修改 `.env` 中的 `APP_URL` 为您的实际域名或 IP
- 生产环境务必修改 `APP_SECRET` 为强密码

## 技术栈

| 类别         | 技术                           |
| ------------ | ------------------------------ |
| 框架         | TanStack Start (React 19, Vite) |
| 运行时       | Node.js                        |
| 语言         | TypeScript                     |
| 数据库       | PostgreSQL + Drizzle ORM       |
| API          | oRPC (类型安全 RPC)            |
| 认证         | Better Auth                    |
| 样式         | Tailwind CSS                   |
| UI 组件      | Radix UI                       |
| 状态管理     | Zustand + TanStack Query       |

## 自托管部署

W简历支持使用 Docker 自托管。技术栈包括：

- **PostgreSQL** — 存储用户数据和简历
- **Browserless** — 无头 Chromium 服务，用于 PDF 生成
- **SeaweedFS** — S3 兼容的文件存储（可选）

详细的部署指南请参考上方 "Docker 部署" 部分。

## 管理员后台

部署后可通过 `/admin/login` 访问管理员后台：
- 需要在数据库中将用户 `role` 字段设置为 `'admin'`
- 管理员可以查看统计信息、管理用户、重置用户密码

 
