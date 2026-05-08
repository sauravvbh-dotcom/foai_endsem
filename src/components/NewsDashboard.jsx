import { useState, useMemo, useEffect } from 'react';
import { useNewsData } from '../hooks/useNewsData';
import NewsChart from '../charts/NewsChart';
import { Search, RefreshCw, ExternalLink, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useStore } from '../store';

export default function NewsDashboard() {
  const { articles, loading, error, refetch, categories } = useNewsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'source'
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Set current news context to store for chatbot
  useEffect(() => {
    if (articles) {
      // Just save top headlines to avoid massive storage
      const topNews = Object.values(articles).flat().slice(0, 10).map(a => ({ title: a.title }));
      useStore.setState({ currentNews: topNews });
    }
  }, [articles]);

  const allArticles = useMemo(() => {
    let list = [];
    if (activeCategory === 'All') {
      Object.values(articles).forEach(catArticles => {
        list = [...list, ...catArticles];
      });
    } else {
      list = articles[activeCategory] || [];
    }
    
    // Filter by search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(a => a.title?.toLowerCase().includes(lower) || a.description?.toLowerCase().includes(lower));
    }
    
    // Remove duplicates by URL
    list = list.filter((v, i, a) => a.findIndex(t => (t.url === v.url)) === i);

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      }
      return (a.source?.name || '').localeCompare(b.source?.name || '');
    });

    return list.slice(0, 20); // Show max 20 overall
  }, [articles, activeCategory, searchTerm, sortBy]);

  const chartData = useMemo(() => {
    return categories.map(cat => ({
      name: cat,
      value: articles[cat] ? articles[cat].length : 0
    })).filter(c => c.value > 0);
  }, [articles, categories]);

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading latest news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-4">
        <p className="text-destructive">{error}</p>
        <button onClick={refetch} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Global News Hub</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="date">Latest First</option>
              <option value="source">By Source</option>
            </select>
            
            <button
              onClick={() => refetch()}
              className="p-2 border rounded-md hover:bg-muted transition-colors"
              title="Refresh News"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Categories
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveCategory('All')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeCategory === 'All' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              >
                All News
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeCategory === cat ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-4">News Distribution</h3>
            <NewsChart data={chartData} onCategoryClick={setActiveCategory} />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="lg:col-span-3 grid gap-6 md:grid-cols-2">
          {allArticles.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground border rounded-lg bg-card">
              No articles found matching your criteria.
            </div>
          ) : (
            allArticles.map((article, i) => (
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={i} 
                className="bg-card border rounded-lg overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow"
              >
                {article.urlToImage && (
                  <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {article.source?.name || 'Unknown Source'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {article.publishedAt ? format(new Date(article.publishedAt), 'MMM d, yyyy') : ''}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                    {article.description}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t">
                    <span className="text-xs text-muted-foreground max-w-[150px] truncate">
                      By {article.author || 'Unknown'}
                    </span>
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      Read More <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
