"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ProductCardProps } from "@/types/products";



export function ProductCard({ product }: ProductCardProps) {
  const { addProduct } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addProduct(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="bg-white border border-gray-100 overflow-hidden flex flex-col">

      <div className="relative w-full aspect-square bg-gray-50">
      <Image
        src={`/imgs/${product.image}`}
        alt={product.title}
        fill
        className="object-cover"
      />
      </div>

      <div className="flex flex-col flex-1 p-3 gap-1">
        <p className="text-sm font-medium text-gray-900 leading-snug">
          {product.title}
        </p>
        <p className="text-xs text-gray-500 leading-relaxed flex-1">
          {product.description}
        </p>
      </div>

      <div className="flex items-center justify-between px-3 pb-4 pt-2">
        <span className="text-base font-medium text-gray-900">
          {product.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>

        <button
          onClick={handleAddToCart}
          className={`h-9 px-4 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95
            ${added
              ? "bg-green-600 text-white"
              : "bg-black text-white hover:bg-gray-800"
            }`}
        >
          {added ? "Adicionado" : "Adicionar"}
        </button>
      </div>
    </div>
  );
}