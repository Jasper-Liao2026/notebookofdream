import { useState, useEffect, useRef } from 'react'
import './App.css'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

type FilterType = 'all' | 'active' | 'completed'

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return []
      }
    }
    return [
      { id: '1', text: '学习 React', completed: false, createdAt: Date.now() - 86400000 },
      { id: '2', text: '学习 TypeScript', completed: true, createdAt: Date.now() - 43200000 },
      { id: '3', text: '构建 TodoList 应用', completed: false, createdAt: Date.now() },
    ]
  })

  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [addingId, setAddingId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    // 聚焦输入框
    if (!addingId && inputRef.current) {
      inputRef.current.focus()
    }
  }, [addingId])

  const addTodo = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return

    const newId = Date.now().toString()
    const newTodo: Todo = {
      id: newId,
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    }

    // 添加动画
    setAddingId(newId)
    setTimeout(() => {
      setTodos(prev => [...prev, newTodo])
      setInputValue('')
      setTimeout(() => setAddingId(null), 300)
    }, 100)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTodo()
  }

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    // 先触发删除动画
    setDeletingIds(prev => new Set(prev).add(id))
    // 动画结束后再删除
    setTimeout(() => {
      setTodos(prev => prev.filter(todo => todo.id !== id))
      setDeletingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 350)
  }

  const clearCompleted = () => {
    const completedIds = todos.filter(t => t.completed).map(t => t.id)
    // 批量删除动画
    completedIds.forEach(id => {
      setDeletingIds(prev => new Set(prev).add(id))
    })
    setTimeout(() => {
      setTodos(prev => prev.filter(todo => !todo.completed))
      setDeletingIds(new Set())
    }, 350)
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  return (
    <div className="app-container">
      <div className="todo-app">
        <header className="app-header">
          <h1>📋 Todo List</h1>
          <p className="subtitle">组织你的每一天</p>
        </header>

        <div className="input-section">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="添加新的任务..."
              className="todo-input"
              maxLength={100}
            />
            <button
              onClick={addTodo}
              className="add-btn"
              disabled={!inputValue.trim()}
            >
              ✚ 添加
            </button>
          </div>
        </div>

        <div className="filter-section">
          {(['all', 'active', 'completed'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
            >
              {f === 'all' ? '全部' : f === 'active' ? '进行中' : '已完成'}
            </button>
          ))}
        </div>

        <div className="todo-list">
          {filteredTodos.length === 0 && deletingIds.size === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>
                {filter === 'all'
                  ? '还没有任务，添加一个吧！'
                  : filter === 'active'
                  ? '太棒了！所有任务都已完成 🎉'
                  : '还没有已完成的任务'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo, index) => {
              const isDeleting = deletingIds.has(todo.id)
              const isAdding = addingId === todo.id
              return (
                <div
                  key={todo.id}
                  className={`todo-item ${todo.completed ? 'completed' : ''} ${isDeleting ? 'deleting' : ''} ${isAdding ? 'adding' : ''}`}
                  style={{
                    animationDelay: isAdding ? '0s' : `${index * 0.06}s`,
                    display: isDeleting ? undefined : undefined,
                  }}
                >
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <span className="todo-text">{todo.text}</span>
                  <span className="todo-time">
                    {new Date(todo.createdAt).toLocaleDateString('zh-CN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-btn"
                    title="删除任务"
                  >
                    ✕
                  </button>
                </div>
              )
            })
          )}
        </div>

        <footer className="app-footer">
          <div className="stats">
            <span className="stat-item">
              <strong>{activeCount}</strong> 项待办
            </span>
            <span className="stat-divider">|</span>
            <span className="stat-item">
              已完成 <strong>{completedCount}</strong> 项
            </span>
            <span className="stat-divider">|</span>
            <span className="stat-item">
              共 <strong>{todos.length}</strong> 项
            </span>
          </div>
          {completedCount > 0 && (
            <button onClick={clearCompleted} className="clear-btn">
              🗑 清除已完成
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}

export default App
