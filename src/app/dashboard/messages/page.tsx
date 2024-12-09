'use client';

import { useEffect, useRef, useState } from "react";
import io from 'socket.io-client';

export default function MessagesPage() {
  const [socket, setSocket] =useState<any>(null);
  const [selectedChat, setSelectedChat] =useState<any>(null);
  const [messages, setMessages] =useState<any>([]);
  const [chats, setChats] =useState<any>([
    {
      id: '1',
      participants: [
        { id: '1', name: 'John Doe', avatar: 'https://placehold.co/32x32' },
        { id: '2', name: 'Jane Smith', avatar: 'https://placehold.co/32x32' }
      ],
      lastMessage: {
        content: 'Hey, how are you?',
        timestamp: new Date().toISOString(),
        senderId: '1'
      },
      unreadCount: 2
    }
  ]);
  const [newMessage, setNewMessage] =useState<any>('');
  const [searchTerm, setSearchTerm] =useState<any>('');
  const [isLoading, setIsLoading] =useState<any>(false);
  const [showNewChatModal, setShowNewChatModal] =useState<any>(false);
  const messagesEndRef:any =useRef(null);

 useEffect(() => {
    // Initialize socket connection
    const newSocket:any = io('http://localhost:3001', {
      auth: {
        token: 'your-auth-token' // Replace with actual auth token
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    newSocket.on('message', (message:any) => {
      handleNewMessage(message);
    });

    newSocket.on('typing', (userId:any) => {
      // Handle typing indicator
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

 useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewMessage = (message:any) => {
    setMessages((prev:any) => [...prev, message]);
    if (message.chatId === selectedChat?.id) {
      markMessageAsRead(message.id);
    }
  };

  const sendMessage = (e:any) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: 'current-user-id', // Replace with actual user ID
      chatId: selectedChat.id,
      timestamp: new Date().toISOString()
    };

    socket.emit('message', message);
    setNewMessage('');
  };

  const markMessageAsRead = async (messageId:any) => {
    try {
      await fetch(`/api/messages/${messageId}/read`, { method: 'POST' });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const ChatList = () => (
    <div className="border-r border-gray-200 w-full md:w-80 h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-1">
        {chats
          .filter((chat:any) =>
            chat.participants.some((p:any) =>
              p.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
          .map((chat:any) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                selectedChat?.id === chat.id ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={chat.participants[1].avatar}
                  alt=""
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {chat.participants[1].name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage.content}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const ChatView = () => (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {selectedChat ? (
        <>
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedChat.participants[1].avatar}
                  alt=""
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {selectedChat.participants[1].name}
                  </h2>
                  <span className="text-sm text-gray-500">Active now</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message:any) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === 'current-user-id'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${
                      message.senderId === 'current-user-id'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs opacity-75">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-gray-200 p-4">
            <form onSubmit={sendMessage} className="flex space-x-4">
              <div className="flex-1 flex items-center space-x-2">
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    socket.emit('typing', {
                      chatId: selectedChat.id,
                      userId: 'current-user-id'
                    });
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a conversation to start messaging
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <button
          onClick={() => setShowNewChatModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          New Message
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="flex flex-col md:flex-row">
          <ChatList />
          <div className="flex-1">
            <ChatView />
          </div>
        </div>
      </div>
    </div>
  );
}