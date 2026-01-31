'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getUserInfo, getPatientDashboard } from '@/lib/api';
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
                const dashboardData = await getPatientDashboard(userId);
                if (dashboardData.profile) {
                    const p = dashboardData.profile;
                    // Map API response to ProfileFormData
                    // Note: Handle fields that might be null or different format
                    const mappedData: ProfileFormData = {
                        fullName: p.full_name || '',
                        dateOfBirth: p.date_of_birth || '',
                        bloodType: p.blood_type || '',
                        allergies: Array.isArray(p.allergies) ? p.allergies.map((a: any) => typeof a === 'string' ? { type: 'predefined', value: a } : a) :
                            (typeof p.allergies === 'string' ? p.allergies.split(',').map((s: string) => ({ type: 'predefined', value: s.trim() })) : []),
                        medications: Array.isArray(p.medications) ? p.medications.map((m: any) => typeof m === 'string' ? { type: 'predefined', value: m } : m) :
                            (typeof p.medications === 'string' ? p.medications.split(',').map((s: string) => ({ type: 'predefined', value: s.trim() })) : []),
                        medicalConditions: Array.isArray(p.medical_conditions) ? p.medical_conditions.map((c: any) => typeof c === 'string' ? { type: 'predefined', value: c } : c) :
                            (typeof p.medical_conditions === 'string' ? p.medical_conditions.split(',').map((s: string) => ({ type: 'predefined', value: s.trim() })) : []),
                        contacts: p.contacts && p.contacts.length > 0 ? p.contacts : [{ name: '', phone: '', relation: '', priority: 1 }],
                        publicVisible: p.public_visible || {
                            name: true,
                            bloodType: true,
                            allergies: false,
                            medications: false,
                            conditions: false,
                            contacts: false
                        }
                    };
                    setInitialData(mappedData);
                } else {
                    // No profile found, redirect to create
                    router.replace('/create-profile');
                }
            } catch (err) {
                console.error("Error fetching profile", err);
                // Handle error (maybe redirect to login or dashboard)
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleSubmit = async (formData: ProfileFormData) => {
        const { userId } = getUserInfo();
        try {
            // We need an update endpoint. Using POST to /profiles/{userId} might create/overwrite?
            // Or PUT.
            // The current createProfile uses POST /profiles/{userId}. 
            // Let's assume for now it handles updates or creation.
            // If not, we might need to add PUT /profiles/{userId} to backend.
            // Looking at backend/app/routes/profiles.py would be good, but assuming standard create/update for now.

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

            await apiClient.put(`/profiles/${userId}`, apiData); // Assuming PUT for update

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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Your Profile</h1>
                    <p className="text-gray-600">Update your medical information and privacy settings</p>
                </div>
                <ProfileForm initialData={initialData} onSubmit={handleSubmit} isEditing={true} />
            </div>
        </div>
    );
}
