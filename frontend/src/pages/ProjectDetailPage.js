// frontend/src/pages/ProjectDetailPage.js

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import AuthContext from '../context/AuthContext';

const ProjectDetailPage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for forms
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDeadline, setTaskDeadline] = useState('');
    const [taskAssignee, setTaskAssignee] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

    const fetchProjectData = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/projects/${id}/`);
            setProject(response.data);
            setEditedName(response.data.name);
            setEditedDescription(response.data.description);
            if (response.data.members.length > 0) {
                setTaskAssignee(response.data.members[0].id);
            }
        } catch (err) {
            setError('Failed to fetch project details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchProjectData();
            if (user.role === 'MANAGER' || user.role === 'ADMIN') {
                const fetchUsers = async () => {
                    try {
                        const response = await apiClient.get('/users/');
                        setAllUsers(response.data);
                        if (response.data.length > 0) setSelectedUser(response.data[0].id);
                    } catch (err) {
                        console.error("Could not fetch users", err);
                    }
                };
                fetchUsers();
            }
        }
    }, [id, user]);

    const isOverdue = (task) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deadline = new Date(task.deadline);
        return deadline < today && task.status !== 'DONE';
    };
    
    // --- All Handler Functions ---
    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post(`/projects/${id}/add_member/`, { user_id: selectedUser });
            alert('Member added successfully!');
            fetchProjectData();
        } catch (err) {
            alert('Error: Could not add member.');
        }
    };
    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const response = await apiClient.patch(`/tasks/${taskId}/`, { status: newStatus });
            const updatedTasks = project.tasks.map(task => task.id === taskId ? response.data : task);
            setProject({ ...project, tasks: updatedTasks });
        } catch (err) {
            alert("Error: Could not update task status.");
        }
    };
    const handleDeleteProject = async () => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await apiClient.delete(`/projects/${id}/`);
                navigate('/');
            } catch (err) {
                alert('Error: Could not delete the project.');
            }
        }
    };
    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/tasks/', { title: taskTitle, project: id, assigned_to: taskAssignee, deadline: taskDeadline });
            setProject({ ...project, tasks: [...project.tasks, response.data] });
            setTaskTitle('');
            setTaskDeadline('');
        } catch (err) {
            alert("Error: Could not create the task.");
        }
    };
    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await apiClient.delete(`/tasks/${taskId}/`);
                const updatedTasks = project.tasks.filter(task => task.id !== taskId);
                setProject({ ...project, tasks: updatedTasks });
            } catch (err) {
                alert('Error: Could not delete the task.');
            }
        }
    };
    const handleUpdateProject = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.patch(`/projects/${id}/`, { name: editedName, description: editedDescription });
            setProject(response.data);
            setIsEditing(false);
        } catch (err) {
            alert('Error: Could not update the project.');
        }
    };

    if (!user) return <p>Loading user data...</p>;
    if (loading) return <p>Loading project...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!project) return <p>Project not found.</p>;

    return (
        <div>
            <Link to="/">&larr; Back to Dashboard</Link>

            {isEditing ? (
                <form onSubmit={handleUpdateProject} style={{ marginTop: '20px' }}>
                    <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} required />
                    <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} style={{ width: '100%', minHeight: '80px', marginTop: '10px' }} />
                    <div style={{ marginTop: '10px' }}>
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)} style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>Cancel</button>
                    </div>
                </form>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2>{project.name}</h2>
                        <p>{project.description || "No description provided."}</p>
                    </div>
                    {user && (user.role === 'MANAGER' || user.role === 'ADMIN') && (
                        <div>
                            <button onClick={() => setIsEditing(true)} style={{ marginRight: '10px' }}>Edit Project</button>
                            <button onClick={handleDeleteProject} style={{ backgroundColor: '#dc3545', color: 'white' }}>Delete Project</button>
                        </div>
                    )}
                </div>
            )}
            <hr />

            {user && (user.role === 'MANAGER' || user.role === 'ADMIN') && (
                <div style={{ marginBottom: '20px' }}>
                    <h3>Create New Task</h3>
                    <form onSubmit={handleCreateTask}>
                        <input type="text" placeholder="Task Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required />
                        <select value={taskAssignee} onChange={(e) => setTaskAssignee(e.target.value)} required>
                            {project.members.map(member => (<option key={member.id} value={member.id}>{member.username}</option>))}
                        </select>
                        <input type="date" value={taskDeadline} onChange={(e) => setTaskDeadline(e.target.value)} required />
                        <button type="submit">Add Task</button>
                    </form>
                    <hr />
                </div>
            )}

            <h3>Tasks</h3>
            <ul>
                {project.tasks.length > 0 ? (
                    project.tasks.map(task => (
                        <li key={task.id}>
                            <div>
                                <strong>{task.title}</strong>
                                <div style={{ fontSize: '0.85em', color: '#6c757d', marginTop: '5px' }}>
                                    <span>Deadline: {task.deadline}</span>
                                    {isOverdue(task) && ( <span style={{ color: 'red', fontWeight: 'bold', marginLeft: '10px' }}>(Overdue)</span> )}
                                </div>
                            </div>
                            <div>
                                {user && Number(task.assigned_to) === Number(user.user_id) ? (
                                    <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)}>
                                        <option value="TO_DO">To Do</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="DONE">Done</option>
                                    </select>
                                ) : ( <span>- {task.status}</span> )}
                                {user && (user.role === 'MANAGER' || user.role === 'ADMIN') && (
                                    <button onClick={() => handleDeleteTask(task.id)} style={{ marginLeft: '10px', backgroundColor: '#6c757d', fontSize: '0.8em', padding: '5px 10px' }}>Delete</button>
                                )}
                            </div>
                        </li>
                    ))
                ) : ( <p>No tasks in this project yet.</p> )}
            </ul>

            <hr />
            <h3>Members</h3>
            <ul>
                {project.members.map(member => (
                    <li key={member.id}>{member.username} ({member.email})</li>
                ))}
            </ul>

            {user && (user.role === 'MANAGER' || user.role === 'ADMIN') && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Add Member to Project</h4>
                    <form onSubmit={handleAddMember}>
                        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
                            <option value="" disabled>Select a user to add</option>
                            {allUsers.map(u => (
                                <option key={u.id} value={u.id}>{u.username}</option>
                            ))}
                        </select>
                        <button type="submit">Add Member</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProjectDetailPage;