import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService, MarketData } from '../services/api';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

interface EconomyViewProps {
  onNavigateToSettings: () => void;
}

export const EconomyView: React.FC<EconomyViewProps> = ({ onNavigateToSettings }) => {
  const { t } = useTranslation();
  const [quotes, setQuotes] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [missingKey, setMissingKey] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Symbols to track
  const symbols = ['BTC', 'ETH', 'IBM', 'AAPL']; // Mix of Crypto and Tech Stocks

  const loadData = async () => {
    setLoading(true);
    setMissingKey(false);
    
    try {
      // Fetch all quotes in parallel
      const promises = symbols.map(sym => apiService.fetchGlobalQuote(sym));
      const results = await Promise.all(promises);
      
      // Filter out nulls (failed requests)
      const validQuotes = results.filter((q): q is MarketData => q !== null);
      
      setQuotes(validQuotes);
      setLastUpdated(new Date());

    } catch (err: any) {
      if (err.message === 'MISSING_KEY') {
        setMissingKey(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (missingKey) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="bg-blue-100 p-4 rounded-full text-blue-600 mb-4">
          <TrendingUp size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Market Data Access</h3>
        <p className="text-gray-500 max-w-md mb-6">
          To see real-time stock and crypto market data, please configure your free Alpha Vantage API key.
        </p>
        <button
          onClick={onNavigateToSettings}
          className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
        >
          Configure API Key
        </button>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-3xl">📈</span> {t('nav.economy')}
          </h2>
          {lastUpdated && (
            <p className="text-sm text-gray-400 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button 
          onClick={loadData}
          className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading && quotes.length === 0 && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quotes.map((quote) => {
          const isPositive = parseFloat(quote.change) >= 0;
          return (
            <div key={quote.symbol} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-gray-700">{quote.symbol}</h3>
                <div className={clsx(
                  "p-2 rounded-lg",
                  isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                )}>
                  {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">${quote.price}</span>
              </div>
              
              <div className={clsx(
                "flex items-center gap-1 text-sm mt-2 font-medium",
                isPositive ? "text-green-600" : "text-red-600"
              )}>
                <span>{isPositive ? '+' : ''}{quote.change}</span>
                <span>({quote.changePercent})</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder for Exchange Rate Calculator */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Currency Converter</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              Quickly check exchange rates between major currencies. (Feature coming soon)
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-center gap-4 border border-white/10">
            <div className="text-center">
              <span className="block text-xs text-slate-400 mb-1">USD</span>
              <span className="font-mono text-xl font-bold">1.00</span>
            </div>
            <div className="text-slate-500">→</div>
            <div className="text-center">
              <span className="block text-xs text-slate-400 mb-1">TND</span>
              <span className="font-mono text-xl font-bold">3.12</span>
            </div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};
