# prompt 做NLP 任务开发
- 有哪些东西可以模块化？
    import   from
    export default
    - 维护性和可读性
    - 好复用   引入
- 项目的模块化搭建
    - main.mjs 单点入口 （鉴权、路由）
    - client.mjs client 对象
    - completions.mjs 完成任务的函数

## es6 语法特性
es6 是javascript在2015年推出的新版本，变化比较大，目标是让js成为一个企业级大型项目开发语言
- let const 声明提升bug解决，支持块级作用域
    let const 不能重复声明，const 简单数据类型不能重新赋值，复杂数据类型可以重新赋值，但不能改变其指向的内存地址（类型）

- ...rest 运算符|spread 展开运算符
- 解构赋值
    - 对象
    - 数组 简洁且性能好
- 模块化 esm 模块系统
    - import from
    - export default
    - export
    - export {name,age}

## nlp任务 
- 情感分类
    正面 | 负面 | 中性
    电商等行业中非常重要 客户服务、预警、产品自检等
    后台 
- 信息提取 information extraction
- 主题推断
仅用几分钟，我们就可以构建多个用于对文本呢进行**推理 **的系统，而以前需要熟练的机器学习的人员数天到数周时间（平等）
可以用prompt构建nlp系统