import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Check, X, Search, ChevronDown, Plus, ChevronUp, Loader2 } from 'lucide-react';
import { searchReferences } from '@/lib/api';

export interface CategoryItem {
    category: string; // The main category (Allergies, Medications)
    subcategory?: string; // The visual group (Foods, Medicine)
    name: string;
}

interface CategorizedMultiSelectProps {
    label: string;
    categoryType: string; // "Allergies", "Medications", or "Conditions"
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    colorTheme?: 'red' | 'blue' | 'green';
    // We no longer rely on 'options' prop for the list, but we can keep it for initial state if needed
    initialOptions?: CategoryItem[];
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function CategorizedMultiSelect({
    label,
    categoryType,
    value,
    onChange,
    placeholder = "Select options...",
    colorTheme = 'blue'
}: CategorizedMultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [customInput, setCustomInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<Record<string, CategoryItem[]>>({}); // Grouped results

    const debouncedSearch = useDebounce(searchQuery, 300); // 300ms debounce
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Search Effect
    useEffect(() => {
        const fetchResults = async () => {
            // If empty query, show "Popular" or "Recent" or nothing? 
            // User says: "If a user types 'Food', the dropdown should immediately show..."
            // Let's create a default view (maybe fetch random popular ones or empty)
            if (!debouncedSearch) {
                // If not searching, we could show nothing or popular. 
                // For now, let's leaving it blank with a prompt is cleaner, or fetch defaults.
                // Or we can fetch defaults (empty query search).
                // Let's fetch defaults if open.
                if (isOpen) {
                    setIsLoading(true);
                    try {
                        const data = await searchReferences('', categoryType);
                        // Data comes back as { "Group": [{...}] }
                        // We need to map it to CategoryItem
                        const mappedResults: Record<string, CategoryItem[]> = {};
                        Object.entries(data as Record<string, any[]>).forEach(([group, items]) => {
                            mappedResults[group] = items.map(i => ({
                                category: i.category,
                                subcategory: i.subcategory,
                                name: i.name
                            }));
                        });
                        setResults(mappedResults);
                    } catch (e) {
                        console.error(e);
                    } finally {
                        setIsLoading(false);
                    }
                }
                return;
            }

            setIsLoading(true);
            try {
                const data = await searchReferences(debouncedSearch, categoryType);
                const mappedResults: Record<string, CategoryItem[]> = {};
                Object.entries(data as Record<string, any[]>).forEach(([group, items]) => {
                    mappedResults[group] = items.map(i => ({
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

        if (isOpen) {
            fetchResults();
        }
    }, [debouncedSearch, categoryType, isOpen]);

    // Handle outside click to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery(''); // Reset search on close for cleaner re-open?
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Text Highlighting
    const HighlightedText = ({ text, highlight }: { text: string, highlight: string }) => {
        if (!highlight.trim()) {
            return <span>{text}</span>;
        }
        const regex = new RegExp(`(${highlight})`, 'gi');
        const parts = text.split(regex);
        return (
            <span>
                {parts.map((part, i) =>
                    regex.test(part) ? <span key={i} className="font-bold text-black bg-yellow-100/50 rounded-sm px-0.5">{part}</span> : <span key={i}>{part}</span>
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
        // Prefer searchQuery as custom input if available, else customInput state
        const valToAdd = searchQuery.trim() || customInput.trim();
        if (valToAdd && !value.includes(valToAdd)) {
            onChange([...value, valToAdd]);
            setSearchQuery('');
            setCustomInput('');
        }
    };

    const removeOption = (optionName: string) => {
        onChange(value.filter(v => v !== optionName));
    };

    const themeColors = {
        red: { ring: 'focus:ring-red-500', text: 'text-red-700', bg: 'bg-red-50', hover: 'hover:bg-red-50', pill: 'bg-red-100 text-red-800 border-red-200' },
        blue: { ring: 'focus:ring-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', hover: 'hover:bg-blue-50', pill: 'bg-blue-100 text-blue-800 border-blue-200' },
        green: { ring: 'focus:ring-green-500', text: 'text-green-700', bg: 'bg-green-50', hover: 'hover:bg-green-50', pill: 'bg-green-100 text-green-800 border-green-200' },
    }[colorTheme];

    const hasResults = Object.keys(results).length > 0;

    return (
        <div className="mb-6 relative font-sans" ref={dropdownRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>

            {/* Input container */}
            <div
                className={`min-h-[44px] w-full border border-gray-300 rounded-lg bg-white p-1.5 flex flex-wrap items-center gap-2 cursor-text transition-all duration-200 ${isOpen ? `ring-2 ${themeColors.ring} border-transparent shadow-sm` : 'hover:border-gray-400'}`}
                onClick={() => { setIsOpen(true); inputRef.current?.focus(); }}
            >
                {/* Selected Pills */}
                {value.map((val) => (
                    <span key={val} className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${themeColors.pill} animate-fadeIn`}>
                        {val}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeOption(val); }}
                            className="ml-1.5 hover:text-black focus:outline-none transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}

                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400 font-medium ml-1"
                    placeholder={value.length === 0 ? placeholder : ""}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                />

                {isLoading ? (
                    <Loader2 size={16} className="mr-2 text-gray-400 animate-spin" />
                ) : (
                    <div className="mr-2 text-gray-400">
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden ring-1 ring-black ring-opacity-5 animate-slideDown origin-top max-h-[320px] flex flex-col">

                    <div className="overflow-y-auto flex-1 custom-scrollbar">

                        {!hasResults && !isLoading && searchQuery && (
                            <div className="p-3">
                                <button
                                    onClick={addCustomOption}
                                    className={`w-full text-left flex items-center gap-2 p-3 rounded-md hover:bg-gray-50 border border-dashed border-gray-200 transition-colors group`}
                                >
                                    <div className={`p-1.5 rounded-md bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors`}>
                                        <Plus size={16} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Add "{searchQuery}"</span>
                                        <span className="text-xs text-gray-400 block">Custom value not in database</span>
                                    </div>
                                </button>
                            </div>
                        )}

                        {!hasResults && !isLoading && !searchQuery && (
                            <div className="p-8 text-center text-sm text-gray-400 italic">
                                Type to search...
                            </div>
                        )}

                        {hasResults && Object.entries(results).map(([group, items]) => (
                            <div key={group}>
                                <h4 className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    {group === 'General' ? 'Results' : group}
                                </h4>
                                <div className="py-1">
                                    {items.map((item) => {
                                        const isSelected = value.includes(item.name);
                                        return (
                                            <div
                                                key={item.name}
                                                onClick={() => toggleOption(item.name)}
                                                className={`mx-2 my-0.5 px-3 py-2 rounded-md cursor-pointer flex items-center justify-between group transition-all duration-150 ${isSelected ? themeColors.bg : 'hover:bg-gray-50'}`}
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <span className={`text-sm ${isSelected ? `font-semibold ${themeColors.text}` : 'text-gray-700'}`}>
                                                        <HighlightedText text={item.name} highlight={searchQuery} />
                                                    </span>
                                                </div>
                                                {isSelected && <Check size={16} className={themeColors.text} />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 px-3 py-2 text-xs text-gray-400 border-t border-gray-100 flex justify-between items-center">
                        <span>{value.length} selected</span>
                        <span className="text-[10px] text-gray-300">Supported by CrisisLink AI</span>
                    </div>
                </div>
            )}
        </div>
    );
}
