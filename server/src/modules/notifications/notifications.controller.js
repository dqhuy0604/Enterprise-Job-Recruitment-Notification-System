const Notification = require('./notification.model');

const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false });

    return res.status(200).json({ success: true, unreadCount, data: notifications });
  } catch (error) {
    return next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông báo' });
    }
    return res.status(200).json({ success: true, data: notif });
  } catch (error) {
    return next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
    return res.status(200).json({ success: true, message: 'Đã đánh dấu tất cả là đã đọc' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getMyNotifications, markAsRead, markAllAsRead };
