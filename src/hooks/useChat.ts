
import { useCase } from '../contexts/CaseContext';

export const useChat = () => {
  const { currentCase, sendMessage, loading } = useCase();

  const send = async (message: string) => {
    if (!currentCase) return;
    await sendMessage(currentCase.id, message);
  };

  return {
    messages: currentCase?.messages || [],
    send,
    loading,
  };
};
