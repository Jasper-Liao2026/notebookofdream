import React,{lazy,Suspense} from 'react';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
//路由守卫组件
import RequireAuth from './components/RequireAuth';
import Nav from './components/Nav';
import { useAuthStore } from './store/user';
const Home = lazy(()=>import('./pages/Home'));
const Login = lazy(()=>import('./pages/Login'));
const Pay = lazy(()=>import('./pages/Pay'));
function App(){
  //组件状态几乎都不放在component，放到store
  const token = useAuthStore(state=>state.token);
  return(
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Nav />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pay" element={
            <RequireAuth>
              <Pay />
            </RequireAuth>
          } />
        </Routes>
      </Suspense>
    </Router>
  )
}
export default App;