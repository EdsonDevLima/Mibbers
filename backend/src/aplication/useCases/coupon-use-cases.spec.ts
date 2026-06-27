import { CounponUseCases } from './coupon-use-cases';
import { ECouponStatus, Etype } from '../../domain/types/counpon-types';
import { Coupon } from '../../domain/entities/coupon';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

jest.mock('../../infrastructure/database/connection', () => ({
  connectionDb: {
    getRepository: () => ({
      findOne: jest.fn(),
      update: jest.fn(),
    }),
  },
}));

jest.mock('../../domain/mappers/coupon.mapper');
import { CouponMapper } from '../../domain/mappers/coupon.mapper';

const products = [
  { tittle: 'Produto A', description: 'desc', price: 200, amount: 1 },
  { tittle: 'Produto B', description: 'desc', price: 100, amount: 1 },
];

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

describe('CounponUseCases - ApplyCoupon', () => {
  let useCase: CounponUseCases;

  beforeEach(() => {
    useCase = new CounponUseCases();
    jest.clearAllMocks();
  });

  it('retorna erro quando cupom não existe', async () => {
    jest.mocked(CouponMapper.toDomain).mockReturnValue(null);

    const result = await useCase.ApplyCoupon({
      counponCode: 'INVALIDO',
      productsList: products,
    });

    expect(result).toEqual({ success: false, message: 'cupom inexistente.' });
  });

  it('retorna erro quando cupom está inativo', async () => {
    jest
      .mocked(CouponMapper.toDomain)
      .mockReturnValue(makeCoupon({ status: ECouponStatus.INACTIVE }));

    const result = await useCase.ApplyCoupon({
      counponCode: 'INATIVO',
      productsList: products,
    });

    expect(result).toEqual({ success: false, message: 'cupom inativo.' });
  });

  describe('cupom expirado', () => {
    it('retorna erro com cupom de porcentagem expirado', async () => {
      jest.mocked(CouponMapper.toDomain).mockReturnValue(
        makeCoupon({
          discountType: Etype.PERCENTAGE,
          expiresAt: new Date('2000-01-01'),
        }),
      );

      const result = await useCase.ApplyCoupon({
        counponCode: 'EXPIRADO',
        productsList: products,
      });

      expect(result).toEqual({ success: false, message: 'cupom inativo.' });
    });

    it('retorna erro com cupom de valor fixo expirado', async () => {
      jest.mocked(CouponMapper.toDomain).mockReturnValue(
        makeCoupon({
          discountType: Etype.FIXED,
          discountValue: 50,
          expiresAt: new Date('2000-01-01'),
        }),
      );

      const result = await useCase.ApplyCoupon({
        counponCode: 'EXPIRADO_FIXO',
        productsList: products,
      });

      expect(result).toEqual({ success: false, message: 'cupom inativo.' });
    });
  });

  describe('cupom esgotado (usageLimit <= 0)', () => {
    it('retorna erro com cupom de porcentagem esgotado', async () => {
      jest.mocked(CouponMapper.toDomain).mockReturnValue(
        makeCoupon({
          discountType: Etype.PERCENTAGE,
          usageLimit: 0,
        }),
      );

      const result = await useCase.ApplyCoupon({
        counponCode: 'ESGOTADO_PERCENT',
        productsList: products,
      });

      expect(result).toEqual({ success: false, message: 'cupom esgotado.' });
    });

    it('retorna erro com cupom de valor fixo esgotado', async () => {
      jest.mocked(CouponMapper.toDomain).mockReturnValue(
        makeCoupon({
          discountType: Etype.FIXED,
          discountValue: 50,
          usageLimit: 0,
        }),
      );

      const result = await useCase.ApplyCoupon({
        counponCode: 'ESGOTADO_FIXO',
        productsList: products,
      });

      expect(result).toEqual({ success: false, message: 'cupom esgotado.' });
    });
  });

  describe('valor mínimo não atingido', () => {
    it('retorna erro com cupom de porcentagem e valor abaixo do mínimo', async () => {
      jest.mocked(CouponMapper.toDomain).mockReturnValue(
        makeCoupon({
          discountType: Etype.PERCENTAGE,
          minimumPurchaseAmount: 1000,
        }),
      );

      const result = await useCase.ApplyCoupon({
        counponCode: 'DESCONTO10',
        productsList: products,
      });

      expect(result).toEqual({
        success: false,
        message: 'O valor mínimo para utilizar este cupom não foi atingido.',
      });
    });

    it('retorna erro com cupom fixo e valor abaixo do mínimo', async () => {
      jest.mocked(CouponMapper.toDomain).mockReturnValue(
        makeCoupon({
          discountType: Etype.FIXED,
          discountValue: 50,
          minimumPurchaseAmount: 1000,
        }),
      );

      const result = await useCase.ApplyCoupon({
        counponCode: 'FIXO50',
        productsList: products,
      });

      expect(result).toEqual({
        success: false,
        message: 'O valor mínimo para utilizar este cupom não foi atingido.',
      });
    });
  });

  describe('aplicação com sucesso - com limite de uso', () => {
    it('aplica cupom de porcentagem com limite e retorna valores corretos', async () => {
      jest
        .mocked(CouponMapper.toDomain)
        .mockReturnValue(
          makeCoupon({
            discountType: Etype.PERCENTAGE,
            discountValue: 10,
            usageLimit: 5,
          }),
        );

      // total = 300, 10% = 30, final = 270
      const result = await useCase.ApplyCoupon({
        counponCode: 'DESCONTO10',
        productsList: products,
      });

      expect(result).toEqual({
        success: true,
        message: 'Cupom aplicado com sucesso.',
        originalValue: 300,
        discount: 30,
        finalValue: 270,
      });
    });

    it('aplica cupom fixo com limite e retorna valores corretos', async () => {
      jest
        .mocked(CouponMapper.toDomain)
        .mockReturnValue(
          makeCoupon({
            discountType: Etype.FIXED,
            discountValue: 50,
            usageLimit: 5,
          }),
        );

      // total = 300, fixo = 50, final = 250
      const result = await useCase.ApplyCoupon({
        counponCode: 'FIXO50',
        productsList: products,
      });

      expect(result).toEqual({
        success: true,
        message: 'Cupom aplicado com sucesso.',
        originalValue: 300,
        discount: 50,
        finalValue: 250,
      });
    });
  });

  describe('aplicação com sucesso - sem limite de uso', () => {
    it('aplica cupom de porcentagem sem limite', async () => {
      jest
        .mocked(CouponMapper.toDomain)
        .mockReturnValue(
          makeCoupon({
            discountType: Etype.PERCENTAGE,
            discountValue: 20,
            usageLimit: 999,
          }),
        );

      const result = await useCase.ApplyCoupon({
        counponCode: 'DESCONTO20',
        productsList: products,
      });

      expect(result).toEqual({
        success: true,
        message: 'Cupom aplicado com sucesso.',
        originalValue: 300,
        discount: 60,
        finalValue: 240,
      });
    });

    it('aplica cupom fixo sem limite', async () => {
      jest.mocked(CouponMapper.toDomain).mockReturnValue(
        makeCoupon({
          discountType: Etype.FIXED,
          discountValue: 100,
          usageLimit: 999,
        }), // ← era -1
      );

      const result = await useCase.ApplyCoupon({
        counponCode: 'FIXO100',
        productsList: products,
      });

      expect(result).toEqual({
        success: true,
        message: 'Cupom aplicado com sucesso.',
        originalValue: 300,
        discount: 100,
        finalValue: 200,
      });
    });
  });
});
