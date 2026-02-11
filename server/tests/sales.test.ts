import { describe, expect, it } from 'vitest';

describe('sales totals', () => {
  it('calculates subtotal, tax and total', () => {
    const subtotal = 500;
    const discount = 25;
    const taxPercent = 19;
    const tax = ((subtotal - discount) * taxPercent) / 100;
    const total = subtotal - discount + tax;

    expect(tax).toBe(90.25);
    expect(total).toBe(565.25);
  });
});
