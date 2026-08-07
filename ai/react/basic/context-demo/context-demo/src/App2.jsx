import{
  useState
} from 'react';
import { ThemeContext } from './ThemeContext';
import Page from './components/Page';

function App() {
  const [theme,setTheme]=useState('light');
    return (
        // 上下文的提供者 容器
        // 并不是需要全局，任何地方作为容器使用
        // 默认值light ，可以通过value改变
        <ThemeContext.Provider value={theme}>
            <Page />
            <button onClick={()=>setTheme('dark')}>切换主题</button>
        </ThemeContext.Provider>
    );
}
export default App;
