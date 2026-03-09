import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUser, deleteUser, updateUser } from '../store/slices/usersSlice';
import './UserDemo.css';

const UserDemo = () => {
  const users = useSelector((state) => state.users.users);
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'User' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim()) {
      if (editingUser) {
        dispatch(updateUser({ ...formData, id: editingUser.id }));
        setEditingUser(null);
      } else {
        dispatch(addUser(formData));
      }
      setFormData({ name: '', email: '', role: 'User' });
      setShowForm(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'User' });
  };

  return (
    <div className="demo-container">
      <h1 className="demo-title">User Management Demo</h1>
      <p className="demo-description">
        Manage a list of users with full CRUD operations. Add, edit, and delete users to see Redux handle complex state updates!
      </p>

      <div className="user-app">
        <div className="app-header">
          <h2>Team Members ({users.length})</h2>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="add-user-btn">
              + Add User
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="user-form">
            <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Developer">Developer</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingUser ? 'Update User' : 'Add User'}
              </button>
              <button type="button" onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="users-grid">
          {users.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h3>{user.name}</h3>
                <p className="user-email">{user.email}</p>
                <span className={`user-role ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </div>
              <div className="user-actions">
                <button
                  onClick={() => handleEdit(user)}
                  className="edit-btn"
                  title="Edit user"
                >
                  ✎
                </button>
                <button
                  onClick={() => dispatch(deleteUser(user.id))}
                  className="delete-btn"
                  title="Delete user"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <p>No users yet!</p>
            <p className="empty-hint">Click "Add User" to create your first team member</p>
          </div>
        )}
      </div>

      <div className="redux-info">
        <h3>Redux CRUD Operations:</h3>
        <div className="operations-grid">
          <div className="operation-card">
            <div className="operation-icon create">C</div>
            <h4>Create</h4>
            <p>Add new users to the Redux store with unique IDs</p>
          </div>
          <div className="operation-card">
            <div className="operation-icon read">R</div>
            <h4>Read</h4>
            <p>Display all users from the centralized state</p>
          </div>
          <div className="operation-card">
            <div className="operation-icon update">U</div>
            <h4>Update</h4>
            <p>Modify user details while maintaining immutability</p>
          </div>
          <div className="operation-card">
            <div className="operation-icon delete">D</div>
            <h4>Delete</h4>
            <p>Remove users from the store efficiently</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDemo;
