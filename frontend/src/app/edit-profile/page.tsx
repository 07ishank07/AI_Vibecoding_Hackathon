'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, User } from 'lucide-react';
import { getUserInfo, getPatientDashboard, getProfile } from '@/lib/api';
import apiClient from '@/lib/api';
import ProfileForm, { ProfileFormData } from '@/lib/components/ProfileForm';

export default function EditProfile() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [initialData, setInitialData] = useState<ProfileFormData | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const { userId, userType } = getUserInfo();

            if (!userId) {
                router.push('/login');
                return;
            }

            if (userType === 'doctor') {
                router.replace('/medical-dashboard');
                return;
            }

            try {
                // Use getProfile to get full medical details
                const profileData = await getProfile(userId);

                if (profileData) {
                    const mappedData: ProfileFormData = {
                        fullName: profileData.full_name || '',
                        dateOfBirth: profileData.date_of_birth || '',
                        bloodType: profileData.blood_type || '',
                        allergies: profileData.allergies || [],
                        medications: profileData.medications || [],
                        medicalConditions: profileData.medical_conditions || [],
                        hasAllergies: (profileData.allergies || []).length > 0,
                        hasMedications: (profileData.medications || []).length > 0,
                        hasConditions: (profileData.medical_conditions || []).length > 0,
                        contacts: [{ name: '', phone: '', relation: '', priority: 1 }],
                        publicVisible: {
                            name: true,
                            bloodType: true,
                            allergies: false,
                            medications: false,
                            conditions: false,
                            contacts: false
                        }
                    };

                    // If backend response includes contacts/publicVisible we map them, 
                    // otherwise we keep defaults or need to fetch them if stored elsewhere.
                    // Assuming for now MedicalProfileFull might not have contacts (checking schema).
                    // MedicalProfileFull schema DOES NOT have contacts.
                    // We might need to fetch contacts separately or update schema.
                    // For now, let's keep it safe.

                    setInitialData(mappedData);
                } else {
                    router.replace('/create-profile');
                }
            } catch (err) {
                console.error("Error fetching profile", err);
                router.replace('/create-profile'); // Assume no profile
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleSubmit = async (formData: ProfileFormData) => {
        const { userId } = getUserInfo();
        console.log('Submitting form data:', formData); // Debug log
        
        try {
            const apiData = {
                full_name: formData.fullName,
                date_of_birth: formData.dateOfBirth,
                blood_type: formData.bloodType,
                allergies: formData.allergies,
                medications: formData.medications,
                medical_conditions: formData.medicalConditions,
                dnr_status: false,
                organ_donor: false,
                special_instructions: null,
                languages: ['English']
            };
            
            console.log('Sending API data:', apiData); // Debug log
            await apiClient.put(`/api/profiles/${userId}`, apiData);

            alert('Profile updated successfully!');
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Profile update error:', err);
            const msg = err.response?.data?.detail || 'Failed to update profile.';
            alert(msg);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
            </div>
        );
    }

    if (!initialData) return null; // Should redirect

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Your Profile</h1>
                    <p className="text-lg text-gray-600">Update your emergency medical information</p>
                </div>
                <ProfileForm initialData={initialData} onSubmit={handleSubmit} isEditing={true} />
            </div>
        </div>
    );
}
