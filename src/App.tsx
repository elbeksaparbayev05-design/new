import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Sofa, Sliders, Bookmark, LayoutGrid, 
  ArrowRight, CheckCircle2, RefreshCw, Download, 
  Trash2, ExternalLink, Menu, X, ChevronRight, 
  Layers, ShieldCheck, Zap, Heart, Camera, Upload,
  UserCheck, Wrench, Package, DollarSign, Clock,
  Plus, Calculator, Phone, User, Check, Eye
} from 'lucide-react';

// --- TYPES ---
export type UserRole = 'user' | 'master';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  specialty?: string;
}

export interface DesignConfig {
  type: string;
  width: number;
  height: number;
  depth: number;
  style: string;
  material: string;
  color: string;
  customPrompt: string;
  roomImage: string | null;
  selectedZone: string;
}

export interface SavedDesign {
  id: string;
  title: string;
  image: string;
  beforeImage?: string | null;
  style: string;
  material: string;
  color: string;
  date: string;
}

export interface MasterOrder {
  id: string;
  clientName: string;
  phone: string;
  itemTitle: string;
  dimensions: string;
  status: 'Yangi' | 'Jarayonda' | 'Bajarildi' | 'Rad etildi';
  price: string;
  date: string;
  roomImage?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  material: string;
  price: string;
  image: string;
}

// --- DEMO DATA ---
const DEMO_ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800'
];

const GALLERY_ITEMS = [
  {
    id: '1',
    title: 'Minimalist Loft Shkafi',
    category: 'Shkaf',
    style: 'Loft',
    material: 'Tabiiy yog‘och',
    color: 'Qora',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800',
    description: 'Kichik yotoqxonalar uchun mo‘ljallangan ko‘p funksiyali o‘rnatilgan shkaf.'
  },
  {
    id: '2',
    title: 'Skandinaviya Oshxona Garnituri',
    category: 'Oshxona mebeli',
    style: 'Skandinaviya',
    material: 'MDF',
    color: 'Oq',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
    description: 'Yorug‘ va qulay, minimalist uslubdagi zamonaviy oshxona majmuasi.'
  },
  {
    id: '3',
    title: 'Modern Divan Konsepsiyasi',
    category: 'Divan',
    style: 'Modern',
    material: 'Tabiiy yog‘och',
    color: 'Bej',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    description: 'Mehmonxona uchun premium yumshoq mebel va qulay dizayn.'
  },
  {
    id: '4',
    title: 'Minimalist Ish Stoli',
    category: 'Stol',
    style: 'Minimalism',
    material: 'Metall',
    color: 'Kulrang',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800',
    description: 'Ofis va uy xonalari uchun ergonomik ish stoli dizayni.'
  },
  {
    id: '5',
    title: 'Luxury Ikki kishilik Karavot',
    category: 'Karavot',
    style: 'Luxury',
    material: 'Tabiiy yog‘och',
    color: 'Yog‘och ranglari',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800',
    description: 'Yotoqxona uchun maxsus yumshoq boshli qulay karavot.'
  },
  {
    id: '6',
    title: 'Loft TV Tumbasi',
    category: 'TV tumbasi',
    style: 'Loft',
    material: 'DSP/Laminat',
    color: 'Qora',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=800',
    description: 'Zamonaviy zallar uchun qora metall karkasli TV taglik stoli.'
  }
];

const INITIAL_ORDERS: MasterOrder[] = [
  {
    id: 'ORD-101',
    clientName: 'Sardor Rahimov',
    phone: '+998 90 123 45 67',
    itemTitle: 'Loft uslubidagi yotoqxona shkafi',
    dimensions: '220 x 240 x 60 sm',
    status: 'Yangi',
    price: '4,500,000 UZS',
    date: '2026-03-28'
  },
  {
    id: 'ORD-102',
    clientName: 'Malika Ikromova',
    phone: '+998 91 987 65 43',
    itemTitle: 'Skandinaviya burchak oshxona garnituri',
    dimensions: '300 x 210 x 60 sm',
    status: 'Jarayonda',
    price: '12,000,000 UZS',
    date: '2026-03-25'
  }
];

const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'P-1',
    title: 'Zamonaviy Loft Shkafi',
    category: 'Shkaf',
    material: 'MDF + Shisha',
    price: '5,200,000 UZS',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'P-2',
    title: 'Minimalist Ish Stoli',
    category: 'Stol',
    material: 'Eman yog‘och',
    price: '2,100,000 UZS',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=600'
  }
];

