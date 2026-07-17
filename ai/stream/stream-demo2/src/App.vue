<!--
  ========================================
  整体功能：调用 DeepSeek API，把 AI 回复逐字流式显示在页面上
  ========================================
-->

<script setup>
// <script setup> 是 Vue 3 的编译期语法糖（SFC 专属）
// 省去手动写 setup() 函数和 export default，顶层变量自动暴露给模板
// composition api 相关逻辑组织在一起 —— 和 Vue 2 的选项式 API（data/methods/computed 分开写）不同

import { ref } from 'vue';
//   ^^^         ^^^^^
//   ref 是函数，来自 vue 这个 npm 包（不是 JS 原生语法）
//   调用 ref(初始值) 返回一个 RefImpl 响应式对象，值存在 .value 里
//   RefImpl = Reference Implementation

const question = ref('讲一个中国龙的故事');
//    ^^^^^^^^     ^^^^^^^^^^^^^^^^^^ ref() 的初始值，页面输入框默认显示这段文字
//    模板里 v-model="question" 绑定此变量
//    JS 中读写用 question.value，模板中自动拆包直接用 question

const content = ref('');
//    ^^^^^^^ 页面上 {{ content }} 绑定此变量，AI 回复逐字拼到这里

const stream = ref(true);
//    ^^^^^^ 绑定到 Streaming 复选框，true = 流式输出模式

