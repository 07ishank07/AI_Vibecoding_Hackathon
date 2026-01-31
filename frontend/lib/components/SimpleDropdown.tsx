'use client';

import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

interface SimpleDropdownProps {
    label: string;
    value: string[];
    onChange: (value: string[]) => void;
    colorTheme?: 'red' | 'blue' | 'green';
    options: { category: string; items: string[] };
}

export default function SimpleDropdown({
    label,
    value,
    onChange,
    colorTheme = 'blue',
    options
}: SimpleDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOption = (optionName: string) => {
        if (value.includes(optionName)) {
            onChange(value.filter(v => v !== optionName));
        } else {
            onChange([...value, optionName]);
        }
    };

    const themeColors = {
        red: { 
            bg: 'bg-red-50', 
            border: 'border-red-200',
            pill: 'bg-red-100 text-red-800 border-red-300',
            button: 'bg-red-500 hover:bg-red-600 text-white',
            selected: 'bg-red-100 border-red-300 text-red-800'
        },
        blue: { 
            bg: 'bg-blue-50', 
            border: 'border-blue-200',
            pill: 'bg-blue-100 text-blue-800 border-blue-300',
            button: 'bg-blue-500 hover:bg-blue-600 text-white',
            selected: 'bg-blue-100 border-blue-300 text-blue-800'
        },
        green: { 
            bg: 'bg-green-50', 
            border: 'border-green-200',
            pill: 'bg-green-100 text-green-800 border-green-300',
            button: 'bg-green-500 hover:bg-green-600 text-white',
            selected: 'bg-green-100 border-green-300 text-green-800'
        },
    }[colorTheme];

    return (
        <div className="mb-8">
            <label className="block text-lg font-bold text-gray-800 mb-4">{label}</label>
            
            {/* Selected Items */}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {value.map((item, index) => (
                        <div 
                            key={item}
                            className={`px-3 py-2 rounded-full text-sm font-medium border-2 ${themeColors.pill} animate-fadeIn`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {item}
                            <button
                                onClick={() => toggleOption(item)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Dropdown Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-4 rounded-xl border-2 ${themeColors.border} ${themeColors.bg} flex items-center justify-between transition-all duration-300 hover:shadow-lg`}
            >
                <span className="text-gray-700 font-medium">
                    {value.length === 0 ? `Select ${label.toLowerCase()}` : `${value.length} selected`}
                </span>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {/* Options Grid */}
            {isOpen && (
                <div className={`mt-4 p-4 rounded-xl border-2 ${themeColors.border} ${themeColors.bg} animate-slideDown`}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {options.items.map((item, index) => {
                            const isSelected = value.includes(item);
                            return (
                                <button
                                    key={item}
                                    onClick={() => toggleOption(item)}
                                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                        isSelected 
                                            ? `${themeColors.selected} shadow-md` 
                                            : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                                    }`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{item}</span>
                                        {isSelected && <Check size={16} />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}