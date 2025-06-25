// Simple in-memory database for demo
// In production, use a proper database like PostgreSQL, MongoDB, etc.

let influencersDB = [];
let statsDB = {
  total: 0,
  tiktok: 0,
  youtube: 0,
  lastScrape: null
};

export function getInfluencers() {
  return influencersDB;
}

export function saveInfluencer(influencer) {
  const existingIndex = influencersDB.findIndex(
    inf => inf.handle === influencer.handle && inf.platform === influencer.platform
  );
  
  if (existingIndex >= 0) {
    influencersDB[existingIndex] = { ...influencersDB[existingIndex], ...influencer };
  } else {
    influencersDB.push(influencer);
  }
  
  updateStats();
  return influencer;
}

export function getStats() {
  return statsDB;
}

function updateStats() {
  statsDB.total = influencersDB.length;
  statsDB.tiktok = influencersDB.filter(inf => inf.platform === 'tiktok').length;
  statsDB.youtube = influencersDB.filter(inf => inf.platform === 'youtube').length;
  statsDB.lastScrape = new Date().toISOString();
}

export function clearDatabase() {
  influencersDB = [];
  statsDB = {
    total: 0,
    tiktok: 0,
    youtube: 0,
    lastScrape: null
  };
}