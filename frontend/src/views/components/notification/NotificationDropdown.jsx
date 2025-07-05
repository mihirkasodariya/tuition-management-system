import React, { memo, useEffect } from 'react';
import {
  BellIcon,
  MailIcon,
  MessageSquareIcon,
  AlertTriangleIcon,
  CalendarSync,
  NotebookPen,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { format } from 'timeago.js';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = ({ notifications, markAsReadNotificationFun }) => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setUnreadNotifications(notifications?.filter((n) => !n.isRead).length);
  }, [notifications]);

  const markAsRead = (id) => {
    // Here you would typically make an API call to mark the notification as read
    setUnreadNotifications((prev) => prev - 1);
    markAsReadNotificationFun(id);
  };

  const markAllAsRead = () => {
    // API call to mark all as read
    // setUnreadNotifications(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'contact_form':
        return <MailIcon className="h-4 w-4 text-blue-500" />;
      case 'google_meet_cron':
        return <CalendarSync className="h-4 w-4 text-green-500" />;
      case 'message':
        return <MessageSquareIcon className="h-4 w-4 text-green-500" />;
      case 'alert':
        return <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case 'home_work':
        return <NotebookPen className="h-4 w-4 text-purple-500" />;
      default:
        return <BellIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadNotifications}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[22rem] p-0" align="end">
        <div className="flex items-center justify-between mt-1 px-4 py-3 border-b">
          <h2 className="font-semibold text-sm">Notifications</h2>
          {unreadNotifications > 0 && (
            <button onClick={markAllAsRead} className="text-xs text-blue-500 hover:underline">
              Mark all as read
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications?.length > 0 ? (
            notifications?.map((notification) => (
              <DropdownMenuItem
                key={notification._id}
                className={cn(
                  'flex gap-3 px-4 py-3 border-b cursor-pointer',
                  !notification.isRead && 'bg-gray-50'
                )}
                onClick={
                  !notification.isRead
                    ? () => markAsRead(notification._id)
                    : () => notification?.url && navigate(notification?.url)
                }
              >
                <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium ">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {moment(notification.createdAt).format('LLL')} ({format(notification.createdAt)}
                    )
                  </p>
                </div>
                {!notification.isRead && <span className="h-2 w-2 rounded-full bg-blue-500"></span>}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-sm text-gray-500">No notifications yet</div>
          )}
        </div>
        {notifications?.length > 0 && (
          <div className="px-4 py-2 text-center border-t">
            <button className="text-xs text-red-500 hover:underline">
              delete all notifications
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(NotificationDropdown);
