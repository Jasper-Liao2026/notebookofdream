# 从 MPA 到 SPA：前端路由的演进与实现

> 本文带你从浏览器底层原理出发，一步步理解传统多页面应用的痛点、Hash 路由的工作机制，再用 React Router 构建一个完整的单页应用。

---

## 一、传统多页面应用（MPA）是怎么工作的

### 1.1 一个完整的 HTTP 请求周期

打开浏览器，输入 URL，按下回车——背后发生了什么？

```
用户在地址栏输入 http://example.com/about
        │
        ▼
浏览器解析 URL，向服务器发起 HTTP GET 请求
        │
        ▼
服务器收到请求，返回 about.html 的完整 HTML 文档
        │
        ▼
浏览器收到响应，清空当前页面，重新解析、渲染整个 DOM
        │
        ▼
浏览器在历史记录中插入一条新记录
```

每一次点击链接、每一次页面跳转，这套流程都会**完整地跑一遍**。

### 1.2 MPA 的痛点

来看一个最简单的多页面应用例子。假设我们有两个页面——首页和关于页：

**index.html**
```html
<!DOCTYPE html>
<html>
<head><title>首页</title></head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="index.html">首页</a></li>
                <li><a href="about.html">关于我们</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <h1>首页</h1>
    </main>
    <footer>© 2026</footer>
</body>
</html>
```

**about.html**
```html
<!DOCTYPE html>
<html>
<head><title>关于</title></head>
<body>
    <header>
        <nav>  <!-- 和 index.html 一模一样的导航栏 -->
            <ul>
                <li><a href="index.html">首页</a></li>
                <li><a href="about.html">关于我们</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <h1>关于我们</h1>  <!-- 只有这一行不一样 -->
    </main>
    <footer>© 2026</footer>
</body>
</html>
```

发现了什么？两个文件 **90% 的内容是完全一样的**——`<header>`、`<nav>`、`<footer>` 都是重复的，只有 `<main>` 里的内容不同。

但问题不止于此。更严重的问题是**用户体验的割裂感**：

1. 点击链接 → HTTP 请求发送
2. 等待服务器响应（网络延迟）
3. 页面白屏 → 重新渲染整个 DOM
4. 用户看到新页面

这种"闪一下再出现"的体验，在移动端尤其刺眼。原生 App 里的页面切换是顺滑的——我们习惯了那种感觉。

---

## 二、单页应用（SPA）的核心思想

### 2.1 只替换需要变化的部分

既然每次跳转只有 `<main>` 部分的内容在变，为什么要重新渲染整个页面？

SPA 的思路异常朴素：**整个应用只有一个 HTML 页面，所有"页面切换"本质上是把不同内容塞进同一个挂载点。**

```
切换前：                         切换后：
┌──────────────────┐            ┌──────────────────┐
│   header         │ ← 不动     │   header         │
│   nav            │ ← 不动     │   nav            │
├──────────────────┤            ├──────────────────┤
│  首页内容         │ ← 只换这里 → │  关于页内容       │
├──────────────────┤            ├──────────────────┤
│   footer         │ ← 不动     │   footer         │
└──────────────────┘            └──────────────────┘
```

没有白屏闪烁，没有完整的 HTTP 请求，没有重新解析 CSS 和 JS——用户体验直接拉满。

### 2.2 关键难题：如何"改变 URL 但不发起请求"

SPA 面临一个根本性的矛盾：

- **必须改变 URL**——用户需要能收藏链接、能前进后退、能分享页面
- **不能真的跳转**——一旦浏览器发起新的 HTTP 请求，就是 MPA 的老路了

解决方案藏在 URL 的一个不起眼的角落里：**Hash（`#`）**

---

## 三、Hash 路由：SPA 的基石

### 3.1 什么是 Hash

一个完整的 URL 结构：

```
https://example.com/page?key=value#section2
  └──┬──┘ └──┬──┘ └─┬─┘ └──┬──┘ └──┬──┘
   协议     主机    路径   查询参数    Hash
```

Hash 部分（`#` 及其后面的内容）的特殊之处在于：**改变它不会触发浏览器向服务器发送请求。**

