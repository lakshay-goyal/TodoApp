import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  console.log(API_BASE_URL);

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getTodos`);
      setTodos(response.data.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      alert('Failed to fetch todos');
    }
  };

  // Create a new todo
  const handleCreateTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/createTodo`, {
        title,
        description
      });
      // Reset form and fetch updated todos
      setTitle('');
      setDescription('');
      fetchTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
      alert('Failed to create todo');
    }
  };

  // Update an existing todo
  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/updateTodo/${editingTodo._id}`, {
        title,
        description
      });
      // Reset editing state and fetch updated todos
      setEditingTodo(null);
      setTitle('');
      setDescription('');
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update todo');
    }
  };

  // Delete a todo
  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/deleteTodo/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo');
    }
  };

  // Prepare todo for editing
  const startEditing = (todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="md:col-span-1 bg-gray-800 rounded-2xl shadow-2xl p-8 h-fit">
            <h2 className="text-3xl font-bold text-center text-white mb-6">
              {editingTodo ? 'Edit Todo' : 'Create Todo'}
            </h2>
            <form onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}>
              <div className="space-y-6">
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Todo Title"
                  maxLength={50}
                  required 
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                />
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Todo Description"
                  maxLength={50}
                  required 
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 transition duration-300"
                />
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition duration-300 transform hover:scale-105"
                >
                  {editingTodo ? 'Update Todo' : 'Create Todo'}
                </button>
              </div>
            </form>
          </div>

          {/* Todo List Section */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-4xl font-bold text-white mb-6">Your Todos</h2>
            {todos.length === 0 ? (
              <div className="bg-gray-800 rounded-2xl p-8 text-center text-gray-400">
                No todos yet. Create your first todo!
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {todos.map((todo) => (
                  <div 
                    key={todo._id} 
                    className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-purple-300 mb-2 truncate">{todo.title}</h3>
                      <p className="text-gray-400 mb-3 line-clamp-2">{todo.description}</p>
                      <small className="text-gray-500 text-xs block mb-4">
                        Created: {new Date(todo.createdAt).toLocaleString()}
                      </small>
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => startEditing(todo)}
                          className="flex-1 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition duration-300"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteTodo(todo._id)}
                          className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoApp;