# AI Content Platform & Blog Ecosystem

A comprehensive content management system with AI-powered features and a connected blog platform.

## 🌟 Project Overview

This is a full-stack content management ecosystem consisting of:

### 1. **AI Content Platform** (This Repository)
- **Live Demo**: [AI Content Platform](https://your-ai-platform-url.com)
- **Tech Stack**: Next.js 15, TypeScript, Prisma, NextAuth, AI Integration
- **Features**: Content creation, analytics, collaboration, media management

### 2. **Connected Blog Site** 
- **Live Demo**: [BloggED Blog](https://blogg-ed.vercel.app/)
- **Purpose**: Showcases content created through the AI platform
- **Features**: Modern blog interface, responsive design, content management

## 🚀 Key Features

### AI Content Platform
- 🤖 **AI-Powered Content Creation** - Generate content using Google's Generative AI
- 📊 **Analytics Dashboard** - Real-time content performance tracking
- 👥 **Team Collaboration** - Real-time collaborative editing with Y.js
- 📁 **Media Management** - Upload and organize media files
- 📅 **Calendar Integration** - Schedule and manage content
- 🔐 **Authentication** - Secure user management with NextAuth
- 📱 **Responsive Design** - Works seamlessly across all devices

### Connected Blog Site
- 📝 **Content Display** - Showcases articles created through the platform
- 🎨 **Modern UI** - Clean, professional blog design
- 📱 **Mobile Responsive** - Optimized for all screen sizes
- ⚡ **Fast Performance** - Built with Next.js for optimal speed

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend & Database
- **Prisma** - Type-safe database ORM
- **NextAuth.js** - Authentication system
- **PostgreSQL** - Primary database
- **Firebase** - File storage and real-time features

### AI & Analytics
- **Google Generative AI** - Content generation
- **Chart.js** - Data visualization
- **Socket.io** - Real-time communication

### Collaboration
- **Y.js** - Real-time collaborative editing
- **WebRTC** - Peer-to-peer communication

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google AI API key
- Firebase project

### Installation

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

4. **Configure your environment variables**
```env
DATABASE_URL="your-postgresql-url"
NEXTAUTH_SECRET="your-nextauth-secret"
GOOGLE_AI_API_KEY="your-google-ai-key"
FIREBASE_PROJECT_ID="your-firebase-project"
```

5. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

6. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the AI Content Platform.

## 📊 Project Architecture

```
ai-content-platform/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard pages
│   │   └── auth/          # Authentication pages
│   ├── components/         # Reusable components
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript definitions
├── prisma/                # Database schema
└── public/               # Static assets
```

## 🔗 Connected Projects

- **Blog Site**: [https://blogg-ed.vercel.app/](https://blogg-ed.vercel.app/)
- **GitHub Repository**: [Your Repository URL]
- **Live Demo**: [Your Platform URL]

## 🎯 Key Achievements

- ✅ **Full-Stack Development** - Complete frontend and backend implementation
- ✅ **AI Integration** - Real-time content generation capabilities
- ✅ **Real-time Collaboration** - Multi-user editing with conflict resolution
- ✅ **Modern Architecture** - Type-safe, scalable codebase
- ✅ **Production Ready** - Deployed and fully functional
- ✅ **Connected Ecosystem** - Blog site showcases platform capabilities

## 📈 Performance Features

- **SEO Optimized** - Built with Next.js for excellent search engine performance
- **Fast Loading** - Optimized images and code splitting
- **Mobile First** - Responsive design for all devices
- **Accessibility** - WCAG compliant components

## 🤝 Contributing

This is a portfolio project demonstrating full-stack development capabilities. For questions or collaboration opportunities, please reach out!

## 📄 License

This project is for portfolio demonstration purposes.

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
