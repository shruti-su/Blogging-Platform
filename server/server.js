const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // <--- ADD THIS LINE: Import the cors package
dotenv.config();

const app = express();
const PORT = 5500;

const mongoURI = process.env.MONGODB_ATLAS_URI || process.env.MONGO_URL;

if (!mongoURI) {
    console.error('❌ No MongoDB connection string found in environment variables!');
    process.exit(1);
}

// Options: Only use serverApi for Atlas
const isAtlas = mongoURI.includes('mongodb+srv://');
const clientOptions = isAtlas
    ? { serverApi: { version: '1', strict: true, deprecationErrors: true } }
    : {}; // Empty options for local/dev

mongoose.connect(mongoURI, clientOptions)
    .then(() => {
        console.log('✅ Connected to MongoDB:', isAtlas ? 'Atlas (production)' : 'Local/Docker (development)');
        if (isAtlas) {
            // Optional: Ping Atlas deployment
            mongoose.connection.db.admin().command({ ping: 1 })
                .then(() => console.log('🏓 Pinged MongoDB Atlas successfully!'))
                .catch(err => console.warn('⚠️ Ping failed:', err));
        }
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });
// --- End MongoDB Connection Setup ---

// add all the routes here 
app.use(express.json({ limit: '10mb' })); // Increase payload size limit for base64 image uploads
// <--- ADD CORS CONFIGURATION HERE ---
// Option 1: Allow all origins (good for quick development, less secure for production)
app.use(cors());

// Option 2: Allow specific origins (recommended for production)
// const corsOptions = {
//   origin: 'http://localhost:5173', // Replace with your React app's exact URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Specify allowed HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
//   credentials: true, // Allow cookies to be sent
// };
// app.use(cors(corsOptions));
// <--- END CORS CONFIGURATION ---
app.get('/', async (req, res) => {
    res.send(`🚀 Server is running on http://localhost:${PORT}`);
});

app.use('/auth', require('./routes/auth')); // <--- ADD THIS LINE: Use the auth routes
app.use('/api', require('./routes/user'));
app.use('/blogs', require('./routes/blog')); // <--- ADD THIS LINE: Use the blogs routes
app.use('/categories', require('./routes/category')); // Use the category routes



app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
