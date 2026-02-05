import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import './App.css';
import { isTokenExpired, clearAuthToken, getTimeUntilExpiration } from './utils/auth';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [connected, setConnected] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [descuento, setDescuento] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Verificar autenticaci?n al cargar
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('userData');
    
    if (savedToken && savedUser) {
      // Validar si el token est· expirado
      if (isTokenExpired()) {
        clearAuthToken();
        setIsAuthenticated(false);
        setToken(null);
        setUser(null);
      } else {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    }
  }, []);
  // Verificar expiraciÛn del token cada minuto
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenExpiration = () => {
      if (isTokenExpired()) {
        clearAuthToken();
        setIsAuthenticated(false);
        setToken(null);
        setUser(null);
        setStatusMessage('Tu sesiÛn ha expirado. Por favor inicia sesiÛn nuevamente.');
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000); // Verificar cada minuto
    return () => clearInterval(interval);
  }, [isAuthenticated]);
  // Verificar estado de conexi?n
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/status`);
        setConnected(response.data.connected);
        setQrCode(response.data.qrCode);
      } catch (error) {
        console.error('Error checking status:', error);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Manejar login exitoso
  const handleLoginSuccess = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);
  };

  // Manejar logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  // Enviar mensaje manual
  const handleSendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('');

    try {
      await axios.post(`${API_URL}/send-message`, {
        phone: phoneNumber,
        message: message
      });
      setStatusMessage('?ù Mensaje enviado correctamente');
      setPhoneNumber('');
      setMessage('');
    } catch (error) {
      setStatusMessage('?ù Error al enviar mensaje');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar descuento manual
  const handleUpdateDescuento = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('');

    // Aqu? llamar?as directamente a tu API de APEX
    try {
      const response = await axios.post('http://tu-apex-url.com/ords/apex/api/clientes/descuento', {
        telefono: clientPhone,
        descuento: parseFloat(descuento)
      });

      if (response.data.success) {
        setStatusMessage(`?ù Descuento actualizado a ${descuento}% para ${clientPhone}`);
        setClientPhone('');
        setDescuento('');
      } else {
        setStatusMessage('?ù Error al actualizar descuento');
      }
    } catch (error) {
      setStatusMessage('?ù Error de conexi?n con APEX');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isAuthenticated ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="App">
          <header className="App-header">
            <h1>?? WhatsApp + Oracle APEX Manager</h1>
            <div className="user-info">
              <span>?? {user?.nombre || user?.username}</span>
              <button onClick={handleLogout} className="btn-logout">
                ?? Salir
              </button>
            </div>
          </header>

      <div className="container">
        {/* Estado de conexi?n */}
        <div className="status-card">
          <h2>?? Estado de WhatsApp</h2>
          {!connected && qrCode ? (
            <div className="qr-section">
              <p>Escanea este c?digo QR con WhatsApp:</p>
              <img src={qrCode} alt="QR Code" className="qr-code" />
              <p className="qr-instructions">
                1. Abre WhatsApp en tu tel?fono<br />
                2. Ve a Configuraci?n ?ù Dispositivos vinculados<br />
                3. Toca "Vincular un dispositivo"<br />
                4. Escanea este c?digo
              </p>
            </div>
          ) : connected ? (
            <div className="connected-status">
              <span className="status-icon">?ù</span>
              <p>WhatsApp conectado correctamente</p>
            </div>
          ) : (
            <div className="connecting-status">
              <span className="status-icon">?ù</span>
              <p>Inicializando WhatsApp...</p>
            </div>
          )}
        </div>

        {/* Comandos disponibles */}
        <div className="info-card">
          <h2>?? Comandos para clientes</h2>
          <div className="commands-list">
            <div className="command-item">
              <code>CONSULTAR</code>
              <p>Ver informaci?n del cliente</p>
            </div>
            <div className="command-item">
              <code>DESCUENTO 15</code>
              <p>Actualizar descuento (reemplazar 15 con el %)</p>
            </div>
            <div className="command-item">
              <code>AYUDA</code>
              <p>Ver lista de comandos</p>
            </div>
          </div>
        </div>

        {/* Enviar mensaje manual */}
        <div className="action-card">
          <h2>?? Enviar Mensaje Manual</h2>
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="N?mero de tel?fono (ej: 595981234567)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={!connected || loading}
            />
            <textarea
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={!connected || loading}
              rows="4"
            />
            <button type="submit" disabled={!connected || loading}>
              {loading ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>

        {/* Actualizar descuento manual */}
        <div className="action-card">
          <h2>?? Actualizar Descuento Manual</h2>
          <form onSubmit={handleUpdateDescuento}>
            <input
              type="text"
              placeholder="N?mero de tel?fono del cliente"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Porcentaje de descuento (0-100)"
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
              min="0"
              max="100"
              step="0.01"
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar Descuento'}
            </button>
          </form>
        </div>

        {/* Mensaje de estado */}
        {statusMessage && (
          <div className={`status-message ${statusMessage.includes('?ù') ? 'success' : 'error'}`}>
            {statusMessage}
          </div>
        )}
      </div>
        </div>
      )}
    </>
  );
}

export default App;
