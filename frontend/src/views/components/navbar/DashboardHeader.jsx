import { memo, useCallback, useContext } from 'react';
import NotificationDropdown from '../notification/NotificationDropdown';
import Context from '@/context/context';
import getInitials from '@/helpers/get-initials';

const DashboardHeader = ({ profileDetails, children }) => {
  const {
    notificationState: { notifications, updateNotificationAction },
  } = useContext(Context);

  const markAsReadNotificationFun = useCallback(
    async (notificationId) => {
      await updateNotificationAction(notificationId);
    },
    [notifications]
  );

  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">{children}</div>
        <div className="flex items-center gap-2">
          <NotificationDropdown
            notifications={notifications?.docs ?? []}
            markAsReadNotificationFun={markAsReadNotificationFun}
          />
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
            <span className="sr-only">User menu</span>
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-600">
              {getInitials(profileDetails?.name)}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default memo(DashboardHeader);
