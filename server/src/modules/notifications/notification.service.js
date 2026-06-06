const Notification = require('./notification.model');
const { queueEmail } = require('./email.queue');

const createNotification = async ({ userId, type, title, message, link = '' }) => {
  return Notification.create({ userId, type, title, message, link });
};

const notifyMany = async (userIds, payload) => {
  const unique = [...new Set(userIds.map(String))];
  await Promise.all(unique.map((userId) => createNotification({ ...payload, userId })));
};

const notifyAndEmail = async ({ userId, email, subject, body, ...notif }) => {
  await createNotification({ userId, ...notif });
  if (email) await queueEmail({ to: email, subject, body });
};

module.exports = { createNotification, notifyMany, notifyAndEmail };
