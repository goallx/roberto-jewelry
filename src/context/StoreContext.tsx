'use client'

import React, { createContext, useContext } from 'react';
import { RootStore, rootStore } from '../stores/RootStore';

const StoreContext = createContext<RootStore | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>;
};

export const useStores = (): RootStore => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStores must be used within a StoreProvider');
  }
  return context;
};
