import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User, Phone, MapPin, Building2, ShoppingCart, Truck, Calculator, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    price: string;
    image: string;
    description: string;
  } | null;
}

export default function CheckoutModal({ isOpen, onClose, product }: CheckoutModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  // Extract numeric price for calculation (assuming format like "$24.00" or "3,000.00 DZD")
  const numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, "")) || 3000;
  const total = numericPrice * quantity;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Left Side: Product Image */}
            <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="relative w-full aspect-square max-w-[400px]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 left-0 right-0 text-center space-y-1">
                  <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.description}</p>
                </div>
              </div>
            </div>

            {/* Right Side: Order Form */}
            <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto">
              <div className="max-w-md mx-auto space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">استمارة الطلب</h2>
                  <p className="text-sm text-gray-500 font-medium">Order Form</p>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden h-12">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors border-r border-gray-200"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="flex-1 h-full flex items-center justify-center font-bold text-lg">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors border-l border-gray-200"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 text-right" dir="rtl">
                  <div className="space-y-2">
                    <Label className="text-[13px] font-bold text-gray-700">الإسم الكامل *</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center border-l border-gray-200 bg-gray-50">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <Input placeholder="Nom complet" className="pr-14 h-12 rounded-none border-gray-200 focus-visible:ring-black" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[13px] font-bold text-gray-700">الهاتف *</Label>
                    <div className="flex gap-0">
                      <div className="relative w-32">
                        <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center border-l border-gray-200 bg-gray-50">
                          <Phone size={18} className="text-gray-400" />
                        </div>
                        <div className="pr-14 h-12 flex items-center justify-center border border-gray-200 bg-gray-50 text-sm font-medium">
                          DZ +213
                        </div>
                      </div>
                      <Input placeholder="Numéro de téléphone" className="flex-1 h-12 rounded-none border-gray-200 border-r-0 focus-visible:ring-black" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[13px] font-bold text-gray-700">الولاية *</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center border-l border-gray-200 bg-gray-50 z-10">
                        <MapPin size={18} className="text-gray-400" />
                      </div>
                      <Select>
                        <SelectTrigger className="pr-14 h-12 rounded-none border-gray-200 focus:ring-black">
                          <SelectValue placeholder="Wilaya" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alger">Alger</SelectItem>
                          <SelectItem value="oran">Oran</SelectItem>
                          <SelectItem value="constantine">Constantine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[13px] font-bold text-gray-700">البلدية *</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center border-l border-gray-200 bg-gray-50 z-10">
                        <Building2 size={18} className="text-gray-400" />
                      </div>
                      <Select>
                        <SelectTrigger className="pr-14 h-12 rounded-none border-gray-200 focus:ring-black">
                          <SelectValue placeholder="Baladia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="b1">Baladia 1</SelectItem>
                          <SelectItem value="b2">Baladia 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[13px] font-bold text-gray-700">العنوان</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center border-l border-gray-200 bg-gray-50">
                        <MapPin size={18} className="text-gray-400" />
                      </div>
                      <Input placeholder="Adresse de Livraison" className="pr-14 h-12 rounded-none border-gray-200 focus-visible:ring-black" />
                    </div>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="bg-gray-50 p-6 space-y-4 border border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <ShoppingCart size={16} />
                      <span>سعر المنتج</span>
                    </div>
                    <span className="font-bold">{numericPrice.toLocaleString()} DZD</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Truck size={16} />
                      <span>سعر التوصيل</span>
                    </div>
                    <span className="text-red-500 font-bold">--</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-gray-900">
                      <Calculator size={18} />
                      <span>المجموع</span>
                    </div>
                    <span className="text-xl font-black text-gray-900">{total.toLocaleString()} DZD</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button className="w-full h-14 bg-black text-white hover:bg-gray-900 rounded-none text-lg font-bold flex items-center justify-center gap-3 group">
                  <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                  <span>إشتري الآن</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
