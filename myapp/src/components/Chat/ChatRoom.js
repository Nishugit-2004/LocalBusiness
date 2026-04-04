import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { API_BASE_URL } from '../../api';

// Use window.location origin for socket in production, localport in dev
const socket = io(API_BASE_URL.replace('/api', '')); 

const ChatRoom = ({ orderId, userId, adminId, userRole }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Join the unique order room
        socket.emit('join_room', orderId);

        // Fetch history
        axios.get(`${API_BASE_URL}/chat/${orderId}?userId=${userId}&adminId=${adminId}`)
            .then(res => setMessages(res.data.messages || []))
            .catch(err => console.error(err));

        // Listen for new messages
        socket.on('receive_message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [orderId, userId, adminId]);

    useEffect(scrollToBottom, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const senderId = userRole === 'User' ? userId : adminId;

        try {
            await axios.post(`${API_BASE_URL}/chat/${orderId}/msg`, {
                senderRole: userRole,
                senderId,
                text: newMessage
            });
            setNewMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col h-[400px] w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mt-4">
            <div className="bg-teal-600 p-4 text-white font-black text-xs tracking-widest uppercase flex items-center justify-between">
                <span>Direct Support Chat</span>
                <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.senderRole === userRole ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                            msg.senderRole === userRole 
                            ? 'bg-teal-600 text-white rounded-tr-none' 
                            : 'bg-white text-gray-700 border border-gray-200 rounded-tl-none'
                        }`}>
                            <p className="font-bold text-[10px] opacity-60 mb-1">
                                {msg.senderRole === userRole ? 'YOU' : 'SHOP'}
                            </p>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 flex gap-2 bg-white">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 ring-teal-500 transition-all"
                />
                <button type="submit" className="bg-teal-600 text-white p-2 rounded-xl hover:bg-teal-700 transition active:scale-95">
                    <i className="fa-solid fa-paper-plane px-2"></i>
                </button>
            </form>
        </div>
    );
};

export default ChatRoom;
