import React from 'react';
import './PatientData.css';

const PatientData = ({
  age,
  setAge,
  gender,
  setGender,
  severity,
  setSeverity,
  duration,
  setDuration,
  openAge,
  setOpenAge,
  openGender,
  setOpenGender,
  openSeverity,
  setOpenSeverity,
  openDuration,
  setOpenDuration,
}) => {
  const durationOptions = [
    { label: 'Short Duration', value: 'short' },
    { label: 'Medium Duration', value: 'medium' },
    { label: 'Long Duration', value: 'long' },
  ];

  const severityOptions = [
    { label: 'Mild', value: 'mild' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'Severe', value: 'severe' },
  ];

  const ageOptions = [
    { label: 'Child', value: 'child' },
    { label: 'Adult', value: 'adult' },
    { label: 'Elderly', value: 'elderly' },
  ];

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];

  const renderSelect = (value, setValue, options, open, setOpen, placeholder) => (
    <div className="select-container">
      <select
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        onClick={() => setOpen(!open)}
        className="select-dropdown"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="patient-data-container">
      {renderSelect(
        duration,
        setDuration,
        durationOptions,
        openDuration,
        setOpenDuration,
        'Select Duration'
      )}
      {renderSelect(
        severity,
        setSeverity,
        severityOptions,
        openSeverity,
        setOpenSeverity,
        'Select Severity'
      )}
      {renderSelect(age, setAge, ageOptions, openAge, setOpenAge, 'Select Age Group')}
      {renderSelect(
        gender,
        setGender,
        genderOptions,
        openGender,
        setOpenGender,
        'Select Gender'
      )}
    </div>
  );
};

export default PatientData;
