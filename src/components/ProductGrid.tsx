import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PRODUCTS = [
  {
    id: 1,
    name: "Lotion Goat Milk",
    description: "30 Sec Instantly Whitening",
    price: "$24.00",
    image: "https://picsum.photos/seed/lotion/400/500",
    category: "Body Care"
  },
  {
    id: 2,
    name: "Masque Visage",
    description: "Purifies pores in depth",
    price: "$18.00",
    image: "https://picsum.photos/seed/mask/400/500",
    category: "Face Care"
  },
  {
    id: 3,
    name: "Savon Naturel",
    description: "Au Lait de Chèvre",
    price: "$12.00",
    image: "https://picsum.photos/seed/soap/400/500",
    category: "Cleanser"
  },
  {
    id: 4,
    name: "Creme Lait de Chevre",
    description: "Pearl delicate silky body",
    price: "$28.00",
    image: "https://picsum.photos/seed/cream/400/500",
    category: "Moisturizer"
  }
];

interface ProductGridProps {
  onBuyNow: (product: any) => void;
}

export default function ProductGrid({ onBuyNow }: ProductGridProps) {
  return (
    <section id="shop" className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex items-end justify-between mb-12">
        <div className="space-y-2">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 uppercase">The Collection</h3>
          <p className="text-gray-500 text-sm">Discover the power of natural goat milk skincare.</p>
        </div>
        <a href="#" className="text-sm font-bold tracking-widest uppercase border-b border-black pb-1">View All</a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {PRODUCTS.map((product) => (
          <Card 
            key={product.id} 
            className="border-none shadow-none group cursor-pointer bg-transparent"
            onClick={() => onBuyNow(product)}
          >
            <CardContent className="p-0 mb-4 overflow-hidden bg-gray-100">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </CardContent>
            <CardFooter className="p-0 flex flex-col items-start gap-1">
              <Badge variant="secondary" className="rounded-none text-[10px] font-bold tracking-widest uppercase bg-gray-200 text-gray-700">
                {product.category}
              </Badge>
              <h4 className="text-lg font-bold text-gray-900 mt-1">{product.name}</h4>
              <p className="text-sm text-gray-500">{product.description}</p>
              <p className="text-base font-medium text-gray-900 mt-2">{product.price}</p>
              <Button 
                className="w-full mt-4 rounded-none bg-black text-white hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onBuyNow(product);
                }}
              >
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
