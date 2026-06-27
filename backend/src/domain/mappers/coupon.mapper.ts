import { Coupon as CouponEntity } from '../../infrastructure/database/orm-entities/coupon';
import { Coupon as CouponDomain } from '../entities/coupon';

export class CouponMapper {
  static toDomain(entity: CouponEntity): CouponDomain {
    const coupon = new CouponDomain({
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

  static toPersistence(domain: CouponDomain): CouponEntity {
    const entity = new CouponEntity();

    entity.discountType = domain.discountType;
    entity.minimumValue = domain.minimumValue;
    entity.expireOnData = domain.expireOnData;
    entity.usageLimit = domain.usageLimit;
    entity.couponCode = domain.couponCode;
    entity.status = domain.status;

    return entity;
  }
}
