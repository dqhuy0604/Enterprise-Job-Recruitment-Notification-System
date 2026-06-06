const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate.middleware');
const { protect, authorize } = require('../../middlewares/auth.middleware');
const {
  registerCompanySchema,
  updateCompanySchema,
  companyIdParamSchema,
} = require('./companies.validation');
const companiesController = require('./companies.controller');

router.post('/register', validate(registerCompanySchema), companiesController.registerCompany);

router.get('/me', protect, authorize('hr', 'admin'), companiesController.getMyCompany);
router.put('/me', protect, authorize('hr', 'admin'), validate(updateCompanySchema), companiesController.updateMyCompany);
router.get('/me/stats', protect, authorize('hr', 'admin'), companiesController.getCompanyStats);
router.get('/me/employees', protect, authorize('hr', 'admin'), companiesController.getCompanyEmployees);

router.get('/pending', protect, authorize('admin'), companiesController.getPendingCompanies);
router.patch('/:id/approve', protect, authorize('admin'), validate(companyIdParamSchema), companiesController.approveCompany);
router.patch('/:id/reject', protect, authorize('admin'), validate(companyIdParamSchema), companiesController.rejectCompany);

module.exports = router;
