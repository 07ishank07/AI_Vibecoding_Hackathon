'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Heart, Pill, Phone, User, Clock } from 'lucide-react';

interface EmergencyData {
  full_name: string;
  blood_type: string;
  allergies: string[];
  medications: string[];
  medical_conditions: string[];
  dnr_status: boolean;
  special_instructions: string;
  emergency_contacts: Array<{
    name: string;
    phone: string;
    priority: number;
  }>;
  languages: string[];
}

export default function EmergencyAccess({ params }: { params: { username: string } }) {
  const [emergencyData, setEmergencyData] = useState<EmergencyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmergencyData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/emergency/${params.username}`);
        if (!response.ok) {
          throw new Error('Patient not found');
        }
        const data = await response.json();
        setEmergencyData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmergencyData();
  }, [params.username]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-red-600 font-medium">Loading emergency information...</p>
        </div>
      </div>
    );
  }

  if (error || !emergencyData) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-800 mb-2">Patient Not Found</h1>
          <p className="text-red-600">Unable to load emergency information for this patient.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Emergency Header */}
        <div className="bg-red-600 text-white rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-8 w-8 mr-3" />
            <div>
              <h1 className="text-3xl font-bold">EMERGENCY ACCESS</h1>
              <p className="text-red-100">Medical information accessed at {new Date().toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-red-700 rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-2">{emergencyData.full_name}</h2>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <span className="text-red-100 mr-2">Blood Type:</span>
                <span className="text-3xl font-bold">{emergencyData.blood_type}</span>
              </div>
              {emergencyData.dnr_status && (
                <div className="bg-yellow-500 text-black px-3 py-1 rounded font-bold">
                  DNR STATUS
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Critical Allergies */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-xl font-bold text-red-800">⚠️ ALLERGIES</h3>
            </div>
            {emergencyData.allergies.length > 0 ? (
              <div className="space-y-2">
                {emergencyData.allergies.map((allergy, index) => (
                  <div key={index} className="bg-red-100 border border-red-300 rounded-lg p-3">
                    <span className="font-bold text-red-800 text-lg">{allergy}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No known allergies</p>
            )}
          </div>

          {/* Medical Conditions */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 text-blue-500 mr-2" />
              <h3 className="text-xl font-bold text-blue-800">Medical Conditions</h3>
            </div>
            {emergencyData.medical_conditions.length > 0 ? (
              <div className="space-y-2">
                {emergencyData.medical_conditions.map((condition, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <span className="font-medium text-blue-800">{condition}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No known conditions</p>
            )}
          </div>

          {/* Current Medications */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center mb-4">
              <Pill className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="text-xl font-bold text-green-800">Current Medications</h3>
            </div>
            {emergencyData.medications.length > 0 ? (
              <div className="space-y-2">
                {emergencyData.medications.map((medication, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <span className="font-medium text-green-800">{medication}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No current medications</p>
            )}
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center mb-4">
              <Phone className="h-6 w-6 text-purple-500 mr-2" />
              <h3 className="text-xl font-bold text-purple-800">Emergency Contacts</h3>
            </div>
            {emergencyData.emergency_contacts.length > 0 ? (
              <div className="space-y-3">
                {emergencyData.emergency_contacts.map((contact, index) => (
                  <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-purple-800">{contact.name}</span>
                        <p className="text-purple-600 font-mono text-lg">{contact.phone}</p>
                      </div>
                      <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                        Priority {contact.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No emergency contacts</p>
            )}
          </div>
        </div>

        {/* Special Instructions */}
        {emergencyData.special_instructions && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-800 mb-3">Special Instructions</h3>
            <p className="text-yellow-700 text-lg">{emergencyData.special_instructions}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4 text-center">
          <p className="text-gray-600 text-sm">
            Emergency contacts have been automatically notified of this access.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            CrisisLink.cv - Emergency Medical Information System
          </p>
        </div>
      </div>
    </div>
  );
}