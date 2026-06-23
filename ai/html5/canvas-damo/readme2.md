- canvas api
    - canvas 有大量的js 绘制api
    - 首先获取canvas标签
    - getContext(2d/3d) 上下文 
        ai 游戏爆发 three.js
        物理大模型
    - 绘制各种图形
        rect 方形
        circle 圆
        line线
        clearRect() 方形擦除
        左上角+宽/高
    - 颜色
        fillStyle填充    strokeStyle描边
    
    - 怎么做游戏？
        按帧动画
        - clear 擦掉之前的
        - 画上新的
        - 显卡帧 1s 60次

## requsetAnimationFrame
浏览器提供的适配屏幕刷帧率的高效动画帧调度函数
不能用setInterval 时间可能和电脑显示设备的刷帧率不在同一个频道上
而requestAnimationFrame 是等于刷帧率，体验更协调
- 参数以递归方式绘制函数
- clear 方法
    帧动画不停的画，就有了动画
    加上交互，就是游戏



## 一个飞机游戏
- 工程初始化
    vite,git
    帮我们安装必要的依赖
    .env

- 可以和cc头脑风暴
    - 游戏功能列表，选择其中的一些，做第一个阶段的开发
    MVP 最小可行性方案
    技术路线什么样
- llm 生成
    

## 数据可视化
echart 报表
ECharts 是百度开源、基于 JavaScript 的高性能可视化图表库，支持各类折线 / 饼图 / 地图等数据图表快速开发。
