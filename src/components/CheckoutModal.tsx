import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User, Phone, MapPin, Building2, ShoppingCart, Truck, Calculator, Minus, Plus, ShoppingBag, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

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

const WILAYAS = [
  "01 أدرار", "02 الشلف", "03 الأغواط", "04 أم البواقي", "05 باتنة", "06 بجاية", "07 بسكرة", "08 بشار", "09 البليدة", "10 البويرة",
  "11 تمنراست", "12 تبسة", "13 تلمسان", "14 تيارت", "15 تيزي وزو", "16 الجزائر", "17 الجلفة", "18 جيجل", "19 سطيف", "20 سعيدة",
  "21 سكيكدة", "22 سيدي بلعباس", "23 عنابة", "24 قسنطينة", "25 المدية", "26 مستغانم", "27 المسيلة", "28 معسكر", "29 ورقلة", "30 وهران",
  "31 البيض", "32 إلـيزي", "33 برج بوعريريج", "34 بومرداس", "35 الطارف", "36 تندوف", "37 تيسمسيلت", "38 الوادي", "39 خنشلة", "40 سوق أهراس",
  "41 تيبازة", "42 ميلة", "43 عين الدفلى", "44 النعامة", "45 عين تموشنت", "46 غرداية", "47 غليزان", "48 تيميمون", "49 برج باجي مختار", "50 أولاد جلال",
  "51 بني عباس", "52 عين صالح", "53 عين قزام", "54 تقرت", "55 جانت", "56 المغير", "57 المنيعة", "58 وادي سوف"
];

const DELIVERY_PRICES: Record<string, { home: number; office: number }> = {
  "01 أدرار": { home: 1400, office: 800 },
  "02 الشلف": { home: 600, office: 400 },
  "16 الجزائر": { home: 400, office: 300 },
  "30 وهران": { home: 500, office: 400 },
  "24 قسنطينة": { home: 500, office: 400 },
  "09 البليدة": { home: 400, office: 300 },
  "19 سطيف": { home: 500, office: 400 },
  "23 عنابة": { home: 500, office: 400 },
  "13 تلمسان": { home: 600, office: 450 },
  "06 بجاية": { home: 500, office: 400 },
};

const getDeliveryPrice = (wilaya: string, type: 'home' | 'office' | null) => {
  if (!wilaya || !type) return 0;
  const prices = DELIVERY_PRICES[wilaya] || { home: 700, office: 500 };
  return prices[type];
};

