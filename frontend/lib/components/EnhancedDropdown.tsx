'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Check, X, Search, ChevronDown, Plus, ChevronUp, Loader2 } from 'lucide-react';
import { searchReferences } from '@/lib/api';

interface CategoryItem {
    category: string;
    subcategory?: string;
    name: string;
}

interface EnhancedDropdownProps {
    label: string;
    categoryType: string;
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    colorTheme?: 'red' | 'blue' | 'green';
}

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function EnhancedDropdown({
    label,
    categoryType,
    value,
    onChange,
    placeholder = "Search...",
    colorTheme = 'blue'
}: EnhancedDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<Record<string, CategoryItem[]>>({});

    const debouncedSearch = useDebounce(searchQuery, 200);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!isOpen) return;
            
            setIsLoading(true);
            try {
                const data = await searchReferences(debouncedSearch, categoryType);
                const mappedResults: Record<string, CategoryItem[]> = {};
                Object.entries(data as Record<string, any[]>).forEach(([group, items]) => {
                    mappedResults[group] = items.slice(0, 5).map(i => ({
                        category: i.category,
                        subcategory: i.subcategory,
                        name: i.name
                    }));
                });
                setResults(mappedResults);
            } catch (error) {
                console.error("Search failed", error);
                setResults({});
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedSearch, categoryType, isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const HighlightedText = ({ text, highlight }: { text: string, highlight: string }) => {
        if (!highlight.trim()) return <span>{text}</span>;
        const regex = new RegExp(`(${highlight})`, 'gi');
        const parts = text.split(regex);
        return (
            <span>
                {parts.map((part, i) =>
                    regex.test(part) ? 
                    <span key={i} className="font-bold bg-yellow-200 px-1 rounded">{part}</span> : 
                    <span key={i}>{part}</span>
                )}
            </span>
        );
    };

    const toggleOption = (optionName: string) => {
        if (value.includes(optionName)) {
            onChange(value.filter(v => v !== optionName));
        } else {
            onChange([...value, optionName]);
        }
    };

    const addCustomOption = () => {
        const valToAdd = searchQuery.trim();
        if (valToAdd && !value.includes(valToAdd)) {
            onChange([...value, valToAdd]);
            setSearchQuery('');
        }
    };

    const removeOption = (optionName: string) => {
        onChange(value.filter(v => v !== optionName));
    };

    const themeColors = {
        red: { 
            ring: 'focus:ring-red-500 focus:border-red-500', 
            text: 'text-red-700', 
            bg: 'bg-red-50', 
            pill: 'bg-red-100 text-red-800 border-red-200',
            header: 'bg-red-50 text-red-700'
        },
        blue: { 
            ring: 'focus:ring-blue-500 focus:border-blue-500', 
            text: 'text-blue-700', 
            bg: 'bg-blue-50', 
            pill: 'bg-blue-100 text-blue-800 border-blue-200',
            header: 'bg-blue-50 text-blue-700'
        },
        green: { 
            ring: 'focus:ring-green-500 focus:border-green-500', 
            text: 'text-green-700', 
            bg: 'bg-green-50', 
            pill: 'bg-green-100 text-green-800 border-green-200',
            header: 'bg-green-50 text-green-700'
        },
    }[colorTheme];

    const hasResults = Object.keys(results).length > 0;

    return (
        <div className="mb-6 relative" ref={dropdownRef}>
            <label className="block text-sm font-semibold text-gray-800 mb-3">{label}</label>

            <div
                className={`min-h-[48px] w-full border-2 rounded-xl bg-white p-3 flex flex-wrap items-center gap-2 cursor-text transition-all duration-200 ${
                    isOpen ? `${themeColors.ring} border-transparent shadow-lg` : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => { setIsOpen(true); inputRef.current?.focus(); }}
            >
                {value.map((val) => (
                    <span key={val} className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${themeColors.pill}`}>
                        {val}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeOption(val); }}
                            className="ml-2 hover:text-red-600 focus:outline-none transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}

                <div className="flex-1 flex items-center min-w-[150px]">
                    <Search size={16} className="text-gray-400 mr-2" />
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500"
                        placeholder={value.length === 0 ? placeholder : "Add more..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                    />
                </div>

                {isLoading ? (
                    <Loader2 size={18} className="text-gray-400 animate-spin" />
                ) : (
                    <div className="text-gray-400">
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                )}
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden max-h-[320px] flex flex-col">
                    <div className="sticky top-0 bg-white border-b border-gray-100 p-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">
                                {value.length} selected
                            </span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {!hasResults && !isLoading && searchQuery && (
                            <div className="p-4">
                                <button
                                    onClick={addCustomOption}
                                    className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border-2 border-dashed border-gray-200 transition-colors group"
                                >
                                    <div className="p-2 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600">
                                        <Plus size={16} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Add "{searchQuery}"</span>
                                        <span className="text-xs text-gray-400 block">Custom entry</span>
                                    </div>
                                </button>
                            </div>
                        )}

                        {hasResults && Object.entries(results).map(([group, items]) => (
                            <div key={group}>
                                <div className={`sticky top-0 px-4 py-2 text-xs font-bold uppercase tracking-wider border-b ${themeColors.header}`}>
                                    {group === 'Medications' ? '💊 MEDICINE' : 
                                     group === 'Foods' ? '🍎 FOOD' : 
                                     group === 'Environmental' ? '🌿 ENVIRONMENTAL' : 
                                     `📋 ${group.toUpperCase()}`}
                                </div>
                                <div className="py-1">
                                    {items.map((item) => {
                                        const isSelected = value.includes(item.name);
                                        return (
                                            <div
                                                key={item.name}
                                                onClick={() => toggleOption(item.name)}
                                                className={`mx-2 my-1 px-3 py-2.5 rounded-lg cursor-pointer flex items-center justify-between group transition-all duration-150 hover:bg-blue-500 hover:text-white ${
                                                    isSelected ? themeColors.bg : ''
                                                }`}
                                            >
                                                <span className={`text-sm ${isSelected ? `font-semibold ${themeColors.text}` : 'text-gray-700 group-hover:text-white'}`}>
                                                    <HighlightedText text={item.name} highlight={searchQuery} />
                                                </span>
                                                {isSelected && <Check size={16} className={themeColors.text} />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {!hasResults && !isLoading && !searchQuery && (
                            <div className="p-8 text-center text-sm text-gray-400">
                                Start typing to search medical data...
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}