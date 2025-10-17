const API_BASE = import.meta.env.VITE_API_BASE || '/api';


export async function fetchTodos() {
    const res = await fetch(`${API_BASE}/todos`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}


export async function createTodo(title) {
    const res = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}


export async function updateTodo(id, payload) {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}


export async function deleteTodo(id) {
    const res = await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
    return res.json();
}