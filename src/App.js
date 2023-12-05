// App.js
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
function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user" element={<User />} />
        <Route path="/time-register" element={<TimeRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
