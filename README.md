# 📸 Vedang Cinematography Portfolio

A modern, responsive photographer portfolio website showcasing professional work across multiple domains including weddings, events, corporate photography, concerts, product photography, food photography, and advertisement campaigns.

![Portfolio Preview](https://via.placeholder.com/800x400/8B4513/F5F3E7?text=Professional+Photography+Portfolio)

## ✨ Features

### 🎨 **Professional Design**
- Clean, minimalist earth-tone design
- Typography-focused layout
- Responsive grid system
- Smooth animations and transitions

### 📱 **Mobile-First Responsive Design**
- Optimized for all screen sizes (320px - 1920px+)
- Touch-friendly navigation and interactions
- Swipe gestures for image carousels
- iOS Safari optimizations
- Progressive enhancement approach

### 🖼️ **Portfolio Showcase**
- Dynamic image carousels with auto-rotation
- Touch/swipe navigation support
- Organized by photography categories:
  - 💒 Weddings
  - 🎉 Events
  - 🏢 Corporate
  - 🎵 Concerts
  - 📦 Product Photography
  - 🍽️ Food Photography
  - 📺 Advertisement (Social Media & TV)

### 💾 **Backend Integration**
- MongoDB Atlas database integration
- Express.js REST API
- Contact form with validation
- Admin panel for viewing submissions
- Rate limiting and security features

### ⚡ **Performance Optimizations**
- Lazy loading for images
- Critical resource preloading
- Optimized mobile interactions
- Reduced motion support
- Error handling and fallbacks

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern CSS with Grid & Flexbox
- **Vanilla JavaScript** - Dynamic interactions
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (MongoDB Atlas)
- **Mongoose** - ODM for MongoDB

### Development
- **Git** - Version control
- **VS Code** - Development environment
- **Live Server** - Development server

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
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
   cd server
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1 - Backend server
   cd server
   npm run dev

   # Terminal 2 - Frontend (if using Live Server)
   # Open index.html with Live Server in VS Code
   ```

5. **Open your browser**
   - Frontend: `http://localhost:5500` (Live Server)
   - Backend API: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin.html`

## 📁 Project Structure

```
vedang-portfolio/
├── 📄 index.html              # Main homepage
├── 📁 css/                    # Stylesheets
│   ├── style.css             # Main styles
│   └── gallery.css           # Gallery-specific styles
├── 📁 js/                     # JavaScript files
│   ├── main.js               # Main functionality
│   └── contact.js            # Contact form handling
├── 📁 images/                 # Photography portfolio
│   └── weddings/             # Wedding photography
├── 📁 pages/                  # Category pages
│   ├── weddings.html
│   ├── events.html
│   ├── corporate.html
│   ├── concerts.html
│   ├── product.html
│   ├── food.html
│   └── advertisement.html
├── 📁 server/                 # Backend application
│   ├── server.js             # Main server file
│   ├── 📁 config/            # Configuration
│   ├── 📁 models/            # Database models
│   ├── 📁 routes/            # API routes
│   └── 📁 public/            # Admin panel
├── package.json              # Frontend dependencies
└── README.md                 # This file
```

## 🎯 Key Features Breakdown

### Mobile Optimization
- **Touch Targets**: All interactive elements meet iOS/Android guidelines (44px minimum)
- **Gesture Support**: Swipe navigation for carousels and mobile menu
- **Viewport Handling**: Prevents zoom issues on iOS Safari
- **Performance**: Optimized scrolling and reduced motion support

### Photography Categories
Each category features:
- Dedicated landing pages
- Responsive image galleries
- Auto-rotating carousels
- Touch-friendly navigation
- Professional descriptions

### Contact System
- **Frontend**: Responsive contact form with validation
- **Backend**: MongoDB storage with email notifications
- **Admin Panel**: View and manage submissions
- **Security**: Rate limiting and input sanitization

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the server directory:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_atlas_connection_string

# Server Configuration
PORT=3000
NODE_ENV=development

# Contact Form (Optional)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
CONTACT_EMAIL=contact@yourdomain.com
```

### MongoDB Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Add it to your `.env` file
5. Whitelist your IP address

## 📱 Mobile Features

### Responsive Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Touch Interactions
- Swipe left/right for carousel navigation
- Swipe up to close mobile menu
- Touch feedback on all interactive elements
- Optimized touch targets for accessibility

### iOS Specific Optimizations
- Prevents automatic zoom on input focus
- Removes tap highlights
- Handles safe area insets
- Optimized momentum scrolling

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the project
2. Deploy the root directory
3. Set up environment variables
4. Configure redirects if needed

### Backend Deployment (Heroku/Railway)
1. Push to your Git repository
2. Connect to deployment service
3. Set environment variables
4. Deploy the `server` directory

### Domain Configuration
1. Point your domain to the frontend
2. Set up API subdomain for backend
3. Configure CORS settings
4. Set up SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support, email contact@vedangcinematography.com or create an issue in this repository.

## 🙏 Acknowledgments

- Photography by Vedang
- Design inspiration from modern portfolio websites
- Icons from various open-source icon libraries
- Fonts from Google Fonts

---

**Built with ❤️ for professional photography showcase**

📸 **Vedang Cinematography** - Capturing life's beautiful moments
