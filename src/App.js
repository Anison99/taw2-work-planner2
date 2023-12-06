import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Home from './components/Home.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Profile from './components/Profile.js';
import User from './components/User.js';
import TimeRegister from './components/TimeRegister.js';
import Navbar from './components/Navbar.js';
import ProjectMeneger from './components/ProjectMeneger.js';

import { TimeProvider } from './components/TimeContext.js';

function App() {
  return (
    <Router basename="/">
      <TimeProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user" element={<User />} />
          <Route path="/time-register" element={<TimeRegister />} />
          <Route path="/project-meneger" element={<ProjectMeneger />} />
        </Routes>
      </TimeProvider>
    </Router>
  );
}

export default App;
