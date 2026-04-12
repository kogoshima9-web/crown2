import { motion } from "motion/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroProps {
  onBuyNow: () => void;
}

export default function Hero({ onBuyNow }: HeroProps) {
  return (
    <section className="relative w-full min-h-[600px] lg:h-[700px] bg-[#F2F2F2] overflow-hidden flex items-center py-12 lg:py-0">
      {/* Background Gradient/Softness */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center relative z-10">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 text-center lg:text-left"
        >
          <div className="space-y-2">
            <p className="text-[12px] font-semibold tracking-[0.2em] text-gray-500 uppercase">
              Perfected by Nature. Made for You.
            </p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Crown <br /> Skincare
            </h2>
            <div className="space-y-2 pt-4 flex flex-col items-center lg:items-start">
              <p className="text-[13px] md:text-[14px] font-medium text-gray-600 flex items-center gap-2">
                <span>🔬</span> Science designed for your Skin/Hair/Body
              </p>
              <p className="text-[13px] md:text-[14px] font-medium text-gray-600 flex items-center gap-2">
                <span>🥼</span> Dermatologist-approved
              </p>
              <p className="text-[13px] md:text-[14px] font-medium text-gray-600 flex items-center gap-2">
                <span>💧</span> 99% Natural
              </p>
              <p className="text-[13px] md:text-[14px] font-medium text-gray-600 flex items-center gap-2">
                <span>🇩🇿</span> 100% Algerian
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <Button 
              onClick={onBuyNow}
              className="bg-white text-black hover:bg-gray-100 h-12 px-8 rounded-none text-[12px] font-bold tracking-widest uppercase border border-white shadow-sm cursor-pointer"
            >
              Buy Now
            </Button>
            <a 
              href="#why-us"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "bg-transparent text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white h-12 px-8 rounded-none text-[12px] font-bold tracking-widest uppercase cursor-pointer flex items-center justify-center"
              )}
            >
              Why Us
            </a>
          </div>
        </motion.div>

        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="flex justify-center lg:justify-end relative"
        >
          <div className="relative w-full max-w-[400px] lg:max-w-[500px] aspect-square">
            <img 
              src="https://storage.googleapis.com/static-content-prod/file-uploads/azgoederbfazp5qbfqdxav/1744425692000-859737.png" 
              alt="Crown Skincare Collection"
              className="w-full h-full object-contain drop-shadow-2xl"
              referrerPolicy="no-referrer"
            />
            {/* Floating elements to mimic the "pro" look */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/20 blur-3xl rounded-full -z-10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
