import { Navigate, useLocation } from 'react-router-dom';

const ProtectRoute = ({ children }) => {
    const isLogin = localStorage.getItem('isLogin') === 'true';
    const location = useLocation();

    if (!isLogin) {
        // 未登录 → 跳转登录页，记住来源路径
        //路由，设置state
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
        //跳转到登录页
    }

    return children;
};

export default ProtectRoute;
