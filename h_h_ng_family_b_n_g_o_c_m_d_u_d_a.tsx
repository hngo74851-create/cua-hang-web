import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Phone, MessageCircle, Send, Search, Plus, 
  Trash2, Edit3, Settings, Store, Lock, LogOut, Check, X, 
  Sparkles, ShieldCheck, Upload, ChevronLeft, ChevronRight, Image as ImageIcon, Droplet, Wheat, Flame, Star
} from 'lucide-react';

// Default AI High-Quality Commercial Images for Rice, Coconut Oil & Feed
const DEFAULT_PRODUCTS = [
  {
    id: '1',
    name: 'Dầu Dừa Nguyên Chất Ep Lạnh Hồ Hương 250ml',
    price: 150000,
    category: 'dưỡng da',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Dầu dừa ép lạnh tinh khiết 100% tự nhiên. Giúp dưỡng ẩm sâu cho da, dưỡng tóc mềm mượt và chống lão hóa hiệu quả.',
    isHot: true
  },
  {
    id: '2',
    name: 'Gạo Thượng Hạng ST25 Hồ Hương (Túi 5kg)',
    price: 195000,
    category: 'thức ăn, gạo, cám',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Hạt gạo dài, trắng trong, khi nấu chín dẻo mềm thơm ngậy mùi lá dứa tự nhiên. Đạt chuẩn chất lượng an toàn cho sức khỏe.',
    isHot: true
  },
  {
    id: '3',
    name: 'Cám Gạo Sạch Cao Cấp Cho Gia Súc (Bao 10kg)',
    price: 130000,
    category: 'thức ăn, gạo, cám',
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Cám gạo mịn thơm, nguyên chất từ nhà máy xay xát. Giàu chất dinh dưỡng và đạm tự nhiên giúp vật nuôi phát triển nhanh.',
    isHot: false
  }
];

// Default Contacts updated with SĐT & Zalo requested
const DEFAULT_CONTACTS = {
  phone: '0949120540',
  zalo: '0886842804',
  messenger: 'https://m.me/hohuongfamily'
};

// Modern Stylish AI Logo SVG Data URL
const DEFAULT_AI_LOGO = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' width='200' height='200'><defs><linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%2310b981;stop-opacity:1' /><stop offset='100%' style='stop-color:%23047857;stop-opacity:1' /></linearGradient></defs><circle cx='100' cy='100' r='96' fill='url(%23grad)' stroke='%23f59e0b' stroke-width='6'/><path d='M100 35 C120 70, 165 85, 165 115 A65 65 0 0 1 35 115 C35 85, 80 70, 100 35 Z' fill='%23ffffff' opacity='0.95'/><path d='M100 65 Q115 100 135 110 A35 35 0 0 1 65 110 Q85 100 100 65 Z' fill='%23f59e0b'/><text x='100' y='165' font-family='sans-serif' font-weight='900' font-size='18' fill='%23ffffff' text-anchor='middle' letter-spacing='2'>HỒ HƯƠNG</text></svg>";

