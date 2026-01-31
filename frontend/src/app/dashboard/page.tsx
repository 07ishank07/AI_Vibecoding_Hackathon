'use client';

import { useState } from 'react';
import { User, QrCode, Eye, Edit, Download, Share, Settings, LogOut } from 'lucide-react';

export default function Dashboard() {
  const [user] = useState({
    name: 'John Smith',
    email: 'john.smith@email.com',
    username: 'johnsmith',
    profileComplete: 85,
    qrGenerated: true,
    lastAccessed: '2 days ago'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                CrisisLink<span className="text-red-600">.cv</span> Dashboard
              </h1>
              <p className="text-gray-600">Manage your life passport</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <button className="flex items-center text-gray-600 hover:text-gray-800">
                <LogOut size={16} className="mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Profile Status</h2>
            <span className="text-sm text-gray-500">Last accessed: {user.lastAccessed}</span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Profile Complete</h3>
              <p className="text-2xl font-bold text-green-600">{user.profileComplete}%</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <QrCode className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">QR Code</h3>
              <p className="text-sm text-gray-600">
                {user.qrGenerated ? 'Generated & Ready' : 'Not Generated'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Privacy</h3>
              <p className="text-sm text-gray-600">Configured</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <a 
            href={`/profile/${user.username}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-3">
              <Eye className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Preview Profile</h3>
            </div>
            <p className="text-sm text-gray-600">See how others view your profile</p>
          </a>

          <button className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left">
            <div className="flex items-center mb-3">
              <Edit className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Edit Profile</h3>
            </div>
            <p className="text-sm text-gray-600">Update your medical information</p>
          </button>

          <button className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left">
            <div className="flex items-center mb-3">
              <Download className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Download QR</h3>
            </div>
            <p className="text-sm text-gray-600">Print your emergency QR code</p>
          </button>

          <button className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left">
            <div className="flex items-center mb-3">
              <Settings className="h-6 w-6 text-gray-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Privacy Settings</h3>
            </div>
            <p className="text-sm text-gray-600">Control what others can see</p>
          </button>
        </div>

        {/* Profile Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Profile Summary</h2>
            <button className="flex items-center text-blue-600 hover:text-blue-700">
              <Edit size={16} className="mr-1" />
              Edit
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Basic Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Blood Type:</span>
                  <span className="font-medium text-red-600">O+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium">39 years</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Emergency Contacts</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Primary:</span>
                  <span className="font-medium">Sarah Smith (Spouse)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Secondary:</span>
                  <span className="font-medium">Michael Smith (Brother)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}