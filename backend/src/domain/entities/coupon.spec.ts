import { Coupon } from './coupon';
import { ECouponStatus, Etype } from '../types/counpon-types';
import { describe, it, expect } from '@jest/globals';

const makeCoupon = (overrides = {}) =>
  new Coupon({
    code: 'TEST',
    discountType: Etype.PERCENTAGE,
    discountValue: 10,
    minimumPurchaseAmount: 0,
    expiresAt: new Date('2099-12-31'),
    usageLimit: 100,
    status: ECouponStatus.ACTIVE,
    ...overrides,
  });

const products = [
  { tittle: 'Produto A', description: 'desc', price: 200, amount: 1 },
  { tittle: 'Produto B', description: 'desc', price: 100, amount: 1 },
];

describe('Coupon - validações da entidade', () => {
  describe('isActive()', () => {
    it('retorna true quando cupom está ativo', () => {
      expect(makeCoupon().isActive()).toBe(true);
    });
    it('retorna false quando cupom está inativo', () => {
      expect(makeCoupon({ status: ECouponStatus.INACTIVE }).isActive()).toBe(
        false,
      );
    });
  });

  describe('isExpired()', () => {
    it('retorna false quando cupom ainda não expirou', () => {
      expect(makeCoupon().isExpired()).toBe(false);
    });
    it('retorna true quando cupom já expirou', () => {
      expect(
        makeCoupon({ expiresAt: new Date('2000-01-01') }).isExpired(),
      ).toBe(true);
    });
  });

  describe('validateUsageLimit()', () => {
    it('retorna false quando cupom ainda possui usos disponíveis', () => {
      expect(makeCoupon({ usageLimit: 10 }).validateUsageLimit()).toBe(false);
    });
    it('retorna true quando cupom está esgotado', () => {
      expect(makeCoupon({ usageLimit: 0 }).validateUsageLimit()).toBe(true);
    });
  });

  describe('validateMinimumPurchase()', () => {
    it('retorna true quando valor da compra atinge o mínimo exigido', () => {
      expect(
        makeCoupon({ minimumPurchaseAmount: 100 }).validateMinimumPurchase(100),
      ).toBe(true);
    });
    it('retorna false quando valor da compra não atinge o mínimo exigido', () => {
      expect(
        makeCoupon({ minimumPurchaseAmount: 500 }).validateMinimumPurchase(300),
      ).toBe(false);
    });
  });

  describe('calcCounpon()', () => {
    it('calcula corretamente o desconto por porcentagem', () => {
      const result = makeCoupon({ discountValue: 10 }).calcCounpon(products);
      expect(result).toEqual({
        originalValue: 300,
        discount: 30,
        finalValue: 270,
      });
    });
    it('calcula corretamente o desconto com valor fixo', () => {
      const result = makeCoupon({
        discountType: Etype.FIXED,
        discountValue: 50,
      }).calcCounpon(products);
      expect(result).toEqual({
        originalValue: 300,
        discount: 50,
        finalValue: 250,
      });
    });
  });
});
