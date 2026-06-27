import { FastifyRequest, FastifyReply } from 'fastify';
import { CounponUseCases } from '../../aplication/useCases/coupon-use-cases';
import { TApplyCouponProps } from '../../domain/types/counpon-types';

export class CounponController {
  private readonly counponUseCases: CounponUseCases;
  constructor() {
    this.counponUseCases = new CounponUseCases();
  }

  async ApplyCounpon(Req: FastifyRequest, Rep: FastifyReply) {
    try {
      const { counponCode, productsList } = Req.body as TApplyCouponProps;
      const result = await this.counponUseCases.ApplyCoupon({
        counponCode,
        productsList,
      });
      if (result.success == false) {
        return Rep.status(400).send(result);
      }
      return result;
    } catch (error) {
      throw Error(`${error}`);
    }
  }
}
