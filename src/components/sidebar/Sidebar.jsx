import React from 'react';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <div className='sidebar'>
      <div className='sidebar-section'>
        <h2>About Me</h2>
        <p>Short description about yourself or the blog.</p>
      </div>
      <div className='sidebar-section'>
        <h2>Categories</h2>
        <ul>
          <li><a href="#">Category 1</a></li>
          <li><a href="#">Category 2</a></li>
          <li><a href="#">Category 3</a></li>
          <li><a href="#">Category 4</a></li>
        </ul>
      </div>
      <div className='sidebar-section'>
        <h2>Follow Me</h2>
        <div className='social-icons'>
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-linkedin-in"></i></a>
        </div>
      </div>
    </div>
  );
}