"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AiSearchModalContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const AiSearchModalContext = createContext<AiSearchModalContextType | undefined>(undefined);

export function AiSearchModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return React.createElement(AiSearchModalContext.Provider, {
    value: { isOpen, openModal, closeModal }
  }, children);
}

export function useAiSearchModal() {
  const context = useContext(AiSearchModalContext);
  if (context === undefined) {
    throw new Error('useAiSearchModal must be used within an AiSearchModalProvider');
  }
  return context;
}
