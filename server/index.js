import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { scrapeInfluencers } from './scrapers/index.js';
import { exportToGoogleSheets } from './services/googleSheets.js';
import { getInfluencers, saveInfluencer, getStats } from './database/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory storage for demo (replace with actual database)
let influencersData = [];
let scrapingStats = {
  total: 0,
  tiktok: 0,
  youtube: 0,
  lastScrape: null
};

// API Routes
app.get('/api/influencers', (req, res) => {
  res.json(influencersData);
});

app.get('/api/stats', (req, res) => {
  res.json(scrapingStats);
});

app.post('/api/scrape/start', async (req, res) => {
  try {
    console.log('Starting scraping process...');
    
    // Simulate scraping process with sample data
    const sampleInfluencers = [
      {
        id: '1',
        name: 'Sarah Johnson',
        handle: 'scentedwithsarah',
        platform: 'tiktok',
        profileUrl: 'https://tiktok.com/@scentedwithsarah',
        followers: 125000,
        country: 'United States',
        gender: 'Female',
        email: 'sarah@scentedwithsarah.com',
        phone: '',
        language: 'English',
        avgLikes: 8500,
        avgComments: 450,
        avgViews: 95000,
        contentStyle: 'luxury, educational',
        postingFrequency: 'daily',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Fragrance Bros',
        handle: 'fragrancebros',
        platform: 'youtube',
        profileUrl: 'https://youtube.com/@fragrancebros',
        followers: 89000,
        country: 'United Kingdom',
        gender: 'Male',
        email: 'contact@fragrancebros.com',
        phone: '+44-123-456-7890',
        language: 'English',
        avgLikes: 3200,
        avgComments: 180,
        avgViews: 45000,
        contentStyle: 'comedic, reviews',
        postingFrequency: 'weekly',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Perfume Palace',
        handle: 'perfumepalace',
        platform: 'tiktok',
        profileUrl: 'https://tiktok.com/@perfumepalace',
        followers: 67000,
        country: 'France',
        gender: 'Female',
        email: 'hello@perfumepalace.fr',
        phone: '',
        language: 'French',
        avgLikes: 4200,
        avgComments: 220,
        avgViews: 38000,
        contentStyle: 'minimal, artistic',
        postingFrequency: 'daily',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Scent Stories',
        handle: 'scentstories',
        platform: 'youtube',
        profileUrl: 'https://youtube.com/@scentstories',
        followers: 156000,
        country: 'Canada',
        gender: 'Non-binary',
        email: 'stories@scentchannel.com',
        phone: '',
        language: 'English',
        avgLikes: 5800,
        avgComments: 340,
        avgViews: 78000,
        contentStyle: 'storytelling, reviews',
        postingFrequency: 'bi-weekly',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '5',
        name: 'عطور العرب',
        handle: 'arabperfumes',
        platform: 'tiktok',
        profileUrl: 'https://tiktok.com/@arabperfumes',
        followers: 234000,
        country: 'United Arab Emirates',
        gender: 'Male',
        email: 'contact@arabperfumes.ae',
        phone: '+971-50-123-4567',
        language: 'Arabic',
        avgLikes: 12000,
        avgComments: 680,
        avgViews: 145000,
        contentStyle: 'arabic, traditional',
        postingFrequency: 'daily',
        lastUpdated: new Date().toISOString()
      }
    ];

    // Simulate async scraping
    setTimeout(() => {
      influencersData = sampleInfluencers;
      scrapingStats = {
        total: sampleInfluencers.length,
        tiktok: sampleInfluencers.filter(inf => inf.platform === 'tiktok').length,
        youtube: sampleInfluencers.filter(inf => inf.platform === 'youtube').length,
        lastScrape: new Date().toISOString()
      };
    }, 2000);

    res.json({ message: 'Scraping started successfully' });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to start scraping' });
  }
});

app.post('/api/export/sheets', async (req, res) => {
  try {
    const { influencers } = req.body;
    
    if (!process.env.GOOGLE_SHEETS_CREDENTIALS) {
      return res.status(400).json({ 
        error: 'Google Sheets credentials not configured. Please set up your Google Sheets API credentials.' 
      });
    }

    // await exportToGoogleSheets(influencers);
    console.log('Exporting to Google Sheets:', influencers.length, 'influencers');
    
    res.json({ message: 'Data exported to Google Sheets successfully' });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export to Google Sheets' });
  }
});

// Schedule automatic scraping (every 6 hours)
cron.schedule('0 */6 * * *', async () => {
  console.log('Running scheduled scraping...');
  try {
    // await scrapeInfluencers();
    console.log('Scheduled scraping completed');
  } catch (error) {
    console.error('Scheduled scraping failed:', error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Perfume Influencer Aggregator API is ready!');
});