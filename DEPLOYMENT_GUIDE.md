# AI Content Platform - Deployment Guide

## Overview
This guide will help you deploy the AI Content Platform to production with all features working and real data.

## Prerequisites

### 1. Environment Setup
- Node.js 18+ 
- MongoDB database (local or cloud)
- Email service (Gmail, SendGrid, etc.)
- AI API keys (Gemini, OpenAI)
- File storage (Firebase Storage, Cloudinary, etc.)

### 2. Required Services
- **Database**: MongoDB Atlas (recommended) or local MongoDB
- **Email**: Gmail SMTP, SendGrid, or similar
- **File Storage**: Firebase Storage, Cloudinary, or AWS S3
- **AI Services**: Google Gemini API, OpenAI API
- **Hosting**: Vercel, Netlify, or AWS

## Step-by-Step Deployment

### 1. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Database Configuration
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/ai-content-platform"

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Email Configuration
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"

# AI Services
GEMINI_API_KEY="your-gemini-api-key"
OPENAI_API_KEY="your-openai-api-key"

# File Storage (Firebase)
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_CLIENT_EMAIL="your-firebase-client-email"
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
FIREBASE_STORAGE_BUCKET="your-firebase-storage-bucket"

# Optional: Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 2. Database Setup

#### MongoDB Atlas (Recommended)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string
5. Update `DATABASE_URL` in your `.env.local`

#### Local MongoDB
```bash
# Install MongoDB
brew install mongodb-community  # macOS
sudo apt-get install mongodb   # Ubuntu

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongodb          # Ubuntu
```

### 3. Database Migration

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database with initial data
npx prisma db seed
```

### 4. Email Service Setup

#### Gmail SMTP
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the app password in `EMAIL_SERVER_PASSWORD`

#### SendGrid (Alternative)
1. Create a SendGrid account
2. Create an API key
3. Update environment variables:
```bash
EMAIL_SERVER_HOST="smtp.sendgrid.net"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="apikey"
EMAIL_SERVER_PASSWORD="your-sendgrid-api-key"
```

### 5. File Storage Setup

#### Firebase Storage
1. Create a Firebase project
2. Enable Storage
3. Create a service account
4. Download the private key JSON
5. Update environment variables

#### Cloudinary (Alternative)
1. Create a Cloudinary account
2. Get your cloud name, API key, and secret
3. Update environment variables:
```bash
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 6. AI Services Setup

#### Google Gemini API
1. Go to Google AI Studio
2. Create a new API key
3. Add to environment variables

#### OpenAI API (Optional)
1. Create an OpenAI account
2. Generate an API key
3. Add to environment variables

### 7. Build and Deploy

#### Vercel (Recommended)
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Add environment variables in Vercel dashboard

#### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm start
```

### 8. Post-Deployment Setup

#### 1. Verify Database Connection
```bash
npm run test:db
```

#### 2. Test Email Functionality
- Try the forgot password feature
- Verify email templates are working

#### 3. Test File Upload
- Upload images through the media manager
- Verify files are stored correctly

#### 4. Test AI Features
- Try content optimization
- Verify AI integration is working

## Production Checklist

### ✅ Environment Variables
- [ ] All required environment variables set
- [ ] Database connection working
- [ ] Email service configured
- [ ] File storage configured
- [ ] AI services configured

### ✅ Database
- [ ] Schema migrated successfully
- [ ] Initial data seeded (if needed)
- [ ] Database indexes created
- [ ] Backup strategy in place

### ✅ Authentication
- [ ] User registration working
- [ ] Email verification working
- [ ] Password reset working
- [ ] Login/logout working
- [ ] Session management working

### ✅ Content Management
- [ ] Content creation working
- [ ] Rich text editor functioning
- [ ] Image upload working
- [ ] Content editing working
- [ ] Content publishing working

### ✅ Analytics
- [ ] Analytics data being collected
- [ ] Charts displaying correctly
- [ ] Real-time data updating
- [ ] Performance metrics working

### ✅ Security
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] API routes protected
- [ ] Input validation working
- [ ] XSS protection enabled

### ✅ Performance
- [ ] Images optimized
- [ ] Code splitting working
- [ ] Caching configured
- [ ] CDN configured (if applicable)

## Monitoring and Maintenance

### 1. Error Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor application logs
- Set up alerts for critical errors

### 2. Performance Monitoring
- Monitor database performance
- Track API response times
- Monitor user engagement

### 3. Backup Strategy
- Regular database backups
- File storage backups
- Configuration backups

### 4. Updates
- Keep dependencies updated
- Monitor security advisories
- Regular security audits

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Test database connection
npm run test:db

# Check MongoDB status
sudo systemctl status mongodb
```

#### 2. Email Not Sending
- Verify SMTP settings
- Check firewall settings
- Test with different email service

#### 3. File Upload Issues
- Check storage permissions
- Verify API keys
- Test with smaller files first

#### 4. AI Features Not Working
- Verify API keys
- Check rate limits
- Test with simple prompts

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review application logs
3. Test in development environment
4. Create detailed issue reports

## Security Considerations

1. **Environment Variables**: Never commit secrets to version control
2. **Database Security**: Use strong passwords and network security
3. **API Security**: Implement rate limiting and input validation
4. **File Upload**: Validate file types and sizes
5. **Authentication**: Use secure session management
6. **HTTPS**: Always use HTTPS in production

## Performance Optimization

1. **Database**: Add indexes for frequently queried fields
2. **Images**: Use next/image for optimization
3. **Caching**: Implement Redis for session storage
4. **CDN**: Use CDN for static assets
5. **Code Splitting**: Implement dynamic imports

This deployment guide ensures your AI Content Platform is production-ready with all features working correctly.
