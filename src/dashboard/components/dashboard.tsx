import React, { useEffect, useRef, useState } from "react"
import { postTodo, getTodos, setAuth, setAuthGetter, Todo, putTodo, deleteTodo } from "../api/dashboard"
import { useAuth } from "../../auth/api/auth_context"
import DeleteIcon from '@mui/icons-material/Delete'
import './Dashboard.css'


export const Dashboard = () => {
    const [todos, setTodos] = useState<Todo[]>()
    const auth = useAuth()
    const [editIndex, setEditIndex] = useState(0)

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
    async function modifyTodo(id: number, title: string, status: string) {
        setTodos(await putTodo(id, title, status))
    }
    async function removeTodo(id: number) {
        setTodos(await deleteTodo(id))
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
                <div key={todo.id}>
                    <TodoItem
                        todo={todo}
                        isTitleSelected={editIndex === todo.id}
                        onTitleEdit={(newTitle) => modifyTodo(todo.id, newTitle, todo.status)}
                        onTitleClick={(id: number) => setEditIndex(id)}
                        onChangeStatus={s => {
                            modifyTodo(todo.id, todo.title, s)
                        }}
                        onDelete={() => removeTodo(todo.id)
                        }
                />
                </div>
            ))}
        </ul>
    </div>
 )
}

function TodoItem(
    {todo,
        isTitleSelected,
        onTitleClick,
        onTitleEdit,
        onChangeStatus, onDelete}: { 
        todo: Todo,
        isTitleSelected: boolean,
        onTitleClick: (id: number) => void,
        onTitleEdit: (newTitle: string) => void,
        onChangeStatus: (status: string) => void,
        onDelete: () => void
    }
) {
    const statusMap = {
        'NONE': 'Not started',
        'IN_PROGRESS': 'In Progress',
        'DONE': 'Done'
    } as const;

    const reverseMap = {
        'Not started': 'NONE',
        'In Progress': 'IN_PROGRESS',
        'Done': 'DONE'
    } as const;
    const currLabel = statusMap[todo.status]

    const inputRef = useRef<HTMLTextAreaElement>(null)
    useEffect(() => {
        if (isTitleSelected && inputRef.current) {
            inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length)
            inputRef.current.focus()
        }
    }, [isTitleSelected])

    const [newTitle, setNewTitle] = useState(todo.title)

    return (
        <div className="todo-item-container">
            <button 
                className="delete-item-button"
                onClick={() => {
                    onDelete()
                }}>
                    <DeleteIcon className="delete-item" />
            </button>
            <li className="todo-item">
                <div className="todo-item-header">
                    <div className="todo-title-container" onClick={() => onTitleClick(todo.id)}>
                        {isTitleSelected ? (
                            <textarea 
                            className="todo-title-edit"
                                value={newTitle}
                                ref={inputRef}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onBlur={() => {
                                    onTitleEdit(newTitle)
                                    onTitleClick(-1)
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        onTitleEdit(newTitle)
                                        onTitleClick(-1)
                                    }
                                }}
                                />
                        ) : (
                            <span className="todo-title">
                            {todo.title}
                        </span>
                        )}
                    </div>

                    <select className={`todo-status ${todo.status.toLocaleLowerCase()}`}
                    defaultValue={currLabel}
                    onChange={e => {
                        const selectedLabel = e.target.value
                        const newStatus = reverseMap[selectedLabel as keyof typeof reverseMap]
                        onChangeStatus(newStatus)
                    }}>
                        {
                            Object.values(statusMap).map((option, id) =>
                                <option key={id} id={`${id}`}>{option}</option>
                            )
                        }
                    </select>
                </div>
            <div className="todo-item-created-at">{todo.createdAt}</div>
            </li>
        </div>    
        )
}

function NewTodo ({onNewTodoSubmit}: {
    onNewTodoSubmit: (title: string) => void
}) {
    const [title, setTitle] = useState('')

    function submitTodo() {
        onNewTodoSubmit(title)
        setTitle('')
    }

    return (
        <div className="new-todo">
            <input className="todo-input" placeholder="Add a new todo"
            value={title}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter' && title.trim().length !== 0) {
                    submitTodo()
                }
            }} 
            onChange={(e) => setTitle(e.target.value)}
            ></input>
            <button className="todo-submit"
            disabled={title.trim().length === 0}
            onClick={submitTodo}>Add Todo</button>
        </div>
    )
}