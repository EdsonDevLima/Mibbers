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
exports.CounponUseCases = void 0;
const coupon_1 = require("../../infrastructure/database/orm-entities/coupon");
const connection_1 = require("../../infrastructure/database/connection");
const coupon_mapper_1 = require("../../domain/mappers/coupon.mapper");
class CounponUseCases {
    constructor() {
        this.CounponRepository = connection_1.connectionDb.getRepository(coupon_1.Coupon);
    }
    ApplyCoupon(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let responseCalc;
                const counpon = yield this.findCounpon(props.couponCode.trim());
                if (!counpon)
                    return { success: false, message: 'cupom inexistente.' };
                if (!counpon.isActive())
                    return { success: false, message: 'cupom inativo.' };
                if (counpon.isExpired())
                    return { success: false, message: 'cupom inativo.' };
                if (counpon.validateUsageLimit())
                    return { success: false, message: 'cupom esgotado.' };
                responseCalc = counpon.calcCounpon(props.productsList);
                if (!counpon.validateMinimumPurchase(responseCalc.originalValue))
                    return {
                        success: false,
                        message: 'O valor mínimo para utilizar este cupom não foi atingido.',
                    };
                counpon.usageLimit--;
                yield this.CounponRepository.update({ couponCode: counpon.couponCode }, { usageLimit: counpon.usageLimit });
                return {
                    success: true,
                    message: 'Cupom aplicado com sucesso.',
                    originalValue: responseCalc.originalValue,
                    discount: responseCalc.discount,
                    finalValue: responseCalc.finalValue,
                };
            }
            catch (error) {
                throw Error(`${error}`);
            }
        });
    }
    findCounpon(couponCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.CounponRepository.findOne({
                    where: { couponCode: couponCode },
                });
                if (!data)
                    return null;
                return coupon_mapper_1.CouponMapper.toDomain(data);
            }
            catch (error) {
                throw Error(`${error}`);
            }
        });
    }
}
exports.CounponUseCases = CounponUseCases;
