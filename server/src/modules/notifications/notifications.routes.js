const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/auth.middleware');
const notificationsController = require('./notifications.controller');

router.get('/', protect, notificationsController.getMyNotifications);
router.patch('/read-all', protect, notificationsController.markAllAsRead);
router.patch('/:id/read', protect, notificationsController.markAsRead);

module.exports = router;
