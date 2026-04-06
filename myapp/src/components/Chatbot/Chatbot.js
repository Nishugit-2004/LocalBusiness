import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../api';
import './Chatbot.css';
import { FaRobot, FaPaperPlane, FaTimes, FaRegCommentDots, FaUserCircle } from 'react-icons/fa';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your VirtualShop assistant. How can I help you today? 👋", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const userAuth = useSelector((state) => state.user.isAuthenticated);
    const adminAuth = useSelector((state) => state.admin.isAuthenticated);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const adminData = JSON.parse(localStorage.getItem("adminData"));

    const role = adminAuth ? 'Seller' : (userAuth ? 'Customer' : 'Guest');
    const name = adminData?.admin?.name || userData?.user?.name || 'Friend';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (msgText) => {
        const text = msgText || input;
        if (!text.trim()) return;

        const newMessages = [...messages, { text, isBot: false }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/aichat`, {
                message: text,
                role: role,
                history: messages
            });
            setMessages([...newMessages, { text: response.data.reply, isBot: true }]);
        } catch (error) {
            setMessages([...newMessages, { text: "Sorry, I'm offline at the moment. Please try again later! 🛠️", isBot: true }]);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = {
        Customer: [
            "Find Shops Near Me 📍",
            "Track My Orders 📦",
            "Recommend Food 🍔",
            "Help with Payment 💳"
        ],
        Seller: [
            "How to add a product? ➕",
            "View shop orders 🧾",
            "Managing inventory 📈",
            "Change shop profile 🏪"
        ],
        Guest: [
            "What is VirtualShop? 🤔",
            "How to sign up? 📝",
            "Can I sell products? 💰",
            "Contact Support ☎️"
        ]
    };

    return (
        <div className="chatbot-wrapper">
            {/* Float Button */}
            {!isOpen && (
                <button className="chat-float-btn" onClick={() => setIsOpen(true)}>
                    <FaRegCommentDots />
                    <span className="chat-badge">AI</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="header-info">
                            <FaRobot className="bot-icon-header" />
                            <div>
                                <h3>VirtualGuide AI</h3>
                                <p>Online | Helping {name}</p>
                            </div>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}><FaTimes /></button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-bubble ${msg.isBot ? 'bot' : 'user'}`}>
                                {msg.isBot ? <FaRobot className="msg-icon" /> : <FaUserCircle className="msg-icon" />}
                                <div className="text-content">{msg.text}</div>
                            </div>
                        ))}
                        {loading && (
                            <div className="message-bubble bot">
                                <div className="typing-loader">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        {quickActions[role].map((action, i) => (
                            <button key={i} onClick={() => handleSend(action)}>{action}</button>
                        ))}
                    </div>

                    <div className="chat-input-area">
                        <input 
                            type="text" 
                            placeholder="Type a message..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={() => handleSend()} disabled={loading}>
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