这个特性本来是为页面内锚点导航设计的——点击 `<a href="#section2">` 跳到页面中 `name="section2"` 的位置。但前端工程师发现了一个更妙的用法：**用 Hash 来模拟 URL 变化，实现页面切换，同时不触发服务器请求。**

### 3.2 手动实现一个 HashRouter

理解了原理，我们自己写一个 Hash 路由：

```javascript
class HashRouter {
    constructor() {
        // 路由表：存 hash 和对应的回调函数
        this.routers = {};

        // 监听 hash 变化
        window.addEventListener('hashchange', this.load.bind(this));
    }

    // 注册路由：指定某个 hash 对应什么操作
    register(hash, callback) {
        this.routers[hash] = callback;
    }

    // hash 变化时触发：从路由表里找到对应函数并执行
    load() {
        let hash = location.hash;          // 拿到 "#/about"
        let callback = this.routers[hash]; // 找到对应的函数
        if (callback) {
            callback();                    // 执行它
        }
    }
}
```

使用起来很简单：

```javascript
let router = new HashRouter();
let container = document.getElementById('container');

// 注册路由：hash → 要干的事
router.register('#/home',  () => container.innerHTML = '<h1>首页</h1>');
router.register('#/about', () => container.innerHTML = '<h1>关于我们</h1>');
router.register('#/contact', () => container.innerHTML = '<h1>联系我们</h1>');
```

页面里的链接这样写：

```html
<a href="#/home">首页</a>
<a href="#/about">关于我们</a>
<a href="#/contact">联系我们</a>
```

点击链接 → hash 变了 → `hashchange` 事件触发 → `load()` 执行 → 从路由表找到对应回调 → 替换 `#container` 的内容。整套流程没有一次 HTTP 请求。

### 3.3 一个关键的 JS 知识点：`this` 绑定

注意到 `this.load.bind(this)` 这一行了吗？它解决的问题很经典。

`addEventListener` 的回调函数里，`this` 默认指向**触发事件的元素**（这里就是 `window`）。但我们的 `load()` 方法里需要访问 `this.routers`——它必须是路由实例。

```javascript
// 不加 bind：
window.addEventListener('hashchange', this.load);
// load 里的 this → window（❌ 拿不到 routers）

// 加了 bind：
window.addEventListener('hashchange', this.load.bind(this));
// load 里的 this → 路由实例（✅ 可以访问 routers）
```

`bind()` 不执行函数，而是返回一个新函数，新函数里的 `this` 被永久锁定为你指定的值。这正好满足 `addEventListener` 需要一个"等着被调用的函数引用"的需求。

---

## 四、用 React Router 构建现代 SPA

理解了 Hash 路由的底层原理，再看 React Router 就会觉得一切都顺理成章——它不过是用声明式的方式封装了同样的机制。

### 4.1 核心组件：HashRouter + Routes + Route

```jsx
import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <HashRouter>
            <Navigation />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/about' element={<About />} />
            </Routes>
        </HashRouter>
    );
}
```

- **`HashRouter`**：底层就是 `hashchange` + `location.hash`，和我们的手写版做的一样
- **`Routes`**：相当于路由匹配引擎，每次只渲染**一个**匹配的 Route（先匹配到的优先）
- **`Route`**：声明路径和组件的对应关系，`path` 匹配 hash 的值，`element` 指定渲染哪个组件

### 4.2 Link 组件：代替 `<a>` 标签

传统的 `<a href="/about">` 会触发完整页面跳转，这在 SPA 里是灾难。React Router 提供了 `Link`：

```jsx
import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav>
            <Link to="/">首页</Link>
            <Link to="/about">关于</Link>
            <Link to="/user/123">用户 123</Link>
        </nav>
    );
}
```

`Link` 拦截了点击事件，通过操作 hash（或 History API）改变 URL，不会向服务器发请求。生成的 HTML 仍然是 `<a>` 标签，保证了可访问性和 SEO。

### 4.3 动态路由参数：`useParams`

路由不是只能匹配固定路径，还可以捕获动态值：

```jsx
{/* 路由定义 */}
<Route path='/user/:id' element={<UserProfile />} />

{/* UserProfile 组件内部 */}
import { useParams } from 'react-router-dom';

function UserProfile() {
    let { id } = useParams();  // 从 URL 中提取 :id 的值
    return <h1>用户 ID：{id}</h1>;
}
```

