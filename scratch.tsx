import React, { useRef } from 'react';
const Tag: React.ElementType = 'a';
const App = () => {
  const capRef = useRef<HTMLElement>(null);
  return <Tag ref={capRef as React.RefObject<HTMLButtonElement & HTMLAnchorElement>} />;
};
