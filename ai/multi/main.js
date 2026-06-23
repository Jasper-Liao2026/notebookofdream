import './style.css';

document.querySelector('#app').innerHTML = `
  <div class="container">
    <p>Vite 项目已启动 ✅</p>
    <p>环境变量 VITE_API_KEY: <code>${import.meta.env.VITE_API_KEY || '未设置'}</code></p>
  </div>
`;
