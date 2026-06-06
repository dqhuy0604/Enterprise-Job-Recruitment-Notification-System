import api from './client';

export const submitApplication = (formData) =>
  api.post('/api/applications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);

export const getApplications = () =>
  api.get('/api/applications').then((res) => res.data);

export const updateApplicationStatus = (id, status) =>
  api.patch(`/api/applications/${id}/status`, { status }).then((res) => res.data);

export const deleteApplication = (id) =>
  api.delete(`/api/applications/${id}`).then((res) => res.data);
