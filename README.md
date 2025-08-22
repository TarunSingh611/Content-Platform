# AI Content Platform - Travel, Recipes & Task Management

A comprehensive AI-powered platform featuring travel planning, recipe generation, and intelligent task prioritization. Built with modern web technologies and Google's Gemini AI for smart content generation and decision-making.

[![Next.js](https://img.shields.io/badge/Next.js-15.0.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.1.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

[![GitHub stars](https://img.shields.io/github/stars/TarunSingh611/Content-Platform?style=social)](https://github.com/TarunSingh611/Content-Platform/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/TarunSingh611/Content-Platform?style=social)](https://github.com/TarunSingh611/Content-Platform/network)
[![GitHub issues](https://img.shields.io/github/issues/TarunSingh611/Content-Platform)](https://github.com/TarunSingh611/Content-Platform/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/TarunSingh611/Content-Platform)](https://github.com/TarunSingh611/Content-Platform/pulls)
[![GitHub license](https://img.shields.io/github/license/TarunSingh611/Content-Platform)](https://github.com/TarunSingh611/Content-Platform/blob/main/LICENSE)

[![Lines of Code](https://img.shields.io/tokei/lines/github/TarunSingh611/Content-Platform)](https://github.com/TarunSingh611/Content-Platform)
[![Code Size](https://img.shields.io/github/languages/code-size/TarunSingh611/Content-Platform)](https://github.com/TarunSingh611/Content-Platform)
[![Repo Size](https://img.shields.io/github/repo-size/TarunSingh611/Content-Platform)](https://github.com/TarunSingh611/Content-Platform)

[![GitHub Stats](https://github-readme-stats.vercel.app/api?username=TarunSingh611&show_icons=true&theme=radical)](https://github.com/TarunSingh611)
[![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=TarunSingh611&layout=compact&theme=radical)](https://github.com/TarunSingh611)
[![GitHub Streak](https://streak-stats.demolab.com/?user=TarunSingh611&theme=radical)](https://git.io/streak-stats)

[![Profile Views](https://komarev.com/ghpvc/?username=TarunSingh611&color=brightgreen)](https://github.com/TarunSingh611)
[![Repository Views](https://komarev.com/ghpvc/?username=TarunSingh611&repo=Content-Platform&color=blue)](https://github.com/TarunSingh611/Content-Platform)

## 🚀 Features

### ✨ AI-Powered Features
- **Travel Planning**: AI-assisted travel itinerary generation and recommendations
- **Recipe Generation**: Smart recipe creation with ingredient suggestions
- **Task Prioritization**: Intelligent task management and prioritization
- **Content Generation**: AI-powered content creation using Google's Gemini AI
- **Smart Recommendations**: Personalized suggestions based on user preferences

### 🎯 Core Platform Features
- **Content Management**: Create, edit, and publish content
- **Rich Text Editor**: Advanced editor with TipTap
- **Media Management**: Upload and manage images, videos, documents
- **Analytics Dashboard**: Track content performance and engagement
- **User Authentication**: Secure authentication with NextAuth.js
- **Team Collaboration**: Team management and collaboration tools
- **Calendar Integration**: Event management and scheduling
- **Real-time Messaging**: WebSocket-based communication system

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
   git clone https://github.com/TarunSingh611/Content-Platform.git
   cd Content-Platform
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

### Live Demo
- **Platform**: [content-platform-pink.vercel.app](https://content-platform-pink.vercel.app)
- **Documentation**: [DEMO_GUIDE.md](./DEMO_GUIDE.md)


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

## 📱 Platform Features

### AI-Powered Travel Planning
- **Smart Itineraries**: AI-generated travel plans and recommendations
- **Destination Insights**: Intelligent destination suggestions
- **Budget Optimization**: Smart budget planning and cost analysis
- **Travel Tips**: AI-powered travel advice and tips

### Recipe Generation & Management
- **AI Recipe Creation**: Generate recipes based on available ingredients
- **Ingredient Suggestions**: Smart ingredient recommendations
- **Nutritional Analysis**: AI-powered nutritional information
- **Recipe Collections**: Organize and manage recipe collections

### Task Management & Prioritization
- **Intelligent Prioritization**: AI-powered task ranking
- **Smart Scheduling**: Optimal task scheduling recommendations
- **Progress Tracking**: Real-time progress monitoring
- **Collaborative Tasks**: Team-based task management

### Real-time Communication
- **Instant Messaging**: Messages appear in real-time
- **Typing Indicators**: See when someone is typing
- **Online Status**: Track user online/offline status
- **Message History**: Persistent message storage

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

- **Documentation**: [DEMO_GUIDE.md](./DEMO_GUIDE.md)
- **Deployment**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Portfolio**: [PORTFOLIO_SUMMARY.md](./PORTFOLIO_SUMMARY.md)
- **Issues**: [GitHub Issues](https://github.com/TarunSingh611/Content-Platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/TarunSingh611/Content-Platform/discussions)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=TarunSingh611/Content-Platform&type=Date)](https://star-history.com/#TarunSingh611/Content-Platform&Date)

---

**Made with ❤️ by Tarun Singh**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/TarunSingh611)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/tarunsingh611)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/TarunSingh611)
