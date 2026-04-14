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
    <section className="relative w-full min-h-[600px] lg:h-[750px] bg-white overflow-hidden flex items-center py-12 lg:py-0">
      <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 text-left"
        >
          <div className="space-y-4">
            <span className="inline-block bg-[#D1E9FF] text-[#007AFF] px-4 py-1 text-[11px] font-bold tracking-wider uppercase rounded-sm">
              New Arrival
            </span>
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 leading-tight">
              Crown Skincare
            </h2>
            <p className="text-[12px] font-bold tracking-[0.2em] text-gray-500 uppercase">
              Perfected by Nature. Made for You.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            {[
              { icon: Beaker, text: "Science designed for your Skin/Hair/Body" },
              { icon: ShieldCheck, text: "Dermatologist-approved" },
              { icon: Leaf, text: "99% Natural" },
              { icon: Globe, text: "100% Algerian" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                  <item.icon size={20} />
                </div>
                <span className="text-[14px] font-medium text-gray-600">{item.text}</span>
              </div>
            ))}
          </div>
          
          <div className="space-y-6 pt-4">
            <div className="text-4xl font-bold text-gray-900">300 DA</div>
            <div className="flex gap-4">
              <Button 
                onClick={onBuyNow}
                className="bg-black text-white hover:bg-gray-800 h-14 px-10 rounded-none text-[12px] font-bold tracking-widest uppercase cursor-pointer"
              >
                Buy Now
              </Button>
              <a 
                href="#why-us"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "bg-transparent text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white h-14 px-10 rounded-none text-[12px] font-bold tracking-widest uppercase cursor-pointer flex items-center justify-center"
                )}
              >
                Why Us
              </a>
            </div>
          </div>
        </motion.div>

        {/* Product Image in Square Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="flex justify-center lg:justify-end relative"
        >
          <div className="relative w-full max-w-[500px] aspect-square bg-[#F8F9FA] rounded-[40px] shadow-2xl flex items-center justify-center overflow-hidden">
            <img 
              src={heroImage} 
              alt="Crown Skincare Collection"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
