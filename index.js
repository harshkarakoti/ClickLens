require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const useragent = require('express-useragent');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001; // Using port 3001 to avoid conflict with CoinPulse

// Middleware
app.use(cors());
app.use(express.json());
app.use(useragent.express()); // Helps us parse "Who is clicking?"
app.use(express.static('public'));

// --- CONFIGURATION CHECK ---
if (!process.env.MONGO_URI) {
    console.error('❌ FATAL ERROR: MONGO_URI is missing.');
    process.exit(1);
}

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ ClickLens Database Connected'))
    .catch(err => console.error('❌ DB Error:', err));

// --- DATA ENGINEERING: SCHEMA SEPARATION ---

// 1. The "Fast" Collection (Read-Heavy)
// Keeps it light so redirects are instant.
const UrlSchema = new mongoose.Schema({
    shortId: { type: String, required: true, unique: true },
    redirectUrl: { type: String, required: true },
});

// 2. The "Analytics" Collection (Write-Heavy)
// Stores all the heavy metadata. We separate this so the Url collection doesn't get bloated.
const LogSchema = new mongoose.Schema({
    shortId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    ipAddress: String,
    browser: String,
    os: String,
    device: String
});

const Url = mongoose.model('Url', UrlSchema);
const Log = mongoose.model('Log', LogSchema);

// --- API ENDPOINTS ---

// 1. CREATE SHORT LINK (The "Platform" Service)
app.post('/api/shorten', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        const id = shortid.generate();
        await Url.create({
            shortId: id,
            redirectUrl: url
        });
        
        // Return the full short link
        res.json({ shortUrl: `http://localhost:${PORT}/${id}` });
    } catch (error) {
        // ADD THIS LINE TO SEE THE REAL ERROR IN TERMINAL
        console.error("❌ SHORTEN ERROR:", error); 
        res.status(500).json({ error: error.message || 'Server Error' });
    }
});

// 2. THE REDIRECT ENGINE (With Data Capture)
app.get('/:shortId', async (req, res) => {
    const { shortId } = req.params;
    
    try {
        // A. Find the link (Fast Read)
        const entry = await Url.findOne({ shortId });
        
        if (!entry) return res.status(404).send('Link not found');

        // B. Capture Analytics (The "Data Engineering" Part)
        // We log the click details asynchronously
        await Log.create({
            shortId: shortId,
            ipAddress: req.ip,
            browser: req.useragent.browser,
            os: req.useragent.os,
            device: req.useragent.isMobile ? 'Mobile' : 'Desktop'
        });

        // C. Redirect the user
        res.redirect(entry.redirectUrl);
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// 3. ANALYTICS DASHBOARD (Aggregation Framework)
// Shows "Clicks per Browser"
app.get('/api/analytics/:shortId', async (req, res) => {
    try {
        const stats = await Log.aggregate([
            { $match: { shortId: req.params.shortId } },
            {
                $group: {
                    _id: "$browser", // Group by Browser (Chrome, Safari, etc.)
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const totalClicks = await Log.countDocuments({ shortId: req.params.shortId });

        res.json({
            totalClicks,
            browserBreakdown: stats
        });
    } catch (error) {
        res.status(500).json({ error: 'Analytics Error' });
    }
});

// --- SERVER START ---
app.listen(PORT, () => {
    console.log(`🚀 ClickLens running on http://localhost:${PORT}`);
});