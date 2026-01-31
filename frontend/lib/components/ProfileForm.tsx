'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User, Heart, Phone, Shield, Save, Loader2, X, Plus } from 'lucide-react';
import SimpleDropdown from './SimpleDropdown';
import ProgressLine from './ProgressLine';

// Predefined medical data from database
const MEDICAL_DATA = {
    allergies: {
        category: 'Allergies',
        items: [
            'Penicillin', 'Amoxicillin', 'Aspirin', 'Ibuprofen', 'Sulfa Drugs',
            'Peanuts', 'Tree Nuts', 'Shellfish', 'Fish', 'Milk', 'Eggs',
            'Pollen', 'Dust Mites', 'Mold', 'Pet Dander', 'Bee Stings'
        ]
    },
    conditions: {
        category: 'Conditions',
        items: [
            'Diabetes', 'Hypertension', 'Asthma', 'COPD', 'Heart Disease',
            'Arthritis', 'Depression', 'Anxiety', 'Epilepsy', 'Cancer'
        ]
    },
    medications: {
        category: 'Medications',
        items: [
            'Aspirin', 'Ibuprofen', 'Acetaminophen', 'Metformin', 'Lisinopril',
            'Amlodipine', 'Metoprolol', 'Omeprazole', 'Simvastatin', 'Levothyroxine'
        ]
    }
};

export interface EmergencyContact {
    name: string;
    phone: string;
    relation: string;
    priority: number;
}

export interface PrivacySettings {
    name: boolean;
    bloodType: boolean;
    allergies: boolean;
    medications: boolean;
    conditions: boolean;
    contacts: boolean;
}

export interface ProfileFormData {
    fullName: string;
    dateOfBirth: string;
    bloodType: string;
    allergies: string[];
    medications: string[];
    medicalConditions: string[];
    contacts: EmergencyContact[];
    publicVisible: PrivacySettings;
}

interface ValidationErrors {
    [key: string]: string;
}

