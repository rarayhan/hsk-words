import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { RefreshCw, Shuffle, ChevronLeft, ChevronRight } from 'lucide-react';

interface ReviewModeProps {
  words: Word[];
}

export const ReviewMode: React.FC<ReviewModeProps> = ({ words: initialWords }) => {
  // Local state for words to support shuffling without affecting the main list
  const [reviewList, setReviewList] = useState<Word[]>(initialWords);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Update review list when initialWords changes (e.g. sync finishes)
  useEffect(() => {
    setReviewList(initialWords);
  }, [initialWords]);

  const currentWord = reviewList[currentIndex];

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % reviewList.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + reviewList.length) % reviewList.length);
  };

  const handleShuffle = () => {
    // 1. Create a copy of the current list
    const shuffled = [...reviewList];
    
    // 2. Perform Fisher-Yates Shuffle (The "Perfect" Shuffle)
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 3. Update state
    setReviewList(shuffled);
    setCurrentIndex(0); // Reset to the first card of the NEW order
    setIsFlipped(false);
  };

  const getCharacterFontSize = (char: string) => {
    const len = char.length;
    if (len <= 1) return "text-9xl";
    if (len === 2) return "text-8xl";
    if (len === 3) return "text-7xl";
    return "text-5xl"; // Fits 4 chars or more comfortably
  };

  if (reviewList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
        <RefreshCw className="w-12 h-12 mb-4 opacity-50" />
        <p>No words found. Add words manually or create a <code>words.txt</code> file to sync automatically.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 pb-20 overflow-y-auto no-scrollbar">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto relative min-h-[300px]">
        
        {/* Progress Only */}
        <div className="w-full flex justify-center items-center text-xs text-gray-400 px-2 mb-2">
          <span>{currentIndex + 1} / {reviewList.length}</span>
        </div>

        {/* Card */}
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center transition-all duration-300 relative cursor-pointer overflow-hidden min-h-[50vh]"
        >
          {/* Front (Character Only) */}
          <div className={`${isFlipped ? 'hidden' : 'flex'} flex-col items-center justify-center absolute inset-0 p-4`}>
             <div className={`font-bold text-ink ${getCharacterFontSize(currentWord.character)} transition-all duration-300 leading-tight`}>
               {currentWord.character}
             </div>
             <p className="absolute bottom-6 text-[10px] text-gray-300 uppercase tracking-widest font-medium">Tap to flip</p>
          </div>

          {/* Back (Meaning & Details) */}
          <div className={`${!isFlipped ? 'hidden' : 'flex'} flex-col items-center justify-center w-full h-full p-6 animate-in fade-in duration-200`}>
            
            {/* Header with Pinyin */}
            <div className="flex flex-col items-center gap-1 mb-4">
                <span className="text-3xl font-bold text-gray-300">{currentWord.character}</span>
                <span className="text-2xl font-bold text-chinese-red font-mono">{currentWord.pinyin}</span>
            </div>

            <div className="w-8 h-1 bg-gray-100 rounded-full mb-4"></div>

            <h2 className="text-2xl font-bold text-ink mb-6 line-clamp-3">{currentWord.meaning}</h2>
            
            <div className="bg-gray-50 p-4 rounded-xl w-full">
                <div className="text-lg text-gray-700 italic font-serif mb-2 leading-relaxed">
                   "{currentWord.exampleSentence}"
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                   {currentWord.exampleMeaning}
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-6 shrink-0">
        <button 
          onClick={(e) => { e.stopPropagation(); prevCard(); }} 
          className="w-16 h-16 rounded-full bg-white shadow-lg text-gray-400 hover:text-chinese-red active:scale-95 transition-all border border-gray-100 flex items-center justify-center"
          aria-label="Previous card"
        >
          <ChevronLeft size={36} strokeWidth={2.5} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleShuffle(); }} 
          className="h-14 px-6 bg-chinese-red text-white font-semibold rounded-xl shadow-lg shadow-red-200 active:scale-95 transition-transform hover:bg-red-700 flex-1 max-w-[140px] flex items-center justify-center gap-2"
        >
          <Shuffle size={20} />
          <span>Shuffle</span>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); nextCard(); }} 
          className="w-16 h-16 rounded-full bg-white shadow-lg text-gray-400 hover:text-chinese-red active:scale-95 transition-all border border-gray-100 flex items-center justify-center"
          aria-label="Next card"
        >
          <ChevronRight size={36} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
