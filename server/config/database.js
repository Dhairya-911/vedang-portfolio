const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        // Log database name
        console.log(`📊 Database: ${conn.connection.db.databaseName}`);
        
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        
        // Log more details in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Full error details:', error);
        }
        
        // Exit process with failure
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
    console.error('❌ Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
    console.log('📴 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('🛑 MongoDB connection closed through app termination');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during MongoDB shutdown:', error);
        process.exit(1);
    }
});

module.exports = connectDB;
