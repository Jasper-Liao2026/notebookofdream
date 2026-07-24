import { useState } from 'react';

function heavyComputation() {
    console.log('开始执行 heavyComputation....');
    const startTime = performance.now();
    const result = [];
    for (let i = 0; i < 10000; i++) {
        result.push({ id: i, name: `用户-${i}` });
    }
    const duration = performance.now() - startTime;
    console.log(duration);
    return result;
}

// 自定义 Hook：把用户数据和过滤逻辑打包，返回两个东西
function useUserFilter() {
    const [users] = useState(() => heavyComputation());    // 惰性初始化，只算一次
    const [filterText, setFilterText] = useState('');
    const filteredUsers = users.filter(user => user.name.includes(filterText));

    
    return [filteredUsers, filterText, setFilterText];     // 一次性返回 3 个
}

function App() {
    const [filteredUsers, filterText, setFilterText] = useUserFilter();  // 解构取出来

    return (
        <div style={{ padding: '20px' }}>
            <h2>用户列表</h2>
            <input type="text" placeholder="输入用户名过滤"
                value={filterText} onChange={(e) => setFilterText(e.target.value)} />
            <p>当前显示{filteredUsers.length}</p>
            <ul style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {filteredUsers.map(user => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
