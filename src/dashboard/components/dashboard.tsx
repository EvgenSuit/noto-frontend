import { useEffect, useState } from "react"
import { postTodo, getTodos, setAuth, setAuthGetter, Todo } from "../api/dashboard"
import { useAuth } from "../../auth/api/auth_context"
import './Dashboard.css'


export const Dashboard = () => {
    const [todos, setTodos] = useState<Todo[]>()
    const auth = useAuth()

    useEffect(() => {
        setAuthGetter(() => auth);
        (async () => {
            const todos = await getTodos()
            setTodos(todos)
           
        })()
    }, [auth])

    async function addTodo(title: string) {
        const newTodos = await postTodo(title)
        setTodos(newTodos)
    }

    return (
    <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>
        <NewTodo
            onNewTodoSubmit={(title: string) => {
                addTodo(title)
            }}
        />
        <ul className="todo-list">
            {todos?.map(todo => (
                <li key={todo.id} className="todo-item">
                    <div className="todo-item-header">
                        <span className="todo-title">
                            {todo.title}
                        </span>
                        <span className={`todo-status ${todo.status.toLocaleLowerCase()}`}>
                        {(() => {
                            switch(todo.status) {
                                case 'NONE':
                                    return 'Not started';
                                case 'IN_PROGRESS':
                                    return 'In Progress';
                                case 'DONE':
                                    return 'Done';
                            }
                        })()}
                        </span>
                    </div>
                    <div className="todo-item-created-at">{todo.createdAt}</div>
                </li>
            ))}
        </ul>
    </div>
 )
}

function NewTodo ({onNewTodoSubmit}: {
    onNewTodoSubmit: (title: string) => void
}) {
    const [title, setTitle] = useState('')
    return (
        <div className="new-todo">
            <input className="todo-input" placeholder="Add a new todo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            ></input>
            <button className="todo-submit"
            disabled={title.trim().length === 0}
            onClick={() => onNewTodoSubmit(title.trim())}>Add Todo</button>
        </div>
    )
}