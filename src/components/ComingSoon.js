import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ComingSoon.css';

const VinLookup = () => {
  const [vin, setVin] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const debounceTimeout = 500; // Debounce delay in ms
  const [debouncedVin, setDebouncedVin] = useState(vin);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedVin(vin);
    }, debounceTimeout);

    return () => {
      clearTimeout(handler);
    };
  }, [vin]);

  useEffect(() => {
    if (debouncedVin) {
      setLoading(true);
      axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${debouncedVin}?format=json`)
        .then((response) => {
          const vehicleData = response.data.Results[0];
          setResult({
            Brand: vehicleData.Make,
            Model: vehicleData.Model,
            TransmissionStyle: vehicleData.TransmissionStyle,
            ModelYear: vehicleData.ModelYear,
            Series: vehicleData.Series,
            PlantCountry: vehicleData.PlantCountry,
            EngineModel: vehicleData.EngineModel,
            EngineCylinders: vehicleData.EngineCylinders,
            EngineHP: vehicleData.EngineHP,
            Seats: vehicleData.Seats,
          });
          setError(null);
        })
        .catch((error) => {
          setError(error.response ? error.response.data : 'Error occurred');
          setResult(null);
        })
        .finally(() => setLoading(false));
    }
  }, [debouncedVin]);

  return (
    <div className="vin-lookup-container">
      <div className="title">AutoComplete via VIN</div>
      <input
        type="text"
        className="vin-input"
        placeholder="Enter VIN"
        value={vin}
        onChange={(e) => setVin(e.target.value)}
      />
      {loading && <div className="loader">Loading...</div>}

      {result && !loading && (
        <div className="result-container">
          {/*<h3>Vehicle Details:</h3>*/}
          <div className="result-fields">
            {Object.entries(result).map(([key, value]) => (
              <div className="field-group" key={key}>
                <label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type="text"
                  id={key}
                  value={value || 'N/A'}
                  readOnly
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default VinLookup;
