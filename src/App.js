import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteTodoId, setDeleteTodoId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos: ', error);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post('/todos', {
        text: newTodo,
        completed: false,
      });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo: ', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo: ', error);
    }
    setDeleteTodoId(null);
    setShowConfirmation(false);
  };

  const handleEdit = (id, text) => {
    setEditMode(id);
    setEditValue(text);
  };

  const updateTodo = async (id) => {
    try {
      await axios.put(`/todos/${id}`, {
        text: editValue,
      });
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, text: editValue } : todo
      );
      setTodos(updatedTodos);
      setEditMode(null);
    } catch (error) {
      console.error('Error updating todo: ', error);
    }
  };

  const handleDeleteConfirm = (id) => {
    setDeleteTodoId(id);
    setShowConfirmation(true);
  };

  const handleCancelDelete = () => {
    setDeleteTodoId(null);
    setShowConfirmation(false);
  };

  return (
    <div className="todo-container">
      <h1>TODO List</h1>
      <div className="input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new todo"
        />
        <button className="add-btn" onClick={addTodo}>Add Todo</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            {editMode === todo.id ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <button className="update-btn" onClick={() => updateTodo(todo.id)}>Update</button>
              </>
            ) : (
              <>
                <span>{todo.text}</span>
                <div>
                  <button className="edit-btn" onClick={() => handleEdit(todo.id, todo.text)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteConfirm(todo.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {showConfirmation && (
        <div className="confirmation-modal">
          <p>Are you sure you want to delete this todo item?</p>
          <div className="confirmation-buttons">
            <button onClick={() => deleteTodo(deleteTodoId)}>Yes</button>
            <button onClick={handleCancelDelete}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoApp;
