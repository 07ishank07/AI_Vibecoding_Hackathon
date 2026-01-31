'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User, Heart, Phone, Shield, X, Plus, AlertCircle, Save } from 'lucide-react';
import { MedicalProfileData } from '@/lib/api';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface MedicalItem {
    type: 'predefined' | 'custom';
    value: string;
}

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
    allergies: MedicalItem[];
    medications: MedicalItem[];
    medicalConditions: MedicalItem[];
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
// MEDICAL DATA CONSTANTS (Ideally fetched from backend reference API)
// =============================================================================

const COMMON_ALLERGENS = [
    { category: 'Medications', items: ['Penicillin', 'Amoxicillin', 'Aspirin', 'Ibuprofen', 'Naproxen', 'Sulfa Drugs', 'Codeine', 'Morphine', 'Latex', 'Contrast Dye'] },
    { category: 'Foods', items: ['Peanuts', 'Tree Nuts', 'Shellfish', 'Fish', 'Milk', 'Eggs', 'Soy', 'Wheat', 'Sesame', 'Corn'] },
    { category: 'Environmental', items: ['Pollen', 'Dust Mites', 'Mold', 'Pet Dander', 'Bee Stings', 'Wasp Stings', 'Cockroaches', 'Grass'] },
];

const COMMON_MEDICATIONS = ['Aspirin', 'Ibuprofen', 'Acetaminophen', 'Metformin', 'Lisinopril', 'Amlodipine', 'Metoprolol', 'Omeprazole', 'Simvastatin', 'Levothyroxine', 'Albuterol', 'Gabapentin', 'Hydrochlorothiazide', 'Losartan', 'Atorvastatin'];

const COMMON_CONDITIONS = ['Diabetes', 'Hypertension', 'Asthma', 'COPD', 'Heart Disease', 'Arthritis', 'Depression', 'Anxiety', 'Epilepsy', 'Cancer', 'Kidney Disease', 'Liver Disease', 'Stroke', 'Heart Attack History'];

// =============================================================================
// COMPONENT
// =============================================================================

