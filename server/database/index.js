// In-memory storage for demo (replace with actual database)
let influencersData = [];
let scrapingStats = {
  total: 0,
  tiktok: 0,
  youtube: 0,
  lastScrape: null
};

export function getInfluencers() {
  return influencersData;
}

export function saveInfluencer(influencer) {
  const existingIndex = influencersData.findIndex(inf => inf.id === influencer.id);
  if (existingIndex >= 0) {
    influencersData[existingIndex] = influencer;
  } else {
    influencersData.push(influencer);
  }
  updateStats();
}

export function getStats() {
  return scrapingStats;
}

export function clearDatabase() {
  influencersData = [];
  scrapingStats = {
    total: 0,
    tiktok: 0,
    youtube: 0,
    lastScrape: null
  };
}

function updateStats() {
  scrapingStats = {
    total: influencersData.length,
    tiktok: influencersData.filter(inf => inf.platform === 'tiktok').length,
    youtube: influencersData.filter(inf => inf.platform === 'youtube').length,
    lastScrape: new Date().toISOString()
  };
}