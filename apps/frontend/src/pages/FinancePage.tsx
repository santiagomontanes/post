import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api';

export const FinancePage = () => {
  const [movements, setMovements] = useState<any[]>([]);
  const [form, setForm] = useState({ type: 'EGRESO', category: 'OPERATIVO', concept: '', amount: 0 });

  const load = async () => setMovements((await api.get('/finance/movements')).data);
  useEffect(() => { load(); }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await api.post('/finance/movements', form);
    setForm({ ...form, concept: '', amount: 0 });
    load();
  };

  return (
    <div className="grid-2">
      <form onSubmit={onSubmit} className="card">
        <h3>Registrar movimiento</h3>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>INGRESO</option><option>EGRESO</option></select>
        <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Categoría" />
        <input value={form.concept} onChange={(e) => setForm({ ...form, concept: e.target.value })} placeholder="Concepto" />
        <input value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} type="number" placeholder="Monto" />
        <button>Guardar</button>
      </form>
      <section className="card"><h3>Movimientos</h3><ul>{movements.map((m)=><li key={m.id}>{m.type} - {m.category}: ${m.amount} ({new Date(m.date).toLocaleDateString()})</li>)}</ul></section>
    </div>
  );
};
