# yek命运织机

把正文里的人物做成世界书里的正式角色 —— SillyTavern 第三方扩展。

A SillyTavern extension that turns incidental characters from your roleplay
into fully-formed world book entries.

> 仅限成年内容创作使用。Adult content tooling only.

## 功能

- **自动检测**：每轮回复后扫描最近几楼，列出值得做成角色的人物
- **一键生成**：一次性产出 4 条世界书条目
- **让她真的出场**：往常驻的「行动路线」里追加介入条件，解决「新角色永远不出场」的问题
- **更新已有角色**：重新分析后逐条对比，只更新你勾选的
- **可撤销**：每次写入记录操作明细，一键回滚

## 安装

### 方式一：直接从 GitHub 安装（推荐，可自动更新）

酒馆 → 扩展 → 安装扩展 → 粘贴本仓库地址：

```
https://github.com/<你的账号>/yek-FateLoom
```

### 方式二：手动

把整个文件夹放进 `SillyTavern\public\scripts\extensions\third-party\yek-FateLoom\`，重启酒馆。

### 方式三：酒馆助手脚本

如果装了 [JS-Slash-Runner](https://github.com/N0VI028/JS-Slash-Runner)，把 `yek-FateLoom.script.js` 的内容粘进脚本库即可，不用重启。

## 生成的条目

一个角色 = 4 条 + 1 段：

| 条目 | 内容 |
|---|---|
| `角色卡 <名>` | 基调 / 核心身份 / 背景 / 外貌 / 语言风格 / 性格 |
| `身体配置 <名>` | `<body_configuration>` YAML |
| `性癖档案 <名>` | `<sexual_profile>` YAML |
| `<名>_行为落地指南` | 行为路线：触发条件 / 动作表现 / 重点细节 |
| （追加进「行动路线」） | 「介入机会」：什么信号下她可以出场 |

## 边界设计

三条内容不写重：

- **角色卡** = 人设，外貌只到发型、服饰、整体轮廓
- **身体配置** = 所有身体细节，尺寸形状质感
- **性癖档案** = 性相关的敏感带、弱点、偏好、技巧

## 安全

- 只按条目名精确匹配（`角色卡 <名>` 这类），不碰你手写的条目
- 原地修改 content，不删除重建，uid 和顺序都保留
- 记录内容指纹，你手改过的条目更新时会警告
- 操作日志可一键撤销

## 配置

侧栏「API 配置」独立设置，不占用酒馆主 API：

- 连接方式：自定义端点 / 跟随酒馆主 API
- 端点、API 密钥、模型名（可点「加载模型」拉列表）
- 安装时密钥写入 SillyTavern secrets，不落到设置文件里

## 许可

MIT