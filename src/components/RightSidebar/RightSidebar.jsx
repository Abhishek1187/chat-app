import React, { useContext } from 'react'
import './RightSidebar.css'
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'
import { AppContext } from '../../context/AppContext'

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(AppContext);

  // Get image messages
  const imagedMessages = messages?.filter(msg => msg.image) || [];

  if (!selectedUser) {
    return (
      <div className='rs'>
        <div className="rs-profile">
          <p>Select a user to view profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className='rs'>
      <div className="rs-profile">
        <img src={selectedUser?.avatar || assets.profile_img} alt="" />
        <h3>
          {selectedUser?.name}
          <img
            src={assets.green_dot}
            className={`dot ${selectedUser && (Date.now() - selectedUser.lastSeen < 120000) ? '' : 'offline'}`}
            alt=""
          />
        </h3>
        <p>{selectedUser?.bio || "No bio added"}</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          {imagedMessages.length > 0 ? (
            imagedMessages.slice(-6).map((msg, index) => (
              <img key={index} src={msg.image} alt="" />
            ))
          ) : (
            <p style={{ fontSize: '12px', color: '#999' }}>No media shared</p>
          )}
        </div>
      </div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}

export default RightSidebar
