import api from './client';

export const getJobs = (params = {}) =>
  api.get('/api/jobs', { params }).then((res) => res.data);

export const getJobById = (id) =>
  api.get(`/api/jobs/${id}`).then((res) => res.data);

export const createJob = (data) =>
  api.post('/api/jobs', data).then((res) => res.data);

export const updateJob = (id, data) =>
  api.put(`/api/jobs/${id}`, data).then((res) => res.data);

export const updateJobStatus = (id, status) =>
  api.patch(`/api/jobs/${id}/status`, { status }).then((res) => res.data);

export const deleteJob = (id) =>
  api.delete(`/api/jobs/${id}`).then((res) => res.data);
