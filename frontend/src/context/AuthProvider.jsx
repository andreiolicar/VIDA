import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  // Receber token como parâmetro opcional
  const login = (userData, userToken = null) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    // Usar token passado como parâmetro ou buscar do localStorage
    const tokenToUse = userToken || localStorage.getItem('token');
    if (tokenToUse) {
      localStorage.setItem('token', tokenToUse);
      setToken(tokenToUse);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}