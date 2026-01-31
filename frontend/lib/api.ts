/**
 * API Client for CrisisLink.cv Frontend
 * 
 * Centralized API communication layer with axios.
 * Handles authentication, token management, and all API calls.
 */

import axios, { AxiosInstance } from 'axios';

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// =============================================================================
// API CLIENT INSTANCE
// =============================================================================

/**
 * Configured axios instance with base URL and interceptors
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// =============================================================================
// TOKEN MANAGEMENT
// =============================================================================

/**
 * Store authentication token in localStorage
 */
export const setAuthToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
    }
};

/**
 * Get stored authentication token
 */
export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token');
    }
    return null;
};

/**
 * Remove authentication token (logout)
 */
export const removeAuthToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_type');
    }
};

/**
 * Store user info in localStorage
 */
export const setUserInfo = (userId: string, userType: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user_id', userId);
        localStorage.setItem('user_type', userType);
    }
};

/**
 * Get stored user info
 */
export const getUserInfo = (): { userId: string | null; userType: string | null } => {
    if (typeof window !== 'undefined') {
        return {
            userId: localStorage.getItem('user_id'),
            userType: localStorage.getItem('user_type'),
        };
    }
    return { userId: null, userType: null };
};

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface ReferenceDataResponse {
    [category: string]: Array<{
        id: number;
        category: string;
        subcategory?: string;
        name: string;
    }>;
}

export interface SearchReferenceResponse {
    [group: string]: Array<{
        id: number;
        category: string;
        subcategory?: string;
        name: string;
    }>;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface PatientRegistration {
    username: string;
    email: string;
    password: string;
}

export interface DoctorRegistration {
    username: string;
    email: string;
    password: string;
    hospital_id: string;
    hospital_name: string;
    specialty?: string;
    license_number?: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user_type: string;
    user_id: string;
}

export interface Hospital {
    id: string;
    name: string;
}

export interface DashboardStats {
    total_accesses: number;
    active_profiles: number;
    emergency_alerts: number;
}

export interface PatientListItem {
    id: string;
    name: string;
    age: number | null;
    blood_type: string | null;
    last_accessed: string | null;
}

export interface MedicalProfileData {
    full_name: string;
    date_of_birth?: string;
    blood_type?: string;
    allergies?: string[];
    medications?: string[];
    medical_conditions?: string[];
    dnr_status?: boolean;
    organ_donor?: boolean;
    special_instructions?: string;
    languages?: string[];
    contacts?: Array<{
        name: string;
        phone: string;
        relation: string;
        priority: number;
    }>;
    public_visible?: {
        name: boolean;
        bloodType: boolean;
        allergies: boolean;
        medications: boolean;
        conditions: boolean;
        contacts: boolean;
    };
}

// =============================================================================
// AUTHENTICATION API
// =============================================================================

/**
 * Register a new patient account
 */
export const registerPatient = async (data: PatientRegistration): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register/patient', data);
    return response.data;
};

/**
 * Register a new doctor account
 */
export const registerDoctor = async (data: DoctorRegistration): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register/doctor', data);
    return response.data;
};

/**
 * Login with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
};

/**
 * Get list of available hospitals
 */
export const getHospitals = async (): Promise<Hospital[]> => {
    const response = await apiClient.get<{ hospitals: Hospital[] }>('/api/auth/hospitals');
    return response.data.hospitals;
};

// =============================================================================
// DASHBOARD API
// =============================================================================

/**
 * Get dashboard statistics (for medical dashboard)
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/api/dashboard/stats');
    return response.data;
};

/**
 * Get patient list for doctor's patient lookup
 */
export const getPatients = async (search: string = ''): Promise<{ patients: PatientListItem[]; total_count: number }> => {
    const response = await apiClient.get('/api/dashboard/patients', {
        params: { search, limit: 50 },
    });
    return response.data;
};

/**
 * Get patient's own dashboard profile
 */
export const getPatientDashboard = async (userId: string): Promise<any> => {
    const response = await apiClient.get(`/api/dashboard/profile/${userId}`);
    return response.data;
};

/**
 * Get doctor's dashboard profile
 */
export const getDoctorDashboard = async (userId: string): Promise<any> => {
    const response = await apiClient.get(`/api/dashboard/doctor/${userId}`);
    return response.data;
};

// =============================================================================
// REFERENCE DATA API
// =============================================================================

export const getReferenceData = async (): Promise<ReferenceDataResponse> => {
    const response = await apiClient.get<ReferenceDataResponse>('/api/reference/');
    return response.data;
};

export const searchReferences = async (query: string, category?: string): Promise<SearchReferenceResponse> => {
    const response = await apiClient.get<SearchReferenceResponse>('/api/reference/search', {
        params: { q: query, category }
    });
    return response.data;
};

// =============================================================================
// PROFILE API
// =============================================================================

/**
 * Create a new medical profile
 */
export const createProfile = async (userId: string, profileData: MedicalProfileData): Promise<any> => {
    // Transform the data to match backend expectations
    const transformedData = {
        full_name: profileData.full_name,
        date_of_birth: profileData.date_of_birth,
        blood_type: profileData.blood_type,
        allergies: profileData.allergies || [],
        medications: profileData.medications || [],
        medical_conditions: profileData.medical_conditions || [],
        dnr_status: profileData.dnr_status || false,
        organ_donor: profileData.organ_donor || false,
        special_instructions: profileData.special_instructions,
        languages: profileData.languages || ['English'],
    };

    const response = await apiClient.post(`/api/profiles/?user_id=${userId}`, transformedData);
    return response.data;
};

/**
 * Update an existing medical profile
 */
export const updateProfile = async (userId: string, profileData: MedicalProfileData): Promise<any> => {
    // Transform the data matching the create profile logic
    const transformedData = {
        full_name: profileData.full_name,
        date_of_birth: profileData.date_of_birth,
        blood_type: profileData.blood_type,
        allergies: profileData.allergies || [],
        medications: profileData.medications || [],
        medical_conditions: profileData.medical_conditions || [],
        dnr_status: profileData.dnr_status || false,
        organ_donor: profileData.organ_donor || false,
        special_instructions: profileData.special_instructions,
        languages: profileData.languages || ['English'],
        contacts: profileData.contacts,
        public_visible: profileData.public_visible // Add this to interface if missing
    };

    // Assuming PUT endpoint exists at /api/profiles/{userId}
    // If backend uses POST for updates or different path, adjust here.
    const response = await apiClient.put(`/api/profiles/${userId}`, transformedData);
    return response.data;
};

/**
 * Get a medical profile by user ID
 */
export const getProfile = async (userId: string): Promise<any> => {
    const response = await apiClient.get(`/api/profiles/${userId}`);
    return response.data;
};

// =============================================================================
// EXPORT DEFAULT CLIENT
// =============================================================================

export default apiClient;