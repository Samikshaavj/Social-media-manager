import { createContext, useContext, useState } from 'react';

const ComposerContext = createContext();

export const ComposerProvider = ({ children }) => {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const openComposer = () => setIsComposerOpen(true);
  const closeComposer = () => setIsComposerOpen(false);
  const notifyPostCreated = () => setRefreshTrigger(prev => prev + 1);

  return (
    <ComposerContext.Provider value={{ isComposerOpen, openComposer, closeComposer, refreshTrigger, notifyPostCreated }}>
      {children}
    </ComposerContext.Provider>
  );
};

export const useComposer = () => useContext(ComposerContext);
