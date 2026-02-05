import React, { useState } from 'react';
import './Login.css';
import { setAuthToken } from './utils/auth';

const Login = ({ onLoginSuccess }) => {
  // Strings con acentos y ñ usando fromCharCode (garantizado funciona)
  const sLogin = 'Iniciar Sesi' + String.fromCharCode(243) + 'n'; // ó = 243
  const sPassword = 'Contrase' + String.fromCharCode(241) + 'a'; // ñ = 241
  const sMinPass = 'M' + String.fromCharCode(237) + 'nimo 6 caracteres'; // í = 237
  const sGestion = 'Gesti' + String.fromCharCode(243) + 'n';
  const sAppName = 'Gesti' + String.fromCharCode(243) + 'n Lubrimec';
  const sConexion = 'conexi' + String.fromCharCode(243) + 'n';
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    nombre_completo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const APEX_AUTH_URL = 'https://oracleapex.com/ords/josegalvez/login/auth/login';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Enviar con JSON en el body (seguro)
      const response = await fetch(APEX_AUTH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Guardar token con expiración
        setAuthToken(data.token, data.expiresIn);
        
        localStorage.setItem('userData', JSON.stringify({
          username: formData.username,
          nombre: formData.username
        }));
        
        // Llamar callback de exito
        onLoginSuccess({ username: formData.username, nombre: formData.username }, data.token);
      } else {
        setError(data.message || 'Error al ' + sLogin.toLowerCase());
      }
    } catch (err) {
      setError('Error de ' + sConexion + '. Verifica tu API de APEX.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-card">
          <div className="login-header">
            <h1>{sAppName}</h1>
          </div>

          <div className="login-tabs">
            <button
              className={isLogin ? 'tab active' : 'tab'}
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
            >
              {sLogin}
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {isLogin && (
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label>Usuario</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Ingresa tu usuario"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label>{sPassword}</label>
                <input
                  type="password"
                  name="password"
                  placeholder={'Ingresa tu ' + sPassword}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Iniciando ' + sLogin.toLowerCase() + '...' : sLogin}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
