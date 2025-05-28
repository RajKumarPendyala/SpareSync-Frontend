import React, { createContext, useState, useContext } from 'react';

const SparePartsContext = createContext<any>(null);

export const SparePartsProvider = ({ children }: { children: React.ReactNode }) => {
  const [spareParts, setSpareParts] = useState([]);

  return (
    <SparePartsContext.Provider value={{ spareParts, setSpareParts }}>
      {children}
    </SparePartsContext.Provider>
  );
};

export const useSpareParts = () => useContext(SparePartsContext);
