import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, CheckSquare, Map as MapIcon, Globe, TrendingUp, Settings, Menu } from 'lucide-react';
import { clsx } from 'clsx';
import { TaskList } from './components/TaskList';
import { MapView } from './components/MapView';
import { SettingsView } from './components/SettingsView';
import { NewsView } from './components/NewsView';
import { EconomyView } from './components/EconomyView';

function App() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
    
    if (i18n.language === 'ar') {
      document.body.classList.add('font-arabic');
      document.body.classList.remove('font-sans');
    } else {
      document.body.classList.add('font-sans');
      document.body.classList.remove('font-arabic');
    }
  }, [i18n.language]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { id: 'tasks', icon: CheckSquare, label: t('nav.tasks') },
    { id: 'map', icon: MapIcon, label: t('nav.map') },
    { id: 'news', icon: Globe, label: t('nav.news') },
    { id: 'economy', icon: TrendingUp, label: t('nav.economy') },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className={clsx("bg-slate-900 text-white transition-all duration-300 flex flex-col z-20", isSidebarOpen ? "w-64" : "w-20")}>
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && <h1 className="font-bold text-xl tracking-tight text-blue-400">Yaz Dev</h1>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg">
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={clsx(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                activeTab === item.id 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
           {isSidebarOpen && <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">{t('app.language')}</p>}
           <div className={clsx("flex gap-2", !isSidebarOpen && "flex-col")}>
             {['en', 'fr', 'ar', 'de'].map(lang => (
               <button
                 key={lang}
                 onClick={() => changeLanguage(lang)}
                 className={clsx(
                   "px-2 py-1 text-xs font-bold rounded uppercase",
                   i18n.language === lang 
                    ? "bg-slate-700 text-white" 
                    : "bg-slate-800 text-slate-500 hover:bg-slate-700"
                 )}
               >
                 {lang}
               </button>
             ))}
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 justify-between shadow-sm z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeTab === 'dashboard' ? t('app.welcome') : 
             activeTab === 'settings' ? t('app.settings') : t(`nav.${activeTab}`)}
          </h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('settings')}
              className={clsx(
                "p-2 rounded-full transition-colors",
                activeTab === 'settings' ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <Settings size={20} />
            </button>
            <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              H
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto h-full">
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <TaskList />
                </div>
                
                <div className="space-y-6">
                   <div 
                     onClick={() => setActiveTab('news')}
                     className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white cursor-pointer hover:shadow-xl transition-all"
                   >
                    <h3 className="text-lg font-semibold mb-2">{t('nav.news')}</h3>
                    <p className="opacity-90 text-sm">International markets are opening with a slight uptrend today. Tap to read more.</p>
                  </div>

                  <div 
                    onClick={() => setActiveTab('map')}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-blue-300 transition-all"
                  >
                     <h3 className="text-lg font-semibold mb-2">{t('nav.map')}</h3>
                     <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        <MapIcon size={32} />
                     </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && <TaskList />}
            {activeTab === 'map' && <MapView />}
            {activeTab === 'news' && <NewsView onNavigateToSettings={() => setActiveTab('settings')} />}
            {activeTab === 'economy' && <EconomyView onNavigateToSettings={() => setActiveTab('settings')} />}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;