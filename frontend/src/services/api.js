import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
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
  create: (formData) => API.post('/assignments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => API.put(`/assignments/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
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
