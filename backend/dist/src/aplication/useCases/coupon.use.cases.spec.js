"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const coupon_use_cases_1 = require("./coupon.use.cases");
const counpon_types_1 = require("../../domain/types/counpon.types");
const coupon_1 = require("../../domain/entities/coupon");
const coupon_2 = require("../../infrastructure/database/orm-entities/coupon");
const globals_1 = require("@jest/globals");
globals_1.jest.mock('../../infrastructure/database/connection', () => ({
    connectionDb: {
        getRepository: globals_1.jest.fn().mockReturnValue({
            findOne: globals_1.jest.fn(),
            update: globals_1.jest.fn(),
        }),
    },
}));
globals_1.jest.mock('../../domain/mappers/coupon.mapper');
const coupon_mapper_1 = require("../../domain/mappers/coupon.mapper");
const connection_1 = require("../../infrastructure/database/connection");
const getRepository = () => connection_1.connectionDb.getRepository(coupon_2.Coupon);
const products = [
    { tittle: 'Produto A', description: 'desc', price: 200, amount: 1 },
    { tittle: 'Produto B', description: 'desc', price: 100, amount: 1 },
];
const makeCoupon = (overrides = {}) => new coupon_1.Coupon(Object.assign({ code: 'TEST', discountType: counpon_types_1.Etype.PERCENTAGE, discountValue: 10, minimumPurchaseAmount: 0, expiresAt: new Date('2099-12-31'), usageLimit: 100, status: counpon_types_1.ECouponStatus.ACTIVE }, overrides));
(0, globals_1.describe)('CounponUseCases - ApplyCoupon', () => {
    let useCase;
    (0, globals_1.beforeEach)(() => {
        useCase = new coupon_use_cases_1.CounponUseCases();
        globals_1.jest
            .mocked(getRepository().findOne)
            .mockResolvedValue({ couponCode: 'MOCK' });
        globals_1.jest
            .mocked(getRepository().update)
            .mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });
    });
    (0, globals_1.it)('retorna erro quando cupom não existe', () => __awaiter(void 0, void 0, void 0, function* () {
        globals_1.jest.mocked(coupon_mapper_1.CouponMapper.toDomain).mockReturnValue(null);
        const result = yield useCase.ApplyCoupon({
            couponCode: 'INVALIDO',
            productsList: products,
        });
        (0, globals_1.expect)(result).toEqual({ success: false, message: 'cupom inexistente.' });
    }));
    (0, globals_1.it)('retorna erro quando cupom está inativo', () => __awaiter(void 0, void 0, void 0, function* () {
        globals_1.jest
            .mocked(coupon_mapper_1.CouponMapper.toDomain)
            .mockReturnValue(makeCoupon({ status: counpon_types_1.ECouponStatus.INACTIVE }));
        const result = yield useCase.ApplyCoupon({
            couponCode: 'INATIVO',
            productsList: products,
        });
        (0, globals_1.expect)(result).toEqual({ success: false, message: 'cupom inativo.' });
    }));
    (0, globals_1.describe)('cupom expirado', () => {
        (0, globals_1.it)('retorna erro com cupom de porcentagem expirado', () => __awaiter(void 0, void 0, void 0, function* () {
            globals_1.jest.mocked(coupon_mapper_1.CouponMapper.toDomain).mockReturnValue(makeCoupon({
                discountType: counpon_types_1.Etype.PERCENTAGE,
                expiresAt: new Date('2000-01-01'),
            }));
            const result = yield useCase.ApplyCoupon({
                couponCode: 'EXPIRADO',
                productsList: products,
            });
            (0, globals_1.expect)(result).toEqual({ success: false, message: 'cupom inativo.' });
        }));
        (0, globals_1.it)('retorna erro com cupom de valor fixo expirado', () => __awaiter(void 0, void 0, void 0, function* () {
            globals_1.jest.mocked(coupon_mapper_1.CouponMapper.toDomain).mockReturnValue(makeCoupon({
                discountType: counpon_types_1.Etype.FIXED,
                discountValue: 50,
                expiresAt: new Date('2000-01-01'),
            }));
            const result = yield useCase.ApplyCoupon({
                couponCode: 'EXPIRADO_FIXO',
                productsList: products,
            });
            (0, globals_1.expect)(result).toEqual({ success: false, message: 'cupom inativo.' });
        }));
    });
    (0, globals_1.describe)('cupom esgotado (usageLimit <= 0)', () => {
        (0, globals_1.it)('retorna erro com cupom de porcentagem esgotado', () => __awaiter(void 0, void 0, void 0, function* () {
            globals_1.jest.mocked(coupon_mapper_1.CouponMapper.toDomain).mockReturnValue(makeCoupon({
                discountType: counpon_types_1.Etype.PERCENTAGE,
                usageLimit: 0,
            }));
            const result = yield useCase.ApplyCoupon({
                couponCode: 'ESGOTADO_PERCENT',
                productsList: products,
            });
            (0, globals_1.expect)(result).toEqual({ success: false, message: 'cupom esgotado.' });
        }));
        (0, globals_1.it)('retorna erro com cupom de valor fixo esgotado', () => __awaiter(void 0, void 0, void 0, function* () {
            globals_1.jest.mocked(coupon_mapper_1.CouponMapper.toDomain).mockReturnValue(makeCoupon({
                discountType: counpon_types_1.Etype.FIXED,
                discountValue: 50,
                usageLimit: 0,
            }));
            const result = yield useCase.ApplyCoupon({
                couponCode: 'ESGOTADO_FIXO',
                productsList: products,
            });
            (0, globals_1.expect)(result).toEqual({ success: false, message: 'cupom esgotado.' });
        }));
    });
    (0, globals_1.describe)('valor mínimo não atingido', () => {
        (0, globals_1.it)('retorna erro com cupom de porcentagem e valor abaixo do mínimo', () => __awaiter(void 0, void 0, void 0, function* () {
            globals_1.jest.mocked(coupon_mapper_1.CouponMapper.toDomain).mockReturnValue(makeCoupon({
                discountType: counpon_types_1.Etype.PERCENTAGE,
                minimumPurchaseAmount: 1000,
            }));
            const result = yield useCase.ApplyCoupon({
                couponCode: 'DESCONTO10',
                productsList: products,
            });
            (0, globals_1.expect)(result).toEqual({
                success: false,
                message: 'O valor mínimo para utilizar este cupom não foi atingido.',
            });
        }));
        (0, globals_1.it)('retorna erro com cupom fixo e valor abaixo do mínimo', () => __awaiter(void 0, void 0, void 0, function* () {
            globals_1.jest.mocked(coupon_mapper_1.CouponMapper.toDomain).mockReturnValue(makeCoupon({
                discountType: counpon_types_1.Etype.FIXED,
                discountValue: 50,
                minimumPurchaseAmount: 1000,
            }));
            const result = yield useCase.ApplyCoupon({
                couponCode: 'FIXO50',
                productsList: products,
            });
            (0, globals_1.expect)(result).toEqual({
                success: false,
                message: 'O valor mínimo para utilizar este cupom não foi atingido.',
            });
        }));
    });
    (0, globals_1.describe)('aplicação com sucesso - com limite de uso', () => {
        (0, globals_1.it)('aplica cupom de porcentagem com limite e retorna valores corretos', () => __awaiter(void 0, void 0, void 0, function* () {
            globals_1.jest.mocked(coupon_mapper_1.CouponMapper.toDomain).mockReturnValue(makeCoupon({
                discountType: counpon_types_1.Etype.PERCENTAGE,
                discountValue: 10,
                usageLimit: 5,
            }));
            const result = yield useCase.ApplyCoupon({
                couponCode: 'DESCONTO10',
                productsList: products,
            });
            (0, globals_1.expect)(result).toEqual({
                success: true,
                message: 'Cupom aplicado com sucesso.',
                originalValue: 300,
                discount: 30,
                finalValue: 270,
            });
        }));
        (0, globals_1.it)('aplica cupom fixo com limite e retorna valores corretos', () => __awaiter(void 0, void 0, void 0, function* () {
            globals_1.jest.mocked(coupon_mapper_1.CouponMapper.toDomain).mockReturnValue(makeCoupon({
                discountType: counpon_types_1.Etype.FIXED,
                discountValue: 50,
                usageLimit: 5,
            }));
            const result = yield useCase.ApplyCoupon({
                couponCode: 'FIXO50',
                productsList: products,
            });
            (0, globals_1.expect)(result).toEqual({
                success: true,
                message: 'Cupom aplicado com sucesso.',
                originalValue: 300,
                discount: 50,
                finalValue: 250,
            });
        }));
    });
    (0, globals_1.describe)('aplicação com sucesso - sem limite de uso', () => {
        (0, globals_1.it)('aplica cupom de porcentagem sem limite', () => __awaiter(void 0, void 0, void 0, function* () {
            globals_1.jest.mocked(coupon_mapper_1.CouponMapper.toDomain).mockReturnValue(makeCoupon({
                discountType: counpon_types_1.Etype.PERCENTAGE,
                discountValue: 20,
                usageLimit: 999,
            }));
            const result = yield useCase.ApplyCoupon({
                couponCode: 'DESCONTO20',
                productsList: products,
            });
            (0, globals_1.expect)(result).toEqual({
                success: true,
                message: 'Cupom aplicado com sucesso.',
                originalValue: 300,
                discount: 60,
                finalValue: 240,
            });
        }));
        (0, globals_1.it)('aplica cupom fixo sem limite', () => __awaiter(void 0, void 0, void 0, function* () {
            globals_1.jest.mocked(coupon_mapper_1.CouponMapper.toDomain).mockReturnValue(makeCoupon({
                discountType: counpon_types_1.Etype.FIXED,
                discountValue: 100,
                usageLimit: 999,
            }));
            const result = yield useCase.ApplyCoupon({
                couponCode: 'FIXO100',
                productsList: products,
            });
            (0, globals_1.expect)(result).toEqual({
                success: true,
                message: 'Cupom aplicado com sucesso.',
                originalValue: 300,
                discount: 100,
                finalValue: 200,
            });
        }));
    });
});