const update = async () => {
//    ^^^^^^               ^^^^^ async 让函数内部能用 await 等待异步操作
//    模板里 @click="update" 触发

  if (!question.value) return;
  // ^                  ^^^^^^
  // 逻辑非，把值转布尔再取反：!'' = true → return（空输入不发请求）
  // question.value 是 ref 的取值方式，JS 里必须加 .value

  content.value = '思考中...'; // 页面状态：开始 llm 接口调用，先给用户一个反馈

  const endpoint = 'https://api.deepseek.com/chat/completions';
  // DeepSeek 的接口兼容 OpenAI 格式，路径结构和请求体一样

  const headers = {
    'Content-Type': 'application/json',
    //               告诉服务器：body 是 JSON 格式
    Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
    //                                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // import.meta.env 是 Vite 构建工具注入的（不是 JS 原生）
    // 只有 .env.local 中 VITE_ 开头的变量才会暴露给浏览器
    // `Bearer ${...}` 是 ES6 模板字符串（反引号），${} 里嵌入 JS 表达式
  };

  const response = await fetch(endpoint, {
  //    ^^^^^^^^   ^^^^^       ^^^^
  //    |          |            fetch：浏览器原生 Web API（不是 Node.js），发 HTTP 请求
  //    |          await：等待 Promise resolve（但只等到响应头！不等 body 全下载完）
  //    保存 fetch 的返回值（Response 对象）

    method: 'POST',
    //       ^^^^^^ HTTP 方法，POST 表示提交数据到服务器
    headers,
    //      ^^^ ES6 属性简写，等价于 headers: headers
    body: JSON.stringify({
    //   ^^^^^^^^^^^^^ 把 JS 对象序列化成 JSON 字符串（浏览器原生）
      model: 'deepseek-v4-pro',
      //      ^^^^^^^^^^^^^^^^^ DeepSeek 的模型代号（flash = 快速版）
      messages: [
        { role: 'user', content: question.value }
        //  ^^^^^^^^^^^^
        //  role: 'user' 表示这条消息是用户说的（区分于 'system' 系统提示、'assistant' AI回复）
        //  content: question.value 取输入框的当前值
      ],
      stream: stream.value
      //     ^^^^^^^^^^^ true = 让 API 边生成边发送，false = 全部生成完一次性返回
    })
  });

  if (stream.value) {
  // ^^^^^^^^^^^^ 用户勾选了 Streaming 复选框 → 走流式路径

    content.value = '';
    // 清掉 "思考中..."，准备逐字显示

    // 大文件上传 慢慢流向 权限+形式 js 原生提供了 ReadableStream
    // llm 服务器 ReadableStream 对象 —— 数据流
    // stream 对象 水流 —— 服务器端流向浏览器
    // response.body 服务器端响应体 —— 二进制流
    console.log(response.body);
    //        ^^^^^^^^^^^^ response.body 是 ReadableStream 实例（浏览器 Web API）
    //        不是普通对象，里面的数据是分块（chunk）陆续到达的

    // 水管子，嘬一口 → 返回读取器对象
    // await 没到就等，等 token 流来了再继续
    const reader = response.body?.getReader();
    //    ^^^^^^          ^^                  ^^^^^^^^^
    //    |               可选链（ES2020）     ReadableStream 原型上的方法
    //    |               ?. 保证 body 为 null/undefined 时不会报错，返回 undefined
    //    返回 ReadableStreamDefaultReader，只能通过它的 read() 逐块取数据
    console.log(reader);

    // 二进制编解码
    const decoder = new TextDecoder(); // 二进制流服务的
    //    ^^^^^^^   ^^^^^^^^^^^^^^^^^
    //    |         TextDecoder：浏览器原生 API，把 Uint8Array（二进制）解码成 UTF-8 字符串
    //    网络数据是二进制来的，JS 只能处理字符串，必须先解码

    let done = false; // 开关变量，data: [DONE] 到来时设为 true，结束循环
    //  ^^^^ let 声明一个可重新赋值的变量（const 不能重新赋值）
    let buffer = ''; // 缓存
    // 缓冲区：网络不按行边界切分数据，buffer 存"还没处理完的部分"等下轮拼

    while(!done) {
    //    ^ 取反：!false = true → 进入循环，!true = false → 退出循环
    //    while(条件)：条件为真就循环，为假就退出

      // 嘬一口，嘬到了 resolve，没嘬到继续等
      const {value, done: doneReading} = await reader?.read();
      //     ^^^^^  ^^^^^^^^^^^^^^^^^     ^^^^^       ^^^^^^^^^^
      //     |      解构赋值的别名语法      等待       reader 的 read() 方法
      //     |      把解构出来的 done 重命名      返回 {done: boolean, value: Uint8Array}
      //     |      为 doneReading，避免和外   done: true = 流关闭了
      //     |      层 let done 变量冲突     done: false = 还有数据
      //     这是解构赋值（ES6），reader?.read() 返回的 {done, value} 被拆开
      //     reader对象兼容性：老浏览器不一定支持 ReadableStream，?. 做兼容

      done = doneReading;
      // 把里层读到的 done 传给外层的循环开关变量

      // 除了把本轮的 value 要处理之外，之前会有东西要一起处理
      // chunk 一小块 json 格式
      // delta 偏移量 一小块一小块的增量
      // 解析 json 字符串 choices[0].delta.content
      const chunkValue = buffer + decoder.decode(value);
      //    ^^^^^^^^^               ^^^^^^
      //    本轮要处理的文本         把上轮没处理完的 buffer 拼到前面
      //    = 上轮残留 + 本轮新数据   注意：这里没传 {stream: true}，中文可能乱码（见下方说明）
      console.log(chunkValue);

      buffer = '';
      // 清空缓冲区，后面处理剩下的行再放回来（当前逻辑还未实现）

      // json 字符串 多行数据
      // 一次发送一行，也可能发送多行 —— 取决于 llm 计算速度和任务
      // data: {开始 又有数据来了}
      // data: {开始 又有数据来了}

      const lines = chunkValue.split('\n')
      //                   ^^^^^ 字符串按换行符 \n 切分成数组
        .filter((line) => line.startsWith('data: '))
      // ^^^^^^                                   ^^
      // 数组的 filter 方法                        ⚠️ BUG：正确拼写是 startsWith
      // 返回一个新数组，只保留满足条件的元素        JavaScript 字符串方法是 startsWith（注意 s），不是 startWith
      // 这里只保留以 'data: ' 开头的行            缺少 s 会导致运行时错误：line.startWith is not a function

      // ⚠️ 当前代码到这里就结束了，lines 数组拿到后没有进一步处理
      // 还需要做：
      //   1. 遍历 lines
      //   2. 去掉 "data: " 前缀（line.slice(6)）
      //   3. 判断是否为 '[DONE]'，是则结束
      //   4. JSON.parse() 解析
      //   5. 取 choices[0].delta.content 拼到 content.value
      //   6. buffer 要存最后不完整的行（lines.pop()）

    }

  } else {
  //    ^^^^ 用户没勾选 Streaming → 走非流式路径
    const data = await response.json();
    //               ^^^^^ 等 body 全部下载完 → 一次性解析 JSON
    //   response.json() 是 Fetch API 的方法（不是 JSON.parse()！）
    //   它是 ReadableStream 上的便捷方法，内部等价于读取全部数据再 JSON.parse
    // 只需要修改数据状态，响应式
    content.value = data.choices[0].message.content;
    //                             ^^^^^^^ 非流式的字段名是 message.content（全量）
    //         流式是 delta.content（增量），字段名不同
  }
}

