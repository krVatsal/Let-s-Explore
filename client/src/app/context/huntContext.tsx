"use client"
import React, { createContext, useState, useContext } from 'react';

const HuntContext = createContext();

export function HuntProvider({ children }) {
  const [participationData, setParticipationData] = useState(null);

  const handleSetParticipationData = (data) => {
    setParticipationData(data); 
  };

  return (
    <HuntContext.Provider value={{ participationData, setParticipationData: handleSetParticipationData }}>
      {children}
    </HuntContext.Provider>
  );
}

export function useHunt() {
  return useContext(HuntContext);
}
