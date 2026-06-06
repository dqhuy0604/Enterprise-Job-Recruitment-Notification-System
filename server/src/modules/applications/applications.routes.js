const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate.middleware');
const uploadCV = require('../../middlewares/upload.middleware');
const { protect, authorize, optionalProtect } = require('../../middlewares/auth.middleware');
const { submitApplicationSchema, updateStatusSchema } = require('./applications.validation');
const applicationsController = require('./applications.controller');

router.post(
  '/',
  optionalProtect,
  uploadCV.single('cv'),
  validate(submitApplicationSchema),
  applicationsController.submitApplication
);

router.get('/', protect, authorize('hr', 'admin'), applicationsController.getAllApplications);
router.get('/:id', protect, authorize('hr', 'admin'), applicationsController.getApplicationById);
router.patch(
  '/:id/status',
  protect,
  authorize('hr', 'admin'),
  validate(updateStatusSchema),
  applicationsController.updateApplicationStatus
);
router.delete('/:id', protect, authorize('admin'), applicationsController.deleteApplication);

module.exports = router;
