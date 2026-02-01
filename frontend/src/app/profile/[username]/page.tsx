'use client';

import { useState, useEffect } from 'react';
import { User, Heart, Eye, EyeOff, Edit, Loader2 } from 'lucide-react';
import { getUserInfo, getProfile } from '@/lib/api';
import ProfilePreview from '@/lib/components/ProfilePreview';
import QRCodeDisplay from '@/components/QRCodeDisplay';

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { userId } = getUserInfo();
        if (userId) {
          const profileData = await getProfile(userId);
          setProfile(profileData);
          setIsOwner(true);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found or you need to create one.</p>
          <a href="/create-profile" className="mt-4 inline-block text-blue-600 hover:text-blue-700">Create Profile</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 mb-6 shadow-sm border border-blue-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Preview</h1>
              <p className="text-gray-600">This is how your profile appears to others</p>
            </div>
            {isOwner && (
              <div className="flex space-x-3">
                <a
                  href="/edit-profile"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Profile
                </a>
                <a
                  href="/dashboard"
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  Dashboard
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center">
                <Eye className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <h3 className="font-semibold text-blue-800">Public View</h3>
                  <p className="text-blue-700 text-sm">
                    Only information marked as "visible to public" is shown below.
                    Medical professionals with emergency access can see all details.
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Preview Component */}
            {profile && (
              <ProfilePreview profile={profile} />
            )}

            {/* Privacy Legend */}
            {isOwner && (
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Privacy Legend</h3>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-gray-700">Visible to public</span>
                  </div>
                  <div className="flex items-center">
                    <EyeOff className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">Hidden from public (emergency access only)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* QR Code Sidebar */}
          <div className="lg:col-span-1">
            <QRCodeDisplay username={params.username} />
          </div>
        </div>
      </div>
    </div>
  );
}