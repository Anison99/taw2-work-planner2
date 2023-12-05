import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Login.css';

function Login() {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Zalogowano:', data);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.message); // Ustaw błąd zwrócony przez serwer
      }
    } catch (error) {
      console.error('Błąd logowania:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Logowanie</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Hasło:</label>
          <input
            type="password"
            name="password"
            id="password"
            value={userData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" class="btn btn-outline-primary">Zaloguj</button>
      </form>
      <div>
      </div>
    </div>
  )
}

export default Login
