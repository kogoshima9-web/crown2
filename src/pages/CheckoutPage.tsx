import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { 
  User, 
  Phone, 
  MapPin, 
  Building2, 
  ShoppingCart, 
  Truck, 
  Calculator, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Loader2, 
  CheckCircle2,
  Facebook,
  Instagram
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { productName } = useParams();
  
  const [product, setProduct] = useState<{
    name: string;
    price: string;
    image: string;
    description: string;
  } | null>(location.state?.product || null);

  const { scrollY } = useScroll();
  const imageOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const imageScale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const imageTranslateY = useTransform(scrollY, [0, 300], [0, -50]);

  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'home' | 'office' | null>(null);
  const [loading, setLoading] = useState(!product);
  const [formData, setFormData] = useState({
    customer_name: "",
    phone_number: "",
    wilaya: "",
    baladia: "",
    address: ""
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    async function fetchProduct() {
      if (!product && productName) {
        const decodedName = decodeURIComponent(productName);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('name', decodedName)
          .single();
        
        if (!error && data) {
          setProduct({
            name: data.name,
            price: `${data.price} DA`,
            image: data.image_url,
            description: data.description
          });
        } else if (decodedName === "Crown Skincare Collection") {
          setProduct({
            name: "Crown Skincare Collection",
            price: "300 DA",
            image: "https://qbplkodflyuocfawqjga.supabase.co/storage/v1/object/public/1/Gemini_Generated_Image_7f0nor7f0nor7f0n.png",
            description: "Complete natural goat milk skincare set"
          });
        }
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [product, productName]);

  const numericPrice = product ? parseFloat(product.price.replace(/[^0-9.]/g, "")) || 300 : 0;
  const currentDeliveryPrice = getDeliveryPrice(formData.wilaya, deliveryType);
  const total = (numericPrice * quantity) + currentDeliveryPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
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
    } catch (error: any) {
      console.error('Error placing order:', error);
      alert(`Failed to place order: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 animate-pulse">Loading product...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <Button onClick={() => navigate('/')} className="bg-black text-white">Back to Home</Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-8 py-12 bg-gray-50 p-10 rounded-2xl border border-gray-100"
          >
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 size={56} className="text-green-600" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-green-600 uppercase tracking-tight">تم تسجيل الطلب</h2>
              <p className="text-gray-600 text-lg font-medium">شكراً لك! سنتصل بك قريباً لتأكيد طلبك.</p>
            </div>
            <Button 
              onClick={() => navigate('/')}
              className="w-full h-16 bg-black text-white hover:bg-gray-900 rounded-none text-xl font-bold"
            >
              العودة للرئيسية
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side: Product Image (Desktop) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-24 hidden lg:block"
          >
            <div className="bg-gray-50 rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-8 md:p-16">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="mt-8 text-center lg:text-left space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-500 text-lg leading-relaxed">{product.description}</p>
            </div>
          </motion.div>

          {/* Mobile Product Image (Fades away on scroll) */}
          <motion.div 
            style={{ opacity: imageOpacity, scale: imageScale, y: imageTranslateY }}
            className="lg:hidden space-y-6"
          >
            <div className="bg-gray-50 rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-8">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-500 leading-relaxed">{product.description}</p>
            </div>
          </motion.div>

          {/* Right Side: Checkout Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-gray-100 shadow-xl rounded-3xl p-6 md:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between border border-gray-200 rounded-xl overflow-hidden h-14">
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-16 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors border-r border-gray-200"
                >
                  <Minus size={20} />
                </button>
                <div className="flex-1 h-full flex items-center justify-center font-bold text-xl">
                  {quantity}
                </div>
                <button 
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-16 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors border-l border-gray-200"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-5 text-right" dir="rtl">
                <div className="space-y-2">
                  <Label className="text-[14px] font-bold text-gray-700">الإسم الكامل *</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 w-14 flex items-center justify-center border-l border-gray-200 bg-gray-50">
                      <User size={20} className="text-gray-400" />
                    </div>
                    <Input 
                      required
                      value={formData.customer_name}
                      onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                      placeholder="Nom complet" 
                      className="pr-16 h-14 rounded-xl border-gray-200 focus-visible:ring-black text-lg" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[14px] font-bold text-gray-700">الهاتف *</Label>
                  <div className="flex gap-0">
                    <div className="relative w-36">
                      <div className="absolute inset-y-0 right-0 w-14 flex items-center justify-center border-l border-gray-200 bg-gray-50">
                        <Phone size={20} className="text-gray-400" />
                      </div>
                      <div className="pr-16 h-14 flex items-center justify-center border border-gray-200 bg-gray-50 text-sm font-bold">
                        DZ +213
                      </div>
                    </div>
                    <Input 
                      required
                      value={formData.phone_number}
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                      placeholder="Numéro de téléphone" 
                      className="flex-1 h-14 rounded-xl rounded-r-none border-gray-200 border-r-0 focus-visible:ring-black text-lg" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[14px] font-bold text-gray-700">الولاية *</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 w-14 flex items-center justify-center border-l border-gray-200 bg-gray-50 z-10 pointer-events-none">
                      <MapPin size={20} className="text-gray-400" />
                    </div>
                    <select 
                      required
                      className="w-full pr-16 h-14 rounded-xl border border-gray-200 focus:ring-1 focus:ring-black outline-none bg-white text-right appearance-none text-lg"
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
                  <Label className="text-[14px] font-bold text-gray-700">البلدية *</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 w-14 flex items-center justify-center border-l border-gray-200 bg-gray-50 z-10">
                      <Building2 size={20} className="text-gray-400" />
                    </div>
                    <Input 
                      required
                      value={formData.baladia}
                      onChange={(e) => setFormData({...formData, baladia: e.target.value})}
                      placeholder="Baladia" 
                      className="pr-16 h-14 rounded-xl border-gray-200 focus-visible:ring-black text-lg" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[14px] font-bold text-gray-700">العنوان</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 w-14 flex items-center justify-center border-l border-gray-200 bg-gray-50">
                      <MapPin size={20} className="text-gray-400" />
                    </div>
                    <Input 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Adresse de Livraison" 
                      className="pr-16 h-14 rounded-xl border-gray-200 focus-visible:ring-black text-lg" 
                    />
                  </div>
                </div>

                {/* Delivery Options */}
                {formData.wilaya && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4 pt-6 border-t border-gray-100"
                  >
                    <div className="flex items-center gap-2 font-bold text-gray-900 text-lg">
                      <Truck size={22} />
                      <span>نوع التوصيل</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label 
                        className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                          deliveryType === 'home' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setDeliveryType('home')}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            deliveryType === 'home' ? 'border-black' : 'border-gray-300'
                          }`}>
                            {deliveryType === 'home' && <div className="w-3 h-3 bg-black rounded-full" />}
                          </div>
                          <span className="font-bold">توصيل منزلي</span>
                        </div>
                        <span className="font-bold text-gray-600">{getDeliveryPrice(formData.wilaya, 'home').toLocaleString()} DA</span>
                      </label>

                      <label 
                        className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                          deliveryType === 'office' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setDeliveryType('office')}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            deliveryType === 'office' ? 'border-black' : 'border-gray-300'
                          }`}>
                            {deliveryType === 'office' && <div className="w-3 h-3 bg-black rounded-full" />}
                          </div>
                          <span className="font-bold">توصيل للمكتب</span>
                        </div>
                        <span className="font-bold text-gray-600">{getDeliveryPrice(formData.wilaya, 'office').toLocaleString()} DA</span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Summary Box */}
              <div className="bg-gray-50 p-8 rounded-2xl space-y-4 border border-gray-100">
                <div className="flex justify-between items-center text-lg">
                  <div className="flex items-center gap-3 text-gray-600">
                    <ShoppingCart size={20} />
                    <span className="font-medium">سعر المنتج</span>
                  </div>
                  <span className="font-bold">{(numericPrice * quantity).toLocaleString()} DA</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Truck size={20} />
                    <span className="font-medium">سعر التوصيل</span>
                  </div>
                  <span className={`${deliveryType ? 'text-red-600' : 'text-gray-400'} font-bold`}>
                    {deliveryType ? `${currentDeliveryPrice.toLocaleString()} DA` : "--"}
                  </span>
                </div>
                <div className="pt-6 border-t border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-3 font-black text-gray-900 text-xl">
                    <Calculator size={24} />
                    <span>المجموع</span>
                  </div>
                  <span className="text-3xl font-black text-gray-900">
                    {deliveryType ? `${total.toLocaleString()} DA` : "--"}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                disabled={isSubmitting}
                type="submit"
                className="w-full h-20 bg-black text-white hover:bg-gray-900 rounded-2xl text-2xl font-black flex items-center justify-center gap-4 group shadow-xl shadow-black/10"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={28} />
                ) : (
                  <ShoppingBag size={28} className="group-hover:scale-110 transition-transform" />
                )}
                <span>إشتري الآن</span>
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Social Links at bottom */}
        <div className="mt-20 flex justify-center gap-8 border-t border-gray-100 pt-12">
          <a href="#" className="text-gray-400 hover:text-black transition-colors">
            <Facebook size={32} />
          </a>
          <a href="#" className="text-gray-400 hover:text-black transition-colors">
            <Instagram size={32} />
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
