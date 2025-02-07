import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <div className='header'>
      <div className="headertitle">
        <h1>Explorez l'Art de la Pensée</h1>
        <h2>Découvrez des perspectives uniques, des idées innovantes et des histoires qui inspirent le changement</h2>
        <Link to="/posts" className="explore-btn">
          Découvrir les Articles
        </Link>
      </div>
    </div>
  );
}

export default Header;