export default function App() {
  // --- AUTH & USER STATE ---
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('mebelchi_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  
  // Auth Form Fields
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');

  // --- NAVIGATION STATE ---
  const [activeTab, setActiveTab] = useState<'home' | 'studio' | 'result' | 'gallery' | 'saved' | 'master_dashboard'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- CAMERA & PHOTO STATE ---
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // --- STUDIO & GENERATION STATE ---
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);

  const [config, setConfig] = useState<DesignConfig>({
    type: 'Shkaf',
    width: 200,
    height: 220,
    depth: 60,
    style: 'Modern',
    material: 'MDF',
    color: 'Bej',
    customPrompt: '',
    roomImage: DEMO_ROOM_IMAGES[0],
    selectedZone: 'Burchak qismi'
  });

  const [currentResult, setCurrentResult] = useState({
    title: 'Shaxsiy AI Dizayn Konsepsiyasi',
    beforeImage: DEMO_ROOM_IMAGES[0] as string | null,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    description: 'Siz kiritgan o‘lchamlar va uslub talablariga muvofiq xonangiz uchun maxsus tayyorlangan vizual yechim.',
    style: 'Modern',
    material: 'MDF',
    color: 'Bej',
    dimensions: '200x220x60 sm'
  });

  // --- GALLERY FILTER STATE ---
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [selectedStyle, setSelectedStyle] = useState('Barchasi');

  // --- MASTER STATE ---
  const [masterOrders, setMasterOrders] = useState<MasterOrder[]>(INITIAL_ORDERS);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
  const [masterTab, setMasterTab] = useState<'orders' | 'portfolio' | 'calc'>('orders');

  // Master Calculator state
  const [calcSheets, setCalcSheets] = useState(4);
  const [calcPricePerSheet, setCalcPricePerSheet] = useState(380000);
  const [calcHardwarePrice, setCalcHardwarePrice] = useState(700000);
  const [calcLaborMargin, setCalcLaborMargin] = useState(35);

  useEffect(() => {
    const stored = localStorage.getItem('mebelchi_saved');
    if (stored) {
      try { setSavedDesigns(JSON.parse(stored)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveUserSession = (user: UserProfile | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('mebelchi_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mebelchi_user');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    const user: UserProfile = {
      id: Date.now().toString(),
      name: authName || (authEmail.split('@')[0]),
      email: authEmail,
      role: selectedRole
    };
    saveUserSession(user);
    setAuthModalOpen(false);
    if (user.role === 'master') {
      setActiveTab('master_dashboard');
    } else {
      setActiveTab('studio');
    }
  };

  const handleLogout = () => {
    saveUserSession(null);
    setActiveTab('home');
  };

  // Camera handling
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Kameraga ruxsat berilmadi yoki qurilmada kamera topilmadi.");
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setConfig({ ...config, roomImage: dataUrl });
    }
    stopCamera();
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setConfig({ ...config, roomImage: uploadEvent.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setActiveTab('result');

    setTimeout(() => {
      const matched = GALLERY_ITEMS.find(item => item.category === config.type) || GALLERY_ITEMS[0];
      setCurrentResult({
        title: `${config.style} uslubidagi ${config.type}`,
        beforeImage: config.roomImage,
        image: matched.image,
        description: `Yuklangan xona rasmi va tanlangan ${config.material} (rangi: ${config.color}) parametri asosida AI tomonidan generatsiya qilindi. O‘lchamlar: ${config.width}x${config.height}x${config.depth} sm.`,
        style: config.style,
        material: config.material,
        color: config.color,
        dimensions: `${config.width} x ${config.height} x ${config.depth} sm`
      });
      setIsGenerating(false);
    }, 1600);
  };

  const saveToLocalStorage = (items: SavedDesign[]) => {
    setSavedDesigns(items);
    localStorage.setItem('mebelchi_saved', JSON.stringify(items));
  };

  const handleSaveCurrent = () => {
    const newDesign: SavedDesign = {
      id: Date.now().toString(),
      title: currentResult.title,
      image: currentResult.image,
      beforeImage: currentResult.beforeImage,
      style: currentResult.style,
      material: currentResult.material,
      color: currentResult.color,
      date: new Date().toLocaleDateString()
    };
    saveToLocalStorage([...savedDesigns, newDesign]);
    alert('Dizayn saqlanganlarga qo‘shildi!');
  };

  const removeSaved = (id: string) => {
    saveToLocalStorage(savedDesigns.filter(d => d.id !== id));
  };

  const loadDesignFromGallery = (item: typeof GALLERY_ITEMS[0]) => {
    setCurrentResult({
      title: item.title,
      beforeImage: null,
      image: item.image,
      description: item.description,
      style: item.style,
      material: item.material,
      color: item.color,
      dimensions: 'Standart o‘lcham'
    });
    setConfig(prev => ({ ...prev, type: item.category, style: item.style, material: item.material, color: item.color }));
    setActiveTab('result');
  };

  const filteredGallery = GALLERY_ITEMS.filter(item => {
    const matchCat = selectedCategory === 'Barchasi' || item.category === selectedCategory;
    const matchStyle = selectedStyle === 'Barchasi' || item.style === selectedStyle;
    return matchCat && matchStyle;
  });

  const materialCost = (calcSheets * calcPricePerSheet) + calcHardwarePrice;
  const estimatedPrice = Math.round(materialCost * (1 + calcLaborMargin / 100));

  return (
    <div className="min-h-screen flex flex-col bg-[#F4FBF6] text-[#1F2A2D] w-full overflow-x-hidden">
      
      {/* --- RESPONSIVE HEADER --- */}
      <header className="sticky top-0 z-50 bg-[#F4FBF6]/95 backdrop-blur-md border-b border-[#D7F2DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          <div 
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0F5A4E] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sofa className="w-4 h-4 sm:w-5 sm:h-5 text-[#D8B38A]" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[#0F5A4E]">MEBELCHI</span>
              <span className="block text-[9px] sm:text-[10px] tracking-widest uppercase text-[#5D7B73]">AI Furniture Tech</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button onClick={() => setActiveTab('home')} className={`text-sm font-medium transition-colors hover:text-[#0F5A4E] ${activeTab === 'home' ? 'text-[#0F5A4E] font-semibold' : 'text-[#4E5D5B]'}`}>Bosh sahifa</button>
            <button onClick={() => setActiveTab('studio')} className={`text-sm font-medium transition-colors hover:text-[#0F5A4E] ${activeTab === 'studio' ? 'text-[#0F5A4E] font-semibold' : 'text-[#4E5D5B]'}`}>AI Studio</button>
            <button onClick={() => setActiveTab('gallery')} className={`text-sm font-medium transition-colors hover:text-[#0F5A4E] ${activeTab === 'gallery' ? 'text-[#0F5A4E] font-semibold' : 'text-[#4E5D5B]'}`}>Galereya</button>
            <button onClick={() => setActiveTab('saved')} className={`text-sm font-medium transition-colors hover:text-[#0F5A4E] flex items-center gap-1.5 ${activeTab === 'saved' ? 'text-[#0F5A4E] font-semibold' : 'text-[#4E5D5B]'}`}>
              <Bookmark className="w-4 h-4" /> Saqlanganlar ({savedDesigns.length})
            </button>
            {currentUser?.role === 'master' && (
              <button onClick={() => setActiveTab('master_dashboard')} className={`text-sm font-medium transition-colors hover:text-[#0F5A4E] flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F5A4E]/10 text-[#0F5A4E] ${activeTab === 'master_dashboard' ? 'font-bold' : ''}`}>
                <Wrench className="w-4 h-4" /> Usta Paneli
              </button>
            )}
          </nav>

          {/* User Auth Action (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-2.5 bg-white border border-[#D7F2DF] px-3 py-1.5 rounded-full shadow-sm">
                <div className="w-7 h-7 rounded-full bg-[#0F5A4E] text-white flex items-center justify-center text-xs font-bold uppercase">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-xs font-bold text-[#0F5A4E] max-w-[100px] truncate">{currentUser.name}</span>
                  <span className="text-[10px] text-[#5D7B73] capitalize">{currentUser.role === 'master' ? 'Usta' : 'Mijoz'}</span>
                </div>
                <button onClick={handleLogout} className="ml-1 text-xs text-red-500 hover:text-red-700 font-medium p-1" title="Chiqish">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className="px-5 py-2.5 rounded-full bg-[#0F5A4E] text-white text-sm font-medium hover:bg-[#0F5A4E] transition-all shadow-sm flex items-center gap-2">
                <User className="w-4 h-4" /> Kirish
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            {currentUser && (
              <div className="w-8 h-8 rounded-full bg-[#0F5A4E] text-white flex items-center justify-center text-xs font-bold uppercase">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg text-[#0F5A4E] hover:bg-[#D7F2DF]">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F4FBF6] border-b border-[#D7F2DF] px-4 pt-2 pb-6 space-y-2.5 shadow-lg animate-in slide-in-from-top duration-200">
            <button onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} className={`block w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold ${activeTab === 'home' ? 'bg-[#0F5A4E] text-white' : 'text-[#0F5A4E] hover:bg-[#D7F2DF]'}`}>Bosh sahifa</button>
            <button onClick={() => { setActiveTab('studio'); setMobileMenuOpen(false); }} className={`block w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold ${activeTab === 'studio' ? 'bg-[#0F5A4E] text-white' : 'text-[#0F5A4E] hover:bg-[#D7F2DF]'}`}>AI Studio</button>
            <button onClick={() => { setActiveTab('gallery'); setMobileMenuOpen(false); }} className={`block w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold ${activeTab === 'gallery' ? 'bg-[#0F5A4E] text-white' : 'text-[#0F5A4E] hover:bg-[#D7F2DF]'}`}>Galereya</button>
            <button onClick={() => { setActiveTab('saved'); setMobileMenuOpen(false); }} className={`block w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold ${activeTab === 'saved' ? 'bg-[#0F5A4E] text-white' : 'text-[#0F5A4E] hover:bg-[#D7F2DF]'}`}>Saqlanganlar ({savedDesigns.length})</button>
            {currentUser?.role === 'master' && (
              <button onClick={() => { setActiveTab('master_dashboard'); setMobileMenuOpen(false); }} className={`block w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold text-[#0F5A4E] ${activeTab === 'master_dashboard' ? 'bg-[#0F5A4E]/10' : ''}`}>Usta Paneli</button>
            )}
            <div className="pt-2">
              {currentUser ? (
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full py-3 rounded-xl bg-red-100 text-red-600 font-bold text-sm text-center">Tizimdan chiqish</button>
              ) : (
                <button onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }} className="w-full py-3 rounded-xl bg-[#0F5A4E] text-white font-bold text-sm text-center shadow-md">Kirish / Ro‘yxatdan o‘tish</button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto">

        {/* 1. HOME PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-12 sm:space-y-20 pb-16">
            <section className="relative overflow-hidden pt-8 sm:pt-12 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D7F2DF] text-[#0F5A4E] text-[11px] sm:text-xs font-semibold uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-[#0F5A4E]" />
                    IDEATHON 2026 • AI FurnitureTech
                  </div>
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F5A4E] leading-[1.2] sm:leading-[1.15]">
                    Orzuingizdagi mebelni <span className="text-[#0F5A4E]">AI yordamida</span> yarating
                  </h1>
                  <p className="text-base sm:text-lg text-[#4E5D5B] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    Xonangizni rasmga oling va AI orqali mebel tayyor bo‘lishidan oldin xonada qanday ko‘rinishini tasvirlang!
                  </p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2">
                    <button 
                      onClick={() => setActiveTab('studio')}
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl sm:rounded-full bg-[#0F5A4E] text-white font-semibold hover:bg-[#0F5A4E] transition-all shadow-lg flex items-center justify-center gap-3 text-base"
                    >
                      Dizayn yaratish <ArrowRight className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => { setAuthModalOpen(true); setSelectedRole('master'); }}
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl sm:rounded-full bg-[#D7F2DF] text-[#0F5A4E] font-semibold hover:bg-[#D7F2DF] transition-all flex items-center justify-center gap-2 text-base"
                    >
                      <Wrench className="w-4 h-4" /> Usta sifatida kirish
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 relative mt-6 lg:mt-0">
                  <div className="relative mx-auto max-w-md lg:max-w-none">
                    <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#0F5A4E]/30 to-[#D8B38A]/30 blur-xl"></div>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/40 bg-white">
                      <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800" alt="Mebel AI" className="w-full h-72 sm:h-[420px] object-cover" />
                      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-lg border border-white/60 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] sm:text-xs font-bold text-[#0F5A4E] uppercase">AI Vizualizatsiya</span>
                          <h4 className="text-xs sm:text-sm font-bold text-[#0F5A4E]">Yotoqxona Shkafi</h4>
                        </div>
                        <span className="px-2.5 py-1 bg-[#0F5A4E] text-white text-[10px] sm:text-xs rounded-full font-medium">Modern</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 2. AI STUDIO PAGE */}
        {activeTab === 'studio' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
            <div className="text-center space-y-2.5">
              <span className="px-3 py-1 rounded-full bg-[#0F5A4E]/10 text-[#0F5A4E] text-xs font-bold uppercase">AI Studio Generator</span>
              <h1 className="text-2xl sm:text-4xl font-bold text-[#0F5A4E]">Xonangiz rasmini yuklang va mebel yarating</h1>
              <p className="text-xs sm:text-sm text-[#4E5D5B] max-w-xl mx-auto">Kameradan rasmga oling yoki galereyadan yuklab parametrlarini belgilang.</p>
            </div>

            <form onSubmit={handleGenerate} className="bg-white rounded-3xl p-5 sm:p-10 shadow-sm border border-[#D7F2DF] space-y-6 sm:space-y-8">
              
              {/* Photo Section */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-[#0F5A4E]">
                  1. Xona rasmini kiriting (Kamera yoki Fayl)
                </label>
                
                {isCameraActive ? (
                  <div className="relative rounded-2xl overflow-hidden bg-black h-64 sm:h-80 flex flex-col items-center justify-center">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute bottom-4 flex gap-3 z-10">
                      <button 
                        type="button" 
                        onClick={capturePhoto} 
                        className="px-5 py-2.5 rounded-full bg-[#0F5A4E] text-white font-bold text-xs flex items-center gap-2 shadow-xl"
                      >
                        <Camera className="w-4 h-4" /> Rasmga olish
                      </button>
                      <button 
                        type="button" 
                        onClick={stopCamera} 
                        className="px-4 py-2.5 rounded-full bg-white/90 text-black font-semibold text-xs"
                      >
                        Yopish
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="border-2 border-dashed border-[#D7F2DF] rounded-2xl p-5 text-center hover:border-[#0F5A4E] transition-colors flex flex-col items-center justify-center bg-[#F4FBF6]">
                      <Upload className="w-7 h-7 text-[#0F5A4E] mb-1.5" />
                      <span className="text-xs font-bold text-[#0F5A4E]">Fayldan rasm yuklash</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="mt-2.5 text-[11px] text-transparent file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#0F5A4E] file:text-white cursor-pointer" 
                      />
                    </div>

                    <div className="border border-[#D7F2DF] rounded-2xl p-5 text-center flex flex-col items-center justify-center bg-[#F4FBF6] space-y-2">
                      <Camera className="w-7 h-7 text-[#0F5A4E]" />
                      <span className="text-xs font-bold text-[#0F5A4E]">Kameradan rasmga olish</span>
                      <button 
                        type="button" 
                        onClick={startCamera} 
                        className="px-4 py-2 rounded-full bg-[#0F5A4E] text-white text-xs font-medium hover:bg-[#0C4F45] transition-colors"
                      >
                        Kamerani yoqish
                      </button>
                    </div>
                  </div>
                )}

                {config.roomImage && (
                  <div className="relative rounded-2xl overflow-hidden border border-[#D7F2DF] h-48 sm:h-60 bg-gray-100 mt-2">
                    <img src={config.roomImage} alt="Xona rasmi" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] sm:text-xs px-3 py-1 rounded-full backdrop-blur-md">
                      Yuklangan Xona Rasmi
                    </div>
                  </div>
                )}
              </div>

              {/* Furniture Category Selector */}
              <div className="space-y-3 pt-4 border-t border-[#D7F2DF]">
                <label className="block text-sm font-bold text-[#0F5A4E]">2. Mebel turini tanlang</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  {['Shkaf', 'Oshxona mebeli', 'Divan', 'Stol', 'Karavot', 'Kitob javoni', 'TV tumbasi', 'Boshqa mebel'].map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setConfig({ ...config, type })}
                      className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold border text-center transition-all ${config.type === type ? 'bg-[#0F5A4E] text-white border-[#0F5A4E]' : 'bg-[#F4FBF6] text-[#0F5A4E] border-[#D7F2DF]'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Range Controls */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-[#0F5A4E]">3. O‘lchamlar (santimetrda)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F4FBF6] p-4 rounded-2xl border border-[#D7F2DF]">
                  <div>
                    <span className="text-xs text-[#5D7B73] font-semibold">Eni: {config.width} sm</span>
                    <input type="range" min="50" max="400" step="10" value={config.width} onChange={e => setConfig({ ...config, width: Number(e.target.value) })} className="w-full accent-[#0F5A4E] mt-1" />
                  </div>
                  <div>
                    <span className="text-xs text-[#5D7B73] font-semibold">Balandligi: {config.height} sm</span>
                    <input type="range" min="50" max="300" step="10" value={config.height} onChange={e => setConfig({ ...config, height: Number(e.target.value) })} className="w-full accent-[#0F5A4E] mt-1" />
                  </div>
                  <div>
                    <span className="text-xs text-[#5D7B73] font-semibold">Chuqurligi: {config.depth} sm</span>
                    <input type="range" min="30" max="120" step="5" value={config.depth} onChange={e => setConfig({ ...config, depth: Number(e.target.value) })} className="w-full accent-[#0F5A4E] mt-1" />
                  </div>
                </div>
              </div>

              {/* Select Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0F5A4E]">Dizayn uslubi</label>
                  <select value={config.style} onChange={e => setConfig({ ...config, style: e.target.value })} className="w-full py-3 px-3.5 rounded-xl bg-[#F4FBF6] border border-[#D7F2DF] text-xs sm:text-sm font-medium">
                    <option value="Minimalizm">Minimalizm</option>
                    <option value="Modern">Modern</option>
                    <option value="Skandinaviya">Skandinaviya</option>
                    <option value="Loft">Loft</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0F5A4E]">Material</label>
                  <select value={config.material} onChange={e => setConfig({ ...config, material: e.target.value })} className="w-full py-3 px-3.5 rounded-xl bg-[#F4FBF6] border border-[#D7F2DF] text-xs sm:text-sm font-medium">
                    <option value="Tabiiy yog‘och">Tabiiy yog‘och</option>
                    <option value="MDF">MDF</option>
                    <option value="DSP/Laminat">DSP/Laminat</option>
                    <option value="Metall">Metall</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={isGenerating} className="w-full py-4 rounded-2xl bg-[#0F5A4E] text-white font-bold hover:bg-[#0C4F45] transition-all shadow-md flex items-center justify-center gap-2.5 text-sm sm:text-base">
                {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-[#D8B38A]" />}
                AI yordamida dizayn yaratish
              </button>

            </form>
          </div>
        )}

        {/* 3. RESULT VIEW (BEFORE VS AFTER) */}
        {activeTab === 'result' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#0F5A4E] uppercase">Generatsiya natijasi</span>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0F5A4E]">{currentResult.title}</h1>
              </div>
              <div className="flex gap-2.5 w-full sm:w-auto">
                <button onClick={() => setActiveTab('studio')} className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#D7F2DF] text-[#0F5A4E] text-xs font-bold">O‘zgartirish</button>
                <button onClick={handleSaveCurrent} className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#0F5A4E] text-white text-xs font-bold flex items-center justify-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-[#D8B38A]" /> Saqlash
                </button>
              </div>
            </div>

            {/* Before & After Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-[#D7F2DF]">
              {currentResult.beforeImage && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#5D7B73] uppercase">Oldin (Original Xona)</span>
                  <div className="h-56 sm:h-72 rounded-2xl overflow-hidden bg-gray-100 border border-[#D7F2DF]">
                    <img src={currentResult.beforeImage} alt="Before" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#0F5A4E] uppercase">Keyin (AI Yaratgan Mebel)</span>
                <div className="h-56 sm:h-72 rounded-2xl overflow-hidden bg-gray-100 border border-[#D7F2DF]">
                  <img src={currentResult.image} alt="After" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#D7F2DF] space-y-3">
              <h3 className="font-bold text-[#0F5A4E] text-base">Mebel xususiyatlari</h3>
              <p className="text-xs sm:text-sm text-[#4E5D5B] leading-relaxed">{currentResult.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-3 border-t border-[#D7F2DF]">
                <div><span className="text-[#5D7B73] block">Uslub:</span> <b className="text-[#0F5A4E]">{currentResult.style}</b></div>
                <div><span className="text-[#5D7B73] block">Material:</span> <b className="text-[#0F5A4E]">{currentResult.material}</b></div>
                <div><span className="text-[#5D7B73] block">Rang:</span> <b className="text-[#0F5A4E]">{currentResult.color}</b></div>
                <div><span className="text-[#5D7B73] block">O‘lcham:</span> <b className="text-[#0F5A4E]">{currentResult.dimensions}</b></div>
              </div>
            </div>
          </div>
        )}

        {/* 4. GALLERY PAGE */}
        {activeTab === 'gallery' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-[#0F5A4E] text-center">Tayyor Dizaynlar Galereyasi</h1>
            
            {/* Horizontal Filter Bar */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {['Barchasi', 'Shkaf', 'Oshxona mebeli', 'Divan', 'Stol', 'Karavot', 'TV tumbasi'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${selectedCategory === cat ? 'bg-[#0F5A4E] text-white' : 'bg-white text-[#0F5A4E] border border-[#D7F2DF]'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredGallery.map(item => (
                <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-[#D7F2DF] p-4 flex flex-col justify-between space-y-3 shadow-sm">
                  <div className="h-52 sm:h-56 rounded-2xl overflow-hidden bg-gray-100">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-[#0F5A4E] text-base">{item.title}</h3>
                    <p className="text-xs text-[#4E5D5B] line-clamp-2">{item.description}</p>
                  </div>
                  <button onClick={() => loadDesignFromGallery(item)} className="w-full py-2.5 bg-[#F4FBF6] rounded-xl text-xs font-bold text-[#0F5A4E] hover:bg-[#0F5A4E] hover:text-white transition-colors">
                    Shu dizayn asosida yaratish
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. SAVED DESIGNS PAGE */}
        {activeTab === 'saved' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F5A4E]">Saqlangan Dizaynlar</h1>
            {savedDesigns.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-3xl border border-[#D7F2DF]">
                <p className="text-xs sm:text-sm text-[#5D7B73]">Hozircha saqlangan dizaynlar mavjud emas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedDesigns.map(design => (
                  <div key={design.id} className="bg-white p-4 rounded-3xl border border-[#D7F2DF] space-y-3 shadow-sm">
                    <img src={design.image} alt={design.title} className="w-full h-44 object-cover rounded-2xl" />
                    <h4 className="font-bold text-[#0F5A4E] text-sm">{design.title}</h4>
                    <button onClick={() => removeSaved(design.id)} className="text-xs text-red-500 font-semibold hover:underline">O‘chirish</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. MASTER DASHBOARD PAGE */}
        {activeTab === 'master_dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 sm:p-6 rounded-3xl border border-[#D7F2DF] gap-4">
              <div>
                <span className="text-xs text-[#0F5A4E] font-bold uppercase">Usta Boshqaruv Paneli</span>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0F5A4E]">{currentUser?.name || 'Usta'} Profilingiz</h1>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => setMasterTab('orders')} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold ${masterTab === 'orders' ? 'bg-[#0F5A4E] text-white' : 'bg-[#F4FBF6]'}`}>Buyurtmalar</button>
                <button onClick={() => setMasterTab('portfolio')} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold ${masterTab === 'portfolio' ? 'bg-[#0F5A4E] text-white' : 'bg-[#F4FBF6]'}`}>Portfolio</button>
                <button onClick={() => setMasterTab('calc')} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold ${masterTab === 'calc' ? 'bg-[#0F5A4E] text-white' : 'bg-[#F4FBF6]'}`}>Kalkulyator</button>
              </div>
            </div>

            {/* Orders Tab */}
            {masterTab === 'orders' && (
              <div className="space-y-4">
                <h3 className="font-bold text-[#0F5A4E]">Kelib tushgan buyurtmalar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {masterOrders.map(ord => (
                    <div key={ord.id} className="bg-white p-5 rounded-3xl border border-[#D7F2DF] space-y-3 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[11px] text-[#5D7B73]">{ord.id} • {ord.date}</span>
                          <h4 className="font-bold text-[#0F5A4E] text-sm sm:text-base">{ord.itemTitle}</h4>
                        </div>
                        <span className="px-2.5 py-1 bg-[#D7F2DF] text-[#0F5A4E] text-[10px] sm:text-xs font-bold rounded-full">{ord.status}</span>
                      </div>
                      <p className="text-xs text-[#4E5D5B]">Mijoz: {ord.clientName} ({ord.phone})</p>
                      <p className="text-xs text-[#4E5D5B]">O‘lchamlari: {ord.dimensions}</p>
                      <div className="pt-2 border-t border-[#D7F2DF] flex justify-between items-center">
                        <span className="font-bold text-[#0F5A4E] text-sm">{ord.price}</span>
                        <button className="px-3 py-1.5 bg-[#0F5A4E] text-white rounded-xl text-xs font-medium">Taklif yuborish</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price Calculator Tab */}
            {masterTab === 'calc' && (
              <div className="bg-white p-5 sm:p-8 rounded-3xl border border-[#D7F2DF] max-w-2xl mx-auto space-y-5 shadow-sm">
                <h3 className="text-lg sm:text-xl font-bold text-[#0F5A4E]">Mebel Narxini Hisoblash Kalkulyatori</h3>
                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block font-bold">MDF/DSP Listlar soni: {calcSheets} ta</label>
                    <input type="range" min="1" max="20" value={calcSheets} onChange={e => setCalcSheets(Number(e.target.value))} className="w-full accent-[#0F5A4E] mt-1" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">1 list narxi (UZS): {calcPricePerSheet.toLocaleString()}</label>
                    <input type="number" value={calcPricePerSheet} onChange={e => setCalcPricePerSheet(Number(e.target.value))} className="w-full p-2.5 border rounded-xl text-xs sm:text-sm" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Furnitura va mexanizmlar (UZS): {calcHardwarePrice.toLocaleString()}</label>
                    <input type="number" value={calcHardwarePrice} onChange={e => setCalcHardwarePrice(Number(e.target.value))} className="w-full p-2.5 border rounded-xl text-xs sm:text-sm" />
                  </div>
                  <div>
                    <label className="block font-bold">Ustachilik ustamasi (%): {calcLaborMargin}%</label>
                    <input type="range" min="10" max="100" value={calcLaborMargin} onChange={e => setCalcLaborMargin(Number(e.target.value))} className="w-full accent-[#0F5A4E] mt-1" />
                  </div>
                </div>

                <div className="p-4 bg-[#F4FBF6] rounded-2xl space-y-2 border border-[#D7F2DF]">
                  <div className="flex justify-between text-xs"><span>Materiallar tannarxi:</span><b>{materialCost.toLocaleString()} UZS</b></div>
                  <div className="flex justify-between text-sm sm:text-base font-bold text-[#0F5A4E]"><span>Mijozga narx:</span><b>{estimatedPrice.toLocaleString()} UZS</b></div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* --- RESPONSIVE AUTH MODAL --- */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 relative shadow-2xl animate-in zoom-in-95 duration-150">
            <button onClick={() => setAuthModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <X className="w-6 h-6" />
            </button>
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F5A4E]">MEBELCHI Platformasiga Kirish</h2>
              <p className="text-xs text-[#5D7B73]">Rolingizni tanlang va hisobga kiring</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedRole('user')}
                className={`p-3.5 rounded-2xl border text-center text-xs font-bold transition-all ${selectedRole === 'user' ? 'border-[#0F5A4E] bg-[#0F5A4E]/10 text-[#0F5A4E]' : 'border-gray-200 text-[#5D7B73]'}`}
              >
                Foydalanuvchi
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('master')}
                className={`p-3.5 rounded-2xl border text-center text-xs font-bold transition-all ${selectedRole === 'master' ? 'border-[#0F5A4E] bg-[#0F5A4E]/10 text-[#0F5A4E]' : 'border-gray-200 text-[#5D7B73]'}`}
              >
                Mebel Ustasi
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-3.5">
              <input type="email" placeholder="Email manzil" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required className="w-full p-3 border rounded-xl text-xs sm:text-sm" />
              <input type="password" placeholder="Parol" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required className="w-full p-3 border rounded-xl text-xs sm:text-sm" />
              <button type="submit" className="w-full py-3.5 bg-[#0F5A4E] text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-[#0F5A4E]">
                Kirish
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-[#0F5A4E] text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F5A4E] flex items-center justify-center text-white">
              <Sofa className="w-4 h-4" />
            </div>
            <div>
              <span className="text-lg font-bold">MEBELCHI</span>
              <span className="block text-[10px] text-gray-400">IDEATHON 2026 • AI Platform</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">Mebelingizni yasatishdan oldin ko‘ring! Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>

    </div>
  );
}