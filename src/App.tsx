import React, { useState } from 'react';
import './App.css';
import ConverterCard from './components/ConverterCard';

interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate?: number;
}

function App() {
  const [results, setResults] = useState<ConversionResult[]>([]);

  const handleConversion = (result: ConversionResult) => {
    setResults(prev => [result, ...prev.slice(0, 4)]); // Mantener solo los últimos 5 resultados
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🔄 Conversor Universal</h1>
        <p>Convierte entre diferentes unidades de manera fácil y rápida</p>
      </header>
      
      <main className="App-main">
        <div className="converters-grid">
          <ConverterCard
            title="💰 COP a USD"
            description="Peso colombiano a dólares"
            fromUnit="COP"
            toUnit="USD"
            endpoint="/api/convert/cop-to-usd"
            onConversion={handleConversion}
          />
          
          <ConverterCard
            title="📏 Metros a Centímetros"
            description="Conversión de longitud"
            fromUnit="metros"
            toUnit="centímetros"
            endpoint="/api/convert/meters-to-cm"
            onConversion={handleConversion}
          />
          
          <ConverterCard
            title="⚖️ Kilos a Libras"
            description="Conversión de peso"
            fromUnit="kg"
            toUnit="lbs"
            endpoint="/api/convert/kg-to-lbs"
            onConversion={handleConversion}
          />
          
          <ConverterCard
            title="🚗 km/h a mph"
            description="Conversión de velocidad"
            fromUnit="km/h"
            toUnit="mph"
            endpoint="/api/convert/kmh-to-mph"
            onConversion={handleConversion}
          />
        </div>

        {results.length > 0 && (
          <div className="results-section">
            <h2>📊 Últimas Conversiones</h2>
            <div className="results-list">
              {results.map((result, index) => (
                <div key={index} className="result-item">
                  <span className="result-conversion">
                    {result.amount} {result.from} = {result.result} {result.to}
                  </span>
                  {result.rate && (
                    <span className="result-rate">
                      (Tasa: {result.rate})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
