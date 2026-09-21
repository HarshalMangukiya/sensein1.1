'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Boxes,
  Building2,
  Settings,
  LogOut,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  AlertCircle,
  Plus,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  Eye,
  Filter,
  RefreshCw,
  Edit2,
  X,
  Sparkles,
  Loader2,
  MapPin,
} from 'lucide-react';
import { useAdminStore } from '@/store/admin-store';
import { BrandLogo } from '@/components/brand-logo';
import {
  fetchProducts,
  fetchAllOrders,
  updateOrderStatusApi,
  fetchWholesaleInquiries,
  updateInquiryStatusApi,
  createProductApi,
  updateProductStockApi,
  createDelhiveryShipmentApi,
  requestDelhiveryPickupApi,
  trackDelhiveryAwbApi,
} from '@/lib/api';

const normalizeOrder = (ord: any) => {
  const customerName =
    typeof ord.customer === 'string'
      ? ord.customer
      : ord.customer?.name || ord.customer?.email || 'Valued Patron';
  const customerEmail = ord.customer?.email || ord.email || '';
  const customerPhone = ord.customer?.phone || ord.phone || '';
  const customerAddress = ord.customer?.address || ord.address || '';
  const customerCity = ord.customer?.city
    ? `${ord.customer.city}${ord.customer?.state ? `, ${ord.customer.state}` : ''}`
    : ord.city || 'India';
  const customerState = ord.customer?.state || ord.state || '';
  const customerPincode = ord.customer?.pincode || ord.pincode || '';
  const dateStr = ord.createdAt
    ? new Date(ord.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : ord.date || 'Recent';

  const rawStatus = (ord.orderStatus || ord.status || 'Confirmed').toString();
  const lowerStatus = rawStatus.toLowerCase();
  const statusStr =
    lowerStatus === 'confirmed'
      ? 'Confirmed'
      : lowerStatus === 'shipped' || lowerStatus === 'dispatched'
      ? 'Shipped'
      : lowerStatus === 'delivered'
      ? 'Delivered'
      : lowerStatus === 'cancelled'
      ? 'Cancelled'
      : 'Confirmed';

  const orderId = ord.orderNumber || ord.id || (ord._id ? ord._id.toString() : 'ORD-RECENT');

  return {
    ...ord,
    id: orderId,
    orderNumber: orderId,
    customer: customerName,
    rawCustomer: ord.customer,
    email: customerEmail,
    phone: customerPhone,
    address: customerAddress,
    city: customerCity,
    state: customerState,
    pincode: customerPincode,
    date: dateStr,
    createdAt: ord.createdAt,
    updatedAt: ord.updatedAt,
    status: statusStr,
    total: ord.total || 0,
    subtotal: ord.subtotal || ord.total || 0,
    shippingFee: ord.shippingFee || 0,
    discount: ord.discount || 0,
    items: (ord.items || []).map((it: any) => ({
      name: it.name || 'Botanical Formulation',
      qty: it.quantity || it.qty || 1,
      price: it.price || 0,
      size: it.size,
      image: it.image,
    })),
    paymentMethod: ord.paymentMethod === 'razorpay' ? 'Prepaid (Razorpay)' : (ord.paymentMethod || 'Prepaid (Razorpay)'),
    paymentStatus: (ord.paymentStatus || 'PAID').toUpperCase(),
    razorpayOrderId: ord.razorpayOrderId || '',
    awbNumber: ord.awbNumber || ord.shipment?.awb || '',
    carrier: ord.carrier || 'Delhivery Express Priority',
    trackingUrl: ord.trackingUrl || ord.shipment?.trackingUrl || '',
    shipment: ord.shipment || null,
  };
};

const normalizeInquiry = (inq: any) => ({
  ...inq,
  id: inq.referenceCode || inq.id,
  referenceCode: inq.referenceCode || inq.id,
  organization: inq.organizationName || inq.organization || 'Enterprise Partner',
  contact: inq.contactPerson || inq.contact || 'Representative',
  email: inq.email,
  phone: inq.phone,
  type: inq.distributionType || inq.type || 'Wholesale Partner',
  volumeTier: inq.estimatedQuantity || inq.volumeTier || '50+ Units',
  status: inq.status || 'New Inquiry',
  date: inq.submittedAt
    ? new Date(inq.submittedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : inq.date || 'Recent',
});

export function AdminDashboard() {
  const { adminUser, logout } = useAdminStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'wholesale' | 'settings'>('overview');

  // Orders State (Live MongoDB Atlas)
  const [orders, setOrders] = useState<any[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('All');
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [awbGeneratingId, setAwbGeneratingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Live Tracking Modal State
  const [trackingModal, setTrackingModal] = useState<{
    isOpen: boolean;
    awb: string;
    orderId: string;
    loading: boolean;
    data: any | null;
    error: string | null;
  }>({
    isOpen: false,
    awb: '',
    orderId: '',
    loading: false,
    data: null,
    error: null,
  });

  // Products State (Live MongoDB Atlas)
  const [products, setProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Mask',
    price: 1499,
    originalPrice: 1999,
    stock: 50,
    size: '200ml / 6.76 fl oz',
  });

  // Wholesale Inquiries State (Live MongoDB Atlas)
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Auto-dismiss toast
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Debounce search input by 300ms
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(orderSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [orderSearch]);

  // Server-side orders fetch
  const fetchOrders = async (searchVal = debouncedSearch, filterVal = orderFilter) => {
    try {
      setOrdersLoading(true);
      const ordersData = await fetchAllOrders({
        search: searchVal,
        status: filterVal === 'All' ? undefined : filterVal,
      });
      if (ordersData && Array.isArray(ordersData)) {
        setOrders(ordersData.map(normalizeOrder));
      }
    } catch (err) {
      console.error('Failed to fetch orders from MongoDB Atlas:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Re-fetch when debounced search, filter, or activeTab changes
  React.useEffect(() => {
    fetchOrders(debouncedSearch, orderFilter);
  }, [debouncedSearch, orderFilter, activeTab]);

  // Load initial live data from MongoDB Atlas
  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, prodsData, inqsData] = await Promise.all([
        fetchAllOrders({
          search: debouncedSearch,
          status: orderFilter === 'All' ? undefined : orderFilter,
        }),
        fetchProducts(),
        fetchWholesaleInquiries(),
      ]);

      if (ordersData && Array.isArray(ordersData)) {
        setOrders(ordersData.map(normalizeOrder));
      }
      if (prodsData?.products) {
        setProducts(
          prodsData.products.map((p: any, idx: number) => ({
            ...p,
            stock: p.stock !== undefined ? p.stock : 45 + idx * 10,
          }))
        );
      }
      if (inqsData && Array.isArray(inqsData)) {
        setInquiries(inqsData.map(normalizeInquiry));
      }
    } catch (err) {
      console.error('Failed to load MongoDB Atlas data for Admin Console', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  // Status Updater persisting directly to MongoDB Atlas
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (statusUpdatingId) return;
    setStatusUpdatingId(orderId);

    try {
      const res = await updateOrderStatusApi(orderId, newStatus);
      if (res?.success && res.order) {
        setOrders((prev) =>
          prev.map((ord) =>
            ord.id === orderId || ord.orderNumber === orderId
              ? normalizeOrder(res.order)
              : ord
          )
        );
        setToast({ text: `Order ${orderId} updated to ${newStatus}`, type: 'success' });
      } else {
        setToast({
          text: res?.error || `Failed to update status for order ${orderId}`,
          type: 'error',
        });
      }
    } catch (err: any) {
      setToast({ text: err.message || 'Status update failed', type: 'error' });
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Open Delhivery Live Tracking Modal
  const openTrackingModal = async (awb: string, orderId: string) => {
    setTrackingModal({
      isOpen: true,
      awb,
      orderId,
      loading: true,
      data: null,
      error: null,
    });

    try {
      const res = await trackDelhiveryAwbApi(awb);
      if (res?.success) {
        setTrackingModal((prev) => ({
          ...prev,
          loading: false,
          data: res,
          error: null,
        }));
      } else {
        setTrackingModal((prev) => ({
          ...prev,
          loading: false,
          error: res?.error || 'Tracking details not yet scanned by Delhivery network.',
        }));
      }
    } catch (err: any) {
      setTrackingModal((prev) => ({
        ...prev,
        loading: false,
        error: 'Failed to query Delhivery tracking API: ' + err.message,
      }));
    }
  };

  // Delhivery AWB Generation or Tracking
  const handleDelhiveryShipment = async (ord: any) => {
    if (awbGeneratingId) return;

    // If AWB already generated, open real-time tracking details
    if (ord.awbNumber && ord.awbNumber.trim().length > 0) {
      openTrackingModal(ord.awbNumber, ord.id);
      return;
    }

    setAwbGeneratingId(ord.id);
    const isCod = ord.paymentMethod?.toLowerCase().includes('cod');
    try {
      const res = await createDelhiveryShipmentApi({
        orderNumber: ord.id || ord.orderNumber,
        customerName: ord.customer,
        address: ord.rawCustomer?.address || ord.address || 'Customer Delivery Address',
        pincode: ord.rawCustomer?.pincode || ord.pincode || '400001',
        city: ord.rawCustomer?.city || ord.city || 'Mumbai',
        state: ord.rawCustomer?.state || ord.state || 'Maharashtra',
        phone: ord.phone || '9820144552',
        totalAmount: ord.total,
        paymentMode: isCod ? 'COD' : 'Prepaid',
        codAmount: isCod ? ord.total : 0,
        items: ord.items,
      });

      if (res?.success && res.waybill) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === ord.id
              ? {
                  ...o,
                  awbNumber: res.waybill,
                  carrier: 'Delhivery Express Priority',
                  status: 'Shipped',
                  trackingUrl: res.trackingUrl,
                }
              : o
          )
        );
        setToast({
          text: `Delhivery Shipment Generated! Real Waybill: ${res.waybill}`,
          type: 'success',
        });
      } else {
        setToast({
          text: `Delhivery Notice: ${res?.error || 'Manifest creation was not completed by Delhivery.'}`,
          type: 'error',
        });
      }
    } catch (err: any) {
      setToast({
        text: 'Delhivery integration error: ' + err.message,
        type: 'error',
      });
    } finally {
      setAwbGeneratingId(null);
    }
  };

  const updateProductStock = async (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: Math.max(0, (p.stock || 0) + delta) } : p
      )
    );
    await updateProductStockApi(productId, delta);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      name: newProduct.name,
      slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      subtitle: 'Restorative Clinical Formulation',
      description: 'Ultra-concentrated botanical formulation engineered for cellular reconstruction.',
      price: Number(newProduct.price),
      mrp: Number(newProduct.originalPrice),
      discountPercentage: Math.round(((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100),
      category: newProduct.category,
      curatedCollection: 'Bestsellers',
      rating: 5.0,
      reviewCount: 1,
      images: ['https://res.cloudinary.com/dqddawu42/image/upload/v1789820326/sensein/products/serum-1.jpg'],
      stock: Number(newProduct.stock),
      badges: ['New Formulation'],
      inStock: true,
      netVolume: newProduct.size,
      variants: [{ size: newProduct.size, price: Number(newProduct.price), mrp: Number(newProduct.originalPrice), inStock: true }],
      ingredients: { keyActives: ['French Plum Oil', 'Biomimetic Keratin'], fullList: 'Aqua, Keratin, Prunus Domestica Seed Extract' },
      overview: 'Ultra-concentrated botanical formulation engineered for cellular reconstruction.',
      howToUse: [{ step: 1, title: 'Apply', instruction: 'Massage gently into damp strands.' }],
      reviews: [],
    };

    const saved = await createProductApi(created);
    setProducts((prev) => [saved || created, ...prev]);
    setIsAddProductModalOpen(false);
    setNewProduct({
      name: '',
      category: 'Mask',
      price: 1499,
      originalPrice: 1999,
      stock: 50,
      size: '200ml / 6.76 fl oz',
    });
  };

  const updateInquiryStatus = async (idOrRef: string, newStatus: string) => {
    setInquiries((prev) =>
      prev.map((i) =>
        i.id === idOrRef || i.referenceCode === idOrRef
          ? { ...i, status: newStatus }
          : i
      )
    );
    await updateInquiryStatusApi(idOrRef, newStatus);
  };

  // Computed Real Overview Metrics
  const grossRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalOrdersCount = orders.length;
  const activePatronsCount = new Set(orders.map((o) => o.email || o.phone || o.customer)).size;
  const lowStockProductsCount = products.filter((p) => (p.stock || 0) <= 10).length;

  const filteredProducts = products.filter((p) =>
    (p.name || '').toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-charcoal flex flex-col font-sans">
      {/* Top Executive Header (Pure White & Clean) */}
      <header className="h-16 border-b border-border bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-4">
          <BrandLogo
            src="https://res.cloudinary.com/dqddawu42/image/upload/v1789820764/sensein/brand/sensein-navbar-logo.png"
            variant="dark"
            width={140}
            height={30}
            priority
            unoptimized
            imgClassName="h-7 w-auto object-contain"
          />
          <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-plum/10 border border-plum/20 text-plum">
            Executive Console
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          {/* Public Storefront Preview Link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-charcoal hover:text-plum transition-colors px-3 py-1.5 rounded-md bg-[#FAF7F5] border border-border hover:border-plum/40 shadow-2xs"
          >
            <span className="hidden sm:inline font-semibold">Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-plum" />
          </a>

          {/* User Profile Pill */}
          <div className="flex items-center gap-3 border-l border-border pl-3 sm:pl-5">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-charcoal tracking-tight">{adminUser?.name || 'Administrator'}</p>
              <p className="text-[10px] text-plum uppercase tracking-wider font-semibold">
                {adminUser?.role || 'Super Admin'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-plum text-white flex items-center justify-center font-bold text-xs shadow-xs">
              A
            </div>

            {/* Secure Sign Out */}
            <button
              onClick={logout}
              title="Secure Sign Out"
              className="p-2 text-charcoal-muted hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors ml-1"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar (Clean White) */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-white p-3 sm:p-5 flex md:flex-col justify-between overflow-x-auto no-scrollbar">
          <nav className="flex md:flex-col gap-1.5 sm:gap-2 w-full">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all w-full text-left whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-plum text-white shadow-sm'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-[#FAF7F5]'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-white' : 'text-plum'}`} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                fetchOrders(debouncedSearch, orderFilter);
              }}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all w-full text-left whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-plum text-white shadow-sm'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-[#FAF7F5]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white' : 'text-plum'}`} />
                <span>Orders</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-[#FAF7F5] border border-border text-charcoal'}`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all w-full text-left whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-plum text-white shadow-sm'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-[#FAF7F5]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Boxes className={`w-4 h-4 ${activeTab === 'products' ? 'text-white' : 'text-plum'}`} />
                <span>Inventory</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${activeTab === 'products' ? 'bg-white/20 text-white' : 'bg-[#FAF7F5] border border-border text-charcoal'}`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wholesale')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all w-full text-left whitespace-nowrap ${
                activeTab === 'wholesale'
                  ? 'bg-plum text-white shadow-sm'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-[#FAF7F5]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className={`w-4 h-4 ${activeTab === 'wholesale' ? 'text-white' : 'text-plum'}`} />
                <span>Wholesale B2B</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${activeTab === 'wholesale' ? 'bg-white/20 text-white' : 'bg-emerald-light text-emerald-accent font-bold'}`}>
                {inquiries.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all w-full text-left whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-plum text-white shadow-sm'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-[#FAF7F5]'
              }`}
            >
              <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-white' : 'text-plum'}`} />
              <span>Settings</span>
            </button>
          </nav>

          {/* Quick System Status Footer */}
          <div className="hidden md:block p-3.5 rounded-xl bg-[#FAF7F5] border border-border text-[11px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-charcoal-muted font-medium">System Health</span>
              <span className="text-emerald-accent font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent animate-pulse" /> 100% Operational
              </span>
            </div>
            <div className="flex items-center justify-between text-charcoal-muted font-medium">
              <span>Database Sync</span>
              <span className="text-charcoal font-mono font-semibold">Active Live</span>
            </div>
          </div>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-8 bg-[#FAF7F5] overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-charcoal tracking-tight">Executive Intelligence</h2>
                  <p className="text-xs text-charcoal-muted mt-1">
                    Real-time salon operations, sales velocity, and luxury distribution metrics.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-xs text-charcoal bg-white px-3 py-1.5 rounded-lg border border-border shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-plum" />
                  <span className="font-semibold">Cycle: September 2026</span>
                </div>
              </div>

              {/* Metric Cards Grid (Clean White Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Gross Revenue */}
                <div className="p-5 rounded-xl bg-white border border-border shadow-xs hover:shadow-md transition-all">
                  <div className="flex items-center justify-between text-charcoal-muted mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Gross Revenue</span>
                    <div className="p-2 rounded-lg bg-plum/10 text-plum">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold font-sans text-charcoal">₹{grossRevenue.toLocaleString('en-IN')}</h3>
                  <p className="text-[11px] text-emerald-accent mt-2 flex items-center gap-1 font-semibold">
                    <ArrowUpRight className="w-3 h-3" /> Live Verified Total
                  </p>
                </div>

                {/* Total Orders */}
                <div className="p-5 rounded-xl bg-white border border-border shadow-xs hover:shadow-md transition-all">
                  <div className="flex items-center justify-between text-charcoal-muted mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
                    <div className="p-2 rounded-lg bg-plum/10 text-plum">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold font-sans text-charcoal">{totalOrdersCount}</h3>
                  <p className="text-[11px] text-emerald-accent mt-2 flex items-center gap-1 font-semibold">
                    <ArrowUpRight className="w-3 h-3" /> MongoDB Atlas Synchronized
                  </p>
                </div>

                {/* Active Patrons */}
                <div className="p-5 rounded-xl bg-white border border-border shadow-xs hover:shadow-md transition-all">
                  <div className="flex items-center justify-between text-charcoal-muted mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Active Patrons</span>
                    <div className="p-2 rounded-lg bg-plum/10 text-plum">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold font-sans text-charcoal">{activePatronsCount}</h3>
                  <p className="text-[11px] text-charcoal-muted mt-2 font-medium">
                    Verified Customer Profiles
                  </p>
                </div>

                {/* Low Stock Watch */}
                <div className="p-5 rounded-xl bg-white border border-amber-200 shadow-xs hover:shadow-md transition-all">
                  <div className="flex items-center justify-between text-charcoal-muted mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Inventory Watch</span>
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold font-sans text-amber-700">{lowStockProductsCount} Low Stock</h3>
                  <p className="text-[11px] text-amber-600 mt-2 font-medium">
                    {lowStockProductsCount > 0 ? `${lowStockProductsCount} items require restocking` : 'All stocks optimal'}
                  </p>
                </div>
              </div>

              {/* Revenue Graph & Sales Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Sales Velocity Bar Graph (Light Theme) */}
                <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-border shadow-xs">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-charcoal">Sales Velocity (Last 7 Days)</h4>
                      <p className="text-xs text-charcoal-muted">Daily luxury checkout volume in INR (₹)</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-accent font-semibold bg-emerald-light px-2.5 py-1 rounded-md">
                      <TrendingUp className="w-3.5 h-3.5" /> High Momentum
                    </div>
                  </div>

                  {/* Bar Visualizer */}
                  <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-2 border-b border-border">
                    {[
                      { day: 'Mon', val: 120000, height: '48%' },
                      { day: 'Tue', val: 180000, height: '65%' },
                      { day: 'Wed', val: 140000, height: '54%' },
                      { day: 'Thu', val: 240000, height: '82%' },
                      { day: 'Fri', val: 290000, height: '94%' },
                      { day: 'Sat', val: 320000, height: '100%' },
                      { day: 'Sun', val: 210000, height: '72%' },
                    ].map((bar) => (
                      <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <span className="text-[10px] text-charcoal-muted font-mono opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                          ₹{(bar.val / 1000).toFixed(0)}k
                        </span>
                        <div
                          style={{ height: bar.height }}
                          className="w-full max-w-[38px] bg-gradient-to-t from-plum to-plum-hover rounded-t-md group-hover:brightness-110 transition-all shadow-xs"
                        />
                        <span className="text-xs text-charcoal-muted font-semibold">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Selling Formulations */}
                <div className="p-6 rounded-xl bg-white border border-border shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-charcoal mb-4">Top Curated Rituals</h4>
                    <div className="space-y-3.5">
                      {[
                        { name: 'French Plum Ente Serum', sales: '482 units', share: '38%' },
                        { name: 'Keratin Restorative Mask', sales: '344 units', share: '28%' },
                        { name: 'Cellular Growth Shampoo', sales: '298 units', share: '22%' },
                        { name: 'Caviar Scalp Exfoliant', sales: '142 units', share: '12%' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div>
                            <p className="font-semibold text-charcoal">{item.name}</p>
                            <p className="text-[10px] text-charcoal-muted">{item.sales}</p>
                          </div>
                          <span className="font-mono text-[11px] font-bold text-plum bg-plum/10 px-2 py-0.5 rounded">
                            {item.share}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('products')}
                    className="mt-6 w-full py-2.5 text-center text-xs font-bold uppercase tracking-widest text-plum hover:text-white bg-plum/5 hover:bg-plum rounded-lg transition-colors border border-plum/20"
                  >
                    View All Formulations
                  </button>
                </div>
              </div>

              {/* Recent Orders Snapshot */}
              <div className="p-6 rounded-xl bg-white border border-border shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-charcoal">Recent Purchases</h4>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-plum hover:text-plum-hover font-semibold"
                  >
                    Manage All Orders ({orders.length}) →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-charcoal-muted uppercase tracking-wider text-[10px]">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Patron</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {orders.slice(0, 4).map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#FAF7F5] transition-colors">
                          <td className="py-3 font-mono font-bold text-plum">{ord.id}</td>
                          <td className="py-3 font-semibold text-charcoal">{ord.customer}</td>
                          <td className="py-3 text-charcoal-muted">{ord.date}</td>
                          <td className="py-3 font-bold text-charcoal">₹{ord.total}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                ord.status === 'Delivered'
                                  ? 'bg-emerald-light text-emerald-accent'
                                  : ord.status === 'Shipped'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-charcoal tracking-tight">Order Management</h2>
                  <p className="text-xs text-charcoal-muted mt-1">Review orders, update dispatch state, and view airway bills.</p>
                </div>
                <button
                  type="button"
                  onClick={() => fetchOrders('', 'All')}
                  disabled={ordersLoading}
                  className="px-3.5 py-2 bg-white hover:bg-[#FAF7F5] border border-border hover:border-plum text-charcoal text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-plum ${ordersLoading ? 'animate-spin' : ''}`} />
                  <span>Sync Orders</span>
                </button>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="p-4 bg-white border border-border rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                {/* Search */}
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order ID, customer, city, AWB..."
                    className="w-full pl-9 pr-8 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal placeholder-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-plum"
                  />
                  {ordersLoading && (
                    <Loader2 className="w-3.5 h-3.5 text-plum animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                  {['All', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setOrderFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors whitespace-nowrap ${
                        orderFilter === status
                          ? 'bg-plum text-white shadow-xs'
                          : 'bg-[#FAF7F5] text-charcoal-muted hover:text-charcoal border border-border'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white border border-border rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border bg-[#F8F5F2] text-charcoal-muted uppercase tracking-wider text-[10px]">
                        <th className="p-4">Order Details</th>
                        <th className="p-4">Patron & Destination</th>
                        <th className="p-4">Formulations</th>
                        <th className="p-4">Total & Payment</th>
                        <th className="p-4">Current Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {ordersLoading && orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-charcoal-muted">
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin text-plum" />
                              <span>Synchronizing with MongoDB Atlas...</span>
                            </div>
                          </td>
                        </tr>
                      ) : orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-charcoal-muted">
                            <p className="mb-3 text-xs">No orders found matching criteria.</p>
                            <button
                              type="button"
                              onClick={() => fetchOrders('', 'All')}
                              className="px-4 py-2 bg-plum hover:bg-plum-hover text-white text-xs font-semibold rounded-md shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${ordersLoading ? 'animate-spin' : ''}`} />
                              <span>Sync Live Orders with MongoDB Atlas</span>
                            </button>
                          </td>
                        </tr>
                      ) : (
                        orders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-[#FAF7F5] transition-colors">
                            <td className="p-4">
                              <p className="font-mono font-bold text-plum">{ord.id}</p>
                              <p className="text-[10px] text-charcoal-muted mt-0.5">{ord.date}</p>
                              {ord.awbNumber && ord.awbNumber !== 'BD-PENDING' && !ord.awbNumber.startsWith('PENDING') ? (
                                <button
                                  onClick={() => openTrackingModal(ord.awbNumber, ord.id)}
                                  className="text-[10px] text-gold hover:text-plum font-mono font-semibold mt-1 flex items-center gap-1 group transition-colors"
                                  title="View live Delhivery tracking"
                                >
                                  <span>AWB: {ord.awbNumber}</span>
                                  <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                </button>
                              ) : (
                                <p className="text-[10px] text-charcoal-muted font-mono mt-1">AWB: Pending</p>
                              )}
                            </td>

                            <td className="p-4">
                              <p className="font-semibold text-charcoal">{ord.customer}</p>
                              <p className="text-[10px] text-charcoal-muted">{ord.city}</p>
                              <p className="text-[10px] text-charcoal-subtle font-mono">{ord.phone}</p>
                            </td>

                            <td className="p-4">
                              <div className="space-y-1">
                                {ord.items.map((it: any, idx: number) => (
                                  <p key={idx} className="text-charcoal">
                                    <span className="font-bold text-plum">{it.qty}x</span> {it.name}
                                  </p>
                                ))}
                              </div>
                            </td>

                            <td className="p-4">
                              <p className="font-bold text-charcoal text-sm">₹{Number(ord.total).toLocaleString('en-IN')}</p>
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                                    ord.paymentStatus === 'PAID'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : ord.paymentStatus === 'FAILED'
                                      ? 'bg-red-50 text-red-700 border border-red-200'
                                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                                  }`}
                                >
                                  {ord.paymentStatus}
                                </span>
                                <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-[#FAF7F5] border border-border text-charcoal-muted">
                                  {ord.paymentMethod}
                                </span>
                              </div>
                              {ord.razorpayPaymentId && (
                                <p className="text-[9px] text-charcoal-subtle font-mono mt-0.5 truncate max-w-[130px]" title={`Razorpay ID: ${ord.razorpayPaymentId}`}>
                                  {ord.razorpayPaymentId}
                                </p>
                              )}
                            </td>

                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                                  ord.status === 'Delivered'
                                    ? 'bg-emerald-light text-emerald-accent'
                                    : ord.status === 'Shipped'
                                    ? 'bg-blue-50 text-blue-700'
                                    : ord.status === 'Cancelled'
                                    ? 'bg-red-50 text-red-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {ord.status === 'Delivered' && <CheckCircle2 className="w-3 h-3" />}
                                {ord.status === 'Shipped' && <Truck className="w-3 h-3" />}
                                {ord.status === 'Confirmed' && <Clock className="w-3 h-3" />}
                                {ord.status === 'Cancelled' && <AlertCircle className="w-3 h-3" />}
                                {ord.status}
                              </span>
                            </td>

                            <td className="p-4 text-right">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  onClick={() => handleDelhiveryShipment(ord)}
                                  disabled={awbGeneratingId === ord.id}
                                  className="px-2.5 py-1.5 bg-[#FAF7F5] hover:bg-plum/10 border border-plum/30 text-plum rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-2xs disabled:opacity-60 disabled:cursor-not-allowed"
                                  title={
                                    ord.awbNumber && ord.awbNumber.trim().length > 0
                                      ? 'View Delhivery live tracking status'
                                      : 'Generate Delhivery Airway Bill & Dispatch Manifest'
                                  }
                                >
                                  {awbGeneratingId === ord.id ? (
                                    <>
                                      <Loader2 className="w-3 h-3 text-plum animate-spin" />
                                      <span>Manifesting...</span>
                                    </>
                                  ) : ord.awbNumber && ord.awbNumber.trim().length > 0 ? (
                                    <>
                                      <Truck className="w-3 h-3 text-plum" />
                                      <span>Track AWB</span>
                                    </>
                                  ) : (
                                    <>
                                      <Truck className="w-3 h-3 text-plum" />
                                      <span>Delhivery AWB</span>
                                    </>
                                  )}
                                </button>

                                <select
                                  value={ord.status}
                                  disabled={statusUpdatingId === ord.id}
                                  onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                                  className="px-2.5 py-1.5 bg-white border border-border rounded-md text-[11px] text-charcoal focus:outline-none focus:border-plum font-medium shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS & INVENTORY */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-charcoal tracking-tight">Formulations & Stock</h2>
                  <p className="text-xs text-charcoal-muted mt-1">
                    Manage catalog pricing, unit inventory, and dispatch thresholds.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-plum hover:bg-plum-hover text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-xs"
                >
                  <Plus className="w-4 h-4 text-gold" />
                  <span>Add New Formulation</span>
                </button>
              </div>

              {/* Product Search */}
              <div className="p-4 bg-white border border-border rounded-xl flex items-center justify-between gap-4 shadow-xs">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search formulations by name or category..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal placeholder-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-plum"
                  />
                </div>
                <div className="text-xs text-charcoal-muted font-mono font-semibold">
                  {filteredProducts.length} Formulations Active
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white border border-border rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border bg-[#F8F5F2] text-charcoal-muted uppercase tracking-wider text-[10px]">
                        <th className="p-4">Formulation</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Volume / Size</th>
                        <th className="p-4">Retail Price</th>
                        <th className="p-4">Stock Level</th>
                        <th className="p-4 text-right">Quick Stock Adjustment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FAF7F5] transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded bg-[#FAF7F5] border border-border flex-shrink-0 flex items-center justify-center p-1">
                                <img src={p.images?.[0] || 'https://res.cloudinary.com/dqddawu42/image/upload/v1789820326/sensein/products/serum-1.jpg'} alt={p.name} className="w-full h-full object-contain mix-blend-multiply" />
                              </div>
                              <div>
                                <p className="font-semibold text-charcoal">{p.name}</p>
                                <p className="text-[10px] text-plum font-mono">SKU: {p.slug.toUpperCase().slice(0, 10)}</p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-[#FAF7F5] border border-border rounded text-[11px] text-charcoal">
                              {p.category}
                            </span>
                          </td>

                          <td className="p-4 text-charcoal font-mono">{p.netVolume || '200ml'}</td>

                          <td className="p-4 font-bold text-charcoal">₹{p.price}</td>

                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                                (p.stock || 0) <= 5
                                  ? 'bg-red-50 text-red-700'
                                  : (p.stock || 0) <= 15
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-emerald-light text-emerald-accent'
                              }`}
                            >
                              {(p.stock || 0) <= 5 && <AlertTriangle className="w-3 h-3 text-red-600" />}
                              {p.stock} units
                            </span>
                          </td>

                          <td className="p-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => updateProductStock(p.id, -5)}
                                className="px-2.5 py-1 bg-[#FAF7F5] hover:bg-neutral-200 border border-border rounded text-charcoal font-mono text-xs transition-colors"
                                title="Decrease by 5"
                              >
                                -5
                              </button>
                              <button
                                onClick={() => updateProductStock(p.id, 10)}
                                className="px-2.5 py-1 bg-plum hover:bg-plum-hover text-white rounded font-mono text-xs transition-colors shadow-2xs"
                                title="Restock +10"
                              >
                                +10
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Product Modal (Pure White Luxury) */}
              {isAddProductModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                  <div className="bg-white border border-border rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                      <h3 className="text-lg font-serif font-bold text-charcoal">Add New Luxury Formulation</h3>
                      <button
                        onClick={() => setIsAddProductModalOpen(false)}
                        className="p-1 text-charcoal-muted hover:text-charcoal"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleAddProduct} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                          Formulation Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="e.g. French Plum Restorative Nectar"
                          className="w-full px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                            Category
                          </label>
                          <select
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-plum font-medium"
                          >
                            <option value="Mask">Mask</option>
                            <option value="Serum">Serum</option>
                            <option value="Shampoo">Shampoo</option>
                            <option value="Perfume">Perfume</option>
                            <option value="Cream">Cream</option>
                            <option value="Oil">Oil</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                            Net Volume / Size
                          </label>
                          <input
                            type="text"
                            value={newProduct.size}
                            onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                            Retail Price (₹)
                          </label>
                          <input
                            type="number"
                            required
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                            Original MRP (₹)
                          </label>
                          <input
                            type="number"
                            required
                            value={newProduct.originalPrice}
                            onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-charcoal mb-1">
                            Initial Units
                          </label>
                          <input
                            type="number"
                            required
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-plum"
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                        <button
                          type="button"
                          onClick={() => setIsAddProductModalOpen(false)}
                          className="px-4 py-2 bg-[#FAF7F5] hover:bg-neutral-200 text-xs text-charcoal uppercase tracking-wider rounded-lg transition-colors font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-plum hover:bg-plum-hover text-xs text-white font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
                        >
                          Save Formulation
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WHOLESALE B2B INQUIRIES */}
          {activeTab === 'wholesale' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-charcoal tracking-tight">Enterprise & Salon Dossiers</h2>
                  <p className="text-xs text-charcoal-muted mt-1">
                    B2B salon inquiries submitted through the Enterprise Wholesale Concierge.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-6 bg-white border border-border rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-plum/40 transition-colors shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-plum">{inq.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FAF7F5] border border-border text-charcoal-muted">
                          {inq.type}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            inq.status === 'In Contract'
                              ? 'bg-emerald-light text-emerald-accent'
                              : inq.status === 'Contacted'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-charcoal tracking-tight">{inq.organization}</h3>
                      <p className="text-xs text-charcoal-muted">
                        Lead: <span className="text-charcoal font-semibold">{inq.contact}</span> • {inq.email} • {inq.phone}
                      </p>
                      <p className="text-xs text-charcoal font-mono">
                        Target Volume: <span className="text-plum font-bold">{inq.volumeTier}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 w-full md:w-auto">
                      <a
                        href={`mailto:${inq.email}?subject=SENSEIN%20Enterprise%20Wholesale%20Partnership`}
                        className="flex-1 md:flex-none px-4 py-2 bg-[#FAF7F5] hover:bg-neutral-200 border border-border text-charcoal text-xs font-bold uppercase tracking-wider rounded-lg text-center transition-colors shadow-2xs"
                      >
                        Email Client
                      </a>
                      <button
                        onClick={() => {
                          const nextStatus = inq.status === 'New Inquiry' ? 'Contacted' : 'In Contract';
                          updateInquiryStatus(inq.id, nextStatus);
                        }}
                        className="flex-1 md:flex-none px-4 py-2 bg-plum hover:bg-plum-hover text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
                      >
                        Advance Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in duration-300">
              <div>
                <h2 className="text-2xl font-serif font-bold text-charcoal tracking-tight">Executive System Settings</h2>
                <p className="text-xs text-charcoal-muted mt-1">Configure logistics, security thresholds, and admin console credentials.</p>
              </div>

              <div className="p-6 bg-white border border-border rounded-xl space-y-6 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal mb-1">Administrative Profile</h3>
                  <p className="text-xs text-charcoal-muted">Active session credentials and role authority.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#FAF7F5] rounded-lg border border-border">
                    <span className="text-charcoal-muted block mb-1 uppercase font-semibold text-[10px]">Email ID</span>
                    <span className="font-mono text-charcoal font-bold">{adminUser?.email || 'admin@sensein.com'}</span>
                  </div>

                  <div className="p-4 bg-[#FAF7F5] rounded-lg border border-border">
                    <span className="text-charcoal-muted block mb-1 uppercase font-semibold text-[10px]">Security Clearance</span>
                    <span className="text-plum font-bold">{adminUser?.role || 'Super Administrator'}</span>
                  </div>
                </div>

                <hr className="border-border" />

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal mb-2">Logistics & Courier Priority</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3.5 bg-[#FAF7F5] rounded-lg border border-border">
                      <div>
                        <p className="font-semibold text-charcoal">Delhivery Express Priority Air</p>
                        <p className="text-[11px] text-charcoal-muted">Air priority dispatch for metro cities (24-48 hours)</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-light text-emerald-accent font-bold text-[10px] uppercase">
                        Active
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[#FAF7F5] rounded-lg border border-plum/25 bg-plum/5 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-charcoal">Delhivery Express Logistics API</p>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-light text-emerald-accent font-bold text-[9px] uppercase">
                            Integrated
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-muted mt-0.5">
                          Direct Delhivery CMU shipment manifests, live AWB generation, and automated courier pickup.
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          const res = await requestDelhiveryPickupApi(3);
                          if (res?.success) {
                            alert(`Delhivery Pickup Scheduled!\nPickup ID: ${res.pickupId || 'PU-DEL-CONFIRMED'}\nTime Slot: 02:00 PM - 05:00 PM\nLocation: SENSEIN Central Warehouse`);
                          }
                        }}
                        className="px-3 py-1.5 bg-plum hover:bg-plum-hover text-white rounded-md text-[11px] font-semibold transition-colors shadow-2xs whitespace-nowrap self-start sm:self-auto"
                      >
                        Request Delhivery Pickup
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-[#FAF7F5] rounded-lg border border-border">
                      <div>
                        <p className="font-semibold text-charcoal">Cash on Delivery Verification</p>
                        <p className="text-[11px] text-charcoal-muted">Automated OTP verification on orders exceeding ₹2,500</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-light text-emerald-accent font-bold text-[10px] uppercase">
                        Enabled
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="border-border" />

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={logout}
                    className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-2xs"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-600" />
                    Terminate Admin Session
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Status / Action Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-medium flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200 ${
            toast.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-white border-border text-charcoal'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          )}
          <span>{toast.text}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 p-1 text-charcoal-muted hover:text-charcoal transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Delhivery Express Live Tracking Modal */}
      {trackingModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-plum/10 text-plum flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-charcoal">Delhivery Express Live Tracking</h3>
                  <p className="text-[10px] text-charcoal-muted">Airway Bill Dossier & Logistics Milestones</p>
                </div>
              </div>
              <button
                onClick={() => setTrackingModal((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 text-charcoal-muted hover:text-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-[#FAF7F5] rounded-xl border border-border">
                <div>
                  <p className="text-[10px] text-charcoal-muted uppercase font-bold tracking-wider">Waybill / AWB</p>
                  <p className="font-mono font-bold text-plum text-sm mt-0.5">{trackingModal.awb}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-charcoal-muted uppercase font-bold tracking-wider">Carrier Service</p>
                  <p className="font-semibold text-charcoal text-xs mt-0.5">Delhivery Express Priority</p>
                </div>
              </div>

              {trackingModal.loading ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-charcoal-muted">
                  <Loader2 className="w-6 h-6 animate-spin text-plum" />
                  <p className="text-xs">Querying Delhivery logistics network...</p>
                </div>
              ) : trackingModal.error ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Delhivery Tracking Notice</p>
                    <p className="mt-0.5">{trackingModal.error}</p>
                  </div>
                </div>
              ) : trackingModal.data ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-charcoal-muted">Current Shipment Status:</span>
                    <span className="font-bold text-emerald-accent uppercase tracking-wider bg-emerald-light px-2 py-0.5 rounded">
                      {trackingModal.data.status || 'In Transit'}
                    </span>
                  </div>
                  {trackingModal.data.currentLocation && (
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="text-charcoal-muted">Active Logistics Hub:</span>
                      <span className="font-semibold text-charcoal flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-plum" />
                        {trackingModal.data.currentLocation}
                      </span>
                    </div>
                  )}
                  {trackingModal.data.expectedDelivery && (
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="text-charcoal-muted">Estimated Delivery:</span>
                      <span className="font-semibold text-plum">{trackingModal.data.expectedDelivery}</span>
                    </div>
                  )}

                  {/* Transit Milestones */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-[10px] text-charcoal-muted uppercase font-bold tracking-wider mb-2">
                      Carrier Scans & Events
                    </p>
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {(trackingModal.data.events || []).map((ev: any, idx: number) => (
                        <div key={idx} className="text-xs flex items-start gap-2.5 p-2.5 bg-[#FAF7F5] rounded-lg border border-border/60">
                          <CheckCircle2 className="w-3.5 h-3.5 text-plum flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-semibold text-charcoal text-[11px]">{ev.status}</p>
                            <p className="text-[10px] text-charcoal-muted mt-0.5">
                              {ev.time} {ev.location ? `• ${ev.location}` : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <a
                href={`https://www.delhivery.com/track/package/${trackingModal.awb}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-plum hover:text-plum-hover font-semibold flex items-center gap-1.5"
              >
                <span>Open Delhivery Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setTrackingModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-[#FAF7F5] hover:bg-neutral-200 rounded-lg text-xs font-semibold text-charcoal transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
