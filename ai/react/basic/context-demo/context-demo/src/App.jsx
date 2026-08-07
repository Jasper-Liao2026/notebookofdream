import { useMouse } from './hooks/useMouse';

function App() {
    const { x, y } = useMouse();
    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
            {x} {y}
        </div>
    );
}
export default App;
