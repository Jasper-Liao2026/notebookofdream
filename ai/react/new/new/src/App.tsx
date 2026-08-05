import * as React from 'react';
import Hello from './components/Hello';
import NameEditComponent from './components/NameEditComponent';

const App = () => {
    // name：最终确认的名字
    const [name, setName] = React.useState<string>("默认用户名");
    // editingName：编辑过程中临时文本（随输入框实时变化）
    const [editingName, setEditingName] = React.useState("默认用户名");

    // useEffect：组件挂载后执行副作用（这里模拟异步请求）
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setName("来自服务器的名字");
            setEditingName("来自服务器的名字");
        }, 2000);
        // 清理函数：组件卸载时取消定时器
        return () => clearTimeout(timer);
    }, []); // [] 表示只执行一次（挂载时）

    // 点击 Change 按钮：把临时文本"确认"为正式名字
    const setUsernameState = () => {
        setName(editingName);
    };

    return (
        <>
            <Hello userName={name} />
            <NameEditComponent
                editingName={editingName}
                onEditingNameUpdated={setEditingName}
                onNameUpdated={setUsernameState}
                disabled={editingName === "" || editingName === name}
            />
        </>
    );
};

export default App;
