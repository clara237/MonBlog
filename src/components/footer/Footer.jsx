import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>À propos</h3>
          <p>Découvrez des perspectives uniques et des idées innovantes à travers nos articles soigneusement rédigés.</p>
        </div>
        
        <div className="footer-section">
          <h3>Navigation</h3>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/posts">Articles</Link></li>
            <li><Link to="/login">Connexion</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact</h3>
          <ul>
            <li><i className="fas fa-envelope"></i> contact@monblog.com</li>
            <li><i className="fas fa-phone"></i> +123 456 789</li>
            <li><i className="fas fa-map-marker-alt"></i> Paris, France</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Suivez-nous</h3>
          <div className="social-links">
            <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
            <a href="#" className="social-link"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Mon Blog. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default Footer;