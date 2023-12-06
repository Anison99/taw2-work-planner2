import React, { createContext, useState } from 'react';

export const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
  const [isWorking, setIsWorking] = useState(false);

  return (
    <TimeContext.Provider value={{ isWorking, setIsWorking }}>
      {children}
    </TimeContext.Provider>
  );
};
