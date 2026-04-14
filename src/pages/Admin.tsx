import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, 
  PackagePlus, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  PhoneOff,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type OrderStatus = 'new' | 'verified' | 'not answering' | 'canceled';

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  phone_number: string;
  wilaya: string;
  baladia: string;
  address: string;
  product_name: string;
  quantity: number;
  total_price: number;
  delivery_price: number;
  delivery_type?: string;
  status: OrderStatus;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'sales'>('sales');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image_url: "",
    category: "Full Set"
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();

    // Set up real-time listener for new orders
    const ordersChannel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          setOrders((currentOrders) => [payload.new as Order, ...currentOrders]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  }

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    setIsSavingProduct(true);
    const { error } = await supabase
      .from('products')
      .insert([{
        ...newProduct,
        price: parseFloat(newProduct.price)
      }]);

    if (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    } else {
      setNewProduct({ name: "", price: "", description: "", image_url: "", category: "Full Set" });
      fetchProducts();
    }
    setIsSavingProduct(false);
  }

  async function deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) console.error(error);
    else fetchProducts();
  }

  async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating status:', error);
    } else {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">New</Badge>;
      case 'verified': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Verified</Badge>;
      case 'not answering': return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none">No Answer</Badge>;
      case 'canceled': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Canceled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 uppercase">Crown Admin</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <PackagePlus size={18} />
            Products
          </button>
          <button 
            onClick={() => setActiveTab('sales')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'sales' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ShoppingBag size={18} />
            Sales
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
            <Users size={18} />
            Customers
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h2 className="text-lg font-bold text-gray-900 capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input placeholder="Search..." className="pl-10 w-64 h-9 bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-gray-200" />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter size={16} />
              Filter
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'sales' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Recent Orders</h3>
                  <p className="text-sm text-gray-500">Manage and track your customer sales.</p>
                </div>
                <Button onClick={fetchOrders} variant="outline" size="sm">Refresh Data</Button>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[200px]">Customer</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-gray-500">Loading orders...</TableCell>
                      </TableRow>
                    ) : orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-gray-500">No orders found.</TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900">{order.customer_name}</span>
                              <span className="text-xs text-gray-500">{order.phone_number}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-900">{order.wilaya}</span>
                              <span className="text-xs text-gray-500">{order.baladia}</span>
                              {order.delivery_type && (
                                <span className="text-[10px] font-bold text-blue-600 mt-1 uppercase">{order.delivery_type}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">{order.product_name}</span>
                              <span className="text-xs text-gray-500">Qty: {order.quantity}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900">{(order.total_price + (order.delivery_price || 0)).toLocaleString()} DA</span>
                              <span className="text-[10px] text-gray-400 uppercase font-bold">Inc. Delivery</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(order.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'verified')} className="gap-2">
                                  <CheckCircle2 size={14} className="text-green-600" />
                                  Mark Verified
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'not answering')} className="gap-2">
                                  <PhoneOff size={14} className="text-yellow-600" />
                                  No Answer
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'canceled')} className="gap-2">
                                  <XCircle size={14} className="text-red-600" />
                                  Cancel Order
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'new')} className="gap-2">
                                  <Clock size={14} className="text-blue-600" />
                                  Reset to New
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Product Management</h3>
                  <p className="text-sm text-gray-500">Add or edit products in your store.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Product Form */}
                <form onSubmit={handleAddProduct} className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 h-fit space-y-6">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    <Plus size={18} />
                    Add New Product
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Product Name</Label>
                      <Input 
                        required
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="e.g. Crown Skincare Set" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (DA)</Label>
                      <Input 
                        required
                        type="number" 
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        placeholder="300" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input 
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        placeholder="Brief product summary" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input 
                        value={newProduct.image_url}
                        onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                        placeholder="https://..." 
                      />
                    </div>
                    <Button 
                      disabled={isSavingProduct}
                      type="submit" 
                      className="w-full bg-black text-white hover:bg-gray-800"
                    >
                      {isSavingProduct ? "Saving..." : "Save Product"}
                    </Button>
                  </div>
                </form>

                {/* Product List */}
                <div className="lg:col-span-2 space-y-4">
                  {products.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                      <p className="text-gray-500">No products added yet.</p>
                    </div>
                  ) : (
                    products.map((product) => (
                      <div key={product.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name} 
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <PackagePlus className="text-gray-300" size={24} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-900">{product.name}</h5>
                          <p className="text-xs text-gray-500">{product.price} DA • Active</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteProduct(product.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  label: 'Total Sales', 
                  value: `${orders.reduce((acc, curr) => acc + (curr.total_price || 0), 0).toLocaleString()} DA`, 
                  change: '+12%', 
                  icon: ShoppingBag, 
                  color: 'text-blue-600', 
                  bg: 'bg-blue-50' 
                },
                { 
                  label: 'Total Orders', 
                  value: orders.length.toString(), 
                  change: '+5%', 
                  icon: PackagePlus, 
                  color: 'text-green-600', 
                  bg: 'bg-green-50' 
                },
                { 
                  label: 'Verified Orders', 
                  value: orders.filter(o => o.status === 'verified').length.toString(), 
                  change: '+22%', 
                  icon: Users, 
                  color: 'text-purple-600', 
                  bg: 'bg-purple-50' 
                },
                { 
                  label: 'Pending Orders', 
                  value: orders.filter(o => o.status === 'new').length.toString(), 
                  change: '-3%', 
                  icon: Clock, 
                  color: 'text-yellow-600', 
                  bg: 'bg-yellow-50' 
                },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                    <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-500">{stat.label}</h4>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
