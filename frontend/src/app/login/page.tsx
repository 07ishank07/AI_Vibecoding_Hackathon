'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Stethoscope, AlertCircle, ArrowRight } from 'lucide-react';
import { login, setAuthToken, setUserInfo } from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      setAuthToken(response.access_token);
      setUserInfo(response.user_id, response.user_type);

      if (response.user_type === 'doctor') {
        router.push('/medical-dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Invalid email or password';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block border border-blue-500/30 rounded-full px-4 py-2 mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent text-sm font-medium">SECURE ACCESS</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-3 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-400">Access your CrisisLink.cv life passport</p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 shadow-sm border border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="p-4 bg-gradient-to-r from-blue-100 to-green-100 border border-blue-200 rounded-xl flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-800">{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
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
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Signing In...
                </div>
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Demo Login */}
          <div className="mt-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600">
            <p className="text-slate-300 text-sm mb-2 font-medium">Demo Access:</p>
            <p className="text-slate-400 text-xs">Email: demo@crisislink.cv | Password: demo123</p>
          </div>

          {/* Signup Links */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm mb-4">
              Need an account?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/signup"
                className="flex items-center justify-center px-4 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700/50 transition-all text-sm font-medium"
              >
                <User className="h-4 w-4 mr-2" />
                Patient
              </a>
              <a
                href="/signup/doctor"
                className="flex items-center justify-center px-4 py-3 border border-blue-500/50 text-blue-400 rounded-xl hover:bg-blue-500/10 transition-all text-sm font-medium"
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Doctor
              </a>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a href="/" className="text-slate-400 hover:text-slate-300 text-sm transition-colors">
            ← Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}