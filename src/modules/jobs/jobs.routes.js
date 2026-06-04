// src/modules/jobs/jobs.routes.js
const express = require('express');
const router = express.Router();
const { createJob, getAllJobs } = require('./jobs.controller');

// Định nghĩa các endpoint
router.post('/', createJob); // Đường dẫn: POST /api/jobs
router.get('/', getAllJobs); // Đường dẫn: GET /api/jobs

module.exports = router;