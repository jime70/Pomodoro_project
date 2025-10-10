import React, { useState, useEffect } from 'react';
import { goalsService } from '../../services/api';
import GoalsForm from './GoalsForm';

const GoalsList = ({ currentSession = 1 }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Cargar objetivos
  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await goalsService.getBySet(currentSession);
      setGoals(data);
      setError('');
    } catch (error) {
      console.error('Error al cargar objetivos:', error);
      setError('Error al cargar objetivos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [currentSession]);

  // Marcar como completado/no completado
  const toggleCompleted = async (goal) => {
    try {
      await goalsService.update(goal._id, { completed: !goal.completed });
      fetchGoals();
    } catch (error) {
      console.error('Error al actualizar objetivo:', error);
    }
  };

  // Iniciar edición
  const startEdit = (goal) => {
    setEditingId(goal._id);
    setEditText(goal.text);
  };

  // Guardar edición
  const saveEdit = async (id) => {
    try {
      await goalsService.update(id, { text: editText.trim() });
      setEditingId(null);
      fetchGoals();
    } catch (error) {
      console.error('Error al editar objetivo:', error);
    }
  };

  // Eliminar objetivo
  const deleteGoal = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este objetivo?')) {
      try {
        await goalsService.delete(id);
        fetchGoals();
      } catch (error) {
        console.error('Error al eliminar objetivo:', error);
      }
    }
  };

  const completedCount = goals.filter(g => g.completed).length;

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '24px',
      color: 'white',
      height: 'fit-content',
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto'
    }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '8px'
      }}>
        📋 Objetivos - Sesión {currentSession}
      </h2>
      
      <p style={{
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: '20px'
      }}>
        {completedCount} de {goals.length} completados {goals.length < 5 && `• ${5 - goals.length} disponibles`}
      </p>

      {/* Formulario para agregar objetivo */}
      <GoalsForm 
        currentSession={currentSession} 
        onGoalAdded={fetchGoals}
      />

      {/* Lista de objetivos */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando...
        </div>
      ) : error ? (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      ) : goals.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '32px 20px',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '14px'
        }}>
          No hay objetivos aún.
          <br />
          ¡Agrega tu primer objetivo arriba!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {goals.map((goal) => (
            <div
              key={goal._id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleCompleted(goal)}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              />

              {/* Texto del objetivo */}
              {editingId === goal._id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(goal._id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  autoFocus
                />
              ) : (
                <span
                  style={{
                    flex: 1,
                    fontSize: '14px',
                    textDecoration: goal.completed ? 'line-through' : 'none',
                    opacity: goal.completed ? 0.6 : 1
                  }}
                >
                  {goal.text}
                </span>
              )}

              {/* Botones de acción */}
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                {editingId === goal._id ? (
                  <>
                    <button
                      onClick={() => saveEdit(goal._id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#10b981',
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#6b7280',
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(goal)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteGoal(goal._id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: 'rgba(239, 68, 68, 0.3)',
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalsList;