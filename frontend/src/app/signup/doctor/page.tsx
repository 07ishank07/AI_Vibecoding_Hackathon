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
            const errorMessage = err.response?.data?.detail || 'Registration failed. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <Stethoscope className="h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Medical Professional Registration
                    </h1>
                    <p className="text-gray-600">
                        Join CrisisLink<span className="text-red-600">.cv</span> to access emergency patient information
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error Alert */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                                <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-red-700">{error}</span>
                            </div>
                        )}

                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => handleChange('username', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Choose a username"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your professional email"
                                />
                            </div>
                        </div>

                        {/* Hospital Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hospital <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <select
                                    value={formData.hospital_id}
                                    onChange={(e) => handleChange('hospital_id', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
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

                        {/* Specialty Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Specialty
                            </label>
                            <div className="relative">
                                <Stethoscope className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.specialty}
                                    onChange={(e) => handleChange('specialty', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Emergency Medicine, Cardiology"
                                />
                            </div>
                        </div>

                        {/* License Number Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                License Number
                            </label>
                            <div className="relative">
                                <Award className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.license_number}
                                    onChange={(e) => handleChange('license_number', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Your medical license number"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Create a password"
                                />
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Confirm your password"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <span>Creating Account...</span>
                            ) : (
                                <>
                                    Register as Medical Professional
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Patient Signup Link */}
                    <div className="mt-6 text-center">
                        <a
                            href="/signup"
                            className="inline-flex items-center text-gray-600 hover:text-gray-700 font-medium"
                        >
                            <User className="h-4 w-4 mr-2" />
                            I'm a patient/individual
                        </a>
                    </div>

                    {/* Login Link */}
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center text-sm text-gray-500">
                    <a href="/" className="hover:text-gray-700">← Back to Home</a>
                </div>
            </div>
        </div>
    );
}
