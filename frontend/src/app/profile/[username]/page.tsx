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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-300">Profile not found or you need to create one.</p>
          <a href="/create-profile" className="mt-4 inline-block text-red-400 hover:text-red-300">Create Profile</a>
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
              <h1 className="text-3xl font-bold text-white mb-2">Profile Preview</h1>
              <p className="text-slate-400">This is how your profile appears to others</p>
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
                  className="flex items-center px-4 py-2 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors"
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
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
              <div className="flex items-center">
                <Eye className="h-5 w-5 text-blue-400 mr-2" />
                <div>
                  <h3 className="font-semibold text-blue-300">Public View</h3>
                  <p className="text-blue-200 text-sm">
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
              <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-4">
                <h3 className="font-semibold text-white mb-3">Privacy Legend</h3>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 text-green-400 mr-2" />
                    <span className="text-slate-300">Visible to public</span>
                  </div>
                  <div className="flex items-center">
                    <EyeOff className="h-4 w-4 text-slate-500 mr-2" />
                    <span className="text-slate-300">Hidden from public (emergency access only)</span>
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