import React, { useContext, useState, useEffect, useRef } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import upload from '../../lib/upload'

const ChatBox = () => {
  const { selectedUser, messages, messagesId, sendMessage, userData } = useContext(AppContext);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if(file) {
      setLoading(true);
      try {
        const imageUrl = await upload(file);
        await sendMessage("", imageUrl);
        setText("");
      } catch (error) {
        console.error("Image upload failed:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  const handleSendMessage = async () => {
    if(!text.trim()) return;
    await sendMessage(text);
    setText("");
  }

  const handleKeyPress = (e) => {
    if(e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  if(!selectedUser) {
    return (
      <div className='chat-box'>
        <div className="chat-user">
          <p style={{textAlign: 'center', width: '100%', paddingTop: '100px'}}>Select a user to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className='chat-box'>
      <div className="chat-user">
        <img src={selectedUser?.avatar || assets.profile_img} alt=""/>
        <p>{selectedUser?.name} <img className='dot'src={assets.green_dot} alt=""/></p>
        <img src={ assets.help_icon } className='help' alt=""/>
      </div> 

      <div className="chat-msg">
        {messages && messages.map((msg, index) => (
          <div key={index} className={msg.sId === userData?.id ? "r-msg" : "s-msg"}>
            {msg.image && <img className='msg-img' src={msg.image} alt=""/>}
            {msg.text && <p className='msg'>{msg.text}</p>}
            <div>
              <img src={msg.sId === userData?.id ? userData?.avatar : selectedUser?.avatar} alt="" />
              <p>{new Date(msg.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className='chat-input'>
        <input 
          type='text' 
          placeholder='Send a message'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <input 
          type='file' 
          id='image' 
          accept='image/png , image/jpeg' 
          hidden
          onChange={handleImageUpload}
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt=""/>
        </label>
        <img 
          src={assets.send_button} 
          alt=""
          onClick={handleSendMessage}
          style={{cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1}}
        />
      </div>
    </div>
  )
}

export default ChatBox
