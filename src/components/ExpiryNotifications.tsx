
import { Bell } from "lucide-react";

interface ExpiryNotificationsProps {
  notifications: string[];
}

const ExpiryNotifications = ({ notifications }: ExpiryNotificationsProps) => {
  if (notifications.length === 0) return null;

  return (
    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
      <div className="flex items-center mb-2">
        <Bell className="h-5 w-5 text-orange-500 mr-2" />
        <h3 className="font-semibold text-orange-800">만료 임박 알림</h3>
      </div>
      {notifications.map((notification, index) => (
        <p key={index} className="text-orange-700 text-sm">{notification}</p>
      ))}
    </div>
  );
};

export default ExpiryNotifications;
