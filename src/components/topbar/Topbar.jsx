import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth,database } from '../firebase.js';
import { signOut } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';

import './Topbar.css';

function Topbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isWriter, setIsWriter] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', !isDarkMode);
  };
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.body.classList.add('dark-mode');
    }

  
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = ref(database, `users/${currentUser.uid}`);
        onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setIsAdmin(userData.role === 'admin');
            setIsWriter(userData.status === 'approved');
          }
        });
      } else {
        setIsAdmin(false);
        setIsWriter(false);
      }
    });

    return () => unsubscribe();
  }, []);



  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/Home');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <header>
      <div className="logo">
        <Link to="/">Mon Blog</Link>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">
              <i className="fas fa-home icon" aria-hidden="true"></i> Accueil
            </Link>
          </li>
          <li>
            <Link to="/posts">
              <i className="fas fa-newspaper icon" aria-hidden="true"></i> Articles
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link to="/admin" className="admin-link">
                <i className="fas fa-users-cog icon" aria-hidden="true"></i> Admin
              </Link>
            </li>
          )}
          {user && (isAdmin || isWriter) && (
            <li>
              <Link to="/write">
                <i className="fas fa-pen-to-square icon" aria-hidden="true"></i> Écrire
              </Link>
            </li>
          )}
          {user && (
            <>
              <li>
                <button onClick={handleLogout} className="logout-button">
                  <i className="fas fa-sign-out-alt icon" aria-hidden="true"></i> Déconnexion
                </button>
              </li>
              <li className="user-info">
                <span>{user.displayName || user.email}</span>
                {!isWriter && !isAdmin && <span className="pending-status">(En attente)</span>}
              </li>
            </>
          )}
          {!user && (
            <li>
              <Link to="/login" className="login-button">
                <i className="fas fa-sign-in-alt icon" aria-hidden="true"></i> Se connecter
              </Link>
            </li>
          )}
          <li>
            <button onClick={toggleDarkMode} className="toggle-mode">
              {isDarkMode ? (
                <i className="fas fa-sun icon"></i>
              ) : (
                <i className="fas fa-moon icon"></i>
              )}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Topbar;