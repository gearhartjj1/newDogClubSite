// API service for frontend to communicate with backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
    const response = await fetch(`${API_URL}/dog-classes`);
    if (!response.ok) throw new Error('Failed to fetch dog classes');
    const data = await response.json();
    return data[0] as DogClass[];
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_URL}/dog-classes/${id}`);
    if (!response.ok) throw new Error('Failed to fetch dog class');
    return response.json();
  },

  create: async (dogClassData: any) => {
    console.log("in api: ", dogClassData);
    const response = await fetch(`${API_URL}/dog-classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dogClassData),
    });
    if (!response.ok) throw new Error('Failed to create dog class');
    return response.json();
  },

  getByUserId: async (userId: number) => {
    const response = await fetch(`${API_URL}/dog-classes/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user dog classes');
    const data = await response.json();
    return data[0] as DogClass[];
  },
};

// Classes API
export const classesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/classes`);
    if (!response.ok) throw new Error('Failed to fetch classes');
    return response.json();
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_URL}/classes/${id}`);
    if (!response.ok) throw new Error('Failed to fetch class');
    return response.json();
  },

  create: async (classData: any) => {
    const response = await fetch(`${API_URL}/classes`, {
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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData),
    });
    if (!response.ok) throw new Error('Failed to create signup');
    return response.json();
  },

  getByEmail: async (email: string) => {
    const response = await fetch(`${API_URL}/signups/email/${email}`);
    if (!response.ok) throw new Error('Failed to fetch signups');
    return response.json();
  },

  getByClass: async (classId: number) => {
    const response = await fetch(`${API_URL}/signups/class/${classId}`);
    if (!response.ok) throw new Error('Failed to fetch signups');
    return response.json();
  },
};

// Sign In API
export const signinAPI = {
  signin: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/signin`, {
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
};

// Member Dogs API
export const memberDogsAPI = {
  getByFamilyId: async (familyId: number) => {
    const response = await fetch(`${API_URL}/member-dogs/${familyId}`);
    if (!response.ok) throw new Error('Failed to fetch member dogs');
    return response.json();
  },

  add: async (familyId: number, dogName: string, dogBreed: string, dogAge: string) => {
    const response = await fetch(`${API_URL}/member-dogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ familyId, dogName, dogBreed, dogAge }),
    });
    if (!response.ok) throw new Error('Failed to add dog');
    return response.json();
  },

  remove: async (dogId: number) => {
    const response = await fetch(`${API_URL}/member-dogs/${dogId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to remove dog');
    return response.json();
  },
};

export default { dogClassAPI, classesAPI, signupsAPI, memberDogsAPI };
