'use client';

import React from 'react';
import { Heart, AlertTriangle, Pill, User } from 'lucide-react';

interface ProfilePreviewProps {
    profile: {
        full_name: string;
        blood_type?: string;
        allergies: string[];
        medications: string[];
        medical_conditions: string[];
    };
}

export default function ProfilePreview({ profile }: ProfilePreviewProps) {
    return (
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-red-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">{profile.full_name}</h3>
                    <p className="text-slate-300">Blood Type: {profile.blood_type || 'Not specified'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Allergies */}
                <div className="space-y-3">
                    <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                        <h4 className="font-semibold text-white">Allergies</h4>
                    </div>
                    <div className="space-y-2">
                        {profile.allergies.length > 0 ? (
                            profile.allergies.map((allergy, index) => (
                                <div key={index} className="px-3 py-2 bg-red-50 text-red-800 rounded-lg text-sm font-medium border border-red-200">
                                    {allergy}
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-sm">None specified</p>
                        )}
                    </div>
                </div>

                {/* Medical Conditions */}
                <div className="space-y-3">
                    <div className="flex items-center">
                        <Heart className="w-5 h-5 text-red-500 mr-2" />
                        <h4 className="font-semibold text-white">Conditions</h4>
                    </div>
                    <div className="space-y-2">
                        {profile.medical_conditions.length > 0 ? (
                            profile.medical_conditions.map((condition, index) => (
                                <div key={index} className="px-3 py-2 bg-red-50 text-red-800 rounded-lg text-sm font-medium border border-red-200">
                                    {condition}
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-sm">None specified</p>
                        )}
                    </div>
                </div>

                {/* Medications */}
                <div className="space-y-3">
                    <div className="flex items-center">
                        <Pill className="w-5 h-5 text-red-500 mr-2" />
                        <h4 className="font-semibold text-white">Medications</h4>
                    </div>
                    <div className="space-y-2">
                        {profile.medications.length > 0 ? (
                            profile.medications.map((medication, index) => (
                                <div key={index} className="px-3 py-2 bg-red-50 text-red-800 rounded-lg text-sm font-medium border border-red-200">
                                    {medication}
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-sm">None specified</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}