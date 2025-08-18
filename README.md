# � Vedang Cinematography Portfolio - Backend API

This is the backend API server for the Vedang Cinematography Portfolio website. It provides a RESTful API for handling contact form submissions, admin panel functionality, and database operations.

## ✨ Features

### 🔧 **API Endpoints**
- **Contact Form**: Submit and store contact inquiries
- **Admin Panel**: View and manage contact submissions
- **Health Check**: API status monitoring
- **Rate Limiting**: Protection against spam and abuse

### �️ **Security Features**
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Rate limiting on API endpoints
- Environment variable protection
- MongoDB injection prevention

### 💾 **Database Integration**
- MongoDB Atlas cloud database
- Mongoose ODM for data modeling
- Contact form data persistence
- Admin interface for data management

## 🛠️ Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (MongoDB Atlas)
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API protection
- **Validator** - Input validation

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vedang-cinematography-portfolio.git
   cd vedang-cinematography-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your configuration
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

5. **Access the API**
   - API Base URL: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin.html`

## 📁 Project Structure

```
backend/
├── 📄 server.js                 # Main server file
├── 📁 config/                   # Configuration files
│   └── database.js             # MongoDB connection
├── 📁 models/                   # Database models
│   └── Contact.js              # Contact form model
├── 📁 routes/                   # API routes
│   └── contact.js              # Contact endpoints
├── 📁 public/                   # Static files
│   └── admin.html              # Admin panel
├── 📄 package.json             # Dependencies
└── 📄 .env                     # Environment variables
```

## 🔌 API Endpoints

### Contact Routes

#### Submit Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "eventType": "wedding",
  "eventDate": "2024-06-15",
  "location": "New York",
  "budget": "5000-10000",
  "message": "Looking for wedding photography services"
}
```

#### Get All Contacts (Admin)
```http
GET /api/contact
```

#### Get Contact by ID
```http
GET /api/contact/:id
```

#### Delete Contact
```http
DELETE /api/contact/:id
```

### Health Check
```http
GET /api/health
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vedang-portfolio

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5500

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Contact Form Rate Limiting
CONTACT_RATE_LIMIT_WINDOW_MS=900000
CONTACT_RATE_LIMIT_MAX_REQUESTS=5
```

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account

2. **Create a Cluster**
   - Choose free tier (M0)
   - Select your preferred region

3. **Create Database User**
   - Go to Database Access
   - Add new database user
   - Note the username and password

4. **Configure Network Access**
   - Go to Network Access
   - Add IP Address (0.0.0.0/0 for development)

5. **Get Connection String**
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## 🚀 Deployment

### Heroku Deployment

1. **Prepare for deployment**
   ```bash
   # Ensure all changes are committed
   git add .
   git commit -m "Prepare for deployment"
   ```

2. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://your-frontend-domain.com
   ```

4. **Deploy**
   ```bash
   git push heroku backend:main
   ```

### Railway Deployment

1. **Connect GitHub repository**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub account
   - Import this repository

2. **Configure environment variables**
   - Add all required environment variables
   - Set `MONGODB_URI` to your MongoDB Atlas connection string

3. **Deploy**
   - Railway will automatically deploy your application

### Other Platforms

The backend is compatible with:
- **Render**: Direct GitHub integration
- **DigitalOcean App Platform**: Container deployment
- **AWS Elastic Beanstalk**: Scalable deployment
- **Google Cloud Run**: Serverless deployment

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Use strong MongoDB Atlas password
- [ ] Restrict MongoDB network access to your server IPs
- [ ] Set up proper CORS origins (no wildcards in production)
- [ ] Use HTTPS in production
- [ ] Keep dependencies updated
- [ ] Monitor API usage and set up alerts
- [ ] Implement proper logging
- [ ] Regular database backups

### Rate Limiting

The API includes built-in rate limiting:
- **General API**: 100 requests per 15 minutes per IP
- **Contact Form**: 5 submissions per 15 minutes per IP

## 📊 Monitoring

### Health Check Endpoint

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-08-18T10:30:00.000Z",
  "uptime": 3600,
  "database": "connected"
}
```

### Logging

The server logs:
- All API requests
- Database operations
- Error messages
- Rate limit violations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**
```
Error: MongoNetworkError: failed to connect to server
```
- Check your MongoDB URI
- Verify network access in MongoDB Atlas
- Ensure database user credentials are correct

**CORS Error**
```
Access to fetch at 'http://localhost:3000' from origin 'http://localhost:5500' has been blocked by CORS policy
```
- Check `FRONTEND_URL` in environment variables
- Verify CORS configuration in `server.js`

**Rate Limit Exceeded**
```
Too many requests from this IP, please try again later
```
- Wait for the rate limit window to reset
- Check rate limit configuration
- Consider adjusting limits for development

## 📞 Support

For technical support:
- Create an issue in this repository
- Email: support@vedangcinematography.com

---

**Built with ❤️ for professional photography services**

� **Backend API** - Powering the Vedang Cinematography Portfolio
