'use client';

import { useState, useEffect } from 'react';
import { User, Heart, Eye, EyeOff, Edit, Loader2 } from 'lucide-react';
import { getUserInfo, getProfile } from '@/lib/api';
import ProfilePreview from '@/lib/components/ProfilePreview';

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

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found or you need to create one.</p>
          <a href="/create-profile" className="mt-4 inline-block text-blue-600 hover:underline">Create Profile</a>
        </div>
      </div>
    );
  }

  // Helper to format list items whether they are strings or objects
  const formatList = (items: any[]) => {
    if (!items || items.length === 0) return null;
    if (typeof items[0] === 'string') return items.join(', ');
    return items.map(i => i.value).join(', ');
  }

  // Helper to check visibility
  const isVisible = (field: string) => {
    // If owner, always visible (with indicator). If public, check publicVisible
    if (isOwner) return true;
    return profile.public_visible && profile.public_visible[field];
  }

  const publicVisible = profile.public_visible || {};

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Preview</h1>
              <p className="text-gray-600">This is how your profile appears to others</p>
            </div>
            {isOwner && (
              <div className="flex space-x-3">
                <a
                  href="/edit-profile"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Profile
                </a>
                <a
                  href="/dashboard"
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Dashboard
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
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

        {/* Debug Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Debug Info</h3>
          <pre className="text-xs text-yellow-700">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>

        {/* Profile Preview Component */}
        {profile && (
          <ProfilePreview profile={profile} />
        )}

        {/* Privacy Legend */}
        {isOwner && (
          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Privacy Legend</h3>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Eye className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-gray-700">Visible to public</span>
              </div>
              <div className="flex items-center">
                <EyeOff className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-700">Hidden from public (emergency access only)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}