import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Play, Users, Globe, Calendar, TrendingUp } from 'lucide-react';
import axios from 'axios';

interface Influencer {
  id: string;
  name: string;
  handle: string;
  platform: 'tiktok' | 'youtube';
  profileUrl: string;
  followers: number;
  country: string;
  gender: string;
  email: string;
  phone: string;
  language: string;
  avgLikes: number;
  avgComments: number;
  avgViews: number;
  contentStyle: string;
  postingFrequency: string;
  lastUpdated: string;
}

interface SearchFilters {
  platform: string;
  country: string;
  gender: string;
  minFollowers: number;
  maxFollowers: number;
  language: string;
  contentStyle: string;
}

function App() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [filteredInfluencers, setFilteredInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    platform: '',
    country: '',
    gender: '',
    minFollowers: 50000,
    maxFollowers: 10000000,
    language: '',
    contentStyle: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    tiktok: 0,
    youtube: 0,
    lastScrape: null as string | null
  });

  useEffect(() => {
    fetchInfluencers();
    fetchStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [influencers, searchQuery, filters]);

  const fetchInfluencers = async () => {
    try {
      const response = await axios.get('/api/influencers');
      setInfluencers(response.data);
    } catch (error) {
      console.error('Error fetching influencers:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const startScraping = async () => {
    setLoading(true);
    try {
      await axios.post('/api/scrape/start');
      // Refresh data after scraping
      setTimeout(() => {
        fetchInfluencers();
        fetchStats();
        setLoading(false);
      }, 5000);
    } catch (error) {
      console.error('Error starting scrape:', error);
      setLoading(false);
    }
  };

  const exportToSheets = async () => {
    try {
      await axios.post('/api/export/sheets', { influencers: filteredInfluencers });
      alert('Data exported to Google Sheets successfully!');
    } catch (error) {
      console.error('Error exporting to sheets:', error);
      alert('Error exporting to Google Sheets. Please check your configuration.');
    }
  };

  const applyFilters = () => {
    let filtered = influencers;

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(inf => 
        inf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inf.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inf.contentStyle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Platform filter
    if (filters.platform) {
      filtered = filtered.filter(inf => inf.platform === filters.platform);
    }

    // Country filter
    if (filters.country) {
      filtered = filtered.filter(inf => inf.country === filters.country);
    }

    // Gender filter
    if (filters.gender) {
      filtered = filtered.filter(inf => inf.gender === filters.gender);
    }

    // Followers range filter
    filtered = filtered.filter(inf => 
      inf.followers >= filters.minFollowers && inf.followers <= filters.maxFollowers
    );

    // Language filter
    if (filters.language) {
      filtered = filtered.filter(inf => inf.language === filters.language);
    }

    // Content style filter
    if (filters.contentStyle) {
      filtered = filtered.filter(inf => 
        inf.contentStyle.toLowerCase().includes(filters.contentStyle.toLowerCase())
      );
    }

    setFilteredInfluencers(filtered);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const countries = [...new Set(influencers.map(inf => inf.country))].filter(Boolean);
  const languages = [...new Set(influencers.map(inf => inf.language))].filter(Boolean);
  const contentStyles = [...new Set(influencers.map(inf => inf.contentStyle))].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Perfume Influencer Aggregator</h1>
              <p className="text-gray-600">Discover and analyze perfume reviewers across TikTok and YouTube</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={startScraping}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? <div className="loading"></div> : <Search size={16} />}
                {loading ? 'Scraping...' : 'Start Scraping'}
              </button>
              <button
                onClick={exportToSheets}
                className="btn btn-success"
              >
                <Download size={16} />
                Export to Sheets
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Dashboard */}
      <section className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={24} />
              <div>
                <p className="text-gray-600 text-sm">Total Influencers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <Play className="text-red-600" size={24} />
              <div>
                <p className="text-gray-600 text-sm">YouTube</p>
                <p className="text-2xl font-bold">{stats.youtube}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-pink-600" size={24} />
              <div>
                <p className="text-gray-600 text-sm">TikTok</p>
                <p className="text-2xl font-bold">{stats.tiktok}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <Calendar className="text-green-600" size={24} />
              <div>
                <p className="text-gray-600 text-sm">Last Updated</p>
                <p className="text-sm font-semibold">
                  {stats.lastScrape ? new Date(stats.lastScrape).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="container mb-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} />
            <h2 className="text-lg font-semibold">Search & Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search by name, handle, or style..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
              <select
                value={filters.platform}
                onChange={(e) => setFilters({...filters, platform: e.target.value})}
                className="select"
              >
                <option value="">All Platforms</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                value={filters.country}
                onChange={(e) => setFilters({...filters, country: e.target.value})}
                className="select"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={filters.gender}
                onChange={(e) => setFilters({...filters, gender: e.target.value})}
                className="select"
              >
                <option value="">All Genders</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Followers</label>
              <input
                type="number"
                value={filters.minFollowers}
                onChange={(e) => setFilters({...filters, minFollowers: parseInt(e.target.value) || 0})}
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({...filters, language: e.target.value})}
                className="select"
              >
                <option value="">All Languages</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Style</label>
              <input
                type="text"
                placeholder="e.g., luxury, minimal, comedic..."
                value={filters.contentStyle}
                onChange={(e) => setFilters({...filters, contentStyle: e.target.value})}
                className="input"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results Table */}
      <section className="container mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Influencers ({filteredInfluencers.length} results)
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table min-w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Platform</th>
                  <th>Followers</th>
                  <th>Country</th>
                  <th>Gender</th>
                  <th>Language</th>
                  <th>Avg Engagement</th>
                  <th>Content Style</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredInfluencers.map((influencer) => (
                  <tr key={influencer.id}>
                    <td>
                      <div>
                        <div className="font-semibold">{influencer.name}</div>
                        <div className="text-sm text-gray-500">@{influencer.handle}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${influencer.platform === 'tiktok' ? 'badge-tiktok' : 'badge-youtube'}`}>
                        {influencer.platform.toUpperCase()}
                      </span>
                    </td>
                    <td className="font-semibold">{formatNumber(influencer.followers)}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Globe size={14} />
                        {influencer.country}
                      </div>
                    </td>
                    <td>{influencer.gender}</td>
                    <td>{influencer.language}</td>
                    <td>
                      <div className="text-sm">
                        <div>❤️ {formatNumber(influencer.avgLikes)}</div>
                        <div>💬 {formatNumber(influencer.avgComments)}</div>
                        <div>👁️ {formatNumber(influencer.avgViews)}</div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {influencer.contentStyle}
                      </span>
                    </td>
                    <td>
                      <div className="text-sm">
                        {influencer.email && (
                          <div>📧 {influencer.email}</div>
                        )}
                        {influencer.phone && (
                          <div>📱 {influencer.phone}</div>
                        )}
                        <a 
                          href={influencer.profileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Profile
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredInfluencers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No influencers found matching your criteria. Try adjusting your filters or start a new scraping session.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;