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
      console.log('Enviando petición a:', `https://conversor-backend.vercel.app${endpoint}`);
      console.log('Datos:', { amount: Number(amount) });
      
      const response = await axios.post(`https://conversor-backend.vercel.app${endpoint}`, {
        amount: Number(amount)
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 segundos de timeout
      });

      console.log('Respuesta recibida:', response.data);
      const conversionResult = response.data;
      setResult(conversionResult);
      onConversion(conversionResult);
    } catch (err: any) {
      console.error('Error en la conversión:', err);
      
      if (err.code === 'ECONNABORTED') {
        setError('Timeout: El servidor tardó demasiado en responder');
      } else if (err.response) {
        // El servidor respondió con un error
        setError(err.response?.data?.error || `Error del servidor: ${err.response.status}`);
      } else if (err.request) {
        // La petición se hizo pero no hubo respuesta
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      } else {
        // Error en la configuración de la petición
        setError('Error en la petición: ' + err.message);
      }
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
            value={amount}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Ingresa cantidad"
            disabled={loading}
            className="converter-input"
          />
          <span className="unit-label">{fromUnit}</span>
        </div>
        
        <button 
          onClick={handleConvert}
          disabled={loading || !amount}
          className="convert-button"
        >
          {loading ? '🔄 Convirtiendo...' : '🔄 Convertir'}
        </button>
        
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}
        
        {result && (
          <div className="result-display">
            <div className="result-value">
              <strong>{result.result} {result.to}</strong>
            </div>
            {result.rate && (
              <div className="result-rate">
                Tasa: 1 {result.from} = {result.rate} {result.to}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConverterCard;