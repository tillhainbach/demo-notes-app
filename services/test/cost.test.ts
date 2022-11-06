import { describe, expect, it } from 'vitest';
import { calculateCost } from '../util/cost';

describe('Billing', () => {
  it('charges lowest tier correctly', () => {
    expect(calculateCost(10)).toEqual(4000);
  });
  it('charges middle tier correctly', () => {
    expect(calculateCost(100)).toEqual(20000);
  });
  it('charges highest tier correctly', () => {
    expect(calculateCost(101)).toEqual(10100);
  });
});
