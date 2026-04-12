import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const TESTIMONIAL_IMAGES = [
  "https://storage.googleapis.com/static-content-prod/file-uploads/azgoederbfazp5qbfqdxav/1744426415000-835694.png",
  "https://storage.googleapis.com/static-content-prod/file-uploads/azgoederbfazp5qbfqdxav/1744426419000-845627.png",
  "https://storage.googleapis.com/static-content-prod/file-uploads/azgoederbfazp5qbfqdxav/1744426419000-845628.png",
  "https://storage.googleapis.com/static-content-prod/file-uploads/azgoederbfazp5qbfqdxav/1744426419000-845629.png"
];

export default function WhyUs() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIAL_IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="why-us" className="py-24 bg-gray-50 overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-[12px] font-bold tracking-[0.3em] uppercase text-gray-500">
                The Crown Difference
              </h3>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 uppercase leading-tight">
                Trusted by Thousands <br /> Across Algeria
              </h2>
            </div>
            
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p className="text-lg">
                Our community is at the heart of everything we do. We don't just sell skincare; we provide a scientific solution that delivers real results.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-black font-bold">01.</span>
                  <span>Authentic testimonials from real customers who have seen visible improvements in skin texture and hydration.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-black font-bold">02.</span>
                  <span>Locally sourced ingredients combined with international dermatological standards.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-black font-bold">03.</span>
                  <span>A commitment to transparency, quality, and your skin's long-term health.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <div className="flex gap-2">
                {TESTIMONIAL_IMAGES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1 transition-all duration-300 ${
                      currentIndex === idx ? "w-12 bg-black" : "w-6 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Image Slider */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-[450px] aspect-[4/5] bg-white shadow-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={TESTIMONIAL_IMAGES[currentIndex]}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="w-full h-full object-contain p-4"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              {/* Overlay Label */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 border border-gray-100">
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">Customer Story</p>
                <p className="text-sm font-medium text-gray-900">Verified Purchase • Real Results</p>
              </div>
            </div>
            
            {/* Decorative Background Element */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-gray-200/50 -z-10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gray-200/50 -z-10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
