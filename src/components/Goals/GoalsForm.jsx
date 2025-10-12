import React, { useState } from 'react';
import { goalsService } from '../../services/api';

const GoalsForm = ({ currentSession = 1, onGoalAdded }) => {
  const [text, setText] = useState('');
  const [setNumber, setSetNumber] = useState(currentSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Por favor escribe un objetivo');
      return;
    }

    if (text.length > 200) {
      setError('El objetivo no puede tener más de 200 caracteres');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await goalsService.create({
        text: text.trim(),
        setNumber: parseInt(setNumber)
      });
      
      setText('');
      if (onGoalAdded) onGoalAdded();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Error al crear objetivo';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
      <div style={{ marginBottom: '12px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: 'white'
        }}>
          Nuevo Objetivo
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ej: Leer capítulo 3..."
          disabled={loading}
          maxLength={200}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            outline: 'none'
          }}
        />
        <div style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.7)',
          marginTop: '4px',
          textAlign: 'right'
        }}>
          {text.length}/200
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: 'white'
        }}>
          Sesión
        </label>
        <select
          value={setNumber}
          onChange={(e) => setSetNumber(e.target.value)}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          <option value={1} style={{ color: '#000' }}>Sesión 1</option>
          <option value={2} style={{ color: '#000' }}>Sesión 2</option>
          <option value={3} style={{ color: '#000' }}>Sesión 3</option>
          <option value={4} style={{ color: '#000' }}>Sesión 4</option>
        </select>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '8px 12px',
          borderRadius: '6px',
          marginBottom: '12px',
          fontSize: '13px'
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !text.trim()}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: loading || !text.trim() ? 'rgba(255, 255, 255, 0.2)' : '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: loading || !text.trim() ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Agregando...' : '+ Agregar Objetivo'}
      </button>
    </form>
  );
};

export default GoalsForm;