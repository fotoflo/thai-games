// New file: src/components/layout/WhiteDivider.jsx
import React from 'react';

const Divider = ({className, borderClass = 'white' }) => {
  return (
    <div className={`border-t ${borderClass} my-2 ${className}`} />
  );
};

export default Divider;