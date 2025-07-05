import { useCallback, useContext } from 'react';
import { clearAll } from '@/helpers/local-storage';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  loginActions,
  userActions,
  batchActions,
  boardActions,
  subjectActions,
  studentActions,
  graphActions,
  myDetailsActions,
  builderActions,
} from '@/redux/combineActions';
import Context from '@/context/context';
import { clearAllChatSessions } from '@/helpers/session-storage';

const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    chatAgentState: { resetChatAgentAction },
    notificationState: { resetNotificationAction },
  } = useContext(Context);

  const resetApplications = useCallback(async () => {
    //add here all reset context state func

    dispatch(loginActions.resetLoginAction());
    dispatch(userActions.resetUserProfileAction());
    dispatch(batchActions.resetBatchAction());
    dispatch(boardActions.resetBoardAction());
    dispatch(subjectActions.resetSubjectAction());
    dispatch(studentActions.resetStudentAction());
    dispatch(graphActions.resetGraphAction());
    dispatch(myDetailsActions.resetMyDetailsAction());
    dispatch(builderActions.resetBuilderAction());
    // Reset chat agent state
    resetChatAgentAction();
    resetNotificationAction();
    clearAll();
    clearAllChatSessions();
    navigate('/');
  }, []);

  return resetApplications;
};

export default useLogout;
