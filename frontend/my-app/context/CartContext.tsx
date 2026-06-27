"use client";

import { createContext, useContext, useState } from "react";
import { TProduct } from "@/data/data-types";
import { CartContextType } from "@/types/context";

const CartContext = createContext({} as CartContextType);

function getInitialCart(): TProduct[] {
  if (typeof window === "undefined") return []; 
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<TProduct[]>(getInitialCart);

  function addProduct(product: TProduct) {
    setProducts((oldProducts) => {
      const productExists = oldProducts.find(
        (item) => item.title === product.title
      );

      const updated = productExists
        ? oldProducts.map((item) =>
            item.title === product.title
              ? { ...item, amount: item.amount + 1 }
              : item
          )
        : [...oldProducts, { ...product, amount: 1 }];

      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  }

  function removeProduct(title: string) {
    setProducts((oldProducts) => {
      const updated = oldProducts.filter((item) => item.title !== title);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <CartContext.Provider value={{ products, addProduct, removeProduct }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}