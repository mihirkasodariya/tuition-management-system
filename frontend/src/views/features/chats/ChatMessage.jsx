import { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { X } from 'lucide-react';

export const ChatMessageSkeleton = memo(({ isAi }) => {
  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isAi ? 'bg-secondary rounded-tl-none' : 'bg-primary rounded-tr-none'
        }`}
      >
        {/* Skeleton for message content - random width to simulate different message lengths */}
        <Skeleton
          className={`h-4 rounded-full ${
            isAi ? 'bg-secondary-foreground/20' : 'bg-primary-foreground/20'
          }`}
          style={{ width: `${Math.random() * 200 + 100}px` }}
        />
        {/* Optional: Add multiple lines for longer messages */}
        <Skeleton
          className={`h-4 rounded-full mt-2 ${
            isAi ? 'bg-secondary-foreground/20' : 'bg-primary-foreground/20'
          }`}
          style={{ width: `${Math.random() * 150 + 50}px` }}
        />
      </div>
    </div>
  );
});

export const ChatMessageLoading = memo(() => {
  return (
    <div className="flex items-center space-x-2 text-muted-foreground">
      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
        <X />
      </div>
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: '0ms' }}
        ></div>
        <div
          className="w-2 h-2 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: '150ms' }}
        ></div>
        <div
          className="w-2 h-2 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: '300ms' }}
        ></div>
      </div>
    </div>
  );
});

const ChatMessage = ({ message }) => {
  const isAi = message?.role === 'ai';
  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isAi
            ? 'bg-secondary text-secondary-foreground rounded-tl-none'
            : 'bg-primary text-primary-foreground rounded-tr-none'
        }`}
      >
        <p className=" text-sm">{message?.content}</p>
      </div>
    </div>
  );
};

export default memo(ChatMessage);
