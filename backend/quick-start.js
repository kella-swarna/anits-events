// Quick start script for the backend server
console.log('🚀 Starting College Events Backend Server...\n');

// Set environment variables if .env is not available
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || '3000';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_events';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_this_to_a_long_random_string';
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@anits.edu';
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';
process.env.UPLOAD_PATH = process.env.UPLOAD_PATH || 'uploads/';

console.log('📋 Environment variables set:');
console.log(`   PORT: ${process.env.PORT}`);
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI}`);
console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL}`);
console.log('');

console.log('⚠️  Make sure MongoDB is running!');
console.log('   - Local MongoDB: Start with "mongod" command');
console.log('   - MongoDB Atlas: Update MONGODB_URI if using cloud database');
console.log('');

// Start the server
console.log('🔄 Starting server...');
require('./server.js');
