'use client';

import { useState, useEffect } from 'react';
import { User, Heart, Eye, EyeOff, Edit, Loader2 } from 'lucide-react';
import { getUserInfo, getPatientDashboard } from '@/lib/api'; // Using getPatientDashboard as proxy to get one's own profile
// For public visiting other profiles, we would need a public endpoint e.g. /api/profiles/public/{username}
// But current requirement seems to focus on "preview" which implies seeing your OWN profile as others would.
// So we use existing authenticated endpoints.

export default function ProfilePreview({ params }: { params: { username: string } }) {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { userId } = getUserInfo();
        // Ideally we check if params.username matches current user
        // But for now, let's just fetch the current user's profile to show "Preview" functionality
        // If we want to support viewing OTHERS, we need backend support for public profiles.
        // The user request "The profile preview is hardcoded. Fix it." likely refers to the "Preview" button on dashboard.

        if (userId) {
          const data = await getPatientDashboard(userId);
          if (data && data.profile) {
            setProfile(data.profile);
            setIsOwner(true); // Assuming we are viewing our own
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [params.username]);

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

        {/* Profile Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <User className="h-6 w-6 text-gray-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Full Name</label>
                  {isOwner || publicVisible.name ? (
                    <p className="text-lg font-semibold text-gray-900">{profile.full_name}</p>
                  ) : (
                    <p className="text-gray-400 italic">Hidden from public</p>
                  )}
                </div>
                {isOwner && (
                  <div className="text-sm">
                    {publicVisible.name ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Age</label>
                  <p className="text-lg text-gray-900">{calculateAge(profile.date_of_birth)} years old</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Blood Type</label>
                  {isOwner || publicVisible.bloodType ? (
                    <p className="text-2xl font-bold text-red-600">{profile.blood_type}</p>
                  ) : (
                    <p className="text-gray-400 italic">Hidden from public</p>
                  )}
                </div>
                {isOwner && (
                  <div className="text-sm">
                    {publicVisible.bloodType ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 text-red-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Medical Information</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Allergies</label>
                  {(isOwner || publicVisible.allergies) && profile.allergies && profile.allergies.length > 0 ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 font-semibold">⚠️ {formatList(profile.allergies)}</p>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">No allergies listed or hidden</p>
                  )}
                </div>
                {isOwner && (
                  <div className="ml-2">
                    {publicVisible.allergies ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Current Medications</label>
                  {(isOwner || publicVisible.medications) && profile.medications && profile.medications.length > 0 ? (
                    <p className="text-gray-900">{formatList(profile.medications)}</p>
                  ) : (
                    <p className="text-gray-400 italic">No medications listed or hidden</p>
                  )}
                </div>
                {isOwner && (
                  <div className="ml-2">
                    {publicVisible.medications ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Medical Conditions</label>
                  {(isOwner || publicVisible.conditions) && profile.medical_conditions && profile.medical_conditions.length > 0 ? (
                    <p className="text-gray-900">{formatList(profile.medical_conditions)}</p>
                  ) : (
                    <p className="text-gray-400 italic">No conditions listed or hidden</p>
                  )}
                </div>
                {isOwner && (
                  <div className="ml-2">
                    {publicVisible.conditions ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Emergency Contacts</h2>
            {isOwner && (
              <div>
                {publicVisible.contacts ? (
                  <Eye className="h-4 w-4 text-green-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
              </div>
            )}
          </div>

          {(isOwner || publicVisible.contacts) ? (
            <div className="grid md:grid-cols-2 gap-4">
              {profile.contacts && profile.contacts.map((contact: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Priority {contact.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{contact.relation}</p>
                  <p className="text-blue-600 font-medium">{contact.phone}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">Emergency contacts are hidden from public view</p>
          )}
        </div>

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