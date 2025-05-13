import React from 'react';
import './CustomButton.css';

const CustomButton = ({ title, onPress, color, disabled }) => {
  return (
    <button
      className="custom-button"
      style={{ backgroundColor: disabled ? '#94a3b8' : color }}
      onClick={onPress}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default CustomButton;
