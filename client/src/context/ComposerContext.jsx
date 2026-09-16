import { createContext, useContext, useState } from 'react';

const ComposerContext = createContext();

export const ComposerProvider = ({ children }) => {
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const openComposer = () => setIsComposerOpen(true);
  const closeComposer = () => setIsComposerOpen(false);

  return (
    <ComposerContext.Provider value={{ isComposerOpen, openComposer, closeComposer }}>
      {children}
    </ComposerContext.Provider>
  );
};

export const useComposer = () => useContext(ComposerContext);
