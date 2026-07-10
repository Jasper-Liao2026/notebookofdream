---
title: Agent in Action 图谱
tags:
  - agent
  - langchain
  - tool-calling
  - obsidian
created: 2026-07-08
---

# Agent in Action 图谱

这份笔记用于记录 `agent_in_action` 项目的学习过程。  
Obsidian 会根据下面的 `[[双链]]` 自动生成图谱关系。

## 核心主题

- [[LLM]]
- [[Agent]]
- [[LangChain]]
- [[Tool Calling]]
- [[ReAct 循环]]
- [[文件系统工具]]
- [[命令行工具]]
- [[React Todo App]]

## 项目入口

[[index.mjs]] 是最小的大模型调用示例。

它主要连接：

- [[dotenv]]
- [[ChatOpenAI]]
- [[DeepSeek API]]
- [[model.invoke]]

## 工具调用 Demo

[[src/tool.mjs]] 用来理解 LangChain 里的工具调用流程。

它主要连接：

- [[read_file 工具]]
- [[LangChain Tool]]
- [[zod schema]]
- [[ToolMessage]]
- [[AIMessage]]
- [[HumanMessage]]
- [[SystemMessage]]

## Agent 工具集合

[[src/all-tools.mjs]] 是 Agent 的工具箱。

里面包含：

- [[read_file 工具]]
- [[write_file 工具]]
- [[list_directory 工具]]
- [[execute_command 工具]]
- [[node fs/promises]]
- [[node child_process]]
- [[spawn]]

## Mini Cursor

[[src/mini-cursor.mjs]] 是这个项目最重要的文件。

它主要连接：

- [[Agent]]
- [[ReAct 循环]]
- [[模型绑定工具]]
- [[工具调用循环]]
- [[ToolMessage]]
- [[项目自动化]]
- [[React Todo App]]

## Node 命令执行

[[src/node-exec.mjs]] 用来单独理解 Node.js 如何执行命令。

它主要连接：

- [[child_process]]
- [[spawn]]
- [[子进程]]
- [[命令行工具]]
- [[Vite 项目创建]]

## 生成出来的项目

[[react-todo-app]] 是 Agent 自动化生成的 React 项目。

它主要连接：

- [[React]]
- [[TypeScript]]
- [[Vite]]
- [[TodoList]]
- [[localStorage]]
- [[前端状态管理]]

## 学习记录

### 2026-07-08

- 创建图谱入口笔记。
- 后续理解代码时，可以把每个概念继续拆成独立笔记。

## 待补充节点

- [[为什么需要 Tool]]
- [[Agent 和普通 ChatBot 的区别]]
- [[SystemMessage 的作用]]
- [[HumanMessage 的作用]]
- [[AIMessage 的作用]]
- [[ToolMessage 的作用]]
- [[为什么工具需要 schema]]
- [[为什么要把工具结果再交给模型]]
- [[Cursor 的基本原理]]
- [[Claude Code 的基本原理]]

