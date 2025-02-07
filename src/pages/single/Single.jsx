import React from 'react'
import Topbar from '../../components/topbar/Topbar';
import './Single.css';
import SinglePost from '../singlePost/SinglePost';
export default function Single() {
  return (
    <div className='single'>
        {/*post*/}
        <SinglePost />  
        
    </div>
  )
}
