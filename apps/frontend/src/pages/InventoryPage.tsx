import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api';

const emptyForm = { brand: '', model: '', serial: '', cpu: '', ramGb: 8, storageType: 'SSD', storageGb: 256, screenInches: 14, resolution: '1920x1080', touch: false, batteryState: 'Buena', batteryHoursEstimate: 4, physicalState: 'A', functionalState: 'OK', purchasePrice: 200, salePrice: 300, location: 'Vitrina', warrantyMonths: 3, quantity: 1, category: 'LAPTOP' };

export const InventoryPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState<any>(emptyForm);

  const load = async () => setProducts((await api.get('/products')).data);
  useEffect(() => { load(); }, []);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    await api.post('/products', form);
    setForm(emptyForm);
    load();
  };

  return (
    <div className="grid-2">
      <form onSubmit={onCreate} className="card">
        <h3>Agregar laptop</h3>
        <div className="form-grid">{Object.entries(form).map(([key, value]) => key !== 'touch' ? <input key={key} value={String(value)} onChange={(e) => setForm({ ...form, [key]: ['ramGb','storageGb','screenInches','batteryHoursEstimate','purchasePrice','salePrice','warrantyMonths','quantity'].includes(key) ? Number(e.target.value) : e.target.value })} placeholder={key} /> : <label key={key}><input type="checkbox" checked={Boolean(value)} onChange={(e) => setForm({ ...form, touch: e.target.checked })}/> Touch</label>)}</div>
        <button>Guardar</button>
      </form>
      <section className="card">
        <h3>Inventario</h3>
        <div className="table-wrap"><table><thead><tr><th>SKU</th><th>Equipo</th><th>Estado</th><th>Precio</th></tr></thead><tbody>{products.map((p)=><tr key={p.id}><td>{p.sku}</td><td>{p.brand} {p.model}</td><td>{p.stockStatus}</td><td>${p.salePrice}</td></tr>)}</tbody></table></div>
      </section>
    </div>
  );
};
