import React, { useContext, useEffect, useState } from 'react'
import './LeftSidebar.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { logout } from '../../config/firebase'
import { Navigate, useNavigate } from 'react-router-dom'

const LeftSidebar = () => {
  const { userData, chatData, allUsers, fetchAllUsers, setSelectedUser, setMessagesId, setMessages, selectedUser } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if(search) {
      const filtered = allUsers.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [search, allUsers]);

  const navigate = useNavigate();

  const handleSelectChat = async (user) => {
    setSelectedUser(user);
    
    // Create/get conversation ID
    const conversationId = [userData?.id, user.id].sort().join('_');
    setMessagesId(conversationId);
    
    // Load messages (this would come from Firestore listener in real app)
    setMessages([]);
    setSearch("");
  }

  const handleLogout = async () => {
    await logout();
  }

  return (
    <div className='ls'>
        <div className="ls-top">
            <div className="ls-nav">
              <img src={assets.logo} className='logo' alt=""/>
              <div className="menu">
                    <img src={assets.menu_icon} alt="" />
                    <div className="sub-menu">
                        <p onClick={() => navigate('/profile')}>Edit Profile</p>
                        <hr/>
                        <p onClick={handleLogout}>Logout</p>
                    </div>
                </div>  
            </div>
            <div className="ls-search">
                <img src={assets.search_icon} alt=""/>
                <input 
                  type="text" 
                  placeholder='Search here..' 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>  
        <div className="ls-list">
          {search ? (
            filteredUsers.map((user, index) => (
              <div 
                key={index} 
                className={`friends ${selectedUser?.id === user.id ? 'active' : ''}`}
                onClick={() => handleSelectChat(user)}
              >
                <img src={user.avatar || assets.profile_img} alt=""/>
                <div>
                    <p>{user.name}</p>
                    <span>@{user.username}</span>
                </div>
              </div>
            ))
          ) : chatData?.chatData ? (
            chatData.chatData.map((item, index) => {
              const user = allUsers.find(u => u.id === item.rId);
              return user ? (
                <div 
                  key={index}
                  className={`friends ${selectedUser?.id === user.id ? 'active' : ''}`}
                  onClick={() => handleSelectChat(user)}
                >
                  <img src={user.avatar || assets.profile_img} alt=""/>
                  <div>
                      <p>{user.name}</p>
                      <span>{item.lastMessage || "Start chatting..."}</span>
                  </div>
                </div>
              ) : null;
            })
          ) : (
            <p style={{padding: '20px', textAlign: 'center', color: '#999'}}>No chats yet. Search to start chatting!</p>
          )}
        </div>  
    </div>
  )
}

export default LeftSidebar
