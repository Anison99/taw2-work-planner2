import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Login.css';

function Login() {
  return (
    <div className="login-container">
    <form className="login-form" >
      <h2>Logowanie</h2>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Hasło:</label>
        <input
          type="password"
          name="password"
          id="password"
          required
        />
      </div>
      <button type="button" class="btn btn-outline-primary">Zaloguj</button>
    </form>
    <div>
    </div>
  </div>
  )
}

export default Login
