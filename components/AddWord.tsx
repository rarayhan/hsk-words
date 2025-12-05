import React, { useState } from 'react';
import { Word } from '../types';
import { enrichWord, enrichWordsBulk } from '../services/geminiService';
import { Sparkles, Save, X, Loader2, Layers, Type as TypeIcon, CheckCircle } from 'lucide-react';

interface AddWordProps {
  onAdd: (word: Omit<Word, 'id' | 'createdAt'>, shouldNavigate?: boolean) => void;
  onCancel: () => void;
}

export const AddWord: React.FC<AddWordProps> = ({ onAdd, onCancel }) => {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  
  // Single Mode State
  const [character, setCharacter] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [meaning, setMeaning] = useState('');
  const [exampleSentence, setExampleSentence] = useState('');
  const [exampleMeaning, setExampleMeaning] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Bulk Mode State
  const [bulkText, setBulkText] = useState('');
  const [bulkPreview, setBulkPreview] = useState<Array<Omit<Word, 'id' | 'createdAt'>>>([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });

  // Single Mode Handlers
  const handleMagicFill = async () => {
    if (!character) {
      setError('Please enter a Chinese character first.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const details = await enrichWord(character);
      setPinyin(details.pinyin);
      setMeaning(details.meaning);
      setExampleSentence(details.exampleSentence);
      setExampleMeaning(details.exampleMeaning);
    } catch (err) {
      setError('Failed to fetch details. Please try again or fill manually.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!character || !meaning) {
      setError('Character and Meaning are required.');
      return;
    }
    onAdd({ character, pinyin, meaning, exampleSentence, exampleMeaning }, true);
  };

  // Bulk Mode Handlers
  const handleBulkAnalyze = async () => {
    const lines = bulkText.split('\n').filter(line => line.trim().length > 0);
    if (lines.length === 0) {
      setError('Please enter some words first.');
      return;
    }

    setIsBulkProcessing(true);
    setError('');
    setBulkPreview([]);
    setBulkProgress({ current: 0, total: lines.length });

    try {
      const results = await enrichWordsBulk(lines, (current, total) => {
        setBulkProgress({ current, total });
      });
      setBulkPreview(results);
    } catch (err) {
      setError('Failed to process bulk list. Please try fewer words or check your internet.');
      console.error(err);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkSave = () => {
    // Add all words without navigating for each one
    bulkPreview.forEach(word => onAdd(word, false));
    
    setBulkPreview([]);
    setBulkText('');
    setMode('single');
    // Navigate manually after all are added
    onCancel(); 
  };

  const removeBulkItem = (index: number) => {
    setBulkPreview(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full overflow-y-auto p-6 pb-24 bg-paper">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-ink">Add Words</h2>
          
          {/* Mode Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setMode('single')}
              className={`p-2 rounded-md transition-all ${mode === 'single' ? 'bg-white shadow-sm text-chinese-red' : 'text-gray-400'}`}
              title="Single Word"
            >
              <TypeIcon size={20} />
            </button>
            <button
              onClick={() => setMode('bulk')}
              className={`p-2 rounded-md transition-all ${mode === 'bulk' ? 'bg-white shadow-sm text-chinese-red' : 'text-gray-400'}`}
              title="Bulk Import"
            >
              <Layers size={20} />
            </button>
          </div>
        </div>

        {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError('')}><X size={16} /></button>
            </div>
        )}
        
        {mode === 'single' ? (
          <form onSubmit={handleSubmitSingle} className="space-y-5">
            {/* Character Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chinese Character (Hanzi)</label>
              <div className="relative">
                <input
                  type="text"
                  value={character}
                  onChange={(e) => setCharacter(e.target.value)}
                  className="w-full p-4 text-2xl border-2 border-gray-200 rounded-xl focus:border-chinese-red focus:ring-chinese-red outline-none transition-all"
                  placeholder="e.g. 你好"
                />
                <button
                  type="button"
                  onClick={handleMagicFill}
                  disabled={isLoading || !character}
                  className="absolute right-3 top-3 p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition-colors"
                  title="Auto-fill with AI"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Type a word and hit the sparkle button to auto-fill details.</p>
            </div>

            {/* Details Fields */}
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pinyin</label>
                <input
                  type="text"
                  value={pinyin}
                  onChange={(e) => setPinyin(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-chinese-red outline-none"
                  placeholder="nǐ hǎo"
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meaning</label>
                <input
                  type="text"
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-chinese-red outline-none"
                  placeholder="Hello"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Example Sentence</label>
              <input
                type="text"
                value={exampleSentence}
                onChange={(e) => setExampleSentence(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-chinese-red outline-none"
                placeholder="Chinese example..."
              />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Example Translation</label>
              <input
                type="text"
                value={exampleMeaning}
                onChange={(e) => setExampleMeaning(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-chinese-red outline-none"
                placeholder="English translation..."
              />
            </div>

            <div className="pt-4 flex gap-3">
               <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <X size={18} /> Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-chinese-red text-white rounded-xl font-medium shadow-lg shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Save size={18} /> Save Word
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
             {/* Bulk Input */}
             {bulkPreview.length === 0 ? (
               <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paste list (one word per line)</label>
                    <textarea
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:border-chinese-red outline-none resize-none font-mono text-sm"
                      placeholder={`你好\n世界\n学习\n...`}
                    />
                    <p className="text-xs text-gray-500 mt-2">Paste up to 60 words at a time for automatic enrichment.</p>
                  </div>
                  
                  {isBulkProcessing && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div 
                        className="bg-chinese-red h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${(bulkProgress.current / Math.max(bulkProgress.total, 1)) * 100}%` }}
                      ></div>
                    </div>
                  )}

                  <button
                    onClick={handleBulkAnalyze}
                    disabled={isBulkProcessing || !bulkText.trim()}
                    className="w-full py-4 bg-chinese-red text-white rounded-xl font-bold shadow-lg shadow-red-100 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isBulkProcessing ? (
                      <>
                        <Loader2 className="animate-spin" size={20} /> 
                        Processing {bulkProgress.current}/{bulkProgress.total}...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} /> Analyze Words
                      </>
                    )}
                  </button>
               </div>
             ) : (
               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700">Preview ({bulkPreview.length})</h3>
                    <button 
                      onClick={() => setBulkPreview([])} 
                      className="text-xs text-red-500 hover:underline"
                    >
                      Clear & Edit List
                    </button>
                 </div>
                 
                 <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                    {bulkPreview.map((word, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100 flex items-start gap-3 relative group">
                         <div className="w-6 h-6 rounded-full bg-red-50 text-chinese-red text-xs flex items-center justify-center font-bold mt-1 shrink-0">
                           {idx + 1}
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2">
                               <span className="font-bold text-ink text-lg">{word.character}</span>
                               <span className="text-gray-500 text-sm truncate">{word.pinyin}</span>
                            </div>
                            <div className="text-sm text-gray-700 line-clamp-1">{word.meaning}</div>
                         </div>
                         <button 
                           onClick={() => removeBulkItem(idx)}
                           className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                           title="Remove"
                         >
                           <X size={16} />
                         </button>
                      </div>
                    ))}
                 </div>

                 <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setBulkPreview([])}
                      className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBulkSave}
                      className="flex-1 py-3 px-4 bg-chinese-red text-white rounded-xl font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} /> Import All
                    </button>
                 </div>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};
