import { useEffect, useRef, useState, useContext } from 'react';
import {
  admin_emit_listeners,
  admin_receiver_listeners,
  student_emit_listeners,
  student_receiver_listeners,
} from '@/constants/socket.constants';
import Context from '@/context/context';
import { BASE_URL } from '@/services/config';
import { io } from 'socket.io-client';
// import { useSelector } from 'react-redux';

const useSocket = ({ dependencies = [], isAdmin = false, profileDetails = null }) => {
  // const { profileDetails } = useSelector((state) => state.userProfileState);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  const {
    notificationState: { updateSocketNotificationAction, notifications },
  } = useContext(Context);

  // Create refs to keep track of the latest values
  const updateActionRef = useRef(updateSocketNotificationAction);
  const notificationsRef = useRef(notifications);

  // Update refs when values change
  useEffect(() => {
    updateActionRef.current = updateSocketNotificationAction;
    notificationsRef.current = notifications;
  }, [updateSocketNotificationAction, notifications]);

  useEffect(() => {
    if (!profileDetails) return;
    if (socketRef.current) return;

    const socket = io(BASE_URL);
    socketRef.current = socket;

    const handleNotification = (notification) => {
      console.log(notificationsRef.current, 'shahid'); // Now always current
      updateActionRef.current(notification); // Now always current
    };

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');

      if (isAdmin) {
        let admin_name = 'edu_excellence_admin';
        socket.emit(admin_emit_listeners.join_admin_room, admin_name);
      } else {
        let student_id = `student_${profileDetails?._id}`;
        socket.emit(student_emit_listeners.join_student_room, student_id);
      }

      // Use the ref-based handler
      socket.on(admin_receiver_listeners.adminNotification, handleNotification);
      socket.on(student_receiver_listeners.studentNotification, handleNotification);
    });

    socket.on('disconnect', () => setIsConnected(false));
    socket.on('error', (error) => console.error('Socket error:', error));

    return () => {
      if (socketRef.current) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('error');
        socket.off(admin_receiver_listeners.adminNotification, handleNotification);
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [...dependencies]);

  return { isConnected, socketRef };
};
export default useSocket;

// old if state change again new connection
const useSocketStateChange = ({ dependencies = [], isAdmin = false }) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const {
    notificationState: { updateSocketNotificationAction, notifications },
  } = useContext(Context);

  useEffect(() => {
    if (socketRef.current) return;

    const socket = io(BASE_URL);
    socketRef.current = socket;

    // Basic connection events
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');

      if (isAdmin) {
        let admin_name = 'edu_excellence_admin';
        socket.emit('joinAdminRoom', admin_name);
      }

      // 👇 Setup the listener
      socket.on(admin_receiver_listeners.adminNotification, (notification) => {
        updateSocketNotificationAction(notification);
      });
    });

    // if disconnected
    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    // if there is an error
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      if (socketRef.current) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('error');
        socket.off('newNotification');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [...dependencies]);

  return { isConnected, socketRef };
};
