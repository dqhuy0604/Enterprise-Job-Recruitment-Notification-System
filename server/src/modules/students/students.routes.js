const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middlewares/auth.middleware');
const uploadCvAnalyze = require('../../middlewares/uploadCvAnalyze.middleware');
const studentsController = require('./students.controller');

router.get('/saved-jobs', protect, authorize('student'), studentsController.getSavedJobs);
router.get('/saved-jobs/:jobId', protect, authorize('student'), studentsController.checkSavedJob);
router.post('/saved-jobs/:jobId', protect, authorize('student'), studentsController.toggleSaveJob);
router.delete('/saved-jobs/:jobId', protect, authorize('student'), studentsController.toggleSaveJob);

router.get('/applications', protect, authorize('student'), studentsController.getMyApplications);
router.get('/applications/stats', protect, authorize('student'), studentsController.getApplicationStats);

router.post(
  '/ai-analyze',
  protect,
  authorize('student'),
  uploadCvAnalyze.single('cvFile'),
  studentsController.analyzeCv
);

router.get('/ai-history', protect, authorize('student'), studentsController.getAiHistory);

module.exports = router;
