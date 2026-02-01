'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    User,
    Heart,
    AlertCircle,
    FileText,
    Shield,
    Activity,
    Users,
    Bell,
    Loader2,
    LogOut
} from 'lucide-react';
import {
    getDashboardStats,
    getPatients,
    getDoctorDashboard,
    getUserInfo,
    removeAuthToken,
    DashboardStats,
    PatientListItem
} from '@/lib/api';

// =============================================================================
// MEDICAL DASHBOARD PAGE
// =============================================================================

export default function MedicalDashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Data states
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [patients, setPatients] = useState<PatientListItem[]>([]);
    const [doctorInfo, setDoctorInfo] = useState<any>(null);

    // UI states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent'>('all');

    /**
     * Fetch all dashboard data on component mount
     */
    useEffect(() => {
        const fetchDashboardData = async () => {
            const { userId, userType } = getUserInfo();

            // Redirect to login if not authenticated
            if (!userId) {
                router.push('/login');
                return;
            }

            // Redirect patients to patient dashboard
            if (userType === 'patient') {
                router.push('/dashboard');
                return;
            }

            try {
                // Fetch all data in parallel
                const [statsData, patientsData, doctorData] = await Promise.all([
                    getDashboardStats(),
                    getPatients(''),
                    getDoctorDashboard(userId)
                ]);

                setStats(statsData);
                setPatients(patientsData.patients);
                setDoctorInfo(doctorData);
            } catch (err: any) {
                console.error('Dashboard error:', err);
                setError('Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [router]);

    /**
     * Handle patient search
     */
    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        try {
            const data = await getPatients(query);
            setPatients(data.patients);
        } catch (err) {
            console.error('Search error:', err);
        }
    };

    /**
     * Handle user logout
     */
    const handleLogout = () => {
        removeAuthToken();
        router.push('/login');
    };

    /**
     * Filter patients based on selected filter
     */
    const filteredPatients = patients.filter(() => {
        // For now, return all since we removed risk level filtering
        return true;
    });

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-300">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-slate-300 mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <div className="bg-slate-800/50 backdrop-blur border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Medical Professional Dashboard
                            </h1>
                            <p className="text-sm text-slate-400 mt-1">
                                {doctorInfo?.doctor?.hospital_name || 'Emergency Medical Information Access Portal'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-full transition-colors">
                                <Bell size={20} />
                            </button>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {doctorInfo?.user?.username?.substring(0, 2).toUpperCase() || 'DR'}
                                </div>
                                <span className="text-sm font-medium text-slate-300">
                                    Dr. {doctorInfo?.user?.username || 'Medical'}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                            >
                                <LogOut size={16} className="mr-1" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Statistics Cards - Only 3 cards now (no avg response time) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Accesses */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Accesses</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.total_accesses || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Activity className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Active Profiles - No percentage trend */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Active Profiles</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.active_profiles || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Emergency Alerts - Set to 0 */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Emergency Alerts</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.emergency_alerts || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            No active alerts
                        </div>
                    </div>
                </div>

                {/* Patient Search and Access */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Search Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient Lookup</h2>

                            {/* Search Bar */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Search by name..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex space-x-2 mb-6">
                                <button
                                    onClick={() => setSelectedFilter('all')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    All Patients
                                </button>
                                <button
                                    onClick={() => setSelectedFilter('recent')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === 'recent'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Recent
                                </button>
                            </div>

                            {/* Patient List - No risk level badges */}
                            <div className="space-y-3">
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((patient) => (
                                        <div
                                            key={patient.id}
                                            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {patient.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                                                        <p className="text-sm text-gray-600">
                                                            {patient.age ? `Age: ${patient.age}` : 'Age: Not set'}
                                                            {patient.blood_type && (
                                                                <> | Blood Type: <span className="font-medium text-red-600">{patient.blood_type}</span></>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">{patient.last_accessed}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <User className="mx-auto mb-2" size={48} />
                                        <p>{searchQuery ? 'No patients found matching your search' : 'No patients in the system yet'}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left">
                                    <FileText className="h-6 w-6 text-blue-600 mb-2" />
                                    <h3 className="font-medium text-gray-900">Scan QR Code</h3>
                                    <p className="text-sm text-gray-600">Quick patient access</p>
                                </button>
                                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-left">
                                    <Shield className="h-6 w-6 text-green-600 mb-2" />
                                    <h3 className="font-medium text-gray-900">Emergency Access</h3>
                                    <p className="text-sm text-gray-600">Immediate retrieval</p>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Alerts & Info */}
                    <div className="space-y-6">
                        {/* Emergency Alerts - Empty state for now */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-800">Active Alerts</h2>
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                                    0
                                </span>
                            </div>
                            <div className="text-center py-6 text-gray-500">
                                <AlertCircle className="mx-auto mb-2 text-gray-400" size={32} />
                                <p className="text-sm">No active alerts</p>
                            </div>
                        </div>

                        {/* System Info */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-md p-6 text-white">
                            <h2 className="text-lg font-semibold mb-3">System Information</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="opacity-90">Database Status:</span>
                                    <span className="font-semibold">Online</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="opacity-90">Total Profiles:</span>
                                    <span className="font-semibold">{stats?.active_profiles || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="opacity-90">Server Load:</span>
                                    <span className="font-semibold">Normal</span>
                                </div>
                            </div>
                        </div>

                        {/* Guidelines */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Access Guidelines</h2>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start">
                                    <Shield className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>All accesses are logged for security</span>
                                </li>
                                <li className="flex items-start">
                                    <Heart className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Emergency protocols activated automatically</span>
                                </li>
                                <li className="flex items-start">
                                    <FileText className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Patient consent verified through system</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
