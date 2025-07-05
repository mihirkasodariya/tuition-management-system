import { useMemo } from 'react';
import { ChatAgentState } from './chatAgent/state';
import { NotificationState } from './notifications/state';
import { SidebarState } from './sidebar/state';

const useCombineState = () => {
  const chatAgentState = ChatAgentState();
  const notificationState = NotificationState();
  const sidebarState = SidebarState();
  return useMemo(
    () => ({ chatAgentState, notificationState, sidebarState }),
    [chatAgentState, notificationState, sidebarState]
  );
};

export default useCombineState;
