import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

interface ProductGridProps {
  onBuyNow: (product: any) => void;
}

export default function ProductGrid({ onBuyNow }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-500 animate-pulse">Loading collection...</p>
      </div>
    );
  }

  // Fallback if no products in DB yet
  const displayProducts = products.length > 0 ? products : [
    {
      id: 'default',
      name: "Crown Skincare Collection",
      description: "Complete natural goat milk skincare set",
      price: 300,
      image_url: "https://storage.googleapis.com/static-content-prod/file-uploads/azgoederbfazp5qbfqdxav/1744425692000-859737.png",
      category: "Full Set"
    }
  ];

  return (
    <section id="shop" className="max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h3 className="text-3xl font-bold tracking-tight text-gray-900 uppercase mb-4">The Collection</h3>
        <p className="text-gray-500 text-sm max-w-lg mx-auto">Experience the complete science of natural goat milk skincare in one professional set.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-center">
        {displayProducts.map((product) => (
          <Card 
            key={product.id} 
            className="border-none shadow-none group cursor-pointer bg-transparent w-full"
            onClick={() => onBuyNow({
              ...product,
              image: product.image_url,
              price: `${product.price} DA`
            })}
          >
            <CardContent className="p-0 mb-6 overflow-hidden bg-[#F9F9F9] flex items-center justify-center p-8 aspect-square">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </CardContent>
            <CardFooter className="p-0 flex flex-col items-center text-center gap-2">
              <Badge variant="secondary" className="rounded-none text-[10px] font-bold tracking-widest uppercase bg-gray-100 text-gray-500 px-3 py-1">
                {product.category}
              </Badge>
              <h4 className="text-2xl font-bold text-gray-900 mt-2">{product.name}</h4>
              <p className="text-gray-500 text-sm">{product.description}</p>
              <div className="flex flex-col items-center mt-4">
                <p className="text-3xl font-bold text-gray-900">{product.price} DA</p>
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-1">Limited Time Price</span>
              </div>
              <Button 
                className="w-full mt-8 h-14 rounded-none bg-black text-white hover:bg-gray-800 text-[12px] font-bold tracking-widest uppercase transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onBuyNow({
                    ...product,
                    image: product.image_url,
                    price: `${product.price} DA`
                  });
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
