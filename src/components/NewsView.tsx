import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService, NewsArticle } from '../services/api';
import { AlertCircle, ExternalLink, Calendar, RefreshCw } from 'lucide-react';

interface NewsViewProps {
  onNavigateToSettings: () => void;
}

export const NewsView: React.FC<NewsViewProps> = ({ onNavigateToSettings }) => {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingKey, setMissingKey] = useState(false);

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    setMissingKey(false);
    
    try {
      const data = await apiService.fetchNews(i18n.language);
      // Filter removed articles (common issue with NewsAPI)
      const validArticles = data.filter(a => a.title !== '[Removed]');
      setArticles(validArticles);
    } catch (err: any) {
      if (err.message === 'MISSING_KEY') {
        setMissingKey(true);
      } else {
        setError(err.message || 'Failed to load news');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [i18n.language]);

  if (missingKey) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="bg-orange-100 p-4 rounded-full text-orange-600 mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">API Key Required</h3>
        <p className="text-gray-500 max-w-md mb-6">
          To display the latest news, you need to configure your free NewsAPI key in the settings.
        </p>
        <button
          onClick={onNavigateToSettings}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Go to Settings
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-3xl">📰</span> {t('nav.news')}
        </h2>
        <button 
          onClick={loadNews}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          title="Refresh"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-80 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
          {articles.map((article, index) => (
            <article 
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full"
            >
              {article.urlToImage && (
                <div className="h-48 overflow-hidden relative group">
                  <img 
                    src={article.urlToImage} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur text-white text-xs px-2 py-1 rounded">
                    {article.source.name}
                  </div>
                </div>
              )}
              
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </h3>
                
                <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1">
                  {article.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto text-xs text-gray-400 border-t border-gray-50 pt-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    Read more <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
