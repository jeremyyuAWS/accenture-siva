import React from 'react';
import { useAppContext } from '../context/AppContext';
import EnhancedAIChat from '../components/EnhancedAIChat';

const AiChat: React.FC = () => {
  const { currentUser, chatMessages, sendChatMessage } = useAppContext();

  return (
    <EnhancedAIChat />
  );
};

export default AiChat;