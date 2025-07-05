import React, { memo } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { MessageSquareMore } from 'lucide-react';
import ChatModel from './ChatModel';

const MobileChatDrawer = ({ chatModalAction, isOpen, info, setInfo, isMobile }) => {
  return (
    <Drawer direction="bottom" className="md:hidden">
      <DrawerTrigger asChild>
        <Button
          onClick={() => chatModalAction(true)}
          className="fixed bottom-6 right-6 rounded-full shadow-lg z-10"
          size="lg"
        >
          <MessageSquareMore size={24} />
          Chat with AI
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh]">
        <DrawerTitle className="hidden">Chat with AI Assistant</DrawerTitle>
        <ChatModel
          isOpen={isOpen || false}
          onClose={() => chatModalAction(false)}
          info={info}
          setInfo={setInfo}
          isMobile={isMobile}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default memo(MobileChatDrawer);
