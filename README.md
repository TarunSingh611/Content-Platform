# AI Content Platform with Real-time Messaging

[![Next.js](https://img.shields.io/badge/Next.js-15.0.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.1.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

[![GitHub stars](https://img.shields.io/github/stars/yourusername/ai-content-platform?style=social)](https://github.com/yourusername/ai-content-platform/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/ai-content-platform?style=social)](https://github.com/yourusername/ai-content-platform/network)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/ai-content-platform)](https://github.com/yourusername/ai-content-platform/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/ai-content-platform)](https://github.com/yourusername/ai-content-platform/pulls)
[![GitHub license](https://img.shields.io/github/license/yourusername/ai-content-platform)](https://github.com/yourusername/ai-content-platform/blob/main/LICENSE)

[![Lines of Code](https://img.shields.io/tokei/lines/github/yourusername/ai-content-platform)](https://github.com/yourusername/ai-content-platform)
[![Code Size](https://img.shields.io/github/languages/code-size/yourusername/ai-content-platform)](https://github.com/yourusername/ai-content-platform)
[![Repo Size](https://img.shields.io/github/repo-size/yourusername/ai-content-platform)](https://github.com/yourusername/ai-content-platform)

## 🚀 Features

### ✨ Real-time Messaging System
- **WebSocket Integration**: Real-time messaging using Socket.io
- **Group & Direct Chats**: Support for both group conversations and 1-on-1 messaging
- **Typing Indicators**: See when someone is typing
- **Message Editing**: Edit your own messages
- **Message Deletion**: Soft delete messages with proper permissions
- **Read Receipts**: Track message read status
- **Conversation Management**: Create, join, and manage conversations

### 🎯 Core Platform Features
- **Content Management**: Create, edit, and publish content
- **Rich Text Editor**: Advanced editor with TipTap
- **Media Management**: Upload and manage images, videos, documents
- **Analytics Dashboard**: Track content performance and engagement
- **User Authentication**: Secure authentication with NextAuth.js
- **Team Collaboration**: Team management and collaboration tools
- **Calendar Integration**: Event management and scheduling

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  WebSocket       │    │   MongoDB       │
│   (Vercel)      │◄──►│  Server          │◄──►│   Database      │
│   Frontend      │    │  (Separate)      │    │   (Atlas)       │
│   + API Routes  │    │  Real-time       │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database toolkit
- **MongoDB** - NoSQL database
- **NextAuth.js** - Authentication solution

### Real-time Server
- **Express.js** - Web framework
- **Socket.io** - Real-time WebSocket library
- **CORS** - Cross-origin resource sharing
- **Node.js** - JavaScript runtime

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Prisma Studio** - Database GUI

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB database (Atlas recommended)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-content-platform.git
   cd ai-content-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure your environment**
   ```env
   # Database
   DATABASE_URL="your_mongodb_connection_string"
   
   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # WebSocket Server
   NEXT_PUBLIC_WEBSOCKET_URL="http://localhost:3001"
   ```

5. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Start the WebSocket server**
   ```bash
   cd websocket-server
   npm install
   cp env.example .env
   # Update .env with your database URL
   npm run dev
   ```

7. **Start the main application**
   ```bash
   # In another terminal, from the root directory
   npm run dev
   ```

8. **Visit the application**
   ```
   http://localhost:3000
   ```

## 🚀 Deployment

### Main App (Vercel)
1. Push your code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### WebSocket Server
Choose from multiple deployment options:

- **Railway** (Recommended) - Easy deployment, $5/month
- **Render** - Free tier available
- **DigitalOcean** - $5/month
- **AWS EC2** - Pay per use

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📱 Messaging Features

### Real-time Communication
- **Instant Messaging**: Messages appear in real-time
- **Typing Indicators**: See when someone is typing
- **Online Status**: Track user online/offline status
- **Message History**: Persistent message storage

### Conversation Management
- **Direct Messages**: 1-on-1 conversations
- **Group Chats**: Multi-user conversations
- **Conversation Search**: Find conversations quickly
- **User Search**: Find users to start conversations

### Message Features
- **Text Messages**: Rich text support
- **Message Editing**: Edit your own messages
- **Message Deletion**: Soft delete with permissions
- **Read Receipts**: Track message read status
- **File Attachments**: Support for images, documents

## 🔧 API Endpoints

### Conversations
- `GET /api/conversations` - Get user conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/[id]` - Get conversation details
- `PUT /api/conversations/[id]` - Update conversation
- `DELETE /api/conversations/[id]` - Delete conversation

### Messages
- `GET /api/messages` - Get conversation messages
- `POST /api/messages` - Send new message
- `PUT /api/messages/[id]` - Edit message
- `DELETE /api/messages/[id]` - Delete message

### Users
- `GET /api/users/search` - Search users

## 🗄️ Database Schema

### Core Models
- **User** - User accounts and profiles
- **Conversation** - Chat conversations
- **ConversationParticipant** - User participation in conversations
- **Message** - Individual messages
- **Content** - Platform content
- **Media** - Uploaded files

### Key Features
- **Soft Deletion** - Messages are soft deleted
- **Audit Trail** - Track message edits and deletions
- **Permissions** - Role-based access control
- **Indexing** - Optimized database queries

## 🎨 UI Components

### Messaging Interface
- **ConversationList** - List of conversations
- **Chat** - Main chat interface
- **NewConversationModal** - Create new conversations
- **MessageInput** - Message composition
- **TypingIndicator** - Show typing status

### Design System
- **Responsive Design** - Mobile-first approach
- **Dark/Light Mode** - Theme support
- **Accessibility** - WCAG compliant
- **Modern UI** - Clean, intuitive interface

## 🔒 Security

### Authentication
- **NextAuth.js** - Secure authentication
- **Session Management** - JWT-based sessions
- **Password Hashing** - bcrypt encryption
- **Email Verification** - Account verification

### Authorization
- **Role-based Access** - User roles and permissions
- **Conversation Access** - Verify user participation
- **Message Permissions** - Edit/delete restrictions
- **API Protection** - Route protection

### Data Protection
- **Input Validation** - Zod schema validation
- **SQL Injection Prevention** - Prisma ORM protection
- **XSS Protection** - Content sanitization
- **CORS Configuration** - Cross-origin security

## 📊 Performance

### Optimization
- **Code Splitting** - Dynamic imports
- **Image Optimization** - Next.js Image component
- **Database Indexing** - Optimized queries
- **Caching** - Redis integration ready

### Monitoring
- **Error Tracking** - Sentry integration ready
- **Performance Monitoring** - Vercel Analytics
- **Database Monitoring** - MongoDB Atlas
- **Uptime Monitoring** - Health checks

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Add JSDoc comments for functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Prisma Team** - Excellent database toolkit
- **Socket.io Team** - Real-time communication library
- **Vercel Team** - Deployment platform
- **Tailwind CSS Team** - Utility-first CSS framework

## 📞 Support

- **Documentation**: [QUICK_START.md](./QUICK_START.md)
- **Deployment**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-content-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-content-platform/discussions)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/ai-content-platform&type=Date)](https://star-history.com/#yourusername/ai-content-platform&Date)

---

**Made with ❤️ by [Your Name]**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/yourusername)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/yourusername)
