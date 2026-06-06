const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate.middleware');
const { protect, authorize, optionalProtect } = require('../../middlewares/auth.middleware');
const {
  jobIdParamSchema,
  createJobSchema,
  updateJobSchema,
  updateJobStatusSchema,
  getJobsQuerySchema,
} = require('./jobs.validation');
const jobsController = require('./jobs.controller');

router.post('/', protect, authorize('hr', 'admin'), validate(createJobSchema), jobsController.createJob);
router.get('/', optionalProtect, validate(getJobsQuerySchema), jobsController.getAllJobs);
router.get('/:id', validate(jobIdParamSchema), jobsController.getJobById);
router.put('/:id', protect, authorize('hr', 'admin'), validate(updateJobSchema), jobsController.updateJob);
router.patch('/:id/status', protect, authorize('hr', 'admin'), validate(updateJobStatusSchema), jobsController.updateJobStatus);
router.delete('/:id', protect, authorize('admin'), validate(jobIdParamSchema), jobsController.deleteJob);

module.exports = router;
