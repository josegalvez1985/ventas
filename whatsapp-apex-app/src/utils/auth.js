// Utilidades para manejo de JWT con expiración

export const setAuthToken = (token, expiresIn) => {
  const expiresAt = new Date().getTime() + (expiresIn * 1000);
  localStorage.setItem('authToken', token);
  localStorage.setItem('tokenExpiresAt', expiresAt);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const isTokenExpired = () => {
  const expiresAt = localStorage.getItem('tokenExpiresAt');
  if (!expiresAt) return true;
  
  return new Date().getTime() > parseInt(expiresAt);
};

export const getTimeUntilExpiration = () => {
  const expiresAt = localStorage.getItem('tokenExpiresAt');
  if (!expiresAt) return 0;
  
  const timeLeft = parseInt(expiresAt) - new Date().getTime();
  return Math.max(0, Math.floor(timeLeft / 1000)); // en segundos
};

export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('tokenExpiresAt');
  localStorage.removeItem('userData');
};

export const isAuthenticated = () => {
  return getAuthToken() && !isTokenExpired();
};
