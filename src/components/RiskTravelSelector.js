import React, { useState, useCallback } from 'react';
import './RiskTravelSelector.css';

const COLORS = {
  primary: '#2563EB',
  primaryLight: '#DBEAFE',
  secondary: '#4B5563',
  success: '#059669',
  border: '#E5E7EB',
  text: '#1F2937',
  textSecondary: '#6B7280',
  background: '#F9FAFB',
  white: '#FFFFFF',
  shadow: '#000000',
  danger: '#DC2626',
};

const CustomSelect = ({ options, placeholder, onSelect, label, multiple = false }) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = useCallback(
    (item) => {
      if (multiple) {
        setSelectedValues((prev) => {
          const isSelected = prev.some((i) => i.value === item.value);
          if (isSelected) {
            return prev.filter((i) => i.value !== item.value);
          }
          return [...prev, item];
        });
      } else {
        setSelectedValues([item]);
        setShowDropdown(false);
        if (onSelect) {
          onSelect(item);
        }
      }
    },
    [multiple, onSelect]
  );

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className="custom-select-container">
      {label && <label className="select-label">{label}</label>}
      <div className="select-button" onClick={toggleDropdown}>
        <span
          className={`select-button-text ${!selectedValues.length ? 'placeholder-text' : ''}`}
        >
          {selectedValues.length
            ? selectedValues.map((v) => v.label).join(', ')
            : placeholder}
        </span>
        <span className="arrow-icon">▼</span>
      </div>

      {showDropdown && (
        <div className="dropdown-menu">
          <div className="dropdown-content">
            {options.map((item) => {
              const isSelected = selectedValues.some((i) => i.value === item.value);
              return (
                <div
                  key={item.value}
                  className={`option ${isSelected ? 'option-selected' : ''}`}
                  onClick={() => handleSelect(item)}
                >
                  <span className={`option-text ${isSelected ? 'option-text-selected' : ''}`}>
                    {item.label}
                  </span>
                  {isSelected && <span className="check-icon">✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const RiskTravelSelector = ({
  selectedRiskFactors,
  handleSelectRiskFactors,
  travelRegion,
  setTravelRegion,
  riskFactorWeights,
  travelRiskFactors,
}) => {
  const capitalizeWords = (str) =>
    str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  const riskFactorItems = Object.keys(riskFactorWeights || {}).map((risk) => ({
    label: capitalizeWords(risk),
    value: risk,
  }));

  const travelRegionItems = Object.keys(travelRiskFactors || {}).map((region) => ({
    label: region,
    value: region,
  }));

  return (
    <div className="selector-container">
      <CustomSelect
        options={riskFactorItems}
        placeholder="Select health factors..."
        onSelect={handleSelectRiskFactors}
        label="Health Risk Factors"
        multiple={true}
      />
      <div className="spacing" />
      <CustomSelect
        options={travelRegionItems}
        placeholder="Select travel region..."
        onSelect={setTravelRegion}
        label="Travel Region"
      />
    </div>
  );
};

export default RiskTravelSelector;
