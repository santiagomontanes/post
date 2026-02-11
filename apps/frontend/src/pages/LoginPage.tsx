import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@sistetecni.local');
  const [password, setPassword] = useState('Admin123*');
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="login-screen">
      <form onSubmit={onSubmit} className="card">
        <h1>Ingreso al POS</h1>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" type="password" />
        <button type="submit">Entrar</button>
        {error && <span>{error}</span>}
      </form>
    </div>
  );
};
