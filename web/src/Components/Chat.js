import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const socket = io('http://localhost:5000');

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on('message', (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        sender: 'User',
        timestamp: new Date().toLocaleTimeString(),
      };

      setChat((prevChat) => [...prevChat, newMessage]);

      // Emit the message via socket and save it to MongoDB via Flask
      socket.emit('message', newMessage);

      setMessage('');
    }
  };

  return (
    <div className="chat">
      <div className="chat-messages">
        {chat.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <span>{msg.text}</span>
            <span className="timestamp">{msg.timestamp}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => (e.key === 'Enter' ? sendMessage() : null)}
        placeholder="Type a message..."
      />
    </div>
  );
};

export default Chat;
