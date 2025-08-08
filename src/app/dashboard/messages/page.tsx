'use client';
import { useState } from 'react';
import { MessageSquare, Send, User, Clock } from 'lucide-react';
import DemoRibbon from '@/components/ui/DemoRibbon';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

// Mock data for messages
const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'John Smith',
    content: 'Great article on Next.js! Would you like to collaborate on a project?',
    timestamp: '2 hours ago',
    isRead: false
  },
  {
    id: '2',
    sender: 'Sarah Johnson',
    content: 'Your content strategy is impressive. Can we discuss potential partnerships?',
    timestamp: '1 day ago',
    isRead: true
  },
  {
    id: '3',
    sender: 'Mike Chen',
    content: 'The technical guides you publish are very helpful. Keep up the great work!',
    timestamp: '3 days ago',
    isRead: true
  }
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedMessage) {
      // In a real app, this would send the message to the backend
      const reply: Message = {
        id: Date.now().toString(),
        sender: 'You',
        content: newMessage,
        timestamp: 'Just now',
        isRead: true
      };
      setMessages(prev => [reply, ...prev]);
      setNewMessage('');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Manage your communications and collaborations</p>
        </div>
        <DemoRibbon message="Real-time Messaging - Coming Soon!" />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
          {/* Message List */}
          <div className="border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Conversations</h3>
            </div>
            <div className="overflow-y-auto h-full">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedMessage?.id === message.id ? 'bg-indigo-50 border-indigo-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{message.sender}</p>
                        <p className="text-sm text-gray-500 truncate">{message.content}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{message.timestamp}</p>
                      {!message.isRead && (
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1 ml-auto"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Content */}
          <div className="lg:col-span-2 flex flex-col">
            {selectedMessage ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedMessage.sender}</p>
                        <p className="text-sm text-gray-500">Active now</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                        <p className="text-sm">{selectedMessage.content}</p>
                        <p className="text-xs text-gray-500 mt-1">{selectedMessage.timestamp}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a message from the list to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Demo Features */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Messaging Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DemoRibbon message="Real-time Chat - Coming Soon!" />
          <DemoRibbon message="File Sharing - Coming Soon!" />
          <DemoRibbon message="Video Calls - Coming Soon!" />
        </div>
      </div>
    </div>
  );
}