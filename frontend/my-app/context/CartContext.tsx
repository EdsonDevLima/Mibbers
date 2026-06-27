"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { TProduct } from "@/data/data-types";
import { CartContextType } from "@/types/context";

const CartContext = createContext({} as CartContextType);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [products, setProducts] = useState<TProduct[]>([]);


  useEffect(() => {
    const data = localStorage.getItem("cart");
    if (data) setProducts(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(products));
  }, [products]);

  function addProduct(product: TProduct) {
    setProducts((oldProducts) => {
      const productExists = oldProducts.find(
        (item) => item.title === product.title
      );

      if (productExists) {
        return oldProducts.map((item) =>
          item.title === product.title
            ? {
                ...item,
                amount: item.amount + 1,
              }
            : item
        );
      }

      return [...oldProducts, { ...product, amount: 1 }];
    });
  }

  function removeProduct(title: string) {
    setProducts((oldProducts) =>
      oldProducts.filter((item) => item.title !== title)
    );
  }

  return (
    <CartContext.Provider
      value={{
        products,
        addProduct,
        removeProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}