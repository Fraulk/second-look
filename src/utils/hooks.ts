import { useEffect, useState } from "react";

export const useViewport = () => {
    const actualWidth = document.documentElement.clientWidth || document.body.clientWidth;
    const [width, setWidth] = useState(actualWidth);
  
    const onWindowLoad = () => {
      const actualWidth = document.documentElement.clientWidth || document.body.clientWidth;
      setWidth(actualWidth);
    }
  
    useEffect(() => {
      let resizeTimeout: any;
      window.setTimeout(onWindowLoad, 1000);
      const handleWindowResize = () => {
        const windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => setWidth(windowWidth), 50);
      };
      window.addEventListener('resize', handleWindowResize);
      return () => window.removeEventListener('resize', handleWindowResize);
    }, []);
  
    // Return the width so we can use it in our components
    return { width };
  };