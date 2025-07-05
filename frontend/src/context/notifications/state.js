import { useReducer } from 'react';
import { Actions } from './action';
import Reducer from './reducer';
import { getNotificationsApi, updateNotificationsApi } from '@/apis/notification.api';

export const initialState = {
  notifications: null,
};

export const NotificationState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const fetchNotificationsAction = async (sessionId) => {
    let response = await getNotificationsApi(sessionId);
    if (response[0] === true) {
      dispatch({
        type: Actions.FETCH_NOTIFICATIONS,
        payload: response[1]?.data,
      });
    }

    return response;
  };

  const updateNotificationAction = async (notificationId) => {
    let json = {
      isRead: true,
    };
    let updateNotificationArray = state.notifications;
    updateNotificationArray.docs = updateNotificationArray?.docs?.map((item) => {
      if (item?._id === notificationId) {
        item.isRead = true;
        return item;
      } else return item;
    });

    dispatch({
      type: Actions.FETCH_NOTIFICATIONS,
      payload: updateNotificationArray,
    });

    let response = await updateNotificationsApi(notificationId, json);
    if (response[0] === true) {
    } else {
      updateNotificationArray.docs = updateNotificationArray?.docs?.map((item) => {
        if (item?._id === notificationId) {
          item.isRead = false;
          return item;
        } else return item;
      });

      dispatch({
        type: Actions.FETCH_NOTIFICATIONS,
        payload: updateNotificationArray,
      });
    }

    return response;
  };

  const updateSocketNotificationAction = (newNotification) => {
    const updateNotificationArray = state.notifications || null;

    if (updateNotificationArray) {
      updateNotificationArray.docs = [newNotification, ...updateNotificationArray.docs];
      dispatch({
        type: Actions.FETCH_NOTIFICATIONS,
        payload: updateNotificationArray,
      });
    }
  };

  const updateNotificationStateAction = (payload) => {
    dispatch({ type: Actions.UPDATE_CHAT_AGENT_STATE, payload });
  };

  const resetNotificationAction = () => {
    dispatch({ type: Actions.RESET_STATE });
  };

  return {
    ...state,
    fetchNotificationsAction,
    updateNotificationAction,
    updateSocketNotificationAction,
    updateNotificationStateAction,
    resetNotificationAction,
  };
};
