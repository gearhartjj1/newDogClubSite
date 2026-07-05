// API service for frontend to communicate with backend

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Common fetch options to include session cookie with every request
const fetchOptions: RequestInit = {
  credentials: 'include',
};

export interface DogClass {
  Class: string,
  ClassCode: string,
  Code: string,
  CurDog: string,
  Day: string,//TODO: should be an enum
  ID: number,
  Instructors: string,
  MaxDog: number,
  Prerequisites: string,
  Rate: number,//TODO: probably should be an enum
  Room: string, //TODO: probably should be an enum
  Session: string,
  Start: string, //TODO: should be a Date but the data looks sketchy
  Time: string //TODO: should be a Time but the data looks sketchy
  DogsInClass: number;
  }

// Dog Classes API
//TODO: clean up this to format data from database from json to list of objects
export const dogClassAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/dog-classes`, fetchOptions);
    if (!response.ok) throw new Error('Failed to fetch dog classes');
    const data = await response.json();
    return data[0] as DogClass[];
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_URL}/dog-classes/${id}`, fetchOptions);
    if (!response.ok) throw new Error('Failed to fetch dog class');
    return response.json();
  },

  create: async (dogClassData: any) => {
    const response = await fetch(`${API_URL}/dog-classes`, {
      ...fetchOptions,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dogClassData),
    });
    return response.json();
  },

  getByUserId: async (userId: number) => {
    const response = await fetch(`${API_URL}/dog-classes/user/${userId}`, fetchOptions);
    if (!response.ok) throw new Error('Failed to fetch user dog classes');
    const data = await response.json();
    return data[0] as DogClass[];
  },

  getSessionStatus: async () => {
    const response = await fetch(`${API_URL}/dog-classes/session-status`, fetchOptions);
    if (!response.ok) throw new Error('Failed to fetch session status');
    return response.json();
  }
};

// Classes API
export const classesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/classes`, fetchOptions);
    if (!response.ok) throw new Error('Failed to fetch classes');
    return response.json();
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_URL}/classes/${id}`, fetchOptions);
    if (!response.ok) throw new Error('Failed to fetch class');
    return response.json();
  },

  create: async (classData: any) => {
    const response = await fetch(`${API_URL}/classes`, {
      ...fetchOptions,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classData),
    });
    if (!response.ok) throw new Error('Failed to create class');
    return response.json();
  },
};

// Signups API
export const signupsAPI = {
  create: async (signupData: any) => {
    const response = await fetch(`${API_URL}/signups`, {
      ...fetchOptions,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData),
    });
    if (!response.ok) throw new Error('Failed to create signup');
    return response.json();
  },

  getByEmail: async (email: string) => {
    const response = await fetch(`${API_URL}/signups/email/${email}`, fetchOptions);
    if (!response.ok) throw new Error('Failed to fetch signups');
    return response.json();
  },

  getByClass: async (classId: number) => {
    const response = await fetch(`${API_URL}/signups/class/${classId}`, fetchOptions);
    if (!response.ok) throw new Error('Failed to fetch signups');
    return response.json();
  },
};

// Verify the connection is secure before sending credentials
function assertSecureConnection(): void {
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    throw new Error('Secure connection (HTTPS) is required for authentication. Please access this site over HTTPS.');
  }
}

// Sign In API
export const signinAPI = {
  signin: async (username: string, password: string) => {
    assertSecureConnection();
    const response = await fetch(`${API_URL}/signin`, {
      ...fetchOptions,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Sign in failed');
    }
    return data;
  },

  // Check current session - returns user if authenticated
  me: async () => {
    const response = await fetch(`${API_URL}/signin/me`, fetchOptions);
    const data = await response.json();
    if (!response.ok) {
      return null;
    }
    return data.user;
  },

  // Destroy session server-side
  logout: async () => {
    const response = await fetch(`${API_URL}/signin/logout`, {
      ...fetchOptions,
      method: 'POST',
    });
    return response.json();
  },
};

// Member Dogs API
export const memberDogsAPI = {
  getByFamilyId: async (familyId: number) => {
    const response = await fetch(`${API_URL}/member-dogs/${familyId}`, fetchOptions);
    if (!response.ok) throw new Error('Failed to fetch member dogs');
    return response.json();
  },

  add: async (familyId: number, dogName: string, dogBreed: string, dogAge: string) => {
    const response = await fetch(`${API_URL}/member-dogs`, {
      ...fetchOptions,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ familyId, dogName, dogBreed, dogAge }),
    });
    if (!response.ok) throw new Error('Failed to add dog');
    return response.json();
  },

  remove: async (dogId: number) => {
    const response = await fetch(`${API_URL}/member-dogs/${dogId}`, {
      ...fetchOptions,
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to remove dog');
    return response.json();
  },
};

export default { dogClassAPI, classesAPI, signupsAPI, memberDogsAPI };