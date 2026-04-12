import { Search, User, ShoppingBag } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex-1" />
        
        <div className="flex-1 flex justify-center">
          {/* Brand name removed as per user request */}
        </div>
        
        <div className="flex-1 flex items-center justify-end gap-6">
          {/* Shopping bag removed as per user request */}
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-center gap-10">
        {["SHOP", "WHY US", "ABOUT"].map((item) => (
          <a
            key={item}
            href={item === "WHY US" ? "#why-us" : "#"}
            className="text-[11px] font-medium tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}
