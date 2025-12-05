import React from 'react';
import { Word } from '../types';

interface WordListProps {
  words: Word[];
}

export const WordList: React.FC<WordListProps> = ({ words }) => {
  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-4 pb-24">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-ink px-2">Your Vocabulary ({words.length})</h2>
        
        {words.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No words yet.
          </div>
        ) : (
          <div className="space-y-3">
            {words.map((word) => (
              <div key={word.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-ink">{word.character}</span>
                    <span className="text-sm text-gray-500">{word.pinyin}</span>
                  </div>
                  <div className="text-gray-700">{word.meaning}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};