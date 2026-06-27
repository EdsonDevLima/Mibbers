"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coupon_1 = require("./coupon");
const counpon_types_1 = require("../types/counpon.types");
const globals_1 = require("@jest/globals");
const makeCoupon = (overrides = {}) => new coupon_1.Coupon(Object.assign({ code: 'TEST', discountType: counpon_types_1.Etype.PERCENTAGE, discountValue: 10, minimumPurchaseAmount: 0, expiresAt: new Date('2099-12-31'), usageLimit: 100, status: counpon_types_1.ECouponStatus.ACTIVE }, overrides));
const products = [
    { tittle: 'Produto A', description: 'desc', price: 200, amount: 1 },
    { tittle: 'Produto B', description: 'desc', price: 100, amount: 1 },
];
(0, globals_1.describe)('Coupon - validações da entidade', () => {
    (0, globals_1.describe)('isActive()', () => {
        (0, globals_1.it)('retorna true quando cupom está ativo', () => {
            (0, globals_1.expect)(makeCoupon().isActive()).toBe(true);
        });
        (0, globals_1.it)('retorna false quando cupom está inativo', () => {
            (0, globals_1.expect)(makeCoupon({ status: counpon_types_1.ECouponStatus.INACTIVE }).isActive()).toBe(false);
        });
    });
    (0, globals_1.describe)('isExpired()', () => {
        (0, globals_1.it)('retorna false quando cupom ainda não expirou', () => {
            (0, globals_1.expect)(makeCoupon().isExpired()).toBe(false);
        });
        (0, globals_1.it)('retorna true quando cupom já expirou', () => {
            (0, globals_1.expect)(makeCoupon({ expiresAt: new Date('2000-01-01') }).isExpired()).toBe(true);
        });
    });
    (0, globals_1.describe)('validateUsageLimit()', () => {
        (0, globals_1.it)('retorna false quando cupom ainda possui usos disponíveis', () => {
            (0, globals_1.expect)(makeCoupon({ usageLimit: 10 }).validateUsageLimit()).toBe(false);
        });
        (0, globals_1.it)('retorna true quando cupom está esgotado', () => {
            (0, globals_1.expect)(makeCoupon({ usageLimit: 0 }).validateUsageLimit()).toBe(true);
        });
    });
    (0, globals_1.describe)('validateMinimumPurchase()', () => {
        (0, globals_1.it)('retorna true quando valor da compra atinge o mínimo exigido', () => {
            (0, globals_1.expect)(makeCoupon({ minimumPurchaseAmount: 100 }).validateMinimumPurchase(100)).toBe(true);
        });
        (0, globals_1.it)('retorna false quando valor da compra não atinge o mínimo exigido', () => {
            (0, globals_1.expect)(makeCoupon({ minimumPurchaseAmount: 500 }).validateMinimumPurchase(300)).toBe(false);
        });
    });
    (0, globals_1.describe)('calcCounpon()', () => {
        (0, globals_1.it)('calcula corretamente o desconto por porcentagem', () => {
            const result = makeCoupon({ discountValue: 10 }).calcCounpon(products);
            (0, globals_1.expect)(result).toEqual({
                originalValue: 300,
                discount: 30,
                finalValue: 270,
            });
        });
        (0, globals_1.it)('calcula corretamente o desconto com valor fixo', () => {
            const result = makeCoupon({
                discountType: counpon_types_1.Etype.FIXED,
                discountValue: 50,
            }).calcCounpon(products);
            (0, globals_1.expect)(result).toEqual({
                originalValue: 300,
                discount: 50,
                finalValue: 250,
            });
        });
    });
});
