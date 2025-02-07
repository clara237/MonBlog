import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { database, storage, auth } from '../../config/firebase.config'; // Updated import path
import { ref as dbRef, push, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Write.css';


function Write() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2097152) { // 5MB max
        setError('L\'image ne doit pas dépasser 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Vous devez être connecté pour publier un article');
      }
      
      if (!user.displayName) {
        throw new Error('Veuillez d\'abord mettre à jour votre profil avec un nom d\'utilisateur');
      }

      // Create post reference
      const postsRef = dbRef(database, 'posts');
      const newPostRef = push(postsRef);

      // Add post data with base64 image
      await set(newPostRef, {
        title,
        content,
        imageUrl: imagePreview || '', // Store base64 string directly
        authorId: user.uid,
        authorName: user.displayName,
        authorEmail: user.email,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: {}
      });

      // Reset form and redirect
      setTitle('');
      setContent('');
      setImagePreview(null);
      navigate(`/post/${newPostRef.key}`);
    } catch (err) {
      console.error('Erreur création post:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="write-container">
      <div className="article-container">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <h2>Créer un nouvel article</h2>
          
          <div className="form-group">
            <label htmlFor="title">Titre</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              placeholder="Entrez le titre de votre article"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Contenu</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-control"
              rows="10"
              placeholder="Écrivez votre article ici..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image de couverture</label>
            <div className="image-upload">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Aperçu" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => setImagePreview(null)}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button" 
            disabled={loading}
          >
            {loading ? 'Publication en cours...' : 'Publier l\'article'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Write;