import React, { useEffect, useState } from 'react'
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api'


function AddTodo({ onAdd }) {
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)


  const submit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSaving(true)
    try {
      await onAdd(text.trim())
      setText('')
    } finally {
      setSaving(false)
    }
  }


  return (
    <form onSubmit={submit} style={{ marginBottom: 20 }}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add a todo..."
        style={{ padding: 8, width: '70%', marginRight: 8 }}
      />
      <button disabled={saving} type="submit">{saving ? 'Saving...' : 'Add'}</button>
    </form>
  )
}


function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
      <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo)} />
      <div style={{ flex: 1, marginLeft: 12, textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.title}
        <div style={{ fontSize: 12, color: '#666' }}>{new Date(todo.created_at).toLocaleString()}</div>
      </div>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  )
}




export default function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTodos()
        setTodos(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])


  const handleAdd = async (title) => {
    const newTodo = await createTodo(title)
    setTodos(prev => [newTodo, ...prev])
  }


  const handleToggle = async (todo) => {
    const updated = await updateTodo(todo.id, { completed: !todo.completed })
    setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
  }


  const handleDelete = async (id) => {
    await deleteTodo(id)
    setTodos(prev => prev.filter(t => t.id !== id))
  }


  if (loading) return <div style={{ padding: 20 }}>Loading...</div>
  if (error) return <div style={{ padding: 20 }}>Error: {error}</div>


  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 16px' }}>
      <h1>Todo App</h1>
      <AddTodo onAdd={handleAdd} />
      {todos.length === 0 ? <p>No todos yet.</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map(t => (
            <TodoItem key={t.id} todo={t} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </ul>
      )}
    </div>
  )
}