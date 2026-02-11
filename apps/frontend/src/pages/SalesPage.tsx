import { useEffect, useState } from 'react';
import { api } from '../api';

export const SalesPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [sales, setSales] = useState<any[]>([]);

  const load = async () => {
    setProducts((await api.get('/products')).data.filter((p: any) => p.stockStatus === 'DISPONIBLE'));
    setSales((await api.get('/sales')).data);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!selected.length) return;
    await api.post('/sales', { productIds: selected, paymentMethod: 'EFECTIVO', discount: 0 });
    setSelected([]);
    load();
  };

  return (
    <div className="grid-2">
      <section className="card"><h3>Nueva venta</h3>{products.map((p)=><label key={p.id} className="touch-row"><input type="checkbox" checked={selected.includes(p.id)} onChange={()=>setSelected(selected.includes(p.id)?selected.filter(x=>x!==p.id):[...selected,p.id])}/>{p.sku} - {p.brand} {p.model} (${p.salePrice})</label>)}<button onClick={create}>Confirmar venta</button></section>
      <section className="card"><h3>Ventas recientes</h3><ul>{sales.map((s)=><li key={s.id}>{s.invoiceNumber} - ${s.total.toFixed(2)} <a href={`http://localhost:4000/api/sales/${s.id}/invoice.pdf`} target="_blank">PDF</a></li>)}</ul></section>
    </div>
  );
};
