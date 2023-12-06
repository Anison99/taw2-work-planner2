import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

function Home() {
  return (
    <div className='container'>
    <div className='image'>
      <img src="https://cdn.create.vista.com/api/media/small/161224900/stock-photo-man-covering-face-with-clock" alt="Dashboard" className='image-style' />
    </div>
    <div className='content'>
      <div className='button-container'>
        <div className='button-holder'>
          <p>Rejestracja czasu pracy</p>
          <div className='button-style'>
            <Link to="/login">
              <button type="button" className="btn btn-outline-primary">Zaloguj</button>
            </Link>
            <Link to="/register">
              <button type="button" className="btn btn-outline-primary">Zarejestruj</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Home;
