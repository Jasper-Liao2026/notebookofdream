# 3D
- canvas
html5 新增标签，js api绘制

## css 3D
css 属性去触发3d绘制，不止3d，还会带来gpu加速，哪怕是2d界面，有时我们也会手动3d化

### 布局 layout
- 外层盒子布局
- 内层 展示

### 水平垂直居中
- 父容器
    body 100% 100vh（css3新单位）
    100份 (等比例分)  实现移动端的适配
    vh 即viewport-height
    vw 即viewport-width
- 子元素

## 行内/块级
- html元素有两类 行内 块级
div，ul 等块级
span 等行内
- 块级 block 盒子
    - 可以设置宽高
    - 独占一行
- 行内 inline
    - 不可以设置宽高
    - 也不会把兄弟挤下去
- display 属性
    flex 开启弹性格式上下文
    inline-block 行内块级
        - 不会把兄弟挤下去
        - 又可以设置宽高
    浏览器默认块级/行内->display 手动切换inline/block -> 格式化上下文(flex/inline-block/grid)
    inline-block 默认有坑，默认空格符会占据一定的大小

## 定位
position:relative 相对定位
position:absolute 绝对定位
