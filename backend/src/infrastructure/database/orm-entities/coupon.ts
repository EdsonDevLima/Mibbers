import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ECouponStatus, Etype } from '../../../domain/types/counpon.types';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'real' })
  discountValue: number;

  @Column({ type: 'real' })
  minimumValue: number;

  @Column({ type: 'date' })
  expireOnData: Date;

  @Column({ type: 'int' })
  usageLimit: number;

  @Column({ type: 'varchar' })
  couponCode: string;

  @Column({
    type: 'simple-enum',
    enum: Etype,
  })
  discountType: Etype;

  @Column({
    type: 'simple-enum',
    enum: ECouponStatus,
  })
  status: ECouponStatus;
}
