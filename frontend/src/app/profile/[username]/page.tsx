'use client';

import { useState, useEffect } from 'react';
import { User, Heart, Eye, EyeOff, Edit } from 'lucide-react';

const mockProfileData = {
  fullName: 'John Smith',
  dateOfBirth: '1985-03-15',
  bloodType: 'O+',
  allergies: 'Penicillin, Shellfish',
  medications: 'Lisinopril 10mg daily, Metformin 500mg twice daily',
  medicalConditions: 'Type 2 Diabetes, Hypertension',
  contacts: [
    { name: 'Sarah Smith', phone: '+1-555-0123', relation: 'Spouse', priority: 1 },
    { name: 'Michael Smith', phone: '+1-555-0456', relation: 'Brother', priority: 2 }
  ],
  publicVisible: {
    name: true,
    bloodType: true,
    allergies: false,
    medications: false,
    conditions: false,
    contacts: false
  }
};

export default function ProfilePreview({ params }) {
  const [profile, setProfile] = useState(null);
  const [isOwner, setIsOwner] = useState(true); // Mock - would check if current user owns this profile

  useEffect(() => {
    setProfile(mockProfileData);
  }, [params.username]);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

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
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Edit size={16} className="mr-2" />
                  Edit Profile
                </button>
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
                  {profile.publicVisible.name ? (
                    <p className="text-lg font-semibold text-gray-900">{profile.fullName}</p>
                  ) : (
                    <p className="text-gray-400 italic">Hidden from public</p>
                  )}
                </div>
                {isOwner && (
                  <div className="text-sm">
                    {profile.publicVisible.name ? (
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
                  <p className="text-lg text-gray-900">{calculateAge(profile.dateOfBirth)} years old</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Blood Type</label>
                  {profile.publicVisible.bloodType ? (
                    <p className="text-2xl font-bold text-red-600">{profile.bloodType}</p>
                  ) : (
                    <p className="text-gray-400 italic">Hidden from public</p>
                  )}
                </div>
                {isOwner && (
                  <div className="text-sm">
                    {profile.publicVisible.bloodType ? (
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
                  {profile.publicVisible.allergies && profile.allergies ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 font-semibold">⚠️ {profile.allergies}</p>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">Hidden from public</p>
                  )}
                </div>
                {isOwner && (
                  <div className="ml-2">
                    {profile.publicVisible.allergies ? (
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
                  {profile.publicVisible.medications && profile.medications ? (
                    <p className="text-gray-900">{profile.medications}</p>
                  ) : (
                    <p className="text-gray-400 italic">Hidden from public</p>
                  )}
                </div>
                {isOwner && (
                  <div className="ml-2">
                    {profile.publicVisible.medications ? (
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
                  {profile.publicVisible.conditions && profile.medicalConditions ? (
                    <p className="text-gray-900">{profile.medicalConditions}</p>
                  ) : (
                    <p className="text-gray-400 italic">Hidden from public</p>
                  )}
                </div>
                {isOwner && (
                  <div className="ml-2">
                    {profile.publicVisible.conditions ? (
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
                {profile.publicVisible.contacts ? (
                  <Eye className="h-4 w-4 text-green-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
              </div>
            )}
          </div>
          
          {profile.publicVisible.contacts ? (
            <div className="grid md:grid-cols-2 gap-4">
              {profile.contacts.map((contact, index) => (
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