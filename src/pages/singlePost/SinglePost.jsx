import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { database, auth } from '../../config/firebase.config';
import { ref, onValue, push, set } from 'firebase/database';
import './SinglePost.css';

export default function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch post data
    const postRef = ref(database, `posts/${id}`);
    const unsubscribePost = onValue(postRef, (snapshot) => {
      if (snapshot.exists()) {
        setPost(snapshot.val());
      } else {
        setError("Post non trouvé");
      }
      setLoading(false);
    });

    // Fetch comments
    const commentsRef = ref(database, `comments/${id}`);
    const unsubscribeComments = onValue(commentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const commentsArray = Object.entries(snapshot.val()).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setComments(commentsArray);
      }
    });

    return () => {
      unsubscribePost();
      unsubscribeComments();
    };
  }, [id]);

  const handleAddComment = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Vous devez être connecté pour commenter");
        return;
      }

      const commentsRef = ref(database, `comments/${id}`);
      const newCommentRef = push(commentsRef);
      
      await set(newCommentRef, {
        content: newComment,
        authorId: user.uid,
        authorName: user.displayName || 'Anonyme',
        createdAt: new Date().toISOString()
      });

      setNewComment('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div>Post non trouvé</div>;

  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="singlePostImg"
          />
        )}
        
        <h1 className="singlePostTitle">
          {post.title}
          {auth.currentUser?.uid === post.authorId && (
            <div className="singlePostEdit">
              <i className="fas fa-edit"></i>
              <i className="fas fa-trash-alt"></i>
            </div>
          )}
        </h1>

        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Auteur: <b>{post.authorName}</b>
          </span>
          <span className="singlePostDate">
            <i className="fas fa-clock"></i> 
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        <p className="singlePostDesc">{post.content}</p>

        <div className="singlePostActions">
          <button className="actionBtn likeBtn">
            <i className="fas fa-heart"></i>
            <span>{post.likes || 0} J'aime</span>
          </button>
          <button className="actionBtn commentBtn">
            <i className="fas fa-comment"></i>
            <span>Commenter</span>
          </button>
        </div>

        <div className="commentSection">
          <h3>Commentaires ({comments.length})</h3>
          <div className="addComment">
            {auth.currentUser ? (
              <>
                <textarea 
                  placeholder="Ajouter un commentaire..." 
                  className="commentInput"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button 
                  className="submitComment"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  Publier
                </button>
              </>
            ) : (
              <p>Connectez-vous pour commenter</p>
            )}
          </div>

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.authorName}</span>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}