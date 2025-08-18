// API Configuration
const API_CONFIG = {
    development: {
        baseUrl: 'http://localhost:3000',
        apiUrl: 'http://localhost:3000/api/contact'
    },
    production: {
        baseUrl: 'https://vedang-portfolio-backend.onrender.com',
        apiUrl: 'https://vedang-portfolio-backend.onrender.com/api/contact'
    }
};

// Determine environment
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

// Export current config
const currentConfig = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

window.APP_CONFIG = currentConfig;
