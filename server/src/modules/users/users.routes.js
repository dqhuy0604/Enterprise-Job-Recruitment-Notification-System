const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate.middleware');
const { protect, authorize } = require('../../middlewares/auth.middleware');
const {
  registerStudentSchema,
  registerHrSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  createEmployeeSchema,
} = require('./users.validation');
const usersController = require('./users.controller');

router.post('/register/student', validate(registerStudentSchema), usersController.registerStudent);
router.post('/register/hr', validate(registerHrSchema), usersController.registerHr);
router.post('/login', validate(loginSchema), usersController.login);

router.get('/me', protect, usersController.getMe);
router.put('/me', protect, validate(updateProfileSchema), usersController.updateProfile);
router.put('/me/password', protect, validate(changePasswordSchema), usersController.changePassword);
router.post(
  '/employees',
  protect,
  authorize('hr', 'admin'),
  validate(createEmployeeSchema),
  usersController.createEmployee
);

router.patch(
  '/employees/:id/deactivate',
  protect,
  authorize('hr', 'admin'),
  usersController.deactivateEmployee
);

module.exports = router;
