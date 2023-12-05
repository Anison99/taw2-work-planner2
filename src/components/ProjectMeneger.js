import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/ProjectMeneger.css';
import Navbar from './Navbar';

function ProjectMeneger() {
    const [projects, setProjects] = useState([]);
    const [username, setUsername] = useState('');
    const [projectData, setProjectData] = useState({
        projectId: null,
        nameOfProject: '',
        description: '',
    });


    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user/projects', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            setProjects(data.projects);
        } catch (error) {
            console.error('Błąd pobierania projektów:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        // Wywołanie API, aby pobrać nazwę użytkownika
        const fetchUsername = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/user', { withCredentials: true });
                setUsername(response.data.username);
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };

        fetchUsername();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProjectData({ ...projectData, [name]: value });
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Zapisano nowy projekt');
                fetchProjects();
                setProjectData({
                    nameOfProject: '',
                    description: '',
                });
            } else {
                console.error('Błąd zapisywania projektu:', await response.text());
            }
        } catch (error) {
            console.error('Błąd zapisywania projektu:', error);
        }
    };

    return (
        <div className="project-manager-container">
        <Navbar />
        <form onSubmit={handleProjectSubmit}>
            <div className="form-group">
                <label htmlFor="nameOfProject">Tytuł projektu</label>
                <input
                    type="text"
                    className="form-control"
                    id="nameOfProject"
                    name="nameOfProject"
                    value={projectData.nameOfProject}
                    onChange={handleInputChange}
                    placeholder="Wpisz tytuł"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="description">Opis projektu</label>
                <textarea
                    type="text"
                    className="form-control"
                    id="description"
                    name="description"
                    value={projectData.description}
                    onChange={handleInputChange}
                    placeholder="Wpisz opis"
                    required
                />
            </div>
            <button type="submit" className="btn btn-outline-primary">
                Zapisz projekt
            </button>
        </form>
    </div>
    );
};

export default ProjectMeneger;