export default function CheckoutModal({ isOpen, onClose, product }: CheckoutModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'home' | 'office' | null>(null);
  const [formData, setFormData] = useState({
    customer_name: "",
    phone_number: "",
    wilaya: "",
    baladia: "",
    address: ""
  });

  if (!product) return null;

  const numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, "")) || 300;
  const currentDeliveryPrice = getDeliveryPrice(formData.wilaya, deliveryType);
  const total = (numericPrice * quantity) + currentDeliveryPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.phone_number || !formData.wilaya || !deliveryType) {
      alert("الرجاء ملء جميع الحقول المطلوبة واختيار نوع التوصيل");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: formData.customer_name,
            phone_number: formData.phone_number,
            wilaya: formData.wilaya,
            baladia: formData.baladia,
            address: formData.address,
            product_name: product.name,
            quantity: quantity,
            total_price: numericPrice * quantity,
            delivery_price: currentDeliveryPrice,
            delivery_type: deliveryType === 'home' ? 'توصيل منزلي' : 'توصيل للمكتب',
            status: 'new'
          }
        ]);

      if (error) throw error;

      setIsSuccess(true);
      // Reset form
      setFormData({
        customer_name: "",
        phone_number: "",
        wilaya: "",
        baladia: "",
        address: ""
      });
      setQuantity(1);
      setDeliveryType(null);
    } catch (error: any) {
      console.error('Error placing order:', error);
      alert(`Failed to place order: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
              onClick={handleClose}
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

            {/* Right Side: Order Form or Success Message */}
            <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto flex items-center justify-center">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 py-12"
                >
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={48} className="text-green-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-green-600 uppercase tracking-tight">تم تسجيل الطلب</h2>
                    <p className="text-gray-500 font-medium">شكراً لك! سنتصل بك قريباً لتأكيد طلبك.</p>
                  </div>
                  <Button 
                    onClick={handleClose}
                    className="w-full h-14 bg-black text-white hover:bg-gray-900 rounded-none text-lg font-bold"
                  >
                    إغلاق
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-8 w-full">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">استمارة الطلب</h2>
                    <p className="text-sm text-gray-500 font-medium">Order Form</p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-200 rounded-md overflow-hidden h-12">
                    <button 
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors border-r border-gray-200"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="flex-1 h-full flex items-center justify-center font-bold text-lg">
                      {quantity}
                    </div>
                    <button 
                      type="button"
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
                        <Input 
                          required
                          value={formData.customer_name}
                          onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                          placeholder="Nom complet" 
                          className="pr-14 h-12 rounded-none border-gray-200 focus-visible:ring-black" 
                        />
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
                        <Input 
                          required
                          value={formData.phone_number}
                          onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                          placeholder="Numéro de téléphone" 
                          className="flex-1 h-12 rounded-none border-gray-200 border-r-0 focus-visible:ring-black" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[13px] font-bold text-gray-700">الولاية *</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center border-l border-gray-200 bg-gray-50 z-10 pointer-events-none">
                          <MapPin size={18} className="text-gray-400" />
                        </div>
                        <select 
                          required
                          className="w-full pr-14 h-12 rounded-none border border-gray-200 focus:ring-1 focus:ring-black outline-none bg-white text-right appearance-none"
                          value={formData.wilaya}
                          onChange={(e) => setFormData({...formData, wilaya: e.target.value})}
                          dir="rtl"
                        >
                          <option value="" disabled>الولاية</option>
                          {WILAYAS.map(w => (
                            <option key={w} value={w}>{w}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[13px] font-bold text-gray-700">البلدية *</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center border-l border-gray-200 bg-gray-50 z-10">
                          <Building2 size={18} className="text-gray-400" />
                        </div>
                        <Input 
                          required
                          value={formData.baladia}
                          onChange={(e) => setFormData({...formData, baladia: e.target.value})}
                          placeholder="Baladia" 
                          className="pr-14 h-12 rounded-none border-gray-200 focus-visible:ring-black" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[13px] font-bold text-gray-700">العنوان</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center border-l border-gray-200 bg-gray-50">
                          <MapPin size={18} className="text-gray-400" />
                        </div>
                        <Input 
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          placeholder="Adresse de Livraison" 
                          className="pr-14 h-12 rounded-none border-gray-200 focus-visible:ring-black" 
                        />
                      </div>
                    </div>

                    {/* Delivery Options Section */}
                    {formData.wilaya && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-4 pt-4 border-t border-gray-100"
                      >
                        <div className="flex items-center gap-2 font-bold text-gray-900">
                          <Truck size={18} />
                          <span>التوصيل</span>
                        </div>
                        
                        <div className="space-y-3">
                          <label 
                            className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                              deliveryType === 'home' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setDeliveryType('home')}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                deliveryType === 'home' ? 'border-black' : 'border-gray-300'
                              }`}>
                                {deliveryType === 'home' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                              </div>
                              <span className="font-medium">توصيل منزلي</span>
                            </div>
                            <span className="font-bold">{getDeliveryPrice(formData.wilaya, 'home').toLocaleString()} DA</span>
                          </label>

                          <label 
                            className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                              deliveryType === 'office' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setDeliveryType('office')}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                deliveryType === 'office' ? 'border-black' : 'border-gray-300'
                              }`}>
                                {deliveryType === 'office' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                              </div>
                              <span className="font-medium">توصيل للمكتب</span>
                            </div>
                            <span className="font-bold">{getDeliveryPrice(formData.wilaya, 'office').toLocaleString()} DA</span>
                          </label>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Summary Box */}
                  <div className="bg-gray-50 p-6 space-y-4 border border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <ShoppingCart size={16} />
                        <span>سعر المنتج</span>
                      </div>
                      <span className="font-bold">{(numericPrice * quantity).toLocaleString()} DA</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Truck size={16} />
                        <span>سعر التوصيل</span>
                      </div>
                      <span className={`${deliveryType ? 'text-red-600' : 'text-gray-400'} font-bold`}>
                        {deliveryType ? `${currentDeliveryPrice.toLocaleString()} DA` : "--"}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-2 font-bold text-gray-900">
                        <Calculator size={18} />
                        <span>المجموع</span>
                      </div>
                      <span className="text-xl font-black text-gray-900">
                        {deliveryType ? `${total.toLocaleString()} DA` : "--"}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full h-14 bg-black text-white hover:bg-gray-900 rounded-none text-lg font-bold flex items-center justify-center gap-3 group"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                    )}
                    <span>إشتري الآن</span>
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
