import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Key } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { t } = useTranslation();
  const [keys, setKeys] = useState({
    newsApiKey: '',
    alphaVantageKey: '',
    openWeatherKey: '',
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await window.electronAPI.getSettings();
    const newKeys = { ...keys };
    settings.forEach(s => {
      if (s.key === 'news_api_key') newKeys.newsApiKey = s.value;
      if (s.key === 'alpha_vantage_key') newKeys.alphaVantageKey = s.value;
      if (s.key === 'open_weather_key') newKeys.openWeatherKey = s.value;
    });
    setKeys(newKeys);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    
    await window.electronAPI.saveSetting('news_api_key', keys.newsApiKey);
    await window.electronAPI.saveSetting('alpha_vantage_key', keys.alphaVantageKey);
    await window.electronAPI.saveSetting('open_weather_key', keys.openWeatherKey);
    
    setStatus('saved');
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
          <Key size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{t('app.settings')}</h2>
          <p className="text-sm text-gray-500">Manage your API keys for external services</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* NewsAPI */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">NewsAPI Key</label>
          <input
            type="password"
            value={keys.newsApiKey}
            onChange={(e) => setKeys({...keys, newsApiKey: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. 12345abcdef..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Get a free key at <a href="https://newsapi.org" target="_blank" className="text-blue-600 hover:underline">newsapi.org</a>
          </p>
        </div>

        {/* Alpha Vantage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alpha Vantage Key (Finance)</label>
          <input
            type="password"
            value={keys.alphaVantageKey}
            onChange={(e) => setKeys({...keys, alphaVantageKey: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. KJE82..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Get a free key at <a href="https://www.alphavantage.co/support/#api-key" target="_blank" className="text-blue-600 hover:underline">alphavantage.co</a>
          </p>
        </div>

        {/* OpenWeather */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OpenWeatherMap Key</label>
          <input
            type="password"
            value={keys.openWeatherKey}
            onChange={(e) => setKeys({...keys, openWeatherKey: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. 88392..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Get a free key at <a href="https://openweathermap.org/api" target="_blank" className="text-blue-600 hover:underline">openweathermap.org</a>
          </p>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          {status === 'saved' && <span className="text-green-600 font-medium animate-pulse">Saved successfully!</span>}
          <button
            type="submit"
            className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            <span>Save Keys</span>
          </button>
        </div>
      </form>
    </div>
  );
};
