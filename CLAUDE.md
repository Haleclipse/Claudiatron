# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Claudiatron 是一个基于 Electron + React + TypeScript 的桌面应用，作为 Claude Code 的 GUI 工具。该项目从原始的 Tauri 版本迁移而来，提供完整的 Claude Code 集成功能。

## 常用开发命令

```bash
# 安装依赖 (使用 pnpm)
pnpm install

# 开发模式
pnpm dev

# 代码检查
pnpm lint
pnpm typecheck

# 格式化代码
pnpm format

# 构建应用
pnpm build:win     # Windows
pnpm build:mac     # macOS
pnpm build:linux   # Linux
```

## 架构概览

### 核心架构

- **主进程**: `src/main/` - Electron 主进程代码，管理应用生命周期
- **预加载脚本**: `src/preload/` - 桥接主进程和渲染进程的安全通信层
- **渲染进程**: `src/renderer/` - React 应用界面
- **构建工具**: electron-vite + electron-builder
- **数据库**: SQLite (通过 TypeORM + better-sqlite3)

### 主要目录结构

```
src/
├── main/
│   ├── api/                    # IPC API 处理器
│   │   ├── agents.ts          # AI 代理管理
│   │   ├── claude.ts          # Claude Code 会话管理
│   │   ├── mcp.ts             # MCP 服务器管理
│   │   ├── storage.ts         # 数据库操作
│   │   ├── usage.ts           # 使用情况统计
│   │   ├── hooks.ts           # 钩子管理
│   │   └── slashCommands.ts   # 斜杠命令
│   ├── database/              # 数据库层
│   │   ├── connection.ts      # 数据库连接管理
│   │   ├── entities/          # TypeORM 实体
│   │   └── services/          # 数据库服务层
│   ├── detection/             # Claude 二进制文件检测
│   └── process/               # 进程管理
├── preload/
│   └── index.ts              # 安全的 IPC 接口定义
└── renderer/
    └── src/
        ├── components/        # React 组件
        ├── lib/              # 工具库和 API 客户端
        └── types/            # TypeScript 类型定义
```

## 关键功能模块

### 1. Claude Code 集成

- **二进制检测**: 自动检测系统中的 Claude CLI 安装
- **会话管理**: 创建、恢复和管理 Claude Code 会话
- **流式输出**: 实时显示 Claude 响应
- **进程管理**: 安全的子进程生命周期管理

### 2. 项目管理

- **项目扫描**: 扫描和管理 `~/.claude/projects/` 中的项目
- **CLAUDE.md 编辑**: 内置的项目配置文件编辑器
- **会话历史**: 项目级别的会话历史记录

### 3. AI 代理系统

- **代理创建**: 创建和配置自定义 AI 代理
- **GitHub 导入**: 从 GitHub 导入预定义代理
- **执行监控**: 代理运行状态和输出监控

### 4. 数据存储

- **SQLite 数据库**: 使用 TypeORM 管理代理、运行记录等数据
- **使用统计**: API 使用情况和成本跟踪
- **设置管理**: 应用配置和用户偏好

## IPC 通信架构

### 通信模式

- **类型安全**: 所有 IPC 调用都有完整的 TypeScript 类型定义
- **错误处理**: 统一的错误处理和响应格式
- **安全隔离**: 通过 preload 脚本确保安全的跨进程通信

### API 映射

```typescript
// 前端调用
const projects = await api.getProjects();
const session = await api.createClaudeSession(projectPath);

// 主进程处理器 (src/main/api/)
ipcMain.handle('get-projects', async () => { ... });
ipcMain.handle('create-claude-session', async (_, projectPath) => { ... });
```

## 开发注意事项

### 技术栈

- **包管理器**: pnpm (严格使用，不要使用 npm 或 yarn)
- **TypeScript**: 严格类型检查，确保类型安全
- **UI 组件**: shadcn/ui 组件库 + Tailwind CSS v4
- **动画**: framer-motion 用于 UI 动画
- **状态管理**: React hooks + 组件级状态

### 安全考虑

- **沙箱环境**: 渲染进程运行在受限环境中
- **输入验证**: 验证所有用户输入和 IPC 参数
- **进程隔离**: 所有系统调用都通过主进程代理

### 性能优化

- **代码分割**: 使用动态导入和手动分块
- **流式处理**: 大量数据采用流式传输
- **缓存策略**: 输出缓存和检测结果缓存

## 常见问题处理

### Claude 二进制文件检测

- 检查 PATH 环境变量
- 验证 Claude CLI 版本兼容性
- Windows WSL 环境特殊处理

### 数据库问题

- 数据库文件位置: `~/AppData/Roaming/claudiatron/claudiatron.db` (Windows)
- 自动迁移和表结构同步
- TypeORM 日志调试: 在 `connection.ts` 中设置 `logging: true`

### 进程管理

- 使用 `execa` 管理子进程
- `tree-kill` 确保进程树清理
- 跨平台信号处理

## 组件开发规范

### UI 组件

- 使用 shadcn/ui 组件作为基础
- 保持组件的单一职责
- 使用 TypeScript 接口定义 props

### API 集成

- 所有 API 调用都通过 `src/renderer/src/lib/api.ts`
- 实现适当的加载状态和错误处理
- 使用 React hooks 管理异步状态

### 样式规范

- Tailwind CSS v4 优先
- 响应式设计考虑
- 深色/浅色主题支持

## 禁止事项

- **不要直接编辑** `src/renderer/src/components/ui/` 中的 shadcn 生成组件
- **不要在渲染进程中** 直接访问 Node.js API
- **不要绕过 IPC** 进行跨进程通信
- **不要在主进程中** 执行长时间运行的同步操作

## 重要注意事项

### 渲染进程中的平台检测

**❌ 错误做法**: 在渲染进程中直接使用 `process.platform`

```typescript
// 这会导致 "process is not defined" 错误
if (process.platform === 'win32') { ... }
```

**✅ 正确做法**: 使用 electron-toolkit 暴露的安全接口

```typescript
// 使用预加载脚本暴露的平台信息
if (window.electron.process.platform === 'win32') { ... }
```

### Windows 路径解码

**问题**: Windows 项目路径编码格式 `C--Users-Name-Project` 需要特殊处理

**解决方案**: 在路径解码函数中检测 Windows 盘符模式并正确转换为 `C:\Users\Name\Project`
