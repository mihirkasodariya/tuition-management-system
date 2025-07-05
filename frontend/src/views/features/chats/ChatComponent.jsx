import { useCallback, useState, memo, useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import ChatModel from './ChatModel';
import { MessageSquareMore } from 'lucide-react';
import Context from '@/context/context';
import { getChatSessionId } from '@/helpers/session-storage';
import { createChatSessionApi } from '@/apis/ai.api';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileChatDrawer from './MobileChatDrawer';
import { useSelector } from 'react-redux';

const ChatComponent = () => {
  // * redux state
  const { profileDetails } = useSelector((state) => state.userProfileState);
  // * contexts
  const {
    chatAgentState: {
      isChatModalOpen,
      sessionDetails,
      sessionId,
      chatModalAction,
      setSessionIdAction,
      fetchSessionDetailsAction,
      updateChatAgentStateAction,
    },
  } = useContext(Context);

  // * hooks
  const isMobile = useIsMobile();

  // * states
  const [info, setInfo] = useState({
    loading: false,
    isChatOpen: false,
    inputMessage: '',
    messageLoading: false,
  });

  useEffect(() => {
    setSessionIdFromSessionStorageFunction();
  }, []);

  useEffect(() => {
    if (!sessionId && !sessionDetails && isChatModalOpen) {
      createNewChatSessionHandler();
    }
  }, [isChatModalOpen]);

  useEffect(() => {
    if (sessionId && !sessionDetails) {
      fetchSessionDetails(sessionId || '68402819b144289ea3471056');
    }
  }, [sessionId]);

  const setSessionIdFromSessionStorageFunction = useCallback(() => {
    let sessionStorageId = getChatSessionId();
    if (sessionStorageId) {
      setSessionIdAction(sessionStorageId);
    }
  }, [sessionId]);

  const fetchSessionDetails = useCallback(
    async (sessionId) => {
      if (info?.loading) return;
      setInfo((prev) => ({
        ...prev,
        loading: true,
      }));

      let details = {
        loading: false,
      };

      const response = await fetchSessionDetailsAction(sessionId);
      if (response[2] !== 200) {
        setSessionIdAction(null);
      }
      setInfo((prev) => ({
        ...prev,
        ...details,
      }));
    },
    [sessionId, info?.loading, sessionDetails]
  );

  const createNewChatSessionHandler = useCallback(async () => {
    if (info?.loading || sessionDetails || sessionId) return;

    setInfo((prev) => ({
      ...prev,
      loading: true,
    }));

    const json = {
      userId: profileDetails?._id || null,
    };

    const response = await createChatSessionApi(json);
    if (response[2] === 201) {
      const sessionId = response[1]?.sessionId;
      setSessionIdAction(sessionId);
      updateChatAgentStateAction({
        sessionDetails: response[1]?.data,
      });
    } else {
      console.error('Failed to create new chat session:', response[1]);
    }

    setInfo((prev) => ({
      ...prev,
      loading: false,
    }));
  }, [isChatModalOpen, sessionId, info?.loading]);

  return isMobile ? (
    <MobileChatDrawer
      chatModalAction={chatModalAction}
      isOpen={isChatModalOpen || false}
      info={info}
      setInfo={setInfo}
      isMobile={isMobile}
    />
  ) : (
    <div>
      <Button
        onClick={() => chatModalAction(true)}
        className="fixed bottom-6 right-6 rounded-full shadow-lg z-10"
        size="lg"
      >
        <MessageSquareMore size={24} />
        Chat with AI
      </Button>

      {/* Chat component */}
      <ChatModel
        isOpen={isChatModalOpen || false}
        onClose={() => chatModalAction(false)}
        info={info}
        setInfo={setInfo}
        isMobile={isMobile}
      />
    </div>
  );
};

export default memo(ChatComponent);
