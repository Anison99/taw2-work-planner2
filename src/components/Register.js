import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import '../css/Register.css';
import axios from 'axios'; 

function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({
      username: '',
      email: '',
      password: '',
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const { username, email, password } = userData;
    
      try {
        const response = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
          credentials: 'include', // Dodaj tę linię, aby przesłać ciasteczka (jeśli używasz sesji)
        });
    
        if (response.ok) {
          console.log('Rejestracja zakończona sukcesem');
          navigate('/'); // Przekieruj na stronę główną po rejestracji
        } else {
          const errorMessage = await response.text();
          setError(`Błąd podczas rejestracji: ${errorMessage}`);
          console.error('Błąd podczas rejestracji:', errorMessage);
        }
      } catch (error) {
        setError('Wystąpił błąd podczas rejestracji. Spróbuj ponownie później.');
        console.error('Wystąpił błąd podczas rejestracji:', error);
      }
    };
    

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit} >
        <h2>Rejestracja</h2>
        <div className="form-group">
          <label htmlFor="username">Nazwa użytkownika:</label>
          <input
            type="text"
            name="username"
            id="username"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </div>
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
        <button type="submit" class="btn btn-outline-primary">Zarejestruj</button>
      </form>
    </div>
  )
}

export default Register
