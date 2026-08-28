import React, { useContext, useEffect, useState } from 'react';
import './LeftSidebar.css';
import assets from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { logout, db, auth } from '../../config/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const LeftSidebar = () => {
  const { userData, chatData, setSelectedUser, setMessagesId, setMessages, selectedUser } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const queryTerm = search.trim().toLowerCase();

      if (!queryTerm) {
        setFilteredUsers([]);
        return;
      }

      try {
        const usersRef = collection(db, 'users');
        const q = query(
          usersRef,
          where('username', '>=', queryTerm),
          where('username', '<=', queryTerm + '\uf8ff'),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        const matchedUsers = [];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.id !== auth.currentUser?.uid) {
            matchedUsers.push(data);
          }
        });

        setFilteredUsers(matchedUsers);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const navigate = useNavigate();

  const handleSelectChat = async (user) => {
    setSelectedUser(user);

    // Create/get conversation ID
    const conversationId = [userData?.id, user.id].sort().join('_');
    setMessagesId(conversationId);

    // Reset current view messages for new listener
    setMessages([]);
    setSearch("");
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className='ls'>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className='logo' alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate('/profile')}>Edit Profile</p>
              <hr />
              <p onClick={handleLogout}>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input
            type="text"
            placeholder='Search by username...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="ls-list">
        {search.trim() ? (
          filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`friends ${selectedUser?.id === user.id ? 'active' : ''}`}
                onClick={() => handleSelectChat(user)}
              >
                <img src={user.avatar || assets.profile_img} alt="" />
                <div>
                  <p>{user.name}</p>
                  <span>@{user.username}</span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No users found</p>
          )
        ) : chatData?.chatData && chatData.chatData.length > 0 ? (
          chatData.chatData.map((item, index) => {
            const recipient = item.userData;
            if (!recipient) return null;

            return (
              <div
                key={index}
                className={`friends ${selectedUser?.id === recipient.id ? 'active' : ''}`}
                onClick={() => handleSelectChat(recipient)}
              >
                <img src={recipient.avatar || assets.profile_img} alt="" />
                <div>
                  <p>{recipient.name}</p>
                  <span>{item.lastMessage || "Start chatting..."}</span>
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No chats yet. Search to start chatting!</p>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;