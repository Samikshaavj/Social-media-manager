import { createContext, useContext, useState } from 'react';

const ComposerContext = createContext();

export const ComposerProvider = ({ children }) => {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [initialScheduleDate, setInitialScheduleDate] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const openComposer = (defaultDate = null) => {
    setInitialScheduleDate(defaultDate);
    setIsComposerOpen(true);
  };
  const closeComposer = () => {
    setIsComposerOpen(false);
    setInitialScheduleDate(null);
  };
  const notifyPostCreated = () => setRefreshTrigger(prev => prev + 1);

  return (
    <ComposerContext.Provider value={{ 
      isComposerOpen, 
      openComposer, 
      closeComposer, 
      initialScheduleDate,
      refreshTrigger, 
      notifyPostCreated 
    }}>
      {children}
    </ComposerContext.Provider>
  );
};

export const useComposer = () => useContext(ComposerContext);