// const count = ref(0); // 变量 → 数据（数据绑定）→ 数据状态（响应式）→ 页面状态（反应在）
// RefImpl 响应式对象，值是 count.value
// count.value 改变的时候，页面上绑定了 count 的地方会局部热更新
// console.log(count, count.value);
</script>

<template>
<!--
  <template> 是 Vue SFC 的模板区块
  里面是 Vue 模板语法，不是纯 HTML，Vue 编译时会把它们转成 render 函数
-->
<div class="container">
  <div>
    <label>输入：</label><input class="input" v-model="question" />
    <!--                                          ^^^^^^^^^^^^^^^^^
      v-model：Vue 的双向绑定指令（directive）
      v- 开头的是 Vue 指令，会被编译器特殊处理
      等价于：:value="question" + @input="question = $event.target.value"
      输入框内容 ↔ question.value，任何一方变了另一方自动同步
    -->
    <button @click="update">提交</button>
    <!--      ^^^^^^^^^^^^^^^
      @click = v-on:click 的简写，Vue 事件绑定指令
      @ 就是 v-on: 的符号简写
      点击触发 update 函数
    -->
  </div>
  <div class="output">
    <div>
      <label>Streaming</label>
      <input type="checkbox" v-model="stream"/>
      <!--                            ^^^^^^
        v-model 绑定复选框：勾上 = true，不勾 = false
        Vue 自动处理 checked 属性的变化
      -->
    </div>
    <div>{{ content }}</div>
    <!--   ^^^^^^^^^^^^^^
      {{ }} = 插值表达式（Mustache 语法），Vue 最基础的模板语法
      content.value 每次变化 → 这里自动重新渲染
      这就是响应式系统的核心价值：数据变了，页面自动跟着变
    -->
  </div>
</div>
</template>

<style>
/*
  <style> 是 Vue SFC 的样式区块
  没加 scoped → 全局生效。加 scoped 后 Vue 会给组件元素加 data-v-xxxxx 属性，样式只命中当前组件
*/

.container {
  /* 文档流 是页面布局的基础
  从上到下，从左到右，流式布局
  每个盒子在文档流有自己的位置和大小
  盒模型
  开启新的格式化上下文 */

  display: flex;
  /*      ^^^^ Flexbox 布局（CSS3），子元素可在弹性容器内灵活排列 */

  flex-direction: column;
  /*             ^^^^^^ 主轴方向 = 纵向，子元素从上到下排列 */

  align-items: start;
  /*         ^^^^^ 交叉轴对齐：子元素靠左 */

  justify-content: start;
  /*              ^^^^^ 主轴对齐：子元素从顶部开始 */

  height: 100vh;
  /*     ^^^^ vh = viewport height（视口高度单位）
      100vh = 整个浏览器窗口的可视高度 */

  font-size: 0.85rem; /* 移动端适配，等比例 html标签等比例 */
  /*              ^^^^ rem = root em，相对于 <html> 标签 font-size 的倍数
      适合响应式布局：改 html 的字号，所有用 rem 的地方等比例缩放 */
}

.input {
  width: 200px;
}

.output {
  margin-top: 10px;
  /* margin：外边距（CSS 盒模型：margin → border → padding → content）*/

  min-height: 300px;
  /*        ^^ 最小高度，内容不足时撑开，内容多了自动增高 */

  width: 100%;
  /*    ^^^ 占父容器宽度的 100% */

  text-align: left;
  /*        ^^^^ 文本水平左对齐 */
}

button {
  padding: 0 10px;
  /*      ^^^^^^^^ 上下 0，左右 10px（内边距，盒子内容与边框之间的空间）*/

  margin-left: 6px;
  /*          ^^ 左边外边距，让按钮和输入框之间有个间隙 */
}
</style>
