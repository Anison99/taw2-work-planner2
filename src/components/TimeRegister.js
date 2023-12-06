import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { TimeContext } from './TimeContext';

function TimeRegister() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [projectName, setProjectName] = useState('');
  const [isWorking, setIsWorking] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    const currentDate = new Date().toLocaleString();
    setStartTime(currentDate);
    setIsWorking(true);
  };

  const handleStop = () => {
    const currentDate = new Date().toLocaleString();
    setEndTime(currentDate);
    setIsWorking(false);
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
      <h2>Time Register</h2>
      <p>Start Time: {startTime}</p>
      <p>End Time: {endTime}</p>
      {!isWorking ? (
        <button onClick={handleStart}>Start</button>
      ) : (
        <button onClick={handleStop}>Stop</button>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          Project Name:
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
        </label>
        <button type="submit" disabled={!endTime}>
          Register Time
        </button>
      </form>
    </div>
  );
}

export default TimeRegister;
