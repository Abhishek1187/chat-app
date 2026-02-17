import React, { useContext, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login.jsx'
import Chat from './pages/Chat/Chat.jsx'
import Profile from './pages/ProfileUpdate/Profile.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase';
import { AppContext } from './context/AppContext.jsx'


const App = () => {

  const navigate = useNavigate();
  const {loadUserData} = useContext(AppContext)

  useEffect(()=>{
    onAuthStateChanged(auth , async (user) => {
      if(user) {
        navigate('/chat');
        
        await loadUserData(user.uid)
      }
      else{
        navigate('/');
      }
      
    })
  },[])

  return (
    <>
    <ToastContainer/>
      <Routes>
        
        <Route path= '/' element = {<Login/>}/>
        <Route path='/Chat' element = {<Chat/>}/>
        <Route path='/Profile' element = {<Profile/>}/>
      </Routes>
    </>
  )
}

export default App
