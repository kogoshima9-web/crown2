import { motion } from "motion/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Beaker, ShieldCheck, Leaf, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface HeroProps {
  onBuyNow: () => void;
}

export default function Hero({ onBuyNow }: HeroProps) {
  const [heroImage, setHeroImage] = useState("https://qbplkodflyuocfawqjga.supabase.co/storage/v1/object/public/1/Gemini_Generated_Image_7f0nor7f0nor7f0n.png");

  useEffect(() => {
    async function fetchHeroImage() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'hero_image_url')
        .single();
      
      if (!error && data) {
        setHeroImage(data.value);
      }
    }
    fetchHeroImage();
  }, []);

  return (
    <section className="relative w-full min-h-screen lg:min-h-[750px] bg-white overflow-hidden flex items-center py-8 lg:py-0">
      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Product Image - Top on Mobile, Right on Desktop */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="w-full flex justify-center lg:justify-end order-1 lg:order-2"
        >
          <div className="relative w-full max-w-[340px] md:max-w-[450px] lg:max-w-[500px] aspect-square bg-[#F8F9FA] rounded-[32px] lg:rounded-[40px] shadow-2xl flex items-center justify-center p-8 lg:p-12 overflow-hidden">
            <img 
              src={heroImage} 
              alt="Crown Skincare Collection"
              className="w-full h-full object-contain drop-shadow-xl transform hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Content - Bottom on Mobile, Left on Desktop */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-1"
        >
          {/* Price & Buttons - Priority on Mobile */}
          <div className="flex flex-col items-center lg:items-start gap-4 lg:order-last">
            <div className="text-4xl lg:text-5xl font-bold text-gray-900">300 DA</div>
            <div className="flex gap-3 w-full lg:w-auto">
              <Button 
                onClick={onBuyNow}
                className="flex-1 lg:flex-none bg-black text-white hover:bg-gray-800 h-14 px-8 lg:px-10 rounded-none text-[12px] font-bold tracking-widest uppercase cursor-pointer"
              >
                Buy Now
              </Button>
              <a 
                href="#why-us"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "flex-1 lg:flex-none bg-transparent text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white h-14 px-8 lg:px-10 rounded-none text-[12px] font-bold tracking-widest uppercase cursor-pointer flex items-center justify-center"
                )}
              >
                Why Us
              </a>
            </div>
          </div>

          {/* Heading & Badge */}
          <div className="space-y-3 lg:space-y-4">
            <span className="inline-block bg-[#D1E9FF] text-[#007AFF] px-4 py-1 text-[10px] lg:text-[11px] font-bold tracking-wider uppercase rounded-sm">
              New Arrival
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 leading-tight">
              Crown Skincare
            </h2>
            <p className="text-[11px] lg:text-[12px] font-bold tracking-[0.2em] text-gray-500 uppercase">
              Perfected by Nature. Made for You.
            </p>
          </div>

          {/* Features - Lower priority on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4 pt-2">
            {[
              { icon: Beaker, text: "Science designed for your Skin/Hair/Body" },
              { icon: ShieldCheck, text: "Dermatologist-approved" },
              { icon: Leaf, text: "99% Natural" },
              { icon: Globe, text: "100% Algerian" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 lg:gap-4 justify-center lg:justify-start">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                  <item.icon size={16} className="lg:hidden" />
                  <item.icon size={20} className="hidden lg:block" />
                </div>
                <span className="text-[13px] lg:text-[14px] font-medium text-gray-600 text-left">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
