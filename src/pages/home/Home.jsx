import React from 'react'
import './Home.css'
import Header from '../../components/header/Header'
import Post from '../../components/posts/Post'

function Home() {
  return (
    <div className='home'>
      <Header />
      <div className="home-container">
        <div className="posts-container">
          <Post />
        </div>
      </div>
    </div>
  )
}

export default Home