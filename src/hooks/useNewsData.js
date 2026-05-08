import { useState, useEffect, useCallback } from 'react';
import { fetchNews } from '../services/api';
import { toast } from 'sonner';

const CATEGORIES = ['Technology', 'Science', 'Space', 'World', 'AI'];

export function useNewsData() {
  const [articles, setArticles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNews = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        CATEGORIES.map(async (cat) => {
          if (forceRefresh) localStorage.removeItem(`news_${cat}`);
          const data = await fetchNews(cat);
          return { category: cat, data };
        })
      );

      const newArticles = {};
      results.forEach((res) => {
        newArticles[res.category] = res.data;
      });

      setArticles(newArticles);
    } catch (err) {
      setError('Failed to fetch news. Please try again.');
      toast.error('Failed to load news articles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  return { articles, loading, error, refetch: () => loadNews(true), categories: CATEGORIES };
}
