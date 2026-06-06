import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../api/notifications';
import { useAuth } from '../context/AuthContext';

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);

  const load = () => {
    if (!isAuthenticated) return;
    getNotifications()
      .then((res) => {
        setItems(res.data);
        setUnread(res.unreadCount);
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const handleRead = async (id) => {
    await markNotificationRead(id);
    load();
  };

  const handleReadAll = async () => {
    await markAllNotificationsRead();
    load();
  };

  return (
    <div className="notification-bell">
      <button type="button" className="bell-btn" onClick={() => setOpen(!open)}>
        🔔
        {unread > 0 && <span className="bell-badge">{unread}</span>}
      </button>
      {open && (
        <div className="notification-panel">
          <div className="notification-panel-header">
            <strong>Thông báo</strong>
            {unread > 0 && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleReadAll}>
                Đọc tất cả
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <p className="text-muted notification-empty">Chưa có thông báo</p>
          ) : (
            items.slice(0, 8).map((n) => (
              <div key={n._id} className={`notification-item ${n.read ? '' : 'unread'}`}>
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <div className="notification-actions">
                  {n.link && <Link to={n.link} onClick={() => { handleRead(n._id); setOpen(false); }}>Xem</Link>}
                  {!n.read && (
                    <button type="button" onClick={() => handleRead(n._id)}>Đánh dấu đã đọc</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
