import{
  lazy,
  Suspense
} from 'react';

import{
  //location.hash 
  //前端路由有两种，HashRouter 老的，html5 history
  
  BrowserRouter as Router,//前端路由 #/ hashchange
  Routes,//路由配置数组 都是数组
  Route,//路由配置项
  Navigate//重定向组件
}from 'react-router-dom';
import Navigation from './components/Navigation';
//SPA,动态切换多个界面
//下载，执行 影响首页加载速度
//只要加载当前页面就好，路由懒加载
// import Home from './pages/Home';
// import About from './pages/about'
// import 函数
const Home = lazy(()=>import('./pages/Home'));
const About = lazy(()=>import('./pages/about'));
const UserProfile = lazy(()=>import('./pages/UserProfile'));
const NotFound = lazy(()=>import('./pages/NotFound'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/Products/Detail'));
const Login = lazy(()=>import('./pages/Login'));
const ProtectRoute = lazy(()=>import('./ProtectRoute'));
const Pay = lazy(()=>import('./pages/Pay'));
const App= ()=>{
  return (
    <>
    {/* 前端路由接管一切 */}
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
      {/* 导航栏组件 */}
      <Navigation />
      <div id="container">
        {/* 动态页面切换部分 既是配置，又是出现的地方*/}
        <Routes>

          {/* 有且只有一个Route显示 当前location.hash
          对应页面级别组件 */}
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/user/:id' element={<UserProfile/>} />
          <Route path="/products" element={<Products />}>
            {/* 二级路由 */}
           <Route path=':productId' element={<ProductDetail/>}/>
          
          </Route>
          

          <Route path='/old-path' element={
            <Navigate to="/new-path" replace />
          }/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/pay' element={
            //保护路由ProtectRoute 门禁
            //children 用来定制化组件
            <ProtectRoute>
              {/* children */}
              <Pay/>
            </ProtectRoute>
          }/>

          {/* 贪婪匹配所有，最后404兜底 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </div>
      </Suspense>
    </Router>
    </>
  )
}
export default App