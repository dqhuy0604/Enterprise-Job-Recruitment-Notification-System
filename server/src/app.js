const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const jobRoutes = require('./modules/jobs/jobs.routes');
const applicationRoutes = require('./modules/applications/applications.routes');
const authRoutes = require('./modules/users/users.routes');
const companyRoutes = require('./modules/companies/companies.routes');
const studentRoutes = require('./modules/students/students.routes');
const notificationRoutes = require('./modules/notifications/notifications.routes');
const errorHandler = require('./middlewares/error.middleware');

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/test', (req, res) => {
  res.status(200).json({ success: true, message: 'Express đang chạy!' });
});

app.use(errorHandler);

module.exports = app;
