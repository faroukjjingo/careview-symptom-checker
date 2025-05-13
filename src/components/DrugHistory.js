import React, { useState } from 'react';
import { drugOptions } from './DrugOptions';
import './DrugHistory.css';

const DrugHistory = ({ drugHistory = [], onAddDrug }) => {
  const [newDrug, setNewDrug] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setNewDrug(text);
    if (text.trim()) {
      const filteredOptions = drugOptions.filter((drug) =>
        drug.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filteredOptions);
    } else {
      setSuggestions([]);
    }
  };

  const handleAddDrug = (drug) => {
    const drugToAdd = drug || newDrug;
    if (drugToAdd && !drugHistory.includes(drugToAdd)) {
      onAddDrug(drugToAdd);
      setNewDrug('');
      setSuggestions([]);
    }
  };

  return (
    <div className="drug-history-container">
      <h2 className="drug-history-title">Drug History</h2>

      <ul className="drug-history-list">
        {drugHistory.map((item, index) => (
          <li key={index} className="drug-history-item">
            {item}
          </li>
        ))}
      </ul>

      <input
        className="drug-history-input"
        value={newDrug}
        onChange={handleInputChange}
        placeholder="Enter drug name"
      />

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="suggestion-item"
              onClick={() => handleAddDrug(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      <button
        className="add-drug-button"
        onClick={() => handleAddDrug()}
        disabled={!newDrug.trim()}
      >
        Add Drug
      </button>
    </div>
  );
};

export default DrugHistory;
