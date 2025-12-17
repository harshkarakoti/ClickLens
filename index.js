require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const useragent = require('express-useragent');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001; 

// Middleware
app.use(cors());
app.use(express.json());
app.use(useragent.express()); 

// Serve Frontend
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

// --- SCHEMAS ---
const UrlSchema = new mongoose.Schema({
    shortId: { type: String, required: true, unique: true },
    redirectUrl: { type: String, required: true },
});

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

// 1. CREATE SHORT LINK (UPDATED FIX)
app.post('/api/shorten', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        const id = shortid.generate();
        await Url.create({
            shortId: id,
            redirectUrl: url
        });
        
        // --- DYNAMIC URL DETECTION ---
        // This detects if you are on Vercel (https) or Localhost (http)
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;
        
        res.json({ shortUrl: `${baseUrl}/${id}` });
    } catch (error) {
        console.error("❌ SHORTEN ERROR:", error);
        res.status(500).json({ error: error.message || 'Server Error' });
    }
});

// 2. THE REDIRECT ENGINE
app.get('/:shortId', async (req, res) => {
    const { shortId } = req.params;
    
    try {
        const entry = await Url.findOne({ shortId });
        
        if (!entry) return res.status(404).send('Link not found');

        // Log Analytics asynchronously
        await Log.create({
            shortId: shortId,
            ipAddress: req.ip,
            browser: req.useragent.browser,
            os: req.useragent.os,
            device: req.useragent.isMobile ? 'Mobile' : 'Desktop'
        });

        res.redirect(entry.redirectUrl);
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// 3. ANALYTICS DASHBOARD
app.get('/api/analytics/:shortId', async (req, res) => {
    try {
        const stats = await Log.aggregate([
            { $match: { shortId: req.params.shortId } },
            {
                $group: {
                    _id: "$browser",
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

app.listen(PORT, () => {
    console.log(`🚀 ClickLens running on http://localhost:${PORT}`);
});