'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '@/lib/i18n';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export default function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-slate-600" />
      <select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
        className="px-2 py-1 text-sm border border-slate-300 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="tr">🇹🇷 Türkçe</option>
        <option value="en">🇺🇸 English</option>
      </select>
    </div>
  );
} 