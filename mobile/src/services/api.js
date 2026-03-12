import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For physical device testing, replace with your machine's IP address
// e.g., 'http://192.168.1.100:5000/api'
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const API = axios.create({ baseURL: API_URL });

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

export const subjectAPI = {
  getMySubjects: () => API.get('/subjects'),
  getAllSubjects: () => API.get('/subjects/all'),
  getById: (id) => API.get(`/subjects/${id}`),
  create: (data) => API.post('/subjects', data),
  update: (id, data) => API.put(`/subjects/${id}`, data),
  delete: (id) => API.delete(`/subjects/${id}`),
  enroll: (id) => API.post(`/subjects/${id}/enroll`),
  unenroll: (id) => API.delete(`/subjects/${id}/enroll`),
  getStudents: (id) => API.get(`/subjects/${id}/students`),
};

export const assignmentAPI = {
  getBySubject: (subjectId) => API.get(`/assignments/subject/${subjectId}`),
  getById: (id) => API.get(`/assignments/${id}`),
  getMyAssignments: () => API.get('/assignments/my'),
  create: (data) => API.post('/assignments', data),
  delete: (id) => API.delete(`/assignments/${id}`),
};

export const submissionAPI = {
  submit: (formData) => API.post('/submissions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMySubmissions: () => API.get('/submissions/my'),
  getByAssignment: (assignmentId) => API.get(`/submissions/assignment/${assignmentId}`),
  grade: (id, data) => API.put(`/submissions/${id}/grade`, data),
};

export const materialAPI = {
  getBySubject: (subjectId) => API.get(`/materials/subject/${subjectId}`),
  create: (formData) => API.post('/materials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => API.delete(`/materials/${id}`),
};

export default API;
