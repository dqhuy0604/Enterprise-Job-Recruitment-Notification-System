import api from './client';

export const login = (email, password) =>
  api.post('/api/auth/login', { email, password }).then((res) => res.data);

export const registerStudent = (data) =>
  api.post('/api/auth/register/student', data).then((res) => res.data);

export const registerHr = (data) =>
  api.post('/api/auth/register/hr', data).then((res) => res.data);

export const getMe = () => api.get('/api/auth/me').then((res) => res.data);

export const updateProfile = (data) =>
  api.put('/api/auth/me', data).then((res) => res.data);

export const changePassword = (data) =>
  api.put('/api/auth/me/password', data).then((res) => res.data);

export const createEmployee = (data) =>
  api.post('/api/auth/employees', data).then((res) => res.data);

export const deactivateEmployee = (id) =>
  api.patch(`/api/auth/employees/${id}/deactivate`).then((res) => res.data);
