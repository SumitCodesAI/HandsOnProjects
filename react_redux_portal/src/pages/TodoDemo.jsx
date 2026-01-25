import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, toggleTodo, deleteTodo, setFilter, clearCompleted } from '../store/slices/todosSlice';
import './TodoDemo.css';

const TodoDemo = () => {
  const todos = useSelector((state) => state.todos.todos);
  const filter = useSelector((state) => state.todos.filter);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch(addTodo(inputValue.trim()));
      setInputValue('');
    }
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="demo-container">
      <h1 className="demo-title">Todo List Demo</h1>
      <p className="demo-description">
        A complete todo list application using Redux. Add, complete, and filter tasks to see state management in action!
      </p>

      <div className="todo-app">
        <form onSubmit={handleSubmit} className="todo-input-section">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input"
          />
          <button type="submit" className="add-btn">
            Add Task
          </button>
        </form>

        <div className="filter-section">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => dispatch(setFilter('all'))}
          >
            All ({todos.length})
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => dispatch(setFilter('active'))}
          >
            Active ({activeCount})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => dispatch(setFilter('completed'))}
          >
            Completed ({todos.length - activeCount})
          </button>
        </div>

        <div className="todos-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>No tasks {filter !== 'all' ? filter : 'yet'}!</p>
              {filter === 'all' && <p className="empty-hint">Add a task above to get started</p>}
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => dispatch(toggleTodo(todo.id))}
                  className="todo-checkbox"
                />
                <span className="todo-text">{todo.text}</span>
                <button
                  onClick={() => dispatch(deleteTodo(todo.id))}
                  className="delete-btn"
                  title="Delete task"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <div className="todo-footer">
            <span className="items-left">{activeCount} {activeCount === 1 ? 'item' : 'items'} left</span>
            {todos.some(todo => todo.completed) && (
              <button
                onClick={() => dispatch(clearCompleted())}
                className="clear-btn"
              >
                Clear Completed
              </button>
            )}
          </div>
        )}
      </div>

      <div className="redux-info">
        <h3>Redux Features Demonstrated:</h3>
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <div>
              <strong>Multiple Actions:</strong> Add, toggle, delete, filter, and clear todos
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <div>
              <strong>Complex State:</strong> Managing an array of objects with multiple properties
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <div>
              <strong>Derived State:</strong> Filtering todos based on status without storing filtered data
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <div>
              <strong>Immutable Updates:</strong> Redux Toolkit handles immutability automatically
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoDemo;