访问 `/#/user/123` → `id` 的值为 `"123"`。

### 4.4 嵌套路由：`Outlet`

真实应用常有层级关系——比如产品列表页下挂着产品详情：

```jsx
{/* 路由定义：支持嵌套 */}
<Route path="/products" element={<Products />}>
    <Route path=":productId" element={<ProductDetail />} />
</Route>

{/* Products 组件：用 Outlet 给子路由留位置 */}
import { Outlet } from 'react-router-dom';

function Products() {
    return (
        <div>
            <h1>产品列表</h1>
            <Outlet />  {/* 匹配到的子路由组件就渲染在这里 */}
        </div>
    );
}
```

- 访问 `/products` → 只显示产品列表标题
- 访问 `/products/456` → ProductDetail 渲染在 `<Outlet />` 的位置

### 4.5 路由懒加载：`lazy` + `Suspense`

SPA 把所有页面打包在一起，首屏加载会变慢。`lazy` 让每个页面在**第一次被访问时才下载**：

```jsx
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/about'));
const UserProfile = lazy(() => import('./pages/UserProfile'));

function App() {
    return (
        <HashRouter>
            {/* Suspense 是必需的：在懒加载组件下载期间显示 loading */}
            <Suspense fallback={<div>Loading...</div>}>
                <Navigation />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/user/:id' element={<UserProfile />} />
                </Routes>
            </Suspense>
        </HashRouter>
    );
}
```

每个页面组件会被拆分成独立的 JS 文件（Vite/Webpack 自动处理），只有用户真的访问时才去加载。

### 4.6 404 兜底和编程式导航

```jsx
{/* 通配符 * 匹配所有未被前面 Route 匹配的路径 */}
<Route path="*" element={<NotFound />} />
```

还可以在组件里用 `useNavigate` 实现编程式跳转：

```jsx
import { useNavigate } from 'react-router-dom';

function NotFound() {
    let navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => navigate('/'), 3000);
    }, []);

    return <h1>404 - 3 秒后返回首页</h1>;
}
```

---

## 五、MPA vs SPA 对比总结

| | 传统 MPA | SPA |
|---|---|---|
| 页面文件 | 每个页面对应一个 HTML 文件 | 只有一个 HTML 文件 |
| 页面切换 | 发起 HTTP 请求，整页刷新 | JS 拦截，局部替换 DOM |
| 用户体验 | 白屏闪烁，割裂感 | 顺滑切换，像原生 App |
| 服务器压力 | 每次请求都返回完整 HTML | 只提供数据 API，不拼页面 |
| 首屏速度 | 快（只加载当前页） | 慢（需加载 JS 框架 + 懒加载优化） |
| SEO | 天然友好 | 需 SSR/预渲染辅助 |
| 前端路由 | 无（路由由服务器控制） | 有（前端独立管理路由表） |

---

## 六、从零到一的完整学习路径

回顾整个学习过程，逻辑链条是这样的：

1. **理解 HTTP 请求周期** —— 传统 MPA 每次点击都走完整的请求-响应流程，导致体验割裂
2. **发现问题** —— 页面 90% 的内容重复，每次只为 10% 的变化重新渲染整个页面
3. **找到突破口** —— URL Hash（`#`）改变时不触发 HTTP 请求
4. **掌握底层 API** —— `hashchange` 事件 + `location.hash` 是实现前端路由的基石
5. **手写 HashRouter** —— 用原生 JS 的类和事件监听实现最小可用路由
6. **理解 `this` 绑定** —— `.bind()`、`.call()`、`.apply()` 是事件回调中必备的武器
7. **迁移到 React Router** —— `HashRouter`、`Routes`、`Route`、`Link` 是声明式前端路由的标准方案
8. **进阶优化** —— `lazy` + `Suspense` 实现按需加载，`useParams` 处理动态路由，`Outlet` 支持嵌套路由

每一步都是在解决上一步的痛点，没有跳跃，没有魔法。当你把底层原理吃透了，框架的使用便不再是"背诵 API"，而是"它理所当然是这么设计的"。

---

> 本文的完整示例代码可在 `ai/fe/html/history/`（原生实现）和 `ai/fe/react/router/react-router/`（React 实现）中查看。
