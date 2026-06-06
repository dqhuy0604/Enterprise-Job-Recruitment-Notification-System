import api from './client';

export const getSavedJobs = () =>
  api.get('/api/students/saved-jobs').then((res) => res.data);

export const checkSavedJob = (jobId) =>
  api.get(`/api/students/saved-jobs/${jobId}`).then((res) => res.data);

export const toggleSaveJob = (jobId) =>
  api.post(`/api/students/saved-jobs/${jobId}`).then((res) => res.data);

export const getMyApplications = () =>
  api.get('/api/students/applications').then((res) => res.data);

export const getApplicationStats = () =>
  api.get('/api/students/applications/stats').then((res) => res.data);

export const analyzeCv = ({ cvFile, cvText }) => {
  const formData = new FormData();
  if (cvFile) formData.append('cvFile', cvFile);
  if (cvText) formData.append('cvText', cvText);
  return api.post('/api/students/ai-analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);
};

export const getAiHistory = () =>
  api.get('/api/students/ai-history').then((res) => res.data);
