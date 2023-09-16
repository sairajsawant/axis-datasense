// components/Chatbox.js
import cookie from "react-cookies";

import React, { useState } from 'react';
import { Input, Button, Spacer } from '@nextui-org/react';

import { API_HOST } from "../config/settings";

function Chatbox() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleSubmit = () => {
        if (newMessage.trim() === '') return;

        const userMessage = { text: newMessage, sender: 'user' };

        setMessages([...messages, userMessage]);
        setNewMessage('');

        if (!cookie.load("brewToken")) {
            return new Promise((resolve, reject) => reject(new Error("No Token")));
        }
        const token = cookie.load("brewToken");
        const url = `${API_HOST}/project/${userMessage.text}`;
        const method = "GET";
        const headers = new Headers({
            "Accept": "application/json",
            "authorization": `Bearer ${token}`,
        });

        fetch(url, { method, headers })
            .then((response) => {
                console.log(response)
                response.json().then((res) => {
                    console.log(res.result)
                    const botMessage = { text: res.result, sender: 'bot' };
                    setMessages((prevMessages) => [...prevMessages, botMessage]);
                });
            });
    };

    const handleGenerateChart = (e) => {
        if (newMessage.trim() === '') return;

        const userMessage = { text: newMessage, sender: 'user' };

        setMessages([...messages, userMessage]);
        setNewMessage('');

        if (!cookie.load("brewToken")) {
            return new Promise((resolve, reject) => reject(new Error("No Token")));
        }
        const token = cookie.load("brewToken");
        const url = `${API_HOST}/project/addChart/${userMessage.text}`;
        const method = "GET";
        const headers = new Headers({
            "Accept": "application/json",
            "authorization": `Bearer ${token}`,
        });

        fetch(url, { method, headers })
            .then((response) => {
                console.log(response)
                response.json().then((res) => {
                    const botMessage = { text: "Added chart to your dashboard", sender: 'bot' };
                    setMessages((prevMessages) => [...prevMessages, botMessage]);
                });
            });
    };

    return (
        <div className="chatbox">
            <div className="chatbox-messages">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.sender === 'user' ? 'user' : 'bot'}`}
                    >
                        {message.text}
                    </div>
                ))}
            </div>
            <div class="chatbox-input" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={handleInputChange}
                />
                <Spacer/>
                <Button type="submit" onClick={handleSubmit}>
                    Send
                </Button>
                <Spacer/>
                <Button onClick={handleGenerateChart}>
                    Add chart for my query
                </Button>
            </div>
        </div>
    );
}

export default Chatbox;
