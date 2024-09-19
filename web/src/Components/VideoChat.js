import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import './VideoChat.css';

const socket = io('http://localhost:5000');

const VideoChat = () => {
  const localVideoRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const startStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = mediaStream;
        setStream(mediaStream);

        // Broadcast stream to other users via Socket.io/WebRTC
        socket.emit('join-video', { stream: mediaStream });
      } catch (err) {
        console.error('Error accessing media devices', err);
      }
    };

    startStream();

    // Clean up on component unmount
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  return (
    <div className="video-chat">
      <video ref={localVideoRef} autoPlay muted className="video-player"></video>
    </div>
  );
};

export default VideoChat;
