// frontend/src/pages/DashboardPage.js

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import apiClient from '../services/api';

const DashboardPage = () => {
  const { user, logout } = useContext(AuthContext); // This is the user object that is initially null
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  useEffect(() => {
    // Only fetch projects if the user object is available
    if (user) {
      const fetchProjects = async () => {
        try {
          const response = await apiClient.get('/projects/');
          setProjects(response.data);
        } catch (err) {
          console.error('Failed to fetch projects:', err);
          setError('Could not load projects.');
        } finally {
          setLoading(false);
        }
      };

      fetchProjects();
    }
  }, [user]); // Re-run this effect when the user object changes

  const handleCreateProject = async (e) => {
    e.preventDefault();
    // ... (rest of the function is the same)
    try {
      const response = await apiClient.post('/projects/', {
        name: newProjectName,
        description: newProjectDescription,
      });
      setProjects([...projects, response.data]);
      setNewProjectName('');
      setNewProjectDescription('');
    } catch (err) {
      console.error('Failed to create project:', err);
      alert('Error creating project.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- THIS IS THE FIX ---
  // If the user data is not yet loaded from the context, show a loading screen.
  // This prevents the component from crashing by trying to access user.username.
  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard</h2>
        <div>
          <span>Welcome, {user.username}!</span>
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
        </div>
      </div>

      <hr />

      {user && (user.role === 'MANAGER' || user.role === 'ADMIN') && (
        <div>
          <h3>Create New Project</h3>
          <form onSubmit={handleCreateProject}>
            <input
              type="text"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Project Description"
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
            />
            <button type="submit">Create</button>
          </form>
          <hr />
        </div>
      )}

      <h3>Your Projects</h3>
      {loading && <p>Loading projects...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <ul>
          {projects.length > 0 ? (
            projects.map((project) => (
              <li key={project.id}>
                <Link to={`/projects/${project.id}`}>{project.name}</Link>
              </li>
            ))
          ) : (
            <p>You are not a member of any projects yet.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default DashboardPage;