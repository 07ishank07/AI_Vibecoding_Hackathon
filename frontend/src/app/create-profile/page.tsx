'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, User } from 'lucide-react';
import { createProfile, getUserInfo, getPatientDashboard } from '@/lib/api';
import ProfileForm, { ProfileFormData } from '@/lib/components/ProfileForm';

export default function CreateProfile() {
  const router = useRouter();
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // ===========================================================================
  // AUTH & PROFILE CHECK
  // ===========================================================================

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      const { userId, userType } = getUserInfo();

      if (!userId) {
        router.push('/login');
        return;
      }

      if (userType === 'doctor') {
        router.push('/medical-dashboard');
        return;
      }

      try {
        // Check if profile already exists
        const dashboardData = await getPatientDashboard(userId);
        if (dashboardData.profile && dashboardData.profile.id) {
          router.replace('/dashboard');
          return;
        }
      } catch (err) {
        // Profile not found, proceed to create
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuthAndProfile();
  }, [router]);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
      </div>
    );
  }

  // ===========================================================================
  // SUBMISSION HANDLER
  // ===========================================================================

  const handleSubmit = async (formData: ProfileFormData) => {
    const { userId } = getUserInfo();

    if (!userId) {
      alert('You must be logged in to create a profile');
      router.push('/login');
      return;
    }

    try {
      // API expects simple object, but TypeScript might want mapping
      const apiData = {
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth,
        blood_type: formData.bloodType,
        allergies: formData.allergies,
        medications: formData.medications,
        medical_conditions: formData.medicalConditions,
        contacts: formData.contacts,
        public_visible: formData.publicVisible
      };

      await createProfile(userId, apiData);
      alert('Profile created successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Profile creation error:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to create profile. Please try again.';
      alert(errorMessage);
    }
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Profile</h1>
          <p className="text-lg text-gray-600">Your emergency medical information, always accessible</p>
        </div>

        <ProfileForm onSubmit={handleSubmit} />

      </div>
    </div>
  );
}