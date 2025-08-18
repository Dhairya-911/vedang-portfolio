# MongoDB Integration Setup Guide

This guide will help you set up the MongoDB backend for your contact form.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher) - [Download here](https://nodejs.org/)
- MongoDB (Choose one option):
  - **Local MongoDB** - [Download here](https://www.mongodb.com/download-center/community)
  - **MongoDB Atlas** (Cloud) - [Free account here](https://www.mongodb.com/cloud/atlas)

### Installation Steps

#### 1. Navigate to Server Directory
```bash
cd "d:\vedang portfolio\server"
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment
- Copy `.env` file and update with your settings
- For local MongoDB: Keep default `MONGODB_URI=mongodb://localhost:27017/vedang-portfolio`
- For MongoDB Atlas: Replace with your Atlas connection string

#### 4. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

#### 5. Test the Setup
Open your browser to `http://localhost:3000/health` - you should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-08-15T...",
  "environment": "development"
}
```

## 🛠️ Configuration Options

### MongoDB Atlas Setup (Recommended)
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster
3. Get connection string
4. Update `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vedang-portfolio
```

### Local MongoDB Setup
1. Install MongoDB locally
2. Start MongoDB service
3. Use default connection in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/vedang-portfolio
```

## 📊 Available Endpoints

### Contact Form
- **POST** `/api/contact` - Submit contact form
- **GET** `/api/contact` - Get all contacts (admin)
- **GET** `/api/contact/stats` - Get contact statistics
- **PUT** `/api/contact/:id/status` - Update contact status

### Health Check
- **GET** `/health` - Server health status
- **GET** `/` - API information

## 🔧 Development Tools

### View Contacts (Admin Panel)
Open `http://localhost:3000/api/contact` to see all submissions.

### Contact Statistics
Open `http://localhost:3000/api/contact/stats` for analytics.

### Database Management
Use [MongoDB Compass](https://www.mongodb.com/products/compass) to visually manage your database.

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Check network connectivity (for Atlas)

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing process: `taskkill /f /im node.exe`

3. **CORS Errors**
   - Update `CORS_ORIGIN` in `.env` to match your frontend URL
   - Default is `http://localhost:5500` (Live Server)

4. **Rate Limiting**
   - Adjust limits in `.env`:
     ```env
     RATE_LIMIT_WINDOW_MS=900000
     RATE_LIMIT_MAX_REQUESTS=100
     ```

### Logs to Check
- Server logs in terminal
- Browser Network tab (F12)
- MongoDB logs (if local)

## 🔒 Security Notes

### Production Checklist
- [ ] Change JWT_SECRET in `.env`
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS_ORIGIN
- [ ] Set up MongoDB authentication
- [ ] Add API authentication for admin endpoints
- [ ] Configure HTTPS

### Rate Limiting
- Contact form: 5 submissions per 15 minutes per IP
- General API: 100 requests per 15 minutes per IP

## 📈 Features Included

### Contact Form Features
✅ Real-time validation
✅ Duplicate submission prevention
✅ Character counter for message field
✅ Loading states and error handling
✅ Responsive error messages
✅ Success confirmations

### Backend Features
✅ MongoDB integration with Mongoose
✅ Input validation and sanitization
✅ Rate limiting and security headers
✅ CORS configuration
✅ Error handling and logging
✅ Contact status management
✅ Statistics and analytics

### Database Schema
```javascript
Contact {
  name: String (required, 2-100 chars)
  email: String (required, valid email)
  service: String (enum of services)
  message: String (required, 10-1000 chars)
  status: String (new/read/replied/archived)
  submittedAt: Date
  ipAddress: String
  userAgent: String
  timestamps: createdAt, updatedAt
}
```

## 🔄 Next Steps

1. Test the contact form on your website
2. Set up MongoDB Atlas for production
3. Configure email notifications (optional)
4. Add authentication for admin endpoints
5. Set up monitoring and backups

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review server logs in terminal
3. Test endpoints directly using browser or Postman
4. Verify environment variables in `.env`

Happy coding! 🚀
