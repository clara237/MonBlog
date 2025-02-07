import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { database } from '../../config/firebase.config';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import defaultImage from '../../asset/img1.png';
import './Post.css';

function Post() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const postsPerPage = 10;

  useEffect(() => {
    // utilise realtime updates 
    const postsRef = ref(database, 'posts');
    const postsQuery = query(
      postsRef,
      orderByChild('createdAt')
    );

    const unsubscribe = onValue(postsQuery, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const postsData = Object.entries(snapshot.val()).map(([id, post]) => ({
            id,
            ...post
          }));

          // trie les posts par date plis recent d abord
          const sortedPosts = postsData.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );

          // Calcul pagination
          const startIndex = (currentPage - 1) * postsPerPage;
          const paginatedPosts = sortedPosts.slice(startIndex, startIndex + postsPerPage);

          setPosts(paginatedPosts);
          setTotalPages(Math.ceil(sortedPosts.length / postsPerPage));
        } else {
          setPosts([]);
          setTotalPages(0);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      setError(error.message);
      setLoading(false);
    });

    //  subscription
    return () => unsubscribe();
  }, [currentPage]);

  const truncateText = (text, maxLength = 200) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h1>Derniers Articles</h1>
        <div className="posts-filter">
          <span className="filter-tag active">Tous</span>
          <span className="filter-tag">Tendances</span>
          <span className="filter-tag">Populaires</span>
        </div>
      </div>

      <div className="masonry-grid">
        {posts.map((post, index) => (
          <div key={post.id} className={`post-card elevation-${index % 3}`}>
            <div className="post-card-header">
              <div className="author-info">
                <img 
                  src={post.authorPhotoURL || require('../../asset/img2.webp')}
                  alt={post.authorName}
                  className="author-avatar"
                />
                <div className="author-details">
                  <h3>{post.authorName}</h3>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <Link to={`/post/${post.id}`} className="post-image-wrapper">
              <img 
                src={post.imageUrl || defaultImage}
                alt={post.title}
                className="post-image"
              />
              <div className="post-overlay">
                <span className="read-more">Lire l'article</span>
              </div>
            </Link>

            <div className="post-content">
              <h2>{post.title}</h2>
              <p>{truncateText(post.content, 150)}</p>
              
              <div className="post-footer">
                <div className="post-tags">
                  <span className="tag">Article</span>
                  <span className="tag">Blog</span>
                </div>
                <Link to={`/post/${post.id}`} className="read-more-btn">
                  <span>Découvrir</span>
                  <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <button 
            className="pagination-arrow"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            className="pagination-arrow"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}
export default Post;