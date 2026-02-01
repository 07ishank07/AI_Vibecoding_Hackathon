'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, AlertCircle, ArrowRight, Stethoscope } from 'lucide-react';
import { registerPatient, setAuthToken, setUserInfo } from '@/lib/api';

export default function PatientSignup() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    };

    const validateForm = (): boolean => {
        if (!formData.username.trim()) {
            setError('Username is required');
            return false;
        }
        if (formData.username.length < 3) {
            setError('Username must be at least 3 characters');
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
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await registerPatient({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            setAuthToken(response.access_token);
            setUserInfo(response.user_id, response.user_type);

            router.push('/create-profile');
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 'Registration failed. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-block border border-red-500/30 rounded-full px-4 py-2 mb-6">
                        <span className="text-red-400 text-sm font-medium">CREATE ACCOUNT</span>
                    </div>
                    <h1 className="text-3xl font-black text-white mb-3 tracking-tight">
                        Join CrisisLink
                    </h1>
                    <p className="text-slate-400">
                        Create your digital life passport
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start">
                                <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-red-300">{error}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-3">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => handleChange('username', e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    placeholder="Choose a username"
                                />
                            </div>
                            <p className="mt-2 text-xs text-slate-400">Emergency URL: username.crisislink.cv</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-3">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-3">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    placeholder="Create a password"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-3">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    placeholder="Confirm your password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                <>
                                    Create Life Passport
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <div className="flex items-center justify-center mb-6">
                            <div className="border-t border-slate-600 flex-1"></div>
                            <span className="px-4 text-slate-400 text-sm">or</span>
                            <div className="border-t border-slate-600 flex-1"></div>
                        </div>

                        <a
                            href="/signup/doctor"
                            className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium mb-4"
                        >
                            <Stethoscope className="h-4 w-4 mr-2" />
                            Medical Professional Signup
                        </a>

                        <p className="text-sm text-slate-400">
                            Already have an account?{' '}
                            <a href="/login" className="text-red-400 hover:text-red-300 font-medium">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <a href="/" className="text-slate-400 hover:text-slate-300 text-sm transition-colors">
                        ← Return to Homepage
                    </a>
                </div>
            </div>
        </div>
    );
}