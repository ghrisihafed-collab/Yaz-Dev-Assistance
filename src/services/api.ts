// Service to handle external API calls using keys stored in SQLite

export interface NewsArticle {
  source: { name: string };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
}

export interface MarketData {
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
}

const getApiKey = async (keyName: string): Promise<string | null> => {
  const settings = await window.electronAPI.getSettings();
  const setting = settings.find(s => s.key === keyName);
  return setting ? setting.value : null;
};

export const apiService = {
  // Fetch Top Headlines based on current language
  fetchNews: async (language: string): Promise<NewsArticle[]> => {
    const key = await getApiKey('news_api_key');
    if (!key) throw new Error('MISSING_KEY');

    // Map app languages to NewsAPI supported languages/countries
    // NewsAPI supports: ar, de, en, es, fr, he, it, nl, no, pt, ru, se, ud, zh
    let apiLang = language;
    if (!['ar', 'de', 'en', 'fr'].includes(language)) apiLang = 'en';

    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?language=${apiLang}&pageSize=20&apiKey=${key}`
      );
      const data = await response.json();
      if (data.status === 'error') throw new Error(data.message);
      return data.articles;
    } catch (error) {
      console.error("News Fetch Error:", error);
      throw error;
    }
  },

  // Fetch Exchange Rate (e.g., EUR to USD)
  fetchExchangeRate: async (from: string, to: string) => {
    const key = await getApiKey('alpha_vantage_key');
    if (!key) throw new Error('MISSING_KEY');

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${key}`
      );
      const data = await response.json();
      const rateData = data['Realtime Currency Exchange Rate'];
      
      if (!rateData) return null;

      return {
        from: rateData['1. From_Currency Code'],
        to: rateData['3. To_Currency Code'],
        rate: parseFloat(rateData['5. Exchange Rate']),
        lastRefreshed: rateData['6. Last Refreshed']
      };
    } catch (error) {
      console.error("Forex Fetch Error:", error);
      throw error;
    }
  },

  // Fetch Crypto or Stock Quote
  fetchGlobalQuote: async (symbol: string): Promise<MarketData | null> => {
    const key = await getApiKey('alpha_vantage_key');
    if (!key) throw new Error('MISSING_KEY');

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`
      );
      const data = await response.json();
      const quote = data['Global Quote'];

      if (!quote) return null;

      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']).toFixed(2),
        change: parseFloat(quote['09. change']).toFixed(2),
        changePercent: quote['10. change percent']
      };
    } catch (error) {
      console.error("Quote Fetch Error:", error);
      throw error;
    }
  }
};
