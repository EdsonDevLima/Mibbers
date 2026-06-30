import { TProduct } from "@/data/data-types";

export type CartContextType = {
  products: TProduct[];
  addProduct: (product: TProduct) => void;
  removeProduct: (title: string) => void;
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