export default function App() {
  // Navigation view: 'storefront' or 'admin'
  const [viewMode, setViewMode] = useState('storefront');
  
  // Data States
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('hh_v3_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('hh_v3_contacts');
    return saved ? JSON.parse(saved) : DEFAULT_CONTACTS;
  });

  const [logoUrl, setLogoUrl] = useState(() => {
    return localStorage.getItem('hh_v3_logo') || DEFAULT_AI_LOGO;
  });

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('hh_v3_admin_auth') === 'true';
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Storefront Filtering
  const [activeTab, setActiveTab] = useState('dưỡng da'); // 'dưỡng da' | 'thức ăn, gạo, cám'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeModalImgIdx, setActiveModalImgIdx] = useState(0);

  // Admin Forms
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: 'dưỡng da',
    images: ['', '', ''],
    description: '',
    isHot: false
  });

  const [contactForm, setContactForm] = useState(contacts);
  const [toastMessage, setToastMessage] = useState('');

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('hh_v3_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('hh_v3_contacts', JSON.stringify(contacts));
    setContactForm(contacts);
  }, [contacts]);

  useEffect(() => {
    if (logoUrl) {
      localStorage.setItem('hh_v3_logo', logoUrl);
    }
  }, [logoUrl]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Convert uploaded image file to Base64
  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('Dung lượng ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 4MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...productForm.images];
        newImages[index] = reader.result;
        setProductForm({ ...productForm, images: newImages });
      };
      reader.readAsDataURL(file);
    }
  };

  // Logo File Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result);
        showToast('Đã tải logo mới thành công!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Admin Login Handler
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasswordInput === 'dang2014') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('hh_v3_admin_auth', 'true');
      setAuthError('');
      showToast('Đăng nhập Quản trị viên thành công!');
    } else {
      setAuthError('Mật khẩu không chính xác!');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('hh_v3_admin_auth');
    showToast('Đã đăng xuất.');
  };

  // Product Add / Save
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.images[0] || !productForm.images[1] || !productForm.images[2]) {
      alert('Vui lòng tải lên ĐỦ 3 HÌNH ẢNH cho sản phẩm!');
      return;
    }
    if (!productForm.name || !productForm.price) {
      alert('Vui lòng điền tên sản phẩm và giá!');
      return;
    }

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? {
        ...productForm,
        id: p.id,
        price: Number(productForm.price)
      } : p));
      showToast('Cập nhật sản phẩm thành công!');
    } else {
      const newProduct = {
        ...productForm,
        id: Date.now().toString(),
        price: Number(productForm.price)
      };
      setProducts([newProduct, ...products]);
      showToast('Thêm sản phẩm mới thành công!');
    }

    setEditingProduct(null);
    setProductForm({
      name: '',
      price: '',
      category: 'dưỡng da',
      images: ['', '', ''],
      description: '',
      isHot: false
    });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== id));
      showToast('Đã xóa sản phẩm!');
    }
  };

  const handleStartEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      category: product.category,
      images: product.images && product.images.length === 3 ? [...product.images] : [product.images?.[0] || '', '', ''],
      description: product.description,
      isHot: product.isHot || false
    });
  };

  const handleSaveContacts = (e) => {
    e.preventDefault();
    setContacts(contactForm);
    showToast('Cập nhật thông tin liên hệ thành công!');
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = p.category === activeTab;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const cleanPhoneNumber = (phoneStr) => phoneStr ? phoneStr.replace(/\s+/g, '') : '';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-semibold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mode Switcher Header */}
      <div className="bg-slate-950 border-b border-slate-800 text-xs py-2 px-4 sticky top-0 z-40 text-slate-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 text-amber-400 font-medium">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline font-bold tracking-wide">HỒ HƯƠNG FAMILY • DẦU DỪA, GẠO & CÁM</span>
            <span className="sm:hidden font-bold">HỒ HƯƠNG FAMILY</span>
          </div>
          <div className="flex bg-slate-800/90 p-1 rounded-full border border-slate-700">
            <button 
              onClick={() => setViewMode('storefront')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-xs font-semibold ${
                viewMode === 'storefront' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Giao diện Khách mua</span>
            </button>
            <button 
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-xs font-semibold ${
                viewMode === 'admin' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Giao diện Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: STOREFRONT */}
      {viewMode === 'storefront' && (
        <div className="flex-1 flex flex-col bg-slate-50">
          
          {/* Main Top Header */}
          <header className="bg-white/95 backdrop-blur-md border-b border-emerald-100 sticky top-9 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
              
              {/* Brand Logo & Name */}
              <div className="flex items-center gap-3">
                <img 
                  src={logoUrl} 
                  alt="Logo Hồ Hương Family" 
                  className="w-12 h-12 object-cover rounded-2xl shadow-md border-2 border-emerald-500 bg-emerald-50 p-0.5" 
                />
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900 font-serif flex items-center gap-1.5">
                    HỒ HƯƠNG FAMILY
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase">Uy Tín</span>
                  </h1>
                  <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Chuyên Gạo Ngon • Dầu Dừa • Thức Ăn Cám</p>
                </div>
              </div>

              {/* Header Direct Contact Links */}
              <div className="flex items-center gap-2">
                <a 
                  href={`tel:${cleanPhoneNumber(contacts.phone)}`} 
                  className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3.5 py-2 rounded-full text-xs transition border border-emerald-200 shadow-sm"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>{contacts.phone}</span>
                </a>
                <a 
                  href={`https://zalo.me/${cleanPhoneNumber(contacts.zalo)}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3.5 py-2 rounded-full text-xs transition border border-blue-200 shadow-sm"
                >
                  <Send className="w-4 h-4 text-blue-600" />
                  <span className="hidden md:inline">Zalo {contacts.zalo}</span>
                </a>
                {contacts.messenger && (
                  <a 
                    href={contacts.messenger} target="_blank" rel="noreferrer"
                    className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-full border border-indigo-200 transition shadow-sm"
                    title="Nhắn Messenger"
                  >
                    <MessageCircle className="w-4.5 h-4.5" />
                  </a>
                )}
              </div>
            </div>
          </header>

          {/* AI Banner Hero Section */}
          <section className="relative bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 py-12 px-4 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="max-w-4xl mx-auto relative z-10 text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-800/80 text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full border border-amber-400/30 backdrop-blur-md shadow-inner">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                <span>NÔNG SẢN SACH & SẮC ĐẸP TỰ NHIÊN</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-wide leading-tight">
                Cửa Hàng Hồ Hương Family
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-light">
                Cam kết chất lượng từng giọt dầu dừa ép lạnh dưỡng da, hạt gạo ST25 thơm dẻo và thức ăn chăn nuôi gia súc giàu dinh dưỡng.
              </p>
              
              {/* Quick Call-to-action buttons */}
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <a 
                  href={`tel:${cleanPhoneNumber(contacts.phone)}`}
                  className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-full text-sm transition shadow-lg scale-100 hover:scale-105"
                >
                  <Phone className="w-4 h-4" />
                  <span>Gọi Điện: {contacts.phone}</span>
                </a>
                <a 
                  href={`https://zalo.me/${cleanPhoneNumber(contacts.zalo)}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-full text-sm transition shadow-lg scale-100 hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                  <span>Nhắn Zalo: {contacts.zalo}</span>
                </a>
              </div>
            </div>
          </section>

          {/* Category Tabs & Products */}
          <main className="max-w-7xl mx-auto px-4 py-10 flex-1 w-full">
            
            {/* Customer Category Navigation Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-slate-200/90 p-1.5 rounded-2xl flex w-full max-w-lg shadow-inner border border-slate-300">
                <button
                  onClick={() => setActiveTab('dưỡng da')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                    activeTab === 'dưỡng da'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                      : 'text-slate-600 hover:text-emerald-800'
                  }`}
                >
                  <Droplet className="w-4 h-4 text-amber-300" />
                  <span>Mục Dưỡng Da (Dầu Dừa)</span>
                </button>
                <button
                  onClick={() => setActiveTab('thức ăn, gạo, cám')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                    activeTab === 'thức ăn, gạo, cám'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                      : 'text-slate-600 hover:text-emerald-800'
                  }`}
                >
                  <Wheat className="w-4 h-4 text-amber-300" />
                  <span>Mục Thức Ăn, Gạo, Cám</span>
                </button>
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="max-w-md mx-auto mb-10 relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder={`Tìm kiếm trong ${activeTab === 'dưỡng da' ? 'Mục Dưỡng Da Dầu Dừa' : 'Mục Gạo & Cám'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-full pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Chưa có sản phẩm nào trong danh mục này.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {filteredProducts.map((p) => (
                  <div 
                    key={p.id}
                    className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Product Main Display Image */}
                      <div 
                        className="relative aspect-[4/3] overflow-hidden bg-slate-100 cursor-pointer"
                        onClick={() => { setSelectedProduct(p); setActiveModalImgIdx(0); }}
                      >
                        <img 
                          src={p.images?.[0]} 
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                        />
                        {p.isHot && (
                          <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 fill-white" />
                            Bán Chạy
                          </span>
                        )}
                        <span className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/20">
                          Bộ 3 Ảnh AI
                        </span>
                      </div>

                      {/* Product Details */}
                      <div className="p-6">
                        <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">
                          {p.category === 'dưỡng da' ? 'Dưỡng Da & Làm Đẹp' : 'Nông Sản & Chăn Nuôi'}
                        </span>
                        <h3 
                          onClick={() => { setSelectedProduct(p); setActiveModalImgIdx(0); }}
                          className="font-bold text-slate-900 text-lg group-hover:text-emerald-600 transition cursor-pointer line-clamp-1 mb-2"
                        >
                          {p.name}
                        </h3>
                        <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">{p.description}</p>
                        
                        <div className="text-emerald-700 font-black text-2xl">
                          {formatVND(p.price)}
                        </div>
                      </div>
                    </div>

                    {/* Quick Order Actions */}
                    <div className="p-6 pt-0">
                      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
                        <a 
                          href={`https://zalo.me/${cleanPhoneNumber(contacts.zalo)}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-md"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Zalo</span>
                        </a>
                        <a 
                          href={`tel:${cleanPhoneNumber(contacts.phone)}`} 
                          className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-md"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Gọi Điện</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* Product Image Gallery Modal (3 Images Showcase) */}
          {selectedProduct && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto relative p-6 md:p-8 shadow-2xl border border-slate-100">
                <button 
                  onClick={() => setSelectedProduct(null)} 
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Gallery 3 Images Switcher */}
                  <div className="space-y-4">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner relative">
                      <img 
                        src={selectedProduct.images?.[activeModalImgIdx]} 
                        alt={selectedProduct.name} 
                        className="w-full h-full object-cover transition-all duration-300" 
                      />
                    </div>
                    
                    {/* Thumbnails list */}
                    <div className="grid grid-cols-3 gap-3">
                      {selectedProduct.images?.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveModalImgIdx(idx)}
                          className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                            activeModalImgIdx === idx ? 'border-emerald-600 scale-105 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Details & Direct Links */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{selectedProduct.category}</span>
                      <h2 className="text-2xl font-black text-slate-900 mt-1 mb-2">{selectedProduct.name}</h2>
                      <p className="text-3xl text-emerald-700 font-black mb-4">{formatVND(selectedProduct.price)}</p>
                      
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mô tả sản phẩm chi tiết:</h4>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6">{selectedProduct.description}</p>
                    </div>

                    <div className="space-y-3 border-t border-slate-100 pt-5">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Đặt mua trực tiếp qua:</p>
                      <a 
                        href={`tel:${cleanPhoneNumber(contacts.phone)}`}
                        className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold w-full py-3 rounded-xl transition shadow-lg"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Gọi Ngay SĐT: {contacts.phone}</span>
                      </a>
                      <a 
                        href={`https://zalo.me/${cleanPhoneNumber(contacts.zalo)}`} target="_blank" rel="noreferrer"
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold w-full py-3 rounded-xl transition shadow-lg"
                      >
                        <Send className="w-4 h-4" />
                        <span>Nhắn Zalo: {contacts.zalo}</span>
                      </a>
                      {contacts.messenger && (
                        <a 
                          href={contacts.messenger} target="_blank" rel="noreferrer"
                          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full py-3 rounded-xl transition shadow-lg"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Nhắn Facebook Messenger</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Footer Bar */}
          <footer className="bg-slate-950 text-white py-10 px-4 text-center text-xs mt-auto border-t border-slate-800">
            <div className="max-w-md mx-auto space-y-3">
              <p className="font-black text-lg text-emerald-400 font-serif tracking-wide">HỒ HƯƠNG FAMILY</p>
              <p className="text-slate-400">Chuyên Dầu Dừa Dưỡng Da • Gạo Ngon ST25 • Thức Ăn Gia Súc Cám Sạch</p>
              
              <div className="flex flex-wrap justify-center gap-6 pt-3 text-sm">
                <a href={`tel:${cleanPhoneNumber(contacts.phone)}`} className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 font-medium">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span>SĐT: {contacts.phone}</span>
                </a>
                <a href={`https://zalo.me/${cleanPhoneNumber(contacts.zalo)}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-slate-300 hover:text-blue-400 font-medium">
                  <Send className="w-4 h-4 text-blue-500" />
                  <span>Zalo: {contacts.zalo}</span>
                </a>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* VIEW 2: ADMIN PANEL */}
      {viewMode === 'admin' && (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 bg-slate-100">
          {!isAdminLoggedIn ? (
            /* Modern Login Box (No password hint) */
            <div className="max-w-md mx-auto mt-16 bg-white border border-slate-200 p-8 rounded-3xl shadow-xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Đăng Nhập Admin</h2>
                <p className="text-xs text-slate-500 mt-1">Hệ thống quản trị Cửa hàng Hồ Hương Family</p>
              </div>

              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl mb-4 font-semibold text-center">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-700 font-bold mb-1">Mật khẩu quản trị:</label>
                  <input 
                    type="password" 
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition shadow-md"
                >
                  Xác Nhận Đăng Nhập
                </button>
              </form>
            </div>
          ) : (
            /* Admin Management Interface */
            <div className="space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Quản Lý Cửa Hàng Hồ Hương</h2>
                  <p className="text-xs text-slate-500 mt-1">Thay đổi Logo, Quản lý sản phẩm (Đủ 3 ảnh) & Cập nhật SĐT/Zalo</p>
                </div>
                <button 
                  onClick={handleAdminLogout}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 self-start sm:self-auto transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng Xuất</span>
                </button>
              </div>

              {/* Logo Management */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-600" />
                  <span>Logo Cửa Hàng (Tải từ máy hoặc sử dụng mặc định AI)</span>
                </h3>
                
                <div className="flex flex-wrap items-center gap-6">
                  <img src={logoUrl} alt="Logo" className="w-20 h-20 object-cover rounded-2xl border-2 border-emerald-500 shadow-md p-0.5 bg-emerald-50" />

                  <div className="space-y-2">
                    <label className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>Chọn Ảnh Logo Từ Máy</span>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                    <p className="text-[11px] text-slate-400">Hỗ trợ các file định dạng PNG, JPG, WEBP từ máy tính hoặc điện thoại.</p>
                  </div>
                </div>
              </div>

              {/* Product Form & List */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Product Form */}
                <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    {editingProduct ? <Edit3 className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-emerald-600" />}
                    <span>{editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</span>
                  </h3>

                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-700 font-bold mb-1">Tên sản phẩm *</label>
                      <input 
                        type="text" 
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        placeholder="VD: Dầu Dừa Dưỡng Da 250ml / Gạo ST25"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-700 font-bold mb-1">Giá bán (VND) *</label>
                        <input 
                          type="number" 
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                          placeholder="VD: 150000"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-700 font-bold mb-1">Danh mục *</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="dưỡng da">Mục Dưỡng Da</option>
                          <option value="thức ăn, gạo, cám">Mục Thức Ăn, Gạo, Cám</option>
                        </select>
                      </div>
                    </div>

                    {/* 3 Upload Images Required */}
                    <div className="space-y-2 border-t border-b border-slate-100 py-3">
                      <label className="block text-xs text-slate-800 font-bold">
                        Bắt buộc tải ĐỦ 3 HÌNH ẢNH từ máy của bạn:
                      </label>
                      
                      {[0, 1, 2].map((idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                          {productForm.images[idx] ? (
                            <img src={productForm.images[idx]} alt="" className="w-12 h-12 object-cover rounded-lg border border-slate-300" />
                          ) : (
                            <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs font-bold">
                              Ảnh {idx + 1}
                            </div>
                          )}
                          <div className="flex-1">
                            <label className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition">
                              <Upload className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{productForm.images[idx] ? `Đổi ảnh ${idx + 1}` : `Chọn tệp ảnh ${idx + 1}`}</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleImageUpload(e, idx)} 
                                className="hidden" 
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs text-slate-700 font-bold mb-1">Mô tả sản phẩm</label>
                      <textarea 
                        rows="3"
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        placeholder="Nhập chi tiết thông tin sản phẩm..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="isHot"
                        checked={productForm.isHot}
                        onChange={(e) => setProductForm({...productForm, isHot: e.target.checked})}
                        className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label htmlFor="isHot" className="text-xs text-slate-700 font-semibold">Đánh dấu NỔI BẬT / BÁN CHẠY</label>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button 
                        type="submit"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-md"
                      >
                        {editingProduct ? 'Cập Nhật' : 'Lưu Sản Phẩm'}
                      </button>
                      {editingProduct && (
                        <button 
                          type="button"
                          onClick={() => {
                            setEditingProduct(null);
                            setProductForm({ name: '', price: '', category: 'dưỡng da', images: ['', '', ''], description: '', isHot: false });
                          }}
                          className="bg-slate-200 text-slate-700 hover:bg-slate-300 px-3 py-2.5 rounded-xl text-sm font-semibold"
                        >
                          Hủy
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Product Table */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Danh Sách Sản Phẩm Hiện Có ({products.length})
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200 font-bold">
                        <tr>
                          <th className="p-3">3 Ảnh AI</th>
                          <th className="p-3">Tên & Danh mục</th>
                          <th className="p-3">Giá</th>
                          <th className="p-3 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition">
                            <td className="p-3">
                              <div className="flex -space-x-2">
                                {p.images?.map((img, idx) => (
                                  <img key={idx} src={img} alt="" className="w-9 h-9 object-cover rounded-lg border-2 border-white shadow-sm bg-slate-100" />
                                ))}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-slate-900">{p.name}</div>
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-0.5 ${
                                p.category === 'dưỡng da' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {p.category}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-emerald-700">
                              {formatVND(p.price)}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleStartEdit(p)}
                                  className="p-2 bg-slate-100 hover:bg-emerald-50 text-emerald-700 rounded-lg transition"
                                  title="Sửa"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-2 bg-slate-100 hover:bg-red-50 text-red-600 rounded-lg transition"
                                  title="Xóa"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Admin Contact Settings (Updated Defaults) */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-600" />
                  <span>Thay Đổi 3 Thông Tin Liên Hệ</span>
                </h3>

                <form onSubmit={handleSaveContacts} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-700 font-bold mb-1">1. Số Điện Thoại *</label>
                    <input 
                      type="text" 
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-700 font-bold mb-1">2. Số Zalo Liên Hệ *</label>
                    <input 
                      type="text" 
                      value={contactForm.zalo}
                      onChange={(e) => setContactForm({...contactForm, zalo: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-700 font-bold mb-1">3. Link Messenger *</label>
                    <input 
                      type="text" 
                      value={contactForm.messenger}
                      onChange={(e) => setContactForm({...contactForm, messenger: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>

                  <div className="md:col-span-3 pt-2">
                    <button 
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-md"
                    >
                      Lưu Thông Tin Liên Hệ Mới
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}