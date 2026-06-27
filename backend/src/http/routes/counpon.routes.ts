import { FastifyInstance } from 'fastify';
import { CounponController } from '../controllers/counpon.controller';
import { ApplyCouponSchema } from '../schemas/counpon.schema';

export async function couponRoutes(app: FastifyInstance) {
  const controller = new CounponController();
  app.post(
    '/coupons/apply',
    { schema: { body: ApplyCouponSchema } },
    controller.ApplyCounpon,
  );
}
