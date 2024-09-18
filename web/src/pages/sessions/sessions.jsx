import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import "./sessions.css";

const socket = io('http://localhost:5000'); // Adjust based on your server URL

const VideoChat = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [stream, setStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(true); // State to manage camera on/off
  const chatEndRef = useRef(null); // Ref to scroll to the latest message

  useEffect(() => {
    // Get user media for video
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        const videoElement = document.getElementById('local-video');
        if (videoElement) {
          videoElement.srcObject = currentStream;
        }
      })
      .catch((err) => console.error('Error accessing media devices.', err));

    // Socket.io for chat
    socket.on('message', (msg) => {
      setChat((prevChat) => [...prevChat, { text: msg, sender: "received", timestamp: new Date().toLocaleTimeString() }]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat when a new message is added
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setChat((prevChat) => [
        ...prevChat,
        { text: message, sender: "sent", timestamp: new Date().toLocaleTimeString() }
      ]);
      socket.emit('message', message); // Emit the message to the server
      setMessage(''); // Clear the input
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Enter sends message, Shift+Enter adds a new line
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.stop(); // Stops the video track completely
      setStream(null); // Clear the stream
      setCameraOn(false); // Update state to reflect camera is off
    } else {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          const videoElement = document.getElementById('local-video');
          if (videoElement) {
            videoElement.srcObject = currentStream;
          }
          setCameraOn(true);
        })
        .catch((err) => console.error('Error accessing media devices.', err));
    }
  };

  return (
    <div className="video-chat-container">
      <div className="video-section">
        <video id="local-video" autoPlay muted className="video-player"></video>
        <button onClick={toggleCamera} className="toggle-button">
          {cameraOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>
      </div>

      <div className="chat-section">
        <div className="chat-header">Chat</div>
        <div className="chat-messages">
          {chat.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              <div className="chat-message-content">{msg.text}</div>
              <div className="chat-message-timestamp">{msg.timestamp}</div>
            </div>
          ))}
          <div ref={chatEndRef} /> {/* Empty div to scroll to */}
        </div>
        <form className="chat-form">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress} // Add keypress handler for Enter key
            placeholder="Type your message"
            className="chat-input"
            rows={1} // Optional: define how tall it starts
          />
        </form>
      </div>
    </div>
  );
};

export default VideoChat;