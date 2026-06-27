"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = void 0;
class Coupon {
    constructor(counpon) {
        this.discountType = counpon.discountType;
        this.discountValue = counpon.discountValue;
        this.minimumValue = counpon.minimumPurchaseAmount;
        this.expireOnData = counpon.expiresAt;
        this.usageLimit = counpon.usageLimit;
        this.couponCode = counpon.code;
        this.status = counpon.status;
    }
    isExpired() {
        return this.expireOnData <= new Date();
    }
    validateUsageLimit() {
        return this.usageLimit <= 0;
    }
    validateMinimumPurchase(value) {
        return value >= this.minimumValue;
    }
    isActive() {
        return this.status == 'active' ? true : false;
    }
    calcCounpon(productsList) {
        //soma todos os produtos do pedido
        const total = productsList.reduce((acc, product) => acc + product.price, 0);
        if (this.discountType == 'percentage') {
            const discount = total * (this.discountValue / 100);
            return {
                originalValue: total,
                discount: discount,
                finalValue: total - discount,
            };
        }
        else {
            return {
                originalValue: total,
                discount: this.discountValue,
                finalValue: total - this.discountValue,
            };
        }
    }
}
exports.Coupon = Coupon;
