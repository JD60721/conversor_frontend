import React, { useState } from 'react';
import axios from 'axios';

interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate?: number;
}

interface ConverterCardProps {
  title: string;
  description: string;
  fromUnit: string;
  toUnit: string;
  endpoint: string;
  onConversion: (result: ConversionResult) => void;
}

const ConverterCard: React.FC<ConverterCardProps> = ({
  title,
  description,
  fromUnit,
  toUnit,
  endpoint,
  onConversion
}) => {
  const [amount, setAmount] = useState<string>('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleConvert = async () => {
    if (!amount || isNaN(Number(amount))) {
      setError('Por favor ingresa un número válido');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(`http://localhost:3001${endpoint}`, {
        amount: Number(amount)
      });

      const conversionResult = response.data;
      setResult(conversionResult);
      onConversion(conversionResult);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error en la conversión');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    setError('');
    setResult(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConvert();
    }
  };

  return (
    <div className="converter-card">
      <h3>{title}</h3>
      <p>{description}</p>
      
      <div className="converter-form">
        <div className="input-group">
          <input
            type="number"
            className="converter-input"
            placeholder="Ingresa la cantidad"
            value={amount}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <span className="unit-label">{fromUnit}</span>
        </div>
        
        <button
          className="convert-button"
          onClick={handleConvert}
          disabled={loading || !amount}
        >
          {loading ? <span className="loading"></span> : 'Convertir'}
        </button>
        
        {result && (
          <div className="conversion-result">
            <strong>{result.amount} {result.from}</strong>
            <br />
            = <strong>{result.result} {result.to}</strong>
            {result.rate && (
              <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
                Tasa de cambio: {result.rate}
              </div>
            )}
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConverterCard;