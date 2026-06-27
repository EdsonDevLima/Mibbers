"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponMapper = void 0;
const coupon_1 = require("../../infrastructure/database/orm-entities/coupon");
const coupon_2 = require("../entities/coupon");
class CouponMapper {
    static toDomain(entity) {
        const coupon = new coupon_2.Coupon({
            discountType: entity.discountType,
            discountValue: entity.discountValue,
            minimumPurchaseAmount: entity.minimumValue,
            expiresAt: entity.expireOnData,
            usageLimit: entity.usageLimit,
            code: entity.couponCode,
            status: entity.status,
        });
        return coupon;
    }
    static toPersistence(domain) {
        const entity = new coupon_1.Coupon();
        entity.discountType = domain.discountType;
        entity.minimumValue = domain.minimumValue;
        entity.expireOnData = domain.expireOnData;
        entity.usageLimit = domain.usageLimit;
        entity.couponCode = domain.couponCode;
        entity.status = domain.status;
        return entity;
    }
}
exports.CouponMapper = CouponMapper;
