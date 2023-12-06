import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

import '../css/TimeRegister.css';

function TimeRegister() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [breaks, setBreaks] = useState([]); // Zmiana na tablicę przechowującą przerwy
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const [isWorking, setIsWorking] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [totalBreakTime, setTotalBreakTime] = useState(0); // Stan przechowujący łączny czas przerw

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
      const updatedBreaks = breaks.map((breakItem, index) =>
        index === breaks.length - 1
          ? { ...breakItem, endBreakTime: currentDate }
          : breakItem
      );
      setBreaks(updatedBreaks);
      setIsOnBreak(false);
    }
  };

  const handleStartBreak = () => {
    const currentDate = new Date().toLocaleString();
    const newBreak = { startBreakTime: currentDate, endBreakTime: '' }; // Nowa przerwa
    setIsOnBreak(true);
    setBreaks([...breaks, newBreak]); // Dodanie nowej przerwy do tablicy przerw
  };

  const handleStopBreak = () => {
    const currentDate = new Date().toLocaleString();
    const updatedBreaks = breaks.map((breakItem, index) =>
      index === breaks.length - 1
        ? { ...breakItem, endBreakTime: currentDate }
        : breakItem
    );
    setIsOnBreak(false);
    setBreaks(updatedBreaks);
  };

  // Funkcja do obliczania łącznego czasu przerw
  const calculateTotalBreakTime = () => {
    const total = breaks.reduce((acc, breakItem) => {
      if (breakItem.endBreakTime) {
        const start = new Date(breakItem.startBreakTime);
        const end = new Date(breakItem.endBreakTime);
        const diff = (end - start) / (1000 * 60); // Różnica w minutach
        return acc + diff;
      }
      return acc;
    }, 0);
    const formattedTotal = total.toFixed(2);
  setTotalBreakTime(parseFloat(formattedTotal));
  };
  useEffect(() => {
    calculateTotalBreakTime();
  }, [breaks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/worklogs',
        {
          startTime,
          endTime,
          projectName,
          breaks,
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
        {breaks.map((breakItem, index) => (
          <div key={index}>
            <p>Start Time: {breakItem.startBreakTime}</p>
            <p>End Time: {breakItem.endBreakTime}</p>
          </div>
        ))}
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
        <h2>Total Break Time: {totalBreakTime} minutes</h2>
        {totalBreakTime > 30 && (
          <p style={{ color: 'red' }}>Total break time exceeded 30 minutes!</p>
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
