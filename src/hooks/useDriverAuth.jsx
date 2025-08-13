import { useContext } from 'react';
import { DriverAuthContext } from '../context/DriverAuthContext';

export const useDriverAuth = () => {
  const context = useContext(DriverAuthContext);
  if (context === undefined) {
    throw new Error('useDriverAuth must be used within a DriverAuthProvider');
  }
  return context;
};
