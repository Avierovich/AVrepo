import puppeteer from 'puppeteer';

export async function scrapeYouTube(keyword) {
  console.log(`Scraping YouTube for keyword: ${keyword}`);
  
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Navigate to YouTube search
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}`;
    
    // For demo purposes, return mock data
    await browser.close();
    
    return generateMockYouTubeData(keyword);
    
  } catch (error) {
    console.error('YouTube scraping error:', error);
    return [];
  }
}

function generateMockYouTubeData(keyword) {
  // Mock data for demonstration
  const mockInfluencers = [
    {
      id: `youtube-${Date.now()}-1`,
      name: 'Scent Scientist',
      handle: 'scentscientist',
      platform: 'youtube',
      profileUrl: 'https://youtube.com/@scentscientist',
      followers: 142000,
      country: 'Australia',
      gender: 'Male',
      email: 'hello@scentscientist.com',
      phone: '',
      language: 'English',
      avgLikes: 6800,
      avgComments: 420,
      avgViews: 85000,
      contentStyle: 'educational, scientific',
      postingFrequency: 'weekly',
      lastUpdated: new Date().toISOString()
    }
  ];
  
  return mockInfluencers;
}

// Helper function to extract channel data
async function extractYouTubeChannel(page, channelUrl) {
  try {
    await page.goto(channelUrl, { waitUntil: 'networkidle2' });
    
    // Wait for channel elements to load
    await page.waitForSelector('#channel-header', { timeout: 10000 });
    
    const channelData = await page.evaluate(() => {
      // Extract channel information
      const nameElement = document.querySelector('#channel-name #text');
      const subscribersElement = document.querySelector('#subscriber-count');
      const aboutElement = document.querySelector('#description');
      
      return {
        name: nameElement?.textContent?.trim() || '',
        subscribers: parseSubscriberCount(subscribersElement?.textContent || '0'),
        description: aboutElement?.textContent?.trim() || ''
      };
    });
    
    return channelData;
  } catch (error) {
    console.error('Error extracting YouTube channel:', error);
    return null;
  }
}

function parseSubscriberCount(text) {
  const num = parseFloat(text.replace(/[^\d.]/g, ''));
  if (text.includes('M')) return Math.floor(num * 1000000);
  if (text.includes('K')) return Math.floor(num * 1000);
  return Math.floor(num);
}