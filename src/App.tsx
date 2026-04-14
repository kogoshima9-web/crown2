import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import WhyUs from "./components/WhyUs";
import Footer from "./components/Footer";
import CheckoutModal from "./components/CheckoutModal";
import Admin from "./pages/Admin";
import { useState } from "react";
import { Facebook } from "lucide-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function HomePage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    name: string;
    price: string;
    image: string;
    description: string;
  } | null>(null);

  const handleBuyNow = (product?: any) => {
    if (product) {
      setSelectedProduct(product);
    } else {
      setSelectedProduct({
        name: "Crown Skincare Collection",
        price: "300 DA",
        image: "https://storage.googleapis.com/static-content-prod/file-uploads/azgoederbfazp5qbfqdxav/1744425692000-859737.png",
        description: "Complete natural goat milk skincare set"
      });
    }
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white scroll-smooth">
      <Header />
      <main>
        <Hero onBuyNow={() => handleBuyNow()} />
        <WhyUs />
        <ProductGrid onBuyNow={handleBuyNow} />
        
        <section className="max-w-7xl mx-auto px-4 py-20 text-center border-t border-gray-100">
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-[12px] font-bold tracking-[0.3em] uppercase text-gray-500">Follow us</h3>
            <a 
              href="https://www.facebook.com/profile.php?id=61582458816958" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors group"
            >
              <Facebook size={32} className="text-gray-900 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        product={selectedProduct}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
