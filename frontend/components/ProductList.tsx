import { products } from "@/data/producs"; 
import { ProductCard } from "./ProductCard";

export function ProductsList() {
  return (
    <section className="w-full h-full bg-gray-200 p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.title} product={product} />
        ))}
      </div>
    </section>
  );
}