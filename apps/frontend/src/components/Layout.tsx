import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
  const { logout, user } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>Sistetecni POS</h2>
        <p>{user?.name}</p>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/inventory">Inventario</Link>
          <Link to="/sales">Ventas</Link>
          <Link to="/finance">Caja</Link>
        </nav>
        <button onClick={logout}>Cerrar sesión</button>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
