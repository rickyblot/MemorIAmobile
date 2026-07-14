
import React, { createContext, useContext, useState, useEffect } from 'react';

const DeviceDetectionContext = createContext();

export const useDeviceDetection = () => {
  const context = useContext(DeviceDetectionContext);
  if (!context) {
    throw new Error('useDeviceDetection must be used within DeviceDetectionProvider');
  }
  return context;
};

export const DeviceDetectionProvider = ({ children }) => {
  const [deviceType, setDeviceType] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      
      setDeviceType({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    detectDevice();

    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  return (
    <DeviceDetectionContext.Provider value={deviceType}>
      {children}
    </DeviceDetectionContext.Provider>
  );
};
