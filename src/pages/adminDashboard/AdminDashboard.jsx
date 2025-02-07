import React, { useState, useEffect } from 'react';
import { database } from '../../components/firebase.js';
import { Link } from 'react-router-dom';
import { ref, onValue, update } from 'firebase/database';
import './AdminDashboard.css';

function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Récupérer les utilisateurs en attente
    const usersRef = ref(database, 'users');
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const users = [];
        snapshot.forEach((childSnapshot) => {
          const user = childSnapshot.val();
          if (user.status === 'pending') {
            users.push({ id: childSnapshot.key, ...user });
          }
        });
        setPendingUsers(users);
      }
    });

    // Récupérer tous les articles
    const postsRef = ref(database, 'posts');
    onValue(postsRef, (snapshot) => {
      if (snapshot.exists()) {
        const postsArray = [];
        snapshot.forEach((childSnapshot) => {
          postsArray.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        setPosts(postsArray);
      }
    });
  }, []);

  const approveUser = async (userId) => {
    try {
      await update(ref(database, `users/${userId}`), {
        status: 'approved',
        role: 'writer'
      });
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
    }
  };

  const rejectUser = async (userId) => {
    try {
      await update(ref(database, `users/${userId}`), {
        status: 'rejected'
      });
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
    }
  };
  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };


  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Administrateur</h1>
      </div>
      
      <section className="pending-users">
        <div className="section-header">
          <h2>Utilisateurs en attente d'approbation</h2>
        </div>
        
        {pendingUsers.length === 0 ? (
          <div className="empty-state">
            Aucun utilisateur en attente d'approbation
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nom d'utilisateur</th>
                <th>Email</th>
                <th>Date d'inscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="approve-btn"
                      onClick={() => approveUser(user.id)}
                    >
                      Approuver
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => rejectUser(user.id)}
                    >
                      Rejeter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="posts-section">
        <div className="section-header">
          <h2>Tous les articles</h2>
        </div>
        
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <Link to={`/post/${post.id}`} className="post-image-container">
                {post.imageUrl && (
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="post-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/path/to/default/image.jpg';
                    }}
                  />
                )}
              </Link>
              <div className="post-content">
                <h3>{post.title}</h3>
                <p>{truncateText(post.content)}</p>
                <div className="post-meta">
                  <div className="author-info">
                    <span className="author-name">Par {post.authorName}</span>
                    <span className="post-date">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Link to={`/post/${post.id}`} className="read-more-btn">
                    Voir plus
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;