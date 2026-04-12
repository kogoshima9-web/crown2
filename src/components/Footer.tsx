export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="space-y-6">
          {/* Brand name removed as per user request */}
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
            Harnessing the natural benefits of goat milk to bring you the most effective and gentle skincare solutions.
          </p>
        </div>
        
        <div className="flex flex-col md:items-end">
          <h4 className="text-[12px] font-bold tracking-widest uppercase text-gray-900 mb-6">Navigation</h4>
          <ul className="space-y-4 text-sm text-gray-500 md:text-right">
            <li><a href="#shop" className="hover:text-black transition-colors">SHOP</a></li>
            <li><a href="#why-us" className="hover:text-black transition-colors">WHY US</a></li>
            <li><a href="#" className="hover:text-black transition-colors">ABOUT</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium tracking-widest text-gray-400 uppercase">
        <p>© 2024. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-black transition-colors">Accessibility</a>
        </div>
      </div>
    </footer>
  );
}
