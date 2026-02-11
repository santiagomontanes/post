import { describe, expect, it } from 'vitest';

const buildSku = (brand: string, model: string, count: number) => `${brand.slice(0, 3).toUpperCase()}-${model.slice(0, 3).toUpperCase()}-${String(count).padStart(4, '0')}`;

describe('inventory sku generator', () => {
  it('should generate deterministic sku', () => {
    expect(buildSku('Dell', 'Latitude', 7)).toBe('DEL-LAT-0007');
  });
});
