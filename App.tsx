import React, { useState, useEffect } from 'react';
import { Word, AppTab } from './types';
import { ReviewMode } from './components/ReviewMode';
import { WordList } from './components/WordList';
import { BookOpen, List, Loader2 } from 'lucide-react';

// NOTE: We no longer import geminiService because we are 100% static now!

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.REVIEW);
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load words.json ONCE when the app starts
  useEffect(() => {
    const loadStaticData = async () => {
      try {
        // Fetch the static JSON file from the public folder
        const response = await fetch('words.json');
        
        if (!response.ok) {
          console.error("Failed to load words.json");
          return;
        }

        const data = await response.json();
        setWords(data);
      } catch (error) {
        console.error("Error loading static data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStaticData();
  }, []);

  const NavButton = ({ tab, icon: Icon, label }: { tab: AppTab; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
        activeTab === tab ? 'text-chinese-red bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon size={24} strokeWidth={activeTab === tab ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 text-chinese-red gap-4">
        <Loader2 className="animate-spin" size={48} />
        <p className="font-medium">Loading Dictionary...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100 max-w-lg mx-auto shadow-2xl overflow-hidden relative">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-100 p-4 flex flex-col z-10 shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-chinese-red tracking-tight flex items-center gap-2">
              Flashcards <span className="text-gray-300 text-sm font-normal">| Chinese</span>
          </h1>
          <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            {words.length} Words
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === AppTab.REVIEW && <ReviewMode words={words} />}
        {activeTab === AppTab.LIST && <WordList words={words} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 h-20 pb-6 flex items-center shrink-0 z-20">
        <NavButton tab={AppTab.REVIEW} icon={BookOpen} label="Review" />
        <NavButton tab={AppTab.LIST} icon={List} label="List" />
      </nav>

    </div>
  );
};

export default App;
