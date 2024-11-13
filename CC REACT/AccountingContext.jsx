// src/AccountingContext.js
import React, { createContext, useState } from 'react';

export const AccountingContext = createContext();

export const AccountingProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState('accbook');
  const [items, setItems] = useState({ purchases: [], sales: [], credits: [] });
  const [finalResult, setFinalResult] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState(null); // Store phone number here

  return (
    <AccountingContext.Provider value={{ 
      activeSection, 
      setActiveSection, 
      items, 
      setItems, 
      finalResult, 
      setFinalResult,
      isAuthenticated,
      setIsAuthenticated,
      userPhoneNumber,
      setUserPhoneNumber
    }}>
      {children}
    </AccountingContext.Provider>
  );
};
