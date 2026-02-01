'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, QrCode, Eye, Edit, Download, Settings, LogOut, AlertCircle, Loader2 } from 'lucide-react';
import { getPatientDashboard, getUserInfo, removeAuthToken, getProfile } from '@/lib/api';
import ProfilePreview from '@/lib/components/ProfilePreview';
import QRCodeDisplay from '@/components/QRCodeDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface DashboardData {
  user: {
    id: string;
    username: string;
    email: string;
    user_type: string;
  };
  profile: {
    id: string | null;
    full_name: string | null;
    date_of_birth: string | null;
    blood_type: string | null;
    qr_generated: boolean;
    completion_percentage: number;
  } | null;
  last_accessed: string;
}

// =============================================================================
// PATIENT DASHBOARD PAGE
// =============================================================================

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [fullProfile, setFullProfile] = useState<any>(null);

  /**
   * Fetch dashboard data on component mount
   */
  useEffect(() => {
    const fetchDashboard = async () => {
      const { userId, userType } = getUserInfo();

      // Redirect to login if not authenticated
      if (!userId) {
        router.push('/login');
        return;
      }

      // Redirect doctors to medical dashboard
      if (userType === 'doctor') {
        router.push('/medical-dashboard');
        return;
      }

      try {
        const data = await getPatientDashboard(userId);
        setDashboardData(data);
        
        // Fetch full profile for preview if profile exists
        if (data.profile?.id) {
          const profileData = await getProfile(userId);
          setFullProfile(profileData);
        }
      } catch (err: any) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    removeAuthToken();
    router.push('/login');
  };

  /**
   * Calculate age from date of birth
   */
  const calculateAge = (dob: string | null): string => {
    if (!dob) return 'Not set';
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return `${age} years`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const user = dashboardData?.user;
  const profile = dashboardData?.profile;
  const hasProfile = profile?.id !== null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                CrisisLink<span className="text-blue-500">.cv</span> Dashboard
              </h1>
              <p className="text-gray-600">Manage your life passport</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {profile?.full_name || user?.username || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut size={16} className="mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* No Profile Alert */}
        {!hasProfile && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-medium">Complete Your Profile</p>
              <p className="text-yellow-700 text-sm mt-1">
                You haven't created your medical profile yet. Create one to get your emergency QR code.
              </p>
              <a
                href="/create-profile"
                className="inline-block mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
              >
                Create Profile →
              </a>
            </div>
          </div>
        )}

        {/* Profile Status */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-100 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Profile Status</h2>
            <span className="text-sm text-gray-600">
              Last accessed: {dashboardData?.last_accessed || 'Never'}
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Profile Complete</h3>
              <p className="text-2xl font-bold text-blue-600">
                {profile?.completion_percentage || 0}%
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <QrCode className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">QR Code</h3>
              <p className="text-sm text-gray-600">
                {profile?.qr_generated ? 'Generated & Ready' : 'Not Generated'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Privacy</h3>
              <p className="text-sm text-gray-600">Configured</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <a
            href={hasProfile ? `/profile/${user?.username}` : '/create-profile'}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-3">
              <Eye className="h-6 w-6 text-blue-500 mr-2" />
              <h3 className="font-semibold text-gray-900">
                {hasProfile ? 'Preview Profile' : 'Create Profile'}
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              {hasProfile ? 'See how others view your profile' : 'Set up your emergency profile'}
            </p>
          </a>

          <a
            href="/edit-profile"
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-3">
              <Edit className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="font-semibold text-gray-900">Edit Profile</h3>
            </div>
            <p className="text-sm text-gray-600">Update your medical information</p>
          </a>

          <button 
            onClick={() => {
              if (fullProfile?.qr_code_url) {
                const link = document.createElement('a');
                link.href = fullProfile.qr_code_url;
                link.download = `emergency-qr-${fullProfile.full_name}.png`;
                link.click();
              }
            }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center mb-3">
              <Download className="h-6 w-6 text-blue-500 mr-2" />
              <h3 className="font-semibold text-gray-900">Download QR</h3>
            </div>
            <p className="text-sm text-gray-600">Print your emergency QR code</p>
          </button>

          <button
            onClick={() => router.push('/edit-profile')}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center mb-3">
              <Settings className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="font-semibold text-gray-900">Profile Settings</h3>
            </div>
            <p className="text-sm text-gray-600">Edit profile and privacy</p>
          </button>
        </div>



        {/* Profile Preview */}
        {hasProfile && fullProfile && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Medical Information Preview</h2>
            <ProfilePreview profile={fullProfile} />
          </div>
        )}

        {/* Profile Summary */}
        {hasProfile && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-green-50 border border-blue-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Profile Summary</h2>
                <a
                  href="/edit-profile"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </a>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium text-gray-900">{profile?.full_name || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blood Type:</span>
                      <span className="font-medium text-blue-600">
                        {profile?.blood_type || 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium text-gray-900">{calculateAge(profile?.date_of_birth || null)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Account Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Username:</span>
                      <span className="font-medium text-gray-900">{user?.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900">{user?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            {fullProfile?.qr_code_url && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Emergency QR</h3>
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = fullProfile.qr_code_url;
                      link.download = `emergency-qr-${fullProfile.full_name}.png`;
                      link.click();
                    }}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <Download size={14} className="mr-1" />
                    Download
                  </button>
                </div>
                <div className="text-center">
                  <div className="bg-white p-3 rounded-lg inline-block border border-gray-200">
                    <img 
                      src={fullProfile.qr_code_url} 
                      alt="Emergency QR Code" 
                      className="w-32 h-32"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Scan for emergency access</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}