interface ProfileFormProps {
    initialData?: ProfileFormData;
    onSubmit: (data: ProfileFormData) => Promise<void>;
    isEditing?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ProfileForm({ initialData, onSubmit, isEditing = false }: ProfileFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<ValidationErrors>({});



    const [formData, setFormData] = useState<ProfileFormData>(initialData || {
        fullName: '',
        dateOfBirth: '',
        bloodType: '',
        allergies: [],
        medications: [],
        medicalConditions: [],
        contacts: [{ name: '', phone: '', relation: '', priority: 1 }],
        publicVisible: {
            name: true,
            bloodType: true,
            allergies: false,
            medications: false,
            conditions: false,
            contacts: false
        }
    });

    const totalSteps = 4;
    const stepIcons = [User, Heart, Phone, Shield];
    const stepTitles = ['Basic Info', 'Medical Details', 'Emergency Contacts', 'Privacy Settings'];



    const updateFormData = (field: keyof ProfileFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Helper functions for contacts
    const updateContact = (index: number, field: keyof EmergencyContact, value: string) => {
        setFormData(prev => ({
            ...prev,
            contacts: prev.contacts.map((c, i) => i === index ? { ...c, [field]: value } : c)
        }));
    };

    const addContact = () => {
        if (formData.contacts.length >= 3) return;
        setFormData(prev => ({
            ...prev,
            contacts: [...prev.contacts, { name: '', phone: '', relation: '', priority: prev.contacts.length + 1 }]
        }));
    };

    const removeContact = (index: number) => {
        if (formData.contacts.length <= 1) return;
        setFormData(prev => ({
            ...prev,
            contacts: prev.contacts.filter((_, i) => i !== index).map((c, i) => ({ ...c, priority: i + 1 }))
        }));
    };

    const togglePrivacy = (setting: keyof PrivacySettings) => {
        setFormData(prev => ({
            ...prev,
            publicVisible: { ...prev.publicVisible, [setting]: !prev.publicVisible[setting] }
        }));
    };

    const validateCurrentStep = (): boolean => {
        const newErrors: ValidationErrors = {};
        if (currentStep === 1) {
            if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
            if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
            if (!formData.bloodType) newErrors.bloodType = 'Blood type is required';
        }
        if (currentStep === 3) {
            const hasValidContact = formData.contacts.some(c => c.name.trim() && c.phone.trim());
            if (!hasValidContact) {
                newErrors.contacts = 'At least one contact with name and phone is required';
                formData.contacts.forEach((c, i) => {
                    if (!c.name.trim()) newErrors[`contact_${i}_name`] = 'Name required';
                    if (!c.phone.trim()) newErrors[`contact_${i}_phone`] = 'Phone required';
                });
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (!validateCurrentStep()) return;
        if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };



    return (
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-100">
            {/* Progress Line */}
            <ProgressLine currentStep={currentStep} totalSteps={totalSteps} />

            {/* Step Content */}
            <div className="min-h-[500px]">
                {currentStep === 1 && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Basic Information</h2>
                            <p className="text-gray-600">Let's start with your essential details</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-600">*</span></label>
                            <input type="text" value={formData.fullName} onChange={(e) => updateFormData('fullName', e.target.value)} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-200 ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`} placeholder="Enter full legal name" />
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-600">*</span></label>
                                <input type="date" value={formData.dateOfBirth} onChange={(e) => updateFormData('dateOfBirth', e.target.value)} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-200 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-200'}`} />
                                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type <span className="text-red-600">*</span></label>
                                <select value={formData.bloodType} onChange={(e) => updateFormData('bloodType', e.target.value)} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-200 ${errors.bloodType ? 'border-red-500' : 'border-gray-200'}`}>
                                    <option value="">Select Blood Type</option>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map(bt => <option key={bt} value={bt}>{bt}</option>)}
                                </select>
                                {errors.bloodType && <p className="text-red-500 text-xs mt-1">{errors.bloodType}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Medical Details</h2>
                            <p className="text-gray-600">Help responders understand your medical needs</p>
                        </div>

                        <SimpleDropdown
                            label="🚨 Allergies"
                            value={formData.allergies}
                            onChange={(val) => updateFormData('allergies', val)}
                            colorTheme="red"
                            options={MEDICAL_DATA.allergies}
                        />

                        <SimpleDropdown
                            label="🏥 Medical Conditions"
                            value={formData.medicalConditions}
                            onChange={(val) => updateFormData('medicalConditions', val)}
                            colorTheme="blue"
                            options={MEDICAL_DATA.conditions}
                        />

                        <SimpleDropdown
                            label="💊 Current Medications"
                            value={formData.medications}
                            onChange={(val) => updateFormData('medications', val)}
                            colorTheme="green"
                            options={MEDICAL_DATA.medications}
                        />
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Emergency Contacts</h2>
                        {formData.contacts.map((contact, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                                <div className="absolute top-2 right-2 text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded border">Priority {contact.priority}</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div><label className="text-xs font-medium text-gray-600">Name *</label><input type="text" value={contact.name} onChange={e => updateContact(idx, 'name', e.target.value)} className={`w-full px-3 py-2 border rounded-md text-sm ${errors[`contact_${idx}_name`] ? 'border-red-500' : 'border-gray-300'}`} /></div>
                                    <div><label className="text-xs font-medium text-gray-600">Phone *</label><input type="tel" value={contact.phone} onChange={e => updateContact(idx, 'phone', e.target.value)} className={`w-full px-3 py-2 border rounded-md text-sm ${errors[`contact_${idx}_phone`] ? 'border-red-500' : 'border-gray-300'}`} /></div>
                                    <div className="col-span-2"><label className="text-xs font-medium text-gray-600">Relationship</label><input type="text" value={contact.relation} onChange={e => updateContact(idx, 'relation', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" /></div>
                                </div>
                                {formData.contacts.length > 1 && <button onClick={() => removeContact(idx)} className="mt-3 text-red-600 text-xs flex items-center"><X size={12} className="mr-1" /> Remove</button>}
                            </div>
                        ))}
                        {formData.contacts.length < 3 && <button onClick={addContact} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 flex justify-center items-center transition-colors"><Plus size={16} className="mr-2" /> Add Contact</button>}
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Privacy Configuration</h2>
                        <div className="space-y-4">
                            {Object.keys(formData.publicVisible).map((setting) => (
                                <div key={setting} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                    <div>
                                        <h3 className="font-medium text-gray-900 capitalize">{setting === 'bloodType' ? 'Blood Type' : setting}</h3>
                                        <p className="text-xs text-gray-500">Visible to public scan</p>
                                    </div>
                                    <div className="relative inline-block w-12 h-6">
                                        <input type="checkbox" id={setting} className="opacity-0 w-0 h-0" checked={formData.publicVisible[setting as keyof PrivacySettings]} onChange={() => togglePrivacy(setting as keyof PrivacySettings)} />
                                        <label htmlFor={setting} className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ${formData.publicVisible[setting as keyof PrivacySettings] ? 'bg-green-500' : 'bg-gray-300'}`}>
                                            <span className={`block h-6 w-6 bg-white rounded-full shadow transform transition-transform duration-200 ${formData.publicVisible[setting as keyof PrivacySettings] ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-12 flex justify-between">
                <button onClick={currentStep === 1 ? () => window.history.back() : prevStep} className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium flex items-center transition-all duration-200 hover:shadow-md">
                    <ChevronLeft size={18} className="mr-1" /> Back
                </button>

                {currentStep < totalSteps ? (
                    <button onClick={nextStep} className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                        Next Step <ChevronRight size={18} className="ml-1" />
                    </button>
                ) : (
                    <button onClick={() => {
                        console.log('Final form data:', formData); // Debug log
                        onSubmit(formData);
                    }} className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                        {isEditing ? 'Save Changes' : 'Complete Profile'} <Save size={18} className="ml-2" />
                    </button>
                )}
            </div>
        </div>
    );
}
