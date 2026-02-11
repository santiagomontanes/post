import { FormEvent, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@sistetecni.local');
  const [password, setPassword] = useState('Admin123*');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Si ya existe sesión, redirigir automáticamente
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      navigate('/');
    }
  }, [navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/'); // Ir al Dashboard
    } catch (err) {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <form onSubmit={onSubmit} className="card">
        <h1>Ingreso al POS</h1>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          type="password"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Entrar'}
        </button>

        {error && <span style={{ color: 'red' }}>{error}</span>}
      </form>
    </div>
  );
};
