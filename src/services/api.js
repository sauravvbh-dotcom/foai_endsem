import axios from 'axios';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const ISS_API_KEY = import.meta.env.VITE_ISS_API_KEY;

// Cache utility for news
const getCachedNews = (category) => {
  const cached = localStorage.getItem(`news_${category}`);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    // 15 minutes expiration
    if (Date.now() - timestamp < 15 * 60 * 1000) {
      return data;
    }
  }
  return null;
};

const setCachedNews = (category, data) => {
  localStorage.setItem(`news_${category}`, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
};

export const fetchIssLocation = async () => {
  try {
    // If user provided an N2YO API key, use it as primary
    if (ISS_API_KEY && ISS_API_KEY !== 'your_n2yo_api_key_here') {
      const res = await axios.get(`https://www.n2yo.com/rest/v1/satellite/positions/25544/0/0/0/1/&apiKey=${ISS_API_KEY}`);
      if (res.data && res.data.positions && res.data.positions.length > 0) {
        const pos = res.data.positions[0];
        return {
          timestamp: Math.floor(Date.now() / 1000),
          iss_position: {
            latitude: pos.satlatitude.toString(),
            longitude: pos.satlongitude.toString()
          }
        };
      }
    }
    
    // Fallback to wheretheiss.at (HTTPS compatible)
    const res = await axios.get('https://api.wheretheiss.at/v1/satellites/25544');
    return {
      timestamp: res.data.timestamp,
      iss_position: {
        latitude: res.data.latitude.toString(),
        longitude: res.data.longitude.toString()
      }
    };
  } catch (error) {
    console.error("ISS Fetch Error:", error);
    throw error;
  }
};

export const fetchAstronauts = async () => {
  try {
    // open-notify doesn't support HTTPS, so we return a placeholder 
    // or empty list on production to prevent Mixed Content blocking.
    return { people: [] };
  } catch (err) {
    return { people: [] };
  }
};

// Fallback reverse geocoding using Nominatim (OpenStreetMap)
export const reverseGeocode = async (lat, lon) => {
  try {
    const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
    if (res.data && res.data.address) {
      const address = res.data.address;
      return address.city || address.town || address.village || address.state || address.country || 'Unknown Location';
    }
    return 'Over Ocean';
  } catch (error) {
    return 'Over Ocean';
  }
};

export const fetchNews = async (category = 'Space') => {
  const cached = getCachedNews(category);
  if (cached) return cached;

  try {
    const res = await axios.get(`https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=${category}&language=en`);
    
    // Normalize data to match the expected format
    const articles = res.data.results.map(item => ({
      title: item.title,
      description: item.description,
      author: item.creator ? item.creator[0] : 'Unknown',
      source: { name: item.source_id },
      publishedAt: item.pubDate,
      urlToImage: item.image_url,
      url: item.link
    })).slice(0, 10);
    
    setCachedNews(category, articles);
    return articles;
  } catch (error) {
    console.error("Error fetching news", error);
    return [];
  }
};
