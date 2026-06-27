import {
  ECouponStatus,
  Etype,
  TCouponProps,
  TProduct,
} from '../types/counpon.types';

export class Coupon {
  discountType: Etype;
  minimumValue: number;
  discountValue: number;
  expireOnData: Date;
  usageLimit: number;
  couponCode: string;
  status: ECouponStatus;

  constructor(counpon: TCouponProps) {
    this.discountType = counpon.discountType;
    this.discountValue = counpon.discountValue;
    this.minimumValue = counpon.minimumPurchaseAmount;
    this.expireOnData = counpon.expiresAt;
    this.usageLimit = counpon.usageLimit;
    this.couponCode = counpon.code;
    this.status = counpon.status;
  }

  isExpired(): boolean {
    return this.expireOnData <= new Date();
  }

  validateUsageLimit(): boolean {
    return this.usageLimit <= 0;
  }

  validateMinimumPurchase(value: number): boolean {
    return value >= this.minimumValue;
  }

  isActive(): boolean {
    return this.status == 'active' ? true : false;
  }

  calcCounpon(productsList: TProduct[]) {
    //soma todos os produtos do pedido
  
    const total = productsList.reduce((acc, product) => acc + product.price, 0);

    if (this.discountType == 'percentage') {
      const discount = total * (this.discountValue / 100);

      return {
        originalValue: total,
        discount: discount,
        finalValue: total - discount,
      };
    } else {
      return {
        originalValue: total,
        discount: this.discountValue,
        finalValue: total - this.discountValue,
      };
    }
  }
}
