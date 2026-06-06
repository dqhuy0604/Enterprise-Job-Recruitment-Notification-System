import api from './client';

export const getNotifications = () =>
  api.get('/api/notifications').then((res) => res.data);

export const markNotificationRead = (id) =>
  api.patch(`/api/notifications/${id}/read`).then((res) => res.data);

export const markAllNotificationsRead = () =>
  api.patch('/api/notifications/read-all').then((res) => res.data);
