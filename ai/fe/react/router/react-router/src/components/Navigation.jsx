// a 点击后跳转，二次处理
//不直接用a，react-router-dom 提供了靠谱的Link组件、
//适合SPA 路由跳转的组件功能
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/user/123">小家</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation