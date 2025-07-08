import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Language, languages } from '../types/language';

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 transition-all duration-300 text-black border border-yellow-400 hover:border-yellow-300 font-medium shadow-md hover:shadow-lg text-sm"
      >
        <Globe size={16} />
        <span className="font-semibold">{currentLang.flag}</span>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[180px] z-50 animate-slide-down">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                onLanguageChange(language.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-yellow-50 transition-colors duration-200 flex items-center space-x-3 text-sm ${
                currentLanguage === language.code ? 'bg-yellow-100 text-yellow-700 font-semibold' : 'text-gray-700'
              }`}
            >
              <span>{language.flag}</span>
              <span className="font-medium">{language.name}</span>
              {currentLanguage === language.code && (
                <span className="ml-auto text-yellow-500">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;