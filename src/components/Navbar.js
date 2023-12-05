import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <Link to="/user" className="nav-link">Profil</Link>
                </li>
                <li className="nav-item">
                    <Link to="/time-register" className="nav-link">Czas Pracy</Link>
                </li>
                <li className="nav-item">
                    <Link to="/project-manager" className="nav-link">Projekty</Link>
                </li>
            </ul>
            <div className="form-inline my-2 my-lg-0">
                <button className="btn btn-light" type="submit">Wyloguj</button>
            </div>
        </nav>
    )
}

export default Navbar
