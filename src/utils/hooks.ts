import { useEffect, useState, useCallback, useLayoutEffect, useRef } from "react";

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

export const useKeyPress = (keys: any, specialKey: string, callback: any, node = null) => {
  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event: any) => {
      // event.preventDefault()
      // check if one of the key is part of the ones we want
      if (keys.some((key: any) => event.key === key) && (specialKey && event[specialKey] === true || specialKey == "")) {
        event.preventDefault()
        callbackRef.current(event);
      }
    },
    [keys]
  );

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document;
    // attach the event listener
    targetNode &&
      targetNode.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () =>
      targetNode && targetNode.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress, node]);
};
