import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

import '../css/TimeRegister.css';

function TimeRegister() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [breakStartTime, setBreakStartTime] = useState('');
  const [breakEndTime, setBreakEndTime] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const [isWorking, setIsWorking] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/projects', { withCredentials: true });
        if (response.status === 200) {
          setProjects(response.data.projects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleStart = () => {
    const currentDate = new Date().toLocaleString();
    setStartTime(currentDate);
    setIsWorking(true);
  };

  const handleStop = () => {
    const currentDate = new Date().toLocaleString();
    setIsWorking(false);
  
    if (!isOnBreak) {
      setEndTime(currentDate);
    } else {
      setBreakEndTime(currentDate);
    }
  };
  


  const handleStartBreak = () => {
    const currentDate = new Date().toLocaleString();
    setBreakStartTime(currentDate);
    setIsOnBreak(true);
  };

  const handleStopBreak = () => {
    const currentDate = new Date().toLocaleString();
    setBreakEndTime(currentDate);
    setIsOnBreak(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/worklogs',
        {
          startTime,
          endTime,
          projectName,
          startBreakTime: breakStartTime,
          endBreakTime: breakEndTime,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log('Time registered successfully');
        navigate('/user');
      } else {
        console.error('Error registering time');
      }
    } catch (error) {
      console.error('Error registering time:', error);
    }
  };
  

  return (
    <div>
      <Navbar />
      <div className="time-container">
        <h2 className="time-header">Time Register</h2>
        <p>Start Time: {startTime}</p>
        <p>End Time: {endTime}</p>
        <h2 className="time-header">Breaks</h2>
        <p>Start Time: {breakStartTime}</p>
        <p>End Time: {breakEndTime}</p>
        {!isWorking ? (
          <button className="btn btn-outline-success" onClick={handleStart}>Start</button>
        ) : (
          <>
            <button className="btn btn-outline-danger" onClick={handleStop}>Stop</button>
            {!isOnBreak ? (
              <button className="btn btn-outline-warning" onClick={handleStartBreak}>Start Break</button>
            ) : (
              <button className="btn btn-outline-secondary" onClick={handleStopBreak}>End Break</button>
            )}
          </>
        )}
        <form className="time-form" onSubmit={handleSubmit}>
          <label>
            Project Name:
            <select className="time-select" value={projectName} onChange={(e) => setProjectName(e.target.value)}>
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project._id} value={project.nameOfProject}>
                  {project.nameOfProject}
                </option>
              ))}
            </select>
          </label>
          <button className="time-submit btn btn-outline-primary" type="submit" disabled={!endTime || !projectName || isWorking}>
            Register Time
          </button>
        </form>
      </div>
    </div>
  );
}

export default TimeRegister;
