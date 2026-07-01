import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('nr_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('nr_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const register = (data: { name: string; email: string; password: string; company: string }) =>
  API.post('/auth/register', data);

export const login = (data: { email: string; password: string }) =>
  API.post('/auth/login', data);

export const getMe = () => API.get('/auth/me');

export const createJob = (data: { title: string; description: string; teamMembers: any[]; weightOverrides?: any }) =>
  API.post('/jobs', data);

export const getJobs = () => API.get('/jobs');

export const getCandidates = (page = 1, limit = 20) =>
  API.get(`/candidates?page=${page}&limit=${limit}`);

export const seedCandidates = () => API.post('/candidates/seed');

export const runRanking = (data: { jobId: string; weightOverrides: any }) =>
  API.post('/ranking/run', data);

export const getRankingResult = (id: string) => API.get(`/ranking/${id}`);

export const getRankingHistory = () => API.get('/ranking');

export default API;
