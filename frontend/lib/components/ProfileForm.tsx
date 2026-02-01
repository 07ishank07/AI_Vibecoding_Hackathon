'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, User, Heart, Phone, Shield, Save, X, Plus } from 'lucide-react';

const MEDICAL_DATA = {
    allergies: {
        items: ['Penicillin', 'Amoxicillin', 'Aspirin', 'Ibuprofen', 'Sulfa Drugs', 'Peanuts', 'Tree Nuts', 'Shellfish', 'Fish', 'Milk', 'Eggs', 'Pollen', 'Dust Mites', 'Mold', 'Pet Dander', 'Bee Stings']
    },
    conditions: {
        items: ['Diabetes', 'Hypertension', 'Asthma', 'COPD', 'Heart Disease', 'Arthritis', 'Depression', 'Anxiety', 'Epilepsy', 'Cancer']
    },
    medications: {
        items: ['Aspirin', 'Ibuprofen', 'Acetaminophen', 'Metformin', 'Lisinopril', 'Amlodipine', 'Metoprolol', 'Omeprazole', 'Simvastatin', 'Levothyroxine']
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

interface ProfileFormProps {
    initialData?: ProfileFormData;
    onSubmit: (data: ProfileFormData) => Promise<void>;
    isEditing?: boolean;
}

export default function ProfileForm({ initialData, onSubmit, isEditing = false }: ProfileFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

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
        const newErrors: {[key: string]: string} = {};
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

    const MultiSelect = ({ label, value, onChange, options }: any) => {
        const [isOpen, setIsOpen] = useState(false);
        
        const toggleOption = (option: string) => {
            const newValue = value.includes(option) 
                ? value.filter((v: string) => v !== option)
                : [...value, option];
            onChange(newValue);
        };

        return (
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                <div 
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex flex-wrap gap-1">
                        {value.length === 0 ? (
                            <span className="text-gray-500">Select {label.toLowerCase()}</span>
                        ) : (
                            value.map((item: string) => (
                                <span key={item} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                    {item}
                                </span>
                            ))
                        )}
                    </div>
                </div>
                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {options.items.map((option: string) => (
                            <div
                                key={option}
                                className={`p-3 cursor-pointer hover:bg-gray-50 ${value.includes(option) ? 'bg-blue-50 text-blue-700' : ''}`}
                                onClick={() => toggleOption(option)}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 py-8 shadow-sm border border-blue-100">
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    {stepTitles.map((title, index) => {
                        const StepIcon = stepIcons[index];
                        const stepNumber = index + 1;
                        const isActive = stepNumber === currentStep;
                        const isCompleted = stepNumber < currentStep;
                        
                        return (
                            <div key={index} className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                    isActive ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white' :
                                    isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                    <StepIcon size={20} />
                                </div>
                                <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                                    {title}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[350px] mb-6">
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                            <p className="text-gray-600">Let's start with your essential details</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-blue-600">*</span></label>
                            <input 
                                type="text" 
                                value={formData.fullName} 
                                onChange={(e) => updateFormData('fullName', e.target.value)} 
                                className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} 
                                placeholder="Enter full legal name" 
                            />
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth <span className="text-blue-600">*</span></label>
                                <input 
                                    type="date" 
                                    value={formData.dateOfBirth} 
                                    onChange={(e) => updateFormData('dateOfBirth', e.target.value)} 
                                    className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`} 
                                    style={{ colorScheme: 'light' }}
                                />
                                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type <span className="text-blue-600">*</span></label>
                                <select 
                                    value={formData.bloodType} 
                                    onChange={(e) => updateFormData('bloodType', e.target.value)} 
                                    className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.bloodType ? 'border-red-500' : 'border-gray-300'}`}
                                    style={{ colorScheme: 'light' }}
                                >
                                    <option value="">Select Blood Type</option>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map(bt => 
                                        <option key={bt} value={bt}>{bt}</option>
                                    )}
                                </select>
                                {errors.bloodType && <p className="text-red-500 text-xs mt-1">{errors.bloodType}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-8">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Medical Details</h2>
                            <p className="text-gray-600">Help responders understand your medical needs</p>
                        </div>

                        {/* Allergies Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                                <div>
                                    <h3 className="font-medium text-gray-900">🚨 Do you have any allergies?</h3>
                                    <p className="text-xs text-gray-500">Select if you have known allergies</p>
                                </div>
                                <div className="relative inline-block w-12 h-6">
                                    <input 
                                        type="checkbox" 
                                        id="hasAllergies" 
                                        className="opacity-0 w-0 h-0" 
                                        checked={formData.allergies.length > 0} 
                                        onChange={(e) => {
                                            if (!e.target.checked) {
                                                updateFormData('allergies', []);
                                            }
                                        }} 
                                    />
                                    <label 
                                        htmlFor="hasAllergies" 
                                        className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ${formData.allergies.length > 0 ? 'bg-gradient-to-r from-blue-500 to-green-500' : 'bg-gray-300'}`}
                                    >
                                        <span className={`block h-6 w-6 bg-white rounded-full shadow transform transition-transform duration-200 ${formData.allergies.length > 0 ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </label>
                                </div>
                            </div>
                            {formData.allergies.length > 0 && (
                                <MultiSelect
                                    label="Select your allergies"
                                    value={formData.allergies}
                                    onChange={(val: string[]) => updateFormData('allergies', val)}
                                    options={MEDICAL_DATA.allergies}
                                />
                            )}
                        </div>

                        {/* Medical Conditions Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                                <div>
                                    <h3 className="font-medium text-gray-900">🏥 Do you have any medical conditions?</h3>
                                    <p className="text-xs text-gray-500">Select if you have ongoing medical conditions</p>
                                </div>
                                <div className="relative inline-block w-12 h-6">
                                    <input 
                                        type="checkbox" 
                                        id="hasConditions" 
                                        className="opacity-0 w-0 h-0" 
                                        checked={formData.medicalConditions.length > 0} 
                                        onChange={(e) => {
                                            if (!e.target.checked) {
                                                updateFormData('medicalConditions', []);
                                            }
                                        }} 
                                    />
                                    <label 
                                        htmlFor="hasConditions" 
                                        className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ${formData.medicalConditions.length > 0 ? 'bg-gradient-to-r from-blue-500 to-green-500' : 'bg-gray-300'}`}
                                    >
                                        <span className={`block h-6 w-6 bg-white rounded-full shadow transform transition-transform duration-200 ${formData.medicalConditions.length > 0 ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </label>
                                </div>
                            </div>
                            {formData.medicalConditions.length > 0 && (
                                <MultiSelect
                                    label="Select your medical conditions"
                                    value={formData.medicalConditions}
                                    onChange={(val: string[]) => updateFormData('medicalConditions', val)}
                                    options={MEDICAL_DATA.conditions}
                                />
                            )}
                        </div>

                        {/* Medications Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                                <div>
                                    <h3 className="font-medium text-gray-900">💊 Are you taking any medications?</h3>
                                    <p className="text-xs text-gray-500">Select if you take regular medications</p>
                                </div>
                                <div className="relative inline-block w-12 h-6">
                                    <input 
                                        type="checkbox" 
                                        id="hasMedications" 
                                        className="opacity-0 w-0 h-0" 
                                        checked={formData.medications.length > 0} 
                                        onChange={(e) => {
                                            if (!e.target.checked) {
                                                updateFormData('medications', []);
                                            }
                                        }} 
                                    />
                                    <label 
                                        htmlFor="hasMedications" 
                                        className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ${formData.medications.length > 0 ? 'bg-gradient-to-r from-blue-500 to-green-500' : 'bg-gray-300'}`}
                                    >
                                        <span className={`block h-6 w-6 bg-white rounded-full shadow transform transition-transform duration-200 ${formData.medications.length > 0 ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </label>
                                </div>
                            </div>
                            {formData.medications.length > 0 && (
                                <MultiSelect
                                    label="Select your medications"
                                    value={formData.medications}
                                    onChange={(val: string[]) => updateFormData('medications', val)}
                                    options={MEDICAL_DATA.medications}
                                />
                            )}
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency Contacts</h2>
                            <p className="text-gray-600">Who should we notify in an emergency?</p>
                        </div>
                        {formData.contacts.map((contact, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 relative">
                                <div className="absolute top-2 right-2 text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">Priority {contact.priority}</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <label className="text-xs font-medium text-gray-600">Name *</label>
                                        <input 
                                            type="text" 
                                            value={contact.name} 
                                            onChange={e => updateContact(idx, 'name', e.target.value)} 
                                            className={`w-full px-3 py-2 bg-white border rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`contact_${idx}_name`] ? 'border-red-500' : 'border-gray-300'}`} 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-600">Phone *</label>
                                        <input 
                                            type="tel" 
                                            value={contact.phone} 
                                            onChange={e => updateContact(idx, 'phone', e.target.value)} 
                                            className={`w-full px-3 py-2 bg-white border rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`contact_${idx}_phone`] ? 'border-red-500' : 'border-gray-300'}`} 
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-medium text-gray-600">Relationship</label>
                                        <input 
                                            type="text" 
                                            value={contact.relation} 
                                            onChange={e => updateContact(idx, 'relation', e.target.value)} 
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        />
                                    </div>
                                </div>
                                {formData.contacts.length > 1 && (
                                    <button onClick={() => removeContact(idx)} className="mt-3 text-red-500 text-xs flex items-center hover:text-red-700">
                                        <X size={12} className="mr-1" /> Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        {formData.contacts.length < 3 && (
                            <button onClick={addContact} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-300 flex justify-center items-center transition-colors">
                                <Plus size={16} className="mr-2" /> Add Contact
                            </button>
                        )}
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy Configuration</h2>
                            <p className="text-gray-600">Control what information is publicly visible</p>
                        </div>
                        <div className="space-y-4">
                            {Object.keys(formData.publicVisible).map((setting) => (
                                <div key={setting} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div>
                                        <h3 className="font-medium text-gray-900 capitalize">{setting === 'bloodType' ? 'Blood Type' : setting}</h3>
                                        <p className="text-xs text-gray-500">Visible to public scan</p>
                                    </div>
                                    <div className="relative inline-block w-12 h-6">
                                        <input 
                                            type="checkbox" 
                                            id={setting} 
                                            className="opacity-0 w-0 h-0" 
                                            checked={formData.publicVisible[setting as keyof PrivacySettings]} 
                                            onChange={() => togglePrivacy(setting as keyof PrivacySettings)} 
                                        />
                                        <label 
                                            htmlFor={setting} 
                                            className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ${formData.publicVisible[setting as keyof PrivacySettings] ? 'bg-gradient-to-r from-blue-500 to-green-500' : 'bg-gray-300'}`}
                                        >
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
            <div className="flex justify-between">
                <button 
                    onClick={currentStep === 1 ? () => window.history.back() : prevStep} 
                    className="px-8 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium flex items-center transition-all"
                >
                    <ChevronLeft size={18} className="mr-1" /> Back
                </button>

                {currentStep < totalSteps ? (
                    <button 
                        onClick={nextStep} 
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-xl font-semibold flex items-center transition-all duration-200 transform hover:scale-105"
                    >
                        Next Step <ChevronRight size={18} className="ml-1" />
                    </button>
                ) : (
                    <button 
                        onClick={() => onSubmit(formData)} 
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-xl font-semibold flex items-center transition-all duration-200 transform hover:scale-105"
                    >
                        {isEditing ? 'Save Changes' : 'Complete Profile'} <Save size={18} className="ml-2" />
                    </button>
                )}
            </div>
        </div>
    );
}