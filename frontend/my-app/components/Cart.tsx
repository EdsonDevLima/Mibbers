"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import iconCart from "@/public/icons/shopping-cart.png";
import Image from "next/image";
import { ApplyCouponResponse } from "@/types/context";

export function Cart() {
  const { products, removeProduct } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [discountPct, setDiscountPct] = useState(0);
  const [couponStatus, setCouponStatus] = useState<"idle" | "success" | "error">("idle");
  const [couponMsg, setCouponMsg] = useState("");

  const totalQty = products.reduce((sum, p) => sum + p.amount, 0);
  const subtotal = products.reduce((sum, p) => sum + p.price * p.amount, 0);
  const discountAmt = subtotal * (discountPct / 100);
  const total = subtotal - discountAmt;

  function fmt(val: number) {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

async function applyCoupon() {
  const code = couponInput.trim().toUpperCase();

  if (!code) {
    setCouponStatus("error");
    setCouponMsg("Digite um cupom antes de aplicar.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/coupons/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        counponCode: code,
        productsList: products.map((p) => ({
          tittle: p.title,
          description: "",
          price: p.price,
          amount: p.amount,
        })),
      }),
    });

    if (!response.ok) {
      setDiscountPct(0);
      setCouponStatus("error");
      setCouponMsg("Erro ao aplicar cupom. Tente novamente mais tarde.");
      return;
    }

    const data: ApplyCouponResponse = await response.json();

    if (!data.success) {
      setDiscountPct(0);
      setCouponStatus("error");
      setCouponMsg(data.message);
      return;
    }

    const discountValue = data.discount;

    const percent = Math.round((discountValue / data.originalValue) * 100);

    setDiscountPct(percent);
    setCouponStatus("success");
    setCouponMsg(data.message || "Cupom aplicado com sucesso!");
  } catch (err) {
    setDiscountPct(0);
    setCouponStatus("error");
    setCouponMsg("Erro inesperado. Verifique sua conexão.");
  }
}

  return (
    <>
      <button
        className="relative w-[50px] h-[50px]"
        onClick={() => setShowCart(!showCart)}
        aria-label="Abrir carrinho"
      >
        <Image src={iconCart} alt="Carrinho" width={50} height={50} />
        {totalQty > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {totalQty}
          </span>
        )}
      </button>

      {showCart && (
        <div className="absolute top-[80px] right-0 w-full max-w-md bg-white shadow-lg border border-gray-200  p-4 z-50">

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Carrinho</h2>
            <span className="text-sm text-gray-400">{totalQty} {totalQty === 1 ? "item" : "itens"}</span>
          </div>

          {products.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Carrinho vazio</p>
          ) : (
            <div className="flex flex-col gap-3 mb-4">
              {products.map((product) => (
                <div
                  key={product.title}
                  className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 "
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                    <p className="text-xs text-gray-400">Qtd: {product.amount}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                    {fmt(product.price * product.amount)}
                  </span>
                  <button
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    onClick={() => removeProduct(product.title)}
                    aria-label={`Remover ${product.title}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-gray-50 border border-gray-100  p-3 mb-4">
            <p className="text-xs font-medium text-gray-500 mb-2">🏷 Cupom de desconto</p>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                placeholder="Digite seu cupom"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
              />
              <button
                className="h-9 px-4 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-100 transition-colors"
                onClick={applyCoupon}
              >
                Aplicar
              </button>
            </div>
            {couponStatus !== "idle" && (
              <p
                className={`mt-2 text-xs ${
                  couponStatus === "success" ? "text-green-600" : "text-red-500"
                }`}
              >
                {couponMsg}
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-100  p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Subtotal ({totalQty} {totalQty === 1 ? "item" : "itens"})</span>
              <span className="font-medium text-gray-900">{fmt(subtotal)}</span>
            </div>

            {discountPct > 0 && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">
                  Desconto{" "}
                  <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
                    -{discountPct}%
                  </span>
                </span>
                <span className="font-medium text-green-600">- {fmt(discountAmt)}</span>
              </div>
            )}

            <hr className="border-gray-100 my-3" />

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Total</span>
              <span className="text-xl font-medium text-gray-900">{fmt(total)}</span>
            </div>

            <button className="w-full mt-4 h-11 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
              Finalizar compra
            </button>
          </div>
        </div>
      )}
    </>
  );
}