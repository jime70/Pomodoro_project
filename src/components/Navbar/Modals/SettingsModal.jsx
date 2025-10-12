// SettingsModal.jsx - Modal de configuración completo
// TODO: Implementar modal que integre BackgroundConfig, TimeConfig y MusicConfig
import React from "react";
import BackgroundConfig from '../ConfigButton/BackgroundConfig';

const SettingsModal = ({ isOpen, onClose, onBackgroundChange }) => {
  //Si el modal no está abierto, no se muestra
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: 'flex-start',
        paddingTop: '60px',
        //paddingBottom: '60px',
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onClose} // Cerrar al hacer clic en el overlay
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "32px",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()} // Evitar cerrar al hacer clic dentro
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#1f2937",
              margin: 0,
            }}
          >
            Configuración
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "28px",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            ×
          </button>
        </div>
        <div>
          <BackgroundConfig onBackgroundChange={onBackgroundChange} />
          
          {/* Aquí van las otras configuraciones... */}
          <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '32px' }}>
            Más configuraciones próximamente...
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
