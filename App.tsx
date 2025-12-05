import React, { useState, useEffect } from 'react';
import { Word, AppTab } from './types';
import { ReviewMode } from './components/ReviewMode';
import { WordList } from './components/WordList';
import { BookOpen, List } from 'lucide-react';
import { enrichWordsBulk } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.REVIEW);
  
  // Initialize from localStorage directly (The Cache)
  // This ensures we load pinyin/meanings instantly without re-fetching Gemini
  const [words, setWords] = useState<Word[]>(() => {
    const saved = localStorage.getItem('chinese-words');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse words", e);
      return [];
    }
  });

  const [syncStatus, setSyncStatus] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Auto-Save: Update cache whenever words change
  useEffect(() => {
    localStorage.setItem('chinese-words', JSON.stringify(words));
  }, [words]);

  // Sync Logic:
  // 1. Load words.txt
  // 2. Filter out words we already have in cache
  // 3. Fetch ONLY the new words from Gemini
  useEffect(() => {
    const syncWithFile = async () => {
      try {
        // Add timestamp to prevent caching on static hosts like GitHub Pages
        const response = await fetch(`words.txt?t=${Date.now()}`);
        if (!response.ok) {
           // If file missing, just stay silent, maybe user hasn't created it yet
           return; 
        }

        const text = await response.text();
        const fileLines = text.split('\n').map(line => line.trim()).filter(Boolean);
        
        if (fileLines.length === 0) return;

        // Check against Cache: Find words that are in the file but NOT in our current list
        const existingChars = new Set(words.map(w => w.character));
        const newChars = fileLines.filter(char => !existingChars.has(char));

        if (newChars.length > 0) {
          setIsSyncing(true);
          setSyncStatus(`Found ${newChars.length} new words. Fetching meanings...`);
          
          // Bulk fetch only the new items
          const enrichedResults = await enrichWordsBulk(newChars, (current, total) => {
            setSyncStatus(`Analyzing new words: ${current}/${total}...`);
          });

          const newWordObjects: Word[] = enrichedResults.map(res => ({
            ...res,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
          }));

          // Merge new words into state (and thus into cache)
          setWords(prev => {
            const currentChars = new Set(prev.map(w => w.character));
            const uniqueNewWords = newWordObjects.filter(w => !currentChars.has(w.character));
            return [...uniqueNewWords, ...prev];
          });
          
          setSyncStatus(`Enriched & Cached ${newWordObjects.length} new words.`);
          setTimeout(() => setSyncStatus(''), 4000);
        } else {
           console.log("Words.txt matches cache. No API call needed.");
        }
      } catch (error) {
        console.error("Error syncing with words.txt", error);
      } finally {
        setIsSyncing(false);
      }
    };

    // Small delay to ensure initial render is done
    setTimeout(syncWithFile, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {syncStatus && (
          <div className={`text-xs mt-2 px-3 py-2 rounded-md transition-all ${isSyncing ? 'bg-blue-50 text-blue-700 animate-pulse border border-blue-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
            {syncStatus}
          </div>
        )}
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