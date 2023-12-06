import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function TimeRegister() {
  const [startTime, setStartTime] = useState('');
  const [timer, setTimer] = useState('00:00:00'); // Timer dla odliczania czasu
  const [projectName, setProjectName] = useState('');
  const [isWorking, setIsWorking] = useState(false); // Stan określający, czy użytkownik pracuje
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;

    if (isWorking) {
      const start = Date.now();

      intervalId = setInterval(() => {
        const elapsedTime = Date.now() - start;
        const formattedTime = new Date(elapsedTime).toISOString().substr(11, 8);
        setTimer(formattedTime);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isWorking]);

  const handleStart = () => {
    const currentDate = new Date().toLocaleString();
    setStartTime(currentDate);
    setIsWorking(true);
    setTimer('00:00:00'); // Zerowanie timera po kliknięciu "Start"
  };

  const handleStop = () => {
    setIsWorking(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toLocaleString();

    try {
      const response = await axios.post(
        'http://localhost:5000/api/worklogs',
        {
          startTime,
          endTime: currentDate,
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
      {!isWorking ? (
        <button onClick={handleStart}>Start</button>
      ) : (
        <>
          <p>Working Time: {timer}</p>
          <button onClick={handleStop}>Stop</button>
        </>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          Project Name:
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
        </label>
        <label>
          Start Time:
          <input type="text" value={startTime} disabled />
        </label>
        <button type="submit">Register Time</button>
      </form>
    </div>
  );
}

export default TimeRegister;
