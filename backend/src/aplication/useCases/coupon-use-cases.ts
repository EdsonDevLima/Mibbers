import { Repository } from 'typeorm';
import {
  ApplyCouponResponse,
  TApplyCouponProps,
} from '../../domain/types/counpon-types';
import { Coupon } from '../../infrastructure/database/orm-entities/coupon';
import { connectionDb } from '../../infrastructure/database/connection';
import { CouponMapper } from '../../domain/mappers/coupon.mapper';

export class CounponUseCases {
  private readonly CounponRepository: Repository<Coupon> =
    connectionDb.getRepository(Coupon);

  async ApplyCoupon(props: TApplyCouponProps): Promise<ApplyCouponResponse> {
    try {
      let responseCalc;
      const counpon = await this.findCounpon(props.counponCode);
      if (!counpon) return { success: false, message: 'cupom inexistente.' };
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
      await this.CounponRepository.update(
        { couponCode: counpon.couponCode },
        { usageLimit: counpon.usageLimit },
      );
      return {
        success: true,
        message: 'Cupom aplicado com sucesso.',
        originalValue: responseCalc.originalValue,
        discount: responseCalc.discount,
        finalValue: responseCalc.finalValue,
      };
    } catch (error) {
      throw Error(`${error}`);
    }
  }
  async findCounpon(counponCode: string) {
    try {
      const data = await this.CounponRepository.findOne({
        where: { couponCode: counponCode },
      });

      return CouponMapper.toDomain(data);
    } catch (error) {
      throw Error(`${error}`);
    }
  }
}
