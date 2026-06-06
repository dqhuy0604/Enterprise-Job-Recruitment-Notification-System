import api from './client';

export const registerCompany = (data) =>
  api.post('/api/companies/register', data).then((res) => res.data);

export const getMyCompany = () =>
  api.get('/api/companies/me').then((res) => res.data);

export const updateMyCompany = (data) =>
  api.put('/api/companies/me', data).then((res) => res.data);

export const getCompanyStats = () =>
  api.get('/api/companies/me/stats').then((res) => res.data);

export const getCompanyEmployees = () =>
  api.get('/api/companies/me/employees').then((res) => res.data);

export const getPendingCompanies = () =>
  api.get('/api/companies/pending').then((res) => res.data);

export const approveCompany = (id) =>
  api.patch(`/api/companies/${id}/approve`).then((res) => res.data);

export const rejectCompany = (id) =>
  api.patch(`/api/companies/${id}/reject`).then((res) => res.data);
