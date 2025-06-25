import { scrapeTikTok } from './tiktok.js';
import { scrapeYouTube } from './youtube.js';

const PERFUME_KEYWORDS = [
  'perfume review',
  'fragrance haul',
  'scent of the day',
  'perfume recommendations',
  'fragrance collection',
  'perfume unboxing',
  'cologne review',
  'fragrance first impressions',
  'perfume shopping',
  'scent review'
];

export async function scrapeInfluencers() {
  console.log('Starting influencer scraping process...');
  
  const allInfluencers = [];
  
  try {
    // Scrape TikTok
    console.log('Scraping TikTok...');
    for (const keyword of PERFUME_KEYWORDS) {
      const tiktokInfluencers = await scrapeTikTok(keyword);
      allInfluencers.push(...tiktokInfluencers);
    }
    
    // Scrape YouTube
    console.log('Scraping YouTube...');
    for (const keyword of PERFUME_KEYWORDS) {
      const youtubeInfluencers = await scrapeYouTube(keyword);
      allInfluencers.push(...youtubeInfluencers);
    }
    
    // Filter duplicates and apply minimum follower threshold
    const uniqueInfluencers = filterAndDeduplicateInfluencers(allInfluencers);
    
    console.log(`Scraping completed. Found ${uniqueInfluencers.length} unique influencers.`);
    return uniqueInfluencers;
    
  } catch (error) {
    console.error('Error during scraping:', error);
    throw error;
  }
}

function filterAndDeduplicateInfluencers(influencers) {
  const seen = new Set();
  const filtered = [];
  
  for (const influencer of influencers) {
    // Skip if below minimum follower threshold
    if (influencer.followers < 50000) continue;
    
    // Create unique key based on handle and platform
    const key = `${influencer.handle}-${influencer.platform}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      filtered.push(influencer);
    }
  }
  
  return filtered;
}