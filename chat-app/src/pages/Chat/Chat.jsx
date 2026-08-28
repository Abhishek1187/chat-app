import React, { useContext } from 'react'
import './Chat.css'
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar'
import RightSidebar from '../../components/RightSidebar/RightSidebar'
import ChatBox from '../../components/ChatBox/ChatBox'
import { AppContext } from '../../context/AppContext'

const Chat = () => {
  const { selectedUser } = useContext(AppContext);

  return (
    <div className='chat'>
     <div className={`chat-container ${selectedUser ? 'chat-selected' : ''}`}>
      <LeftSidebar/>
      <ChatBox/>
      <RightSidebar/>
     </div>
    </div>
  )
}

export default Chat
