import { useEffect, useState } from 'react';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../api';

export const DashboardPage = () => {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    api.get('/dashboard').then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Cargando dashboard...</p>;

  return (
    <div className="grid">
      <section className="card"><h3>Ventas y utilidad</h3><ResponsiveContainer width="100%" height={240}><BarChart data={data.salesByDay}><XAxis dataKey="date" /><YAxis /><Tooltip /><Bar dataKey="total" fill="#4f46e5" /><Bar dataKey="utility" fill="#10b981" /></BarChart></ResponsiveContainer></section>
      <section className="card"><h3>Inventario por estado</h3><ResponsiveContainer width="100%" height={240}><PieChart><Pie data={data.inventory.map((x:any)=>({name:x.stockStatus, value:x._count.stockStatus}))} dataKey="value" nameKey="name" outerRadius={90} fill="#f97316" /><Tooltip /></PieChart></ResponsiveContainer></section>
    </div>
  );
};
