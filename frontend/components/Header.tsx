import { Cart } from "./Cart";

export function Header() {
  return (
    <header className="w-full min-h-[80px] bg-gray-300 flex items-center justify-end p-3">
      <Cart />
    </header>
  );
}