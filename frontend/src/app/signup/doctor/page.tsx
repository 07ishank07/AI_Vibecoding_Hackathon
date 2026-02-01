'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, AlertCircle, ArrowRight, Building, Stethoscope, Award } from 'lucide-react';
import { registerDoctor, getHospitals, setAuthToken, setUserInfo, Hospital } from '@/lib/api';

// =============================================================================
// DOCTOR SIGNUP PAGE
// =============================================================================

export default function DoctorSignup() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        hospital_id: '',
        specialty: '',
        license_number: '',
    });

    /**
     * Fetch hospitals list on component mount
     */
    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const hospitalList = await getHospitals();
                setHospitals(hospitalList);
            } catch (err) {
                // Fallback to hardcoded list if API fails
                setHospitals([
                    { id: 'royal-melbourne', name: 'Royal Melbourne Hospital' },
                    { id: 'alfred', name: 'The Alfred Hospital' },
                    { id: 'st-vincents', name: "St Vincent's Hospital" },
                    { id: 'royal-childrens', name: "Royal Children's Hospital" },
                    { id: 'monash', name: 'Monash Medical Centre' },
                    { id: 'austin', name: 'Austin Hospital' },
                    { id: 'western', name: 'Western Health' },
                    { id: 'eastern', name: 'Eastern Health' },
                ]);
            }
        };
        fetchHospitals();
    }, []);

    /**
     * Handle form field changes
     */
    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    };

    /**
     * Get hospital name from ID
     */
    const getHospitalName = (hospitalId: string): string => {
        const hospital = hospitals.find(h => h.id === hospitalId);
        return hospital?.name || hospitalId;
    };

    /**
     * Validate form before submission
     */
    const validateForm = (): boolean => {
        if (!formData.username.trim()) {
            setError('Username is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!formData.password) {
            setError('Password is required');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (!formData.hospital_id) {
            setError('Please select your hospital');
            return false;
        }
        return true;
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await registerDoctor({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                hospital_id: formData.hospital_id,
                hospital_name: getHospitalName(formData.hospital_id),
                specialty: formData.specialty || undefined,
                license_number: formData.license_number || undefined,
            });

            // Store auth data
            setAuthToken(response.access_token);
            setUserInfo(response.user_id, response.user_type);

            // Redirect to medical dashboard
            router.push('/medical-dashboard');
        } catch (err: any) {
            console.error('Registration error:', err);
            let errorMessage = 'Registration failed. Please try again.';
            
            if (err.response?.data?.detail) {
                errorMessage = err.response.data.detail;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            } else if (err.response?.status === 400) {
                errorMessage = 'Invalid registration data. Please check your inputs.';
            } else if (err.response?.status === 409) {
                errorMessage = 'Username or email already exists.';
            } else if (err.response?.status >= 500) {
                errorMessage = 'Server error. Please try again later.';
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-block border border-blue-500/30 rounded-full px-4 py-2 mb-6">
                        <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent text-sm font-medium">MEDICAL PROFESSIONAL</span>
                    </div>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                        <Stethoscope className="h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
                        Medical Registration
                    </h1>
                    <p className="text-gray-600">
                        Join CrisisLink.cv for emergency patient access
                    </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-100 rounded-2xl p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                                <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-red-800">{error}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => handleChange('username', e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Choose a username"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Professional email address"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Hospital <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Building className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                                <select
                                    value={formData.hospital_id}
                                    onChange={(e) => handleChange('hospital_id', e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                                >
                                    <option value="">Select your hospital</option>
                                    {hospitals.map((hospital) => (
                                        <option key={hospital.id} value={hospital.id}>
                                            {hospital.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Specialty
                                </label>
                                <div className="relative">
                                    <Stethoscope className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.specialty}
                                        onChange={(e) => handleChange('specialty', e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Specialty"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    License Number
                                </label>
                                <div className="relative">
                                    <Award className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.license_number}
                                        onChange={(e) => handleChange('license_number', e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="License #"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Create a password"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Confirm your password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                <>
                                    Register as Medical Professional
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <div className="flex items-center justify-center mb-6">
                            <div className="border-t border-gray-300 flex-1"></div>
                            <span className="px-4 text-gray-500 text-sm">or</span>
                            <div className="border-t border-gray-300 flex-1"></div>
                        </div>

                        <a
                            href="/signup"
                            className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium mb-4"
                        >
                            <User className="h-4 w-4 mr-2" />
                            Patient Registration
                        </a>

                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <a href="/" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">
                        ← Return to Homepage
                    </a>
                </div>
            </div>
        </div>
    );
}
