# Perfume Influencer Aggregator

A comprehensive web application that automatically scrapes and aggregates influencer data from TikTok and YouTube, specifically focused on perfume reviewers with 50,000+ followers.

## Features

- **Multi-Platform Scraping**: Automatically searches TikTok and YouTube for perfume influencers
- **Advanced Filtering**: Filter by platform, country, gender, follower count, language, and content style
- **Real-time Dashboard**: View statistics and manage your influencer database
- **Google Sheets Integration**: Export data directly to Google Sheets
- **Scheduled Scraping**: Automatic data updates every 6 hours
- **Responsive Design**: Modern, mobile-friendly interface

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Google Sheets credentials
   ```

3. **Start the Application**
   ```bash
   # Start the backend server
   npm run server

   # In another terminal, start the frontend
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Google Sheets Setup

To enable Google Sheets export functionality:

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google Sheets API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API" and enable it

3. **Create Service Account**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Download the JSON credentials file

4. **Configure Environment Variables**
   ```bash
   GOOGLE_SHEETS_CREDENTIALS={"type":"service_account",...}
   GOOGLE_SHEETS_ID=your_spreadsheet_id_here
   ```

5. **Share Your Spreadsheet**
   - Share your Google Sheet with the service account email
   - Grant "Editor" permissions

## API Endpoints

- `GET /api/influencers` - Get all influencers
- `GET /api/stats` - Get scraping statistics
- `POST /api/scrape/start` - Start scraping process
- `POST /api/export/sheets` - Export data to Google Sheets

## Data Structure

Each influencer record contains:

- **Basic Info**: Name, handle, platform, profile URL
- **Metrics**: Followers, engagement rates (likes, comments, views)
- **Demographics**: Country, gender, language
- **Contact**: Email, phone (when available)
- **Content**: Style, posting frequency
- **Metadata**: Last updated timestamp

## Search Keywords

The application searches for influencers using these keywords:
- "perfume review"
- "fragrance haul"
- "scent of the day"
- "perfume recommendations"
- "fragrance collection"
- "perfume unboxing"
- "cologne review"
- "fragrance first impressions"

## Compliance & Ethics

This application is designed to:
- Respect platform rate limits and anti-bot measures
- Only collect publicly available information
- Comply with terms of service of scraped platforms
- Implement proper delays and request throttling

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express
- **Scraping**: Puppeteer, Cheerio
- **Scheduling**: node-cron
- **Integration**: Google Sheets API
- **Styling**: Custom CSS with modern design principles

## Development

### Project Structure
```
├── src/                 # Frontend React application
├── server/             # Backend Express server
│   ├── scrapers/       # Platform-specific scrapers
│   ├── services/       # External service integrations
│   └── database/       # Data management
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

### Adding New Platforms

To add support for additional platforms:

1. Create a new scraper in `server/scrapers/`
2. Implement the scraping logic following existing patterns
3. Add the platform to the main scraping orchestrator
4. Update the frontend to handle the new platform

### Customizing Search Keywords

Edit the `PERFUME_KEYWORDS` array in `server/scrapers/index.js` to modify search terms.

## Production Deployment

For production deployment:

1. **Database**: Replace in-memory storage with a proper database (PostgreSQL, MongoDB)
2. **Caching**: Implement Redis for caching scraped data
3. **Monitoring**: Add logging and error tracking
4. **Security**: Implement rate limiting and authentication
5. **Scaling**: Use queue systems for scraping jobs

## Legal Considerations

- Always review and comply with platform terms of service
- Respect robots.txt files and rate limits
- Only collect publicly available information
- Consider implementing user consent mechanisms
- Regularly review and update compliance measures

## Support

For issues and questions:
1. Check the console logs for error messages
2. Verify your Google Sheets credentials are correct
3. Ensure all environment variables are properly set
4. Review the platform-specific scraping limitations

## License

This project is for educational and research purposes. Please ensure compliance with all applicable laws and platform terms of service before commercial use.