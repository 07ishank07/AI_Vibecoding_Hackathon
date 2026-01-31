'use client';

import React from 'react';
import { User, Heart, Phone, Shield } from 'lucide-react';

interface ProgressLineProps {
    currentStep: number;
    totalSteps: number;
}

export default function ProgressLine({ currentStep, totalSteps }: ProgressLineProps) {
    const stepIcons = [User, Heart, Phone, Shield];
    const stepTitles = ['Basic Info', 'Medical Details', 'Emergency Contacts', 'Privacy Settings'];
    const stepColors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-purple-500'];

    return (
        <div className="mb-12">
            {/* Progress Line */}
            <div className="relative">
                <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 rounded-full">
                    <div 
                        className="h-full bg-red-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    />
                </div>
                
                {/* Step Circles */}
                <div className="relative flex justify-between">
                    {stepIcons.map((Icon, index) => {
                        const step = index + 1;
                        const isActive = step === currentStep;
                        const isCompleted = step < currentStep;
                        
                        return (
                            <div key={index} className="flex flex-col items-center">
                                <div 
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 transform ${
                                        isActive 
                                            ? 'bg-red-500 text-white shadow-lg scale-125 animate-pulse' 
                                            : isCompleted 
                                                ? 'bg-red-500 text-white shadow-md' 
                                                : 'bg-gray-200 text-gray-400'
                                    } ${isActive ? 'animate-bounce' : ''}`}
                                    style={{ 
                                        animationDelay: isActive ? `${index * 200}ms` : '0ms',
                                        animationDuration: isActive ? '2s' : '0.5s'
                                    }}
                                >
                                    <Icon size={20} />
                                </div>
                                <span 
                                    className={`text-xs mt-3 font-medium transition-all duration-300 ${
                                        isActive 
                                            ? 'text-red-600 font-bold' 
                                            : isCompleted 
                                                ? 'text-red-500' 
                                                : 'text-gray-400'
                                    }`}
                                >
                                    {stepTitles[index]}
                                </span>
                                
                                {/* Active Step Indicator */}
                                {isActive && (
                                    <div className="mt-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}