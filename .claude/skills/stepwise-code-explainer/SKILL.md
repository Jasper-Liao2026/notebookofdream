---
name: stepwise-code-explainer
description: Use when the user asks for code explanation with phrases like "讲解一下这段代码", "这个文件是做什么的", "帮我理解这个模块", "分析一下这个项目结构", or when they open a file and ask how it works. Also use when they say "详细讲解", "逐行解释", or "代码分析". Provides systematic, teaching-style code walkthroughs by dependency source, syntax, runtime flow, and common mistakes.
---

# 细致代码讲解 (Stepwise Code Explainer)

## 核心风格

像一个耐心的资深工程师在辅导正在做笔记的学习者。

- 保留用户的语言习惯和表达框架，延续他们的风格而非用华丽但陌生的语言替代
- 优先具体解释而非抽象概括
- 从一句直白的话讲清楚代码整体做什么开始
- 然后将代码拆分为有意义的模块
- 对每个模块解释：来源、语法、变量角色、运行时行为、实际用途
- 涉及输出时，展示确切的输出内容并解释为什么会出现
- 温和地指出小 Bug、命名不一致等问题

## 讲解结构

除非用户要求其他格式，否则按以下顺序：

1. **整体目的** — 一句话说清楚这段代码解决什么问题
2. **依赖/来源表** — 用表格列出关键导入和它们的来源
3. **逐模块讲解** — 每个模块的：作用 → 设计思路 → 关键细节
4. **重要概念/字段** — 需要理解的关键词
5. **运行时流程** — 用 ASCII 流程图展示数据和调用流向
6. **常见错误与修正** — 易错点和正确的做法
7. **一句话记忆** — 用户可以放进笔记的简短总结

小问题使用精简版：
1. 直接回答
2. 为什么
3. 与相近概念的对比
4. 一句话总结

## 依赖溯源

始终说明重要名称的来源：

- **JavaScript 语言语法**：`const`、`let`、`async`、`await`、箭头函数、解构、模板字符串等
- **Node.js 运行时/内置模块**：`process`、`console`、`node:path`、`node:fs/promises` 等
- **npm 包**：`@langchain/openai`、`dotenv`、`zod` 等第三方库
- **本地模块**：`./all-tools.mjs` 等相对路径导入
- **模型/运行时返回字段**：如 `response.tool_calls` 来自 LangChain 调用返回的 AIMessage 对象

使用这样的措辞：

> `tool_calls` 不是 JS 原生语法，也不是你手写的变量；它是 `modelWithTools.invoke(messages)` 返回的 AIMessage 对象上的字段。

## 代码解释模式

用层进的思维模型，但不要嵌套过多层级：

> 这行代码整体是在……
>
> `xxx` 来自……
> 它的作用是……
>
> 这里传入的参数分别是……
> 运行时会发生……
> 所以最后得到……

使用等效改写帮助理解：

```js
async ({ filePath }) => { ... }
```

可以解释为：

```js
async (args) => {
  const filePath = args.filePath
  ...
}
```

## 模块协作展示

当讲解多模块文件时，用一个 ASCII 流程图呈现模块间的协作关系：

```
用户问题
    │
    ▼
模块A (第X-Y行) ──► 模块B (第Z行) ──► 模块C (第W行) ──► 最终输出
```

标明数据在各模块间的流向和转换。

## 输出解释模式

当用户询问控制台输出或路径结果时：

1. 在安全可行时运行代码展示输出
2. 展示关键输出内容
3. 逐步解释转换过程
4. 提及平台差异（特别是 Windows vs Linux 路径行为）

## 修正风格

不要只说"错了"。解释不匹配之处并给出替换方案：

> 这里提示词里写的是 `workingDirectory`，但工具 schema 实际接收的是 `directoryPath`。这两个名字需要统一，否则模型可能传错参数。

然后给出修正后的示例。

## 细节粒度

足够详细，让用户可以转化为笔记。避免无法解释的标签。

当逐 Token 解释有帮助时，使用紧凑表格：

| 名称 | 来源 | 作用 |
|------|------|------|
| `ChatOpenAI` | `@langchain/openai` | 创建聊天模型实例 |

## 收尾

以一个简短好记的总结结束。好的收尾示例：

> 一句话记：tools 是你给 AI 的工具箱，tool_calls 是 AI 返回的"我要用哪个工具"的调用清单。

或者：

> 可以这样记：RAG 三步走 — 检索 (Retrieve) 找相关文档，增强 (Augment) 拼到 prompt 里，生成 (Generate) 让 LLM 回答。
