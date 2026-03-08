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
    const response = await fetch(`${API_URL}/dog-classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dogClassData),
    });
    if (!response.ok) throw new Error('Failed to create dog class');
    return response.json();
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

export default { dogClassAPI, classesAPI, signupsAPI };
