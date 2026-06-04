// src/modules/applications/applications.routes.js
const Application = require('./applications.model');
const Job = require('../jobs/jobs.model');
const express = require('express');
const router = express.Router();
const uploadCV = require('../../middlewares/upload.middleware');
const { addEmailToQueue } = require('../notifications/email.queue');
const { 
  submitApplication, 
  getAllApplications, 
  getApplicationById, 
  updateApplicationStatus, 
  deleteApplication 
} = require('./applications.controller');

// 1. Ứng viên nộp đơn (Cần chạy qua middleware upload file)
router.post('/', uploadCV.single('cv'), submitApplication);

// 2. HR lấy tất cả danh sách hồ sơ
router.get('/', getAllApplications);

// 3. HR xem chi tiết 1 hồ sơ
router.get('/:id', getApplicationById);

// 4. HR cập nhật trạng thái của hồ sơ (Duyệt/Từ chối)
router.patch('/:id/status', updateApplicationStatus);

// 5. HR xóa một hồ sơ
router.delete('/:id', deleteApplication);

module.exports = router;
