'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Heart, User, Shield, Clock } from 'lucide-react';
import Navigation from '../../../components/Navigation';

// Mock data - replace with API call
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

export default function EmergencyAccess({ params }) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMedicalProfessional, setIsMedicalProfessional] = useState(false);
  const [showEmergencyAccess, setShowEmergencyAccess] = useState(false);
  const [accessTime] = useState(new Date());

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProfile(mockProfileData);
      setIsLoading(false);
    }, 1000);
  }, [params.username]);

  const handleEmergencyAccess = () => {
    setShowEmergencyAccess(true);
    // TODO: Log emergency access, notify contacts
  };

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

  if (isLoading) {
    return (
      <>
        <Navigation context="emergency" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading emergency profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navigation context="emergency" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
            <p className="text-gray-600">The requested emergency profile could not be found.</p>
          </div>
        </div>
      </>
    );
  }

  const showFullAccess = isMedicalProfessional && showEmergencyAccess;

  return (
    <>
      <Navigation context="emergency" />
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="bg-red-600 text-white rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">🚨 Emergency Medical Profile</h1>
                <p className="text-red-100">Accessed: {accessTime.toLocaleString()}</p>
              </div>
              <AlertTriangle className="h-12 w-12" />
            </div>
          </div>

          {/* Medical Professional Access */}
          {!showFullAccess && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="text-center">
                <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Medical Professional Access</h2>
                <p className="text-gray-600 mb-6">
                  Are you a medical professional or emergency responder? Access full emergency details.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setIsMedicalProfessional(true);
                      handleEmergencyAccess();
                    }}
                    className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 font-semibold"
                  >
                    🏥 Emergency Medical Access
                  </button>
                  <p className="text-sm text-gray-500">
                    This will notify emergency contacts and log the access
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rest of the emergency access content remains the same */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <User className="h-6 w-6 text-gray-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              </div>
              
              <div className="space-y-3">
                {(profile.publicVisible.name || showFullAccess) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-lg font-semibold text-gray-900">{profile.fullName}</p>
                  </div>
                )}
                
                {showFullAccess && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Age</label>
                    <p className="text-lg text-gray-900">{calculateAge(profile.dateOfBirth)} years old</p>
                  </div>
                )}
                
                {(profile.publicVisible.bloodType || showFullAccess) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Blood Type</label>
                    <p className="text-2xl font-bold text-red-600">{profile.bloodType}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 text-red-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Medical Information</h2>
              </div>
              
              <div className="space-y-4">
                {(profile.publicVisible.allergies || showFullAccess) && profile.allergies && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <label className="block text-sm font-medium text-red-700 mb-1">⚠️ ALLERGIES</label>
                    <p className="text-red-800 font-semibold">{profile.allergies}</p>
                  </div>
                )}
                
                {(profile.publicVisible.medications || showFullAccess) && profile.medications && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Current Medications</label>
                    <p className="text-gray-900">{profile.medications}</p>
                  </div>
                )}
                
                {(profile.publicVisible.conditions || showFullAccess) && profile.medicalConditions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Medical Conditions</label>
                    <p className="text-gray-900">{profile.medicalConditions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          {(profile.publicVisible.contacts || showFullAccess) && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <div className="flex items-center mb-4">
                <Phone className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Emergency Contacts</h2>
              </div>
              
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
                    <a 
                      href={`tel:${contact.phone}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {contact.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency Access Confirmation */}
          {showFullAccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-800">Emergency Access Activated</h3>
              </div>
              <p className="text-green-700 text-sm">
                Emergency contacts have been automatically notified. Full medical information is now visible.
              </p>
            </div>
          )}

          {/* Limited Access Notice */}
          {!showFullAccess && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
              <p className="text-blue-800 text-sm">
                <strong>Limited Information:</strong> Only publicly visible information is shown. 
                Medical professionals can access full emergency details above.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}