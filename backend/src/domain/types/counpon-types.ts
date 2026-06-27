export enum Etype {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}
export enum ECouponStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export type TCouponProps = {
  uuid?: string;
  code: string;
  discountType: Etype;
  discountValue: number;
  minimumPurchaseAmount: number;
  expiresAt: Date;
  usageLimit: number;
  status: ECouponStatus;
};

export type TProduct = {
  tittle: string;
  description: string;
  price: number;
  amount: number;
};

export type TApplyCouponProps = {
  couponCode: string;
  productsList: TProduct[];
};

export type ApplyCouponResponse =
  | {
      success: true;
      originalValue: number;
      discount: number;
      finalValue: number;
      message: string;
    }
  | {
      success: false;
      message: string;
    };
