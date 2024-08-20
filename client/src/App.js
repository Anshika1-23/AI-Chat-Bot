import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
  });

  useEffect(() => {
    const greeting = "I am AI bot, how may I help you?";
    setMessages([{ sender: 'bot', text: greeting }]);
  }, []);

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    setMessages([...messages, { sender: 'user', text: input }]);

    if (!userDetails.serviceType) {
      setUserDetails({ ...userDetails, serviceType: input });
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: "Great! Please provide your name." },
      ]);
    } else if (!userDetails.name) {
      setUserDetails({ ...userDetails, name: input });
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: "Thanks! Could you also provide your email address?" },
      ]);
    } else if (!userDetails.email) {
      setUserDetails({ ...userDetails, email: input });
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: "Thanks! Finally, could you provide your phone number?" },
      ]);
    } else if (!userDetails.phone) {
      setUserDetails({ ...userDetails, phone: input });

      try {
        const response = await axios.post('http://localhost:5000/api/inquire', {
          serviceType: userDetails.serviceType,
          name: userDetails.name,
          email: userDetails.email,
          phone: input,
        });
        const botMessage = response.data.message;
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: botMessage },
        ]);
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: 'Sorry, there was an error processing your request.' },
        ]);
      }
    }

    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <center><img src="/download.jpeg" alt="Logo" className="logo" /></center>
        <h2>Welcome to AI Support</h2>
      </div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'bot' ? 'bot-message' : 'user-message'}>
            <span className="message-sender">{msg.sender.toUpperCase()}:</span> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={input}
          onChange={handleInput}
          placeholder="Type a message here and hit Enter..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="send-button">&#x27A4;</button>
      </div>
      <button className="clear-chat-button" onClick={() => setMessages([])}>Clear Chat</button>
    </div>
  );
}

export default App;
