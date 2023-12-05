import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import '../css/User.css';

function User() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [projects, setProjects] = useState([]);
  const [editedProject, setEditedProject] = useState({
    projectId: '',
    nameOfProject: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false); // Stan określający, czy jesteśmy w trybie edycji

  const fetchUserProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/projects', { withCredentials: true });
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  useEffect(() => {
    // Pobranie nazwy użytkownika
    const fetchUsername = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user', { withCredentials: true });
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    // Pobranie adresu email użytkownika
    const fetchUserEmail = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/email', { withCredentials: true });
        setEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching email:', error);
      }
    };

    fetchUsername();
    fetchUserEmail();
    fetchUserProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject({ ...editedProject, [name]: value });
  };

  const handleEditProject = async (projectId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/projects/${projectId}`, editedProject, {
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log('Project updated successfully');
        fetchUserProjects();
        setEditedProject({
          projectId: '',
          nameOfProject: '',
          description: '',
        });
        setIsEditing(false); // Po zapisaniu zmian, wyłączamy tryb edycji
      } else {
        console.error('Error updating project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log('Project deleted successfully');
        fetchUserProjects();
      } else {
        console.error('Error deleting project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };


  return (
    <div>
      <Navbar />
      <div className="user-container">
        <h2 className='user-header'>Profil użytkownika {username}</h2>
        <h2>Twoje projekty</h2>
        <ul className="project-list">
          {projects.map((project) => (
            <li className="project-item" key={project._id}>
              <h3>Nazwa: {project.nameOfProject}</h3>
              <p>Opis: {project.description}</p>
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  setEditedProject({ ...editedProject, projectId: project._id });
                  setIsEditing(true);
                }}>
                Edytuj
              </button>
              <button
                className="btn btn-outline-danger" // Przycisk do usuwania projektu
                onClick={() => handleDeleteProject(project._id)}>
                Usuń
              </button>
            </li>
          ))}

        </ul>
        {isEditing && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditProject(editedProject.projectId);
            }}
            style={{ width: '100%' }}
          >
            <h2>Edytuj projekt</h2>
            <div style={{ width: '100%', marginTop: '20px' }}>
              <input
                type="text"
                name="nameOfProject"
                placeholder="Nowa nazwa"
                value={editedProject.nameOfProject}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div style={{ width: '100%', marginTop: '20px' }}>
              <textarea
                name="description"
                placeholder="Nowy opis"
                value={editedProject.description}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              ></textarea>
            </div>
            <div style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditedProject({
                    projectId: '',
                    nameOfProject: '',
                    description: '',
                  });
                }}
              >
                Anuluj
              </button>
              <button type="submit" className="btn btn-outline-primary">
                Zapisz zmiany
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default User;
