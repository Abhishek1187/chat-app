import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login.jsx'
import Chat from './pages/Chat/Chat.jsx'
import Profile from './pages/ProfileUpdate/Profile.jsx'


const App = () => {
  return (
    <>
      <Routes>
        
        <Route path= '/' element = {<Login/>}/>
        <Route path='/Chat' element = {<Chat/>}/>
        <Route path='/Profile' element = {<Profile/>}/>
      </Routes>
    </>
  )
}

export default App
