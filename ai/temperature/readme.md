# 大模型是怎么随机说话的？

控制大模型随机性的关键参数
temperature 随机性 0 - 1 文艺创作 | 写代码
Top k随机样本

上一个词 预测下一个词 prediction next worde
概率分布 

用temperature 0-1 之间


- 幻觉问题
- 开发者有效、靠谱地去使用、控制AI应用的随机性

- 把temperature 拉高  随机性增加  生成会不太靠谱
- 有些创作类的工作，随机性可以增加创意，保证质量的话：
分两步做：
- 先用TOP k 把高概率的词选出来
 3 | 2 默认值 3
 AI应用效果观测
- 再用temperature 控制随机性
    0.2 代码，法律 公司合同
    0.8 创意创作 多模态模型 AI漫剧

    Top K 

- temperature 和 Top K 不可能太大的
    都很小也没有必要

    t小k大，准确且有艺术性
    t大k小，

## langchain 
lang(uage) + chain(llm 工作链|流编排) 

### 核心模块 @langchain/core
- messages 对话列表
- output_parsers解析器
    帮我们自动的解析出相应的格式
- tools
- prompts 提示词模板

为什么要langchain？
开发更快，业务类
AI Agent应用 生成式、概率分布 有点黑盒
要不觉得感到活不太智能，要不太智能，不知道怎么干出来的
chain 的核心概念就是把ai工作链条上的每个节点链起来。

## AI工作流
- llm两个创意和严谨的适合不同业务
- PromptTemplate
llm -> PromptTemplate -> String