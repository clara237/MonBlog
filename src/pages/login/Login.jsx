import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../../components/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // Add this line
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };
 
  const toggleForms = (e) => {
    e.preventDefault();
    setIsLoginForm(!isLoginForm);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      navigate('/');
    } catch (error) {
      setError('Email ou mot de passe incorrect');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerData.email,
        registerData.password
      );
  
      await updateProfile(userCredential.user, {
        displayName: registerData.username
      });
  
      const userRef = ref(database, `users/${userCredential.user.uid}`);
      await set(userRef, {
        username: registerData.username,
        email: registerData.email,
        role: 'pending',
        status: 'pending',
        createdAt: new Date().toISOString()
      });
  
      localStorage.setItem('Compte créé avec succès. En attente d\'approbation par l\'administrateur.');
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    
    <div className="container">
      {error && <div className="error-alert">{error}</div>}
      
      <div className="form-section" style={{display: isLoginForm ? 'none' : 'block'}}>
        <h2>Créer un Compte</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              name="username"
              value={registerData.username}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              name="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password2">Confirmer le Mot de passe</label>
            <input 
              type="password" 
              className="form-control" 
              id="password2" 
              name="password2"
              value={registerData.password2}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">S'inscrire</button>
        </form>
        <div className="toggle-link">
          <p>Déjà un compte ? <a href="#" onClick={toggleForms}>Connectez-vous ici</a></p>
        </div>
      </div>

      <div className="form-section" style={{display: isLoginForm ? 'block' : 'none'}}>
        <h2>Connexion</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input 
              type="email" 
              className="form-control" 
              id="login-email" 
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Mot de passe</label>
            <input 
              type="password" 
              className="form-control" 
              id="login-password" 
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success btn-block">Se connecter</button>
        </form>
        <div className="toggle-link">
          <p>Pas de compte ? <a href="#" onClick={toggleForms}>Inscrivez-vous ici</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;