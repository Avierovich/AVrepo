import { google } from 'googleapis';

export async function exportToGoogleSheets(influencers) {
  try {
    // Initialize Google Sheets API
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    
    if (!spreadsheetId) {
      throw new Error('Google Sheets ID not configured');
    }
    
    // Prepare data for sheets
    const headers = [
      'Name',
      'Handle',
      'Platform',
      'Profile URL',
      'Followers',
      'Country',
      'Gender',
      'Email',
      'Phone',
      'Language',
      'Avg Likes',
      'Avg Comments',
      'Avg Views',
      'Content Style',
      'Posting Frequency',
      'Last Updated'
    ];
    
    const rows = influencers.map(inf => [
      inf.name,
      inf.handle,
      inf.platform,
      inf.profileUrl,
      inf.followers,
      inf.country,
      inf.gender,
      inf.email,
      inf.phone,
      inf.language,
      inf.avgLikes,
      inf.avgComments,
      inf.avgViews,
      inf.contentStyle,
      inf.postingFrequency,
      inf.lastUpdated
    ]);
    
    // Clear existing data and add new data
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: 'A:P'
    });
    
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'RAW',
      resource: {
        values: [headers, ...rows]
      }
    });
    
    console.log(`Exported ${influencers.length} influencers to Google Sheets`);
    return true;
    
  } catch (error) {
    console.error('Google Sheets export error:', error);
    throw error;
  }
}

export async function setupGoogleSheetsIntegration() {
  console.log('Setting up Google Sheets integration...');
  
  // Instructions for setting up Google Sheets API
  const instructions = `
    To set up Google Sheets integration:
    
    1. Go to Google Cloud Console (https://console.cloud.google.com/)
    2. Create a new project or select existing one
    3. Enable Google Sheets API
    4. Create service account credentials
    5. Download the JSON credentials file
    6. Set environment variables:
       - GOOGLE_SHEETS_CREDENTIALS: JSON content of credentials file
       - GOOGLE_SHEETS_ID: Your spreadsheet ID from the URL
    
    Example .env file:
    GOOGLE_SHEETS_CREDENTIALS={"type":"service_account",...}
    GOOGLE_SHEETS_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
  `;
  
  console.log(instructions);
  return instructions;
}