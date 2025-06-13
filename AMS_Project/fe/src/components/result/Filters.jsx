import React, { useState } from "react";

const Filters = ({ onFilterChange, flightCount }) => {
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [durationRange, setDurationRange] = useState(null); // null means no duration filter

  // Handle airline checkbox changes
  const handleAirlineChange = (airline) => {
    const updatedAirlines = selectedAirlines.includes(airline)
      ? selectedAirlines.filter((item) => item !== airline)
      : [...selectedAirlines, airline];
    setSelectedAirlines(updatedAirlines);
    onFilterChange({ airlines: updatedAirlines, durationRange });
  };

  // Handle duration radio button changes
  const handleDurationChange = (range) => {
    const newDurationRange = range === "all" ? null : JSON.parse(range);
    setDurationRange(newDurationRange);
    onFilterChange({ airlines: selectedAirlines, durationRange: newDurationRange });
  };

  return (
    <div className="filters">
      <h3>Filter your results</h3>
      <p>Showing {flightCount} flights</p>
      <div className="filter-section">
        <h4>Airlines</h4>
        <label>
          <input
            type="checkbox"
            checked={selectedAirlines.includes("VietJet")}
            onChange={() => handleAirlineChange("VietJet")}
          />
          VietJet
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedAirlines.includes("Vietnam Airlines")}
            onChange={() => handleAirlineChange("Vietnam Airlines")}
          />
          Vietnam Airlines
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedAirlines.includes("Bamboo Airways")}
            onChange={() => handleAirlineChange("Bamboo Airways")}
          />
          Bamboo Airways
        </label>
      </div>
      <div className="filter-section">
        <h4>Flight Duration</h4>
        <label>
          <input
            type="checkbox"
            name="duration"
            value="all"
            checked={durationRange === null}
            onChange={() => handleDurationChange("all")}
          />
          All durations
        </label>
        <label>
          <input
            type="checkbox"
            name="duration"
            value='{"min":30,"max":60}'
            checked={durationRange?.min === 30 && durationRange?.max === 60}
            onChange={() => handleDurationChange('{"min":30,"max":60}')}
          />
          30–60 minutes
        </label>
        <label>
          <input
            type="checkbox"
            name="duration"
            value='{"min":60,"max":90}'
            checked={durationRange?.min === 60 && durationRange?.max === 90}
            onChange={() => handleDurationChange('{"min":60,"max":90}')}
          />
          60–90 minutes
        </label>
        <label>
          <input
            type="checkbox"
            name="duration"
            value='{"min":90,"max":120}'
            checked={durationRange?.min === 90 && durationRange?.max === 120}
            onChange={() => handleDurationChange('{"min":90,"max":120}')}
          />
          90–120 minutes
        </label>
      </div>
    </div>
  );
};

export default Filters;