export default function ProfileForm({ initialData, onSubmit, isEditing = false }: ProfileFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [showAllergyDropdown, setShowAllergyDropdown] = useState(false);
    const [showMedicationDropdown, setShowMedicationDropdown] = useState(false);
    const [showConditionDropdown, setShowConditionDropdown] = useState(false);
    const [customAllergyInput, setCustomAllergyInput] = useState('');
    const [customMedicationInput, setCustomMedicationInput] = useState('');
    const [customConditionInput, setCustomConditionInput] = useState('');

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

    // Helper functions for medical items
    const addItem = (field: 'allergies' | 'medications' | 'medicalConditions', value: string, type: 'predefined' | 'custom', setInput: (v: string) => void) => {
        if (!value.trim()) return;
        const exists = formData[field].some(item => item.value.toLowerCase() === value.toLowerCase());
        if (exists) return;
        setFormData(prev => ({ ...prev, [field]: [...prev[field], { type, value }] }));
        setInput('');
    };

    const removeItem = (field: 'allergies' | 'medications' | 'medicalConditions', index: number) => {
        setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
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
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            {/* Progress Bar */}
            <div className="mb-8 relative">
                <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-red-600 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
                </div>
                <div className="flex justify-between mt-4">
                    {stepIcons.map((Icon, index) => {
                        const step = index + 1;
                        const isActive = step === currentStep;
                        const isCompleted = step < currentStep;
                        return (
                            <div key={index} className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-red-600 text-white shadow-lg scale-110' : isCompleted ? 'bg-red-200 text-red-700' : 'bg-gray-200 text-gray-400'}`}>
                                    <Icon size={20} />
                                </div>
                                <span className={`text-xs mt-2 font-medium ${isActive ? 'text-red-600' : 'text-gray-500'}`}>{stepTitles[index]}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
                {currentStep === 1 && (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-600">*</span></label>
                            <input type="text" value={formData.fullName} onChange={(e) => updateFormData('fullName', e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter full legal name" />
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-600">*</span></label>
                                <input type="date" value={formData.dateOfBirth} onChange={(e) => updateFormData('dateOfBirth', e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`} />
                                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type <span className="text-red-600">*</span></label>
                                <select value={formData.bloodType} onChange={(e) => updateFormData('bloodType', e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none ${errors.bloodType ? 'border-red-500' : 'border-gray-300'}`}>
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
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Medical Details</h2>
                        {/* Allergies */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.allergies.map((a, i) => (
                                    <span key={i} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm flex items-center border border-red-100">{a.value} <button onClick={() => removeItem('allergies', i)} className="ml-2"><X size={14} /></button></span>
                                ))}
                            </div>
                            <div className="relative flex">
                                <input type="text" value={customAllergyInput} onChange={e => setCustomAllergyInput(e.target.value)} onFocus={() => setShowAllergyDropdown(true)} className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-red-500 focus:outline-none" placeholder="Add allergy..." />
                                <button onClick={() => addItem('allergies', customAllergyInput, 'custom', setCustomAllergyInput)} className="bg-red-600 text-white px-4 rounded-r-lg"><Plus size={20} /></button>
                            </div>
                            {showAllergyDropdown && customAllergyInput === '' && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    <div className="flex justify-between p-2 border-b bg-gray-50"><span className="text-xs font-bold text-gray-500">Common Allergens</span><button onClick={() => setShowAllergyDropdown(false)}><X size={14} className="text-gray-400" /></button></div>
                                    {COMMON_ALLERGENS.map(cat => (
                                        <div key={cat.category}>
                                            <div className="px-3 py-1 bg-gray-50 text-xs font-bold text-gray-500">{cat.category}</div>
                                            {cat.items.map(item => (
                                                <button key={item} onClick={() => { addItem('allergies', item, 'predefined', setCustomAllergyInput); setShowAllergyDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm">{item}</button>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Conditions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.medicalConditions.map((c, i) => (
                                    <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center border border-blue-100">{c.value} <button onClick={() => removeItem('medicalConditions', i)} className="ml-2"><X size={14} /></button></span>
                                ))}
                            </div>
                            <div className="relative flex">
                                <input type="text" value={customConditionInput} onChange={e => setCustomConditionInput(e.target.value)} onFocus={() => setShowConditionDropdown(true)} className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:outline-none" placeholder="Add condition..." />
                                <button onClick={() => addItem('medicalConditions', customConditionInput, 'custom', setCustomConditionInput)} className="bg-blue-600 text-white px-4 rounded-r-lg"><Plus size={20} /></button>
                            </div>
                            {showConditionDropdown && customConditionInput === '' && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    <div className="flex justify-between p-2 border-b bg-gray-50"><span className="text-xs font-bold text-gray-500">Common Conditions</span><button onClick={() => setShowConditionDropdown(false)}><X size={14} className="text-gray-400" /></button></div>
                                    {COMMON_CONDITIONS.map(item => (
                                        <button key={item} onClick={() => { addItem('medicalConditions', item, 'predefined', setCustomConditionInput); setShowConditionDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm">{item}</button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Medications */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.medications.map((m, i) => (
                                    <span key={i} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center border border-green-100">{m.value} <button onClick={() => removeItem('medications', i)} className="ml-2"><X size={14} /></button></span>
                                ))}
                            </div>
                            <div className="relative flex">
                                <input type="text" value={customMedicationInput} onChange={e => setCustomMedicationInput(e.target.value)} onFocus={() => setShowMedicationDropdown(true)} className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-green-500 focus:outline-none" placeholder="Add medication..." />
                                <button onClick={() => addItem('medications', customMedicationInput, 'custom', setCustomMedicationInput)} className="bg-green-600 text-white px-4 rounded-r-lg"><Plus size={20} /></button>
                            </div>
                            {showMedicationDropdown && customMedicationInput === '' && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    <div className="flex justify-between p-2 border-b bg-gray-50"><span className="text-xs font-bold text-gray-500">Common Medications</span><button onClick={() => setShowMedicationDropdown(false)}><X size={14} className="text-gray-400" /></button></div>
                                    {COMMON_MEDICATIONS.map(item => (
                                        <button key={item} onClick={() => { addItem('medications', item, 'predefined', setCustomMedicationInput); setShowMedicationDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-green-50 text-sm">{item}</button>
                                    ))}
                                </div>
                            )}
                        </div>
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
                        {formData.contacts.length < 3 && <button onClick={addContact} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 flex justify-center items-center"><Plus size={16} className="mr-2" /> Add Contact</button>}
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
            <div className="mt-8 flex justify-between">
                <button onClick={currentStep === 1 ? () => window.history.back() : prevStep} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium flex items-center">
                    <ChevronLeft size={18} className="mr-1" /> Back
                </button>

                {currentStep < totalSteps ? (
                    <button onClick={nextStep} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center shadow-md shadow-red-200">Next Step <ChevronRight size={18} className="ml-1" /></button>
                ) : (
                    <button onClick={() => onSubmit(formData)} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center shadow-md shadow-green-200">
                        {isEditing ? 'Save Changes' : 'Complete Profile'} <Save size={18} className="ml-2" />
                    </button>
                )}
            </div>
        </div>
    );
}
