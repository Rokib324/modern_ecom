"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Save,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
  Megaphone,
  Image as ImageIcon,
  LayoutGrid,
  Sparkles,
  Layers,
  Users,
  BookOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AnnouncementItem { id: string; text: string; active: boolean }
interface HeroSlide { id: string; src: string; alt: string; heading: string; ctaLabel: string; ctaHref: string; active: boolean }
interface CollectionItem { id: string; title: string; image: string; href: string; active: boolean }
interface NewInProduct { id: string; name: string; price: string; numPrice: number; image: string; category: string; sizes: string[]; isNew: boolean; active: boolean }
interface FeaturedBanner { id: string; title: string; buttonText: string; href: string; image: string; alt: string; active: boolean }
interface MensKidsBanner { id: string; title: string; description: string; buttonText: string; href: string; image: string; alt: string; active: boolean }
interface OurStoryData { eyebrow: string; heading: string; ctaLabel: string; ctaHref: string }

// ─── Shared hook for loading/saving a section ─────────────────────────────────
function useCmsSection<T>(section: string, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/site-content?section=${section}`);
      const json = await res.json();
      if (json.success) setData(json.data as T);
    } catch { /* use fallback */ }
    finally { setLoading(false); }
  }, [section]);

  const save = useCallback(async (payload: T) => {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch(`/api/site-content?section=${section}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setData(json.data as T);
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch { setStatus("error"); }
    finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  }, [section]);

  useEffect(() => { load(); }, [load]);

  return { data, setData, loading, saving, status, save, reload: load };
}

// ─── Status Button ────────────────────────────────────────────────────────────
function SaveButton({ saving, status, onClick, isDark }: { saving: boolean; status: string; onClick: () => void; isDark: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        status === "success"
          ? "bg-green-500 text-white"
          : status === "error"
            ? "bg-red-500 text-white"
            : isDark
              ? "bg-indigo-600 hover:bg-indigo-500 text-white"
              : "bg-gray-900 hover:bg-gray-700 text-white"
      } disabled:opacity-60`}
    >
      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : status === "success" ? <CheckCircle className="w-4 h-4" /> : status === "error" ? <AlertCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
      {saving ? "Saving…" : status === "success" ? "Saved!" : status === "error" ? "Error" : "Save Changes"}
    </button>
  );
}

// ─── Field Components ─────────────────────────────────────────────────────────
function FieldLabel({ label, isDark }: { label: string; isDark: boolean }) {
  return <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</label>;
}

function TextField({ label, value, onChange, placeholder, isDark, multiline }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; isDark: boolean; multiline?: boolean
}) {
  const cls = `w-full px-3 py-2 rounded-lg border text-sm transition-colors ${isDark ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-indigo-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-600"} focus:outline-none`;
  return (
    <div>
      <FieldLabel label={label} isDark={isDark} />
      {multiline
        ? <textarea className={cls} rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        : <input className={cls} type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />}
    </div>
  );
}

function ImageField({ label, value, onChange, isDark }: { label: string; value: string; onChange: (v: string) => void; isDark: boolean }) {
  return (
    <div>
      <FieldLabel label={label} isDark={isDark} />
      <div className="flex gap-2">
        <input
          className={`flex-1 px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"} focus:outline-none`}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="/images/my-image.jpg or https://..."
        />
        {value && (
          <div className={`w-9 h-9 rounded-lg border overflow-hidden flex-shrink-0 ${isDark ? "border-gray-600" : "border-gray-300"}`}>
            <img src={value} alt="preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleField({ label, value, onChange, isDark }: { label: string; value: boolean; onChange: (v: boolean) => void; isDark: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>{label}</span>
      <button type="button" onClick={() => onChange(!value)} className={`relative inline-flex w-11 h-6 rounded-full transition-colors ${value ? "bg-indigo-500" : isDark ? "bg-gray-600" : "bg-gray-300"}`}>
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

// ─── Card Wrapper ─────────────────────────────────────────────────────────────
function Card({ children, isDark }: { children: React.ReactNode; isDark: boolean }) {
  return <div className={`rounded-xl border p-5 space-y-4 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"}`}>{children}</div>;
}

function SectionHeader({ title, icon: Icon, isDark }: { title: string; icon: React.ElementType; isDark: boolean }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <Icon className={`w-5 h-5 ${isDark ? "text-indigo-400" : "text-gray-700"}`} />
      <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{title}</h3>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: ANNOUNCEMENTS
// ══════════════════════════════════════════════════════════════════════════════
function AnnouncementsTab({ isDark }: { isDark: boolean }) {
  const { data, setData, loading, saving, status, save } = useCmsSection<{ items: AnnouncementItem[] }>(
    "announcements",
    { items: [] }
  );

  const addItem = () => {
    setData(d => ({ items: [...d.items, { id: `ann-${Date.now()}`, text: "", active: true }] }));
  };
  const removeItem = (id: string) => setData(d => ({ items: d.items.filter(i => i.id !== id) }));
  const updateItem = (id: string, key: keyof AnnouncementItem, val: string | boolean) => {
    setData(d => ({ items: d.items.map(i => i.id === id ? { ...i, [key]: val } : i) }));
  };
  const moveItem = (idx: number, dir: -1 | 1) => {
    const arr = [...data.items];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= arr.length) return;
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setData({ items: arr });
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <SectionHeader title="Announcement Bar Messages" icon={Megaphone} isDark={isDark} />
        <SaveButton saving={saving} status={status} onClick={() => save(data)} isDark={isDark} />
      </div>
      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} -mt-2`}>
        Messages scroll across the announcement bar. Inactive items are hidden on the storefront.
      </p>
      <div className="space-y-3">
        {data.items.map((item, idx) => (
          <Card key={item.id} isDark={isDark}>
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-0.5 pt-1 shrink-0">
                <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} className="p-0.5 opacity-50 hover:opacity-100 disabled:opacity-20"><ChevronUp className="w-4 h-4" /></button>
                <GripVertical className={`w-4 h-4 mx-auto ${isDark ? "text-gray-600" : "text-gray-300"}`} />
                <button onClick={() => moveItem(idx, 1)} disabled={idx === data.items.length - 1} className="p-0.5 opacity-50 hover:opacity-100 disabled:opacity-20"><ChevronDown className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 space-y-3">
                <TextField label="Message Text" value={item.text} onChange={v => updateItem(item.id, "text", v)} placeholder="Enter announcement text…" isDark={isDark} />
                <ToggleField label="Show on storefront" value={item.active} onChange={v => updateItem(item.id, "active", v)} isDark={isDark} />
              </div>
              <button onClick={() => removeItem(item.id)} className="mt-1 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
      <button onClick={addItem} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed text-sm font-medium transition-colors ${isDark ? "border-gray-600 text-gray-400 hover:border-indigo-500 hover:text-indigo-400" : "border-gray-300 text-gray-500 hover:border-gray-600 hover:text-gray-700"}`}>
        <Plus className="w-4 h-4" /> Add Message
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: HERO SLIDER
// ══════════════════════════════════════════════════════════════════════════════
function HeroTab({ isDark }: { isDark: boolean }) {
  const { data, setData, loading, saving, status, save } = useCmsSection<{ slides: HeroSlide[]; slideDuration: number }>(
    "hero",
    { slides: [], slideDuration: 6000 }
  );

  const addSlide = () => {
    setData(d => ({ ...d, slides: [...d.slides, { id: `slide-${Date.now()}`, src: "", alt: "", heading: "", ctaLabel: "SHOP NOW", ctaHref: "/products", active: true }] }));
  };
  const removeSlide = (id: string) => setData(d => ({ ...d, slides: d.slides.filter(s => s.id !== id) }));
  const updateSlide = (id: string, key: keyof HeroSlide, val: string | boolean) => {
    setData(d => ({ ...d, slides: d.slides.map(s => s.id === id ? { ...s, [key]: val } : s) }));
  };
  const moveSlide = (idx: number, dir: -1 | 1) => {
    const arr = [...data.slides];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= arr.length) return;
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setData(d => ({ ...d, slides: arr }));
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <SectionHeader title="Hero Slider" icon={ImageIcon} isDark={isDark} />
        <SaveButton saving={saving} status={status} onClick={() => save(data)} isDark={isDark} />
      </div>
      <Card isDark={isDark}>
        <FieldLabel label="Slide Duration (milliseconds)" isDark={isDark} />
        <input
          type="number"
          step="500"
          min="2000"
          value={data.slideDuration}
          onChange={e => setData(d => ({ ...d, slideDuration: Number(e.target.value) }))}
          className={`w-40 px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"} focus:outline-none`}
        />
        <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>6000 = 6 seconds per slide</p>
      </Card>

      <div className="space-y-4">
        {data.slides.map((slide, idx) => (
          <Card key={slide.id} isDark={isDark}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>Slide {idx + 1}</span>
              <div className="flex gap-1">
                <button onClick={() => moveSlide(idx, -1)} disabled={idx === 0} className="p-1 opacity-50 hover:opacity-100 disabled:opacity-20"><ChevronUp className="w-4 h-4" /></button>
                <button onClick={() => moveSlide(idx, 1)} disabled={idx === data.slides.length - 1} className="p-1 opacity-50 hover:opacity-100 disabled:opacity-20"><ChevronDown className="w-4 h-4" /></button>
                <button onClick={() => removeSlide(slide.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            {slide.src && (
              <div className="w-full h-28 rounded-lg overflow-hidden mb-3">
                <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageField label="Image URL" value={slide.src} onChange={v => updateSlide(slide.id, "src", v)} isDark={isDark} />
              <TextField label="Alt Text" value={slide.alt} onChange={v => updateSlide(slide.id, "alt", v)} placeholder="Describe the image for accessibility" isDark={isDark} />
              <TextField label="Heading" value={slide.heading} onChange={v => updateSlide(slide.id, "heading", v)} placeholder="Effortless style, beautifully made." isDark={isDark} />
              <div className="grid grid-cols-2 gap-3">
                <TextField label="CTA Label" value={slide.ctaLabel} onChange={v => updateSlide(slide.id, "ctaLabel", v)} placeholder="SHOP NOW" isDark={isDark} />
                <TextField label="CTA Link" value={slide.ctaHref} onChange={v => updateSlide(slide.id, "ctaHref", v)} placeholder="/products" isDark={isDark} />
              </div>
            </div>
            <ToggleField label="Show slide on storefront" value={slide.active} onChange={v => updateSlide(slide.id, "active", v)} isDark={isDark} />
          </Card>
        ))}
      </div>
      <button onClick={addSlide} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed text-sm font-medium transition-colors ${isDark ? "border-gray-600 text-gray-400 hover:border-indigo-500 hover:text-indigo-400" : "border-gray-300 text-gray-500 hover:border-gray-600 hover:text-gray-700"}`}>
        <Plus className="w-4 h-4" /> Add Slide
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: COLLECTIONS
// ══════════════════════════════════════════════════════════════════════════════
function CollectionsTab({ isDark }: { isDark: boolean }) {
  const { data, setData, loading, saving, status, save } = useCmsSection<{ heading: string; items: CollectionItem[] }>(
    "collections",
    { heading: "Shop Our Collections", items: [] }
  );

  const addItem = () => setData(d => ({ ...d, items: [...d.items, { id: `col-${Date.now()}`, title: "", image: "", href: "/products", active: true }] }));
  const removeItem = (id: string) => setData(d => ({ ...d, items: d.items.filter(i => i.id !== id) }));
  const updateItem = (id: string, key: keyof CollectionItem, val: string | boolean) => {
    setData(d => ({ ...d, items: d.items.map(i => i.id === id ? { ...i, [key]: val } : i) }));
  };
  const moveItem = (idx: number, dir: -1 | 1) => {
    const arr = [...data.items];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= arr.length) return;
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setData(d => ({ ...d, items: arr }));
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <SectionHeader title="Shop Our Collections" icon={LayoutGrid} isDark={isDark} />
        <SaveButton saving={saving} status={status} onClick={() => save(data)} isDark={isDark} />
      </div>
      <Card isDark={isDark}>
        <TextField label="Section Heading" value={data.heading} onChange={v => setData(d => ({ ...d, heading: v }))} placeholder="Shop Our Collections" isDark={isDark} />
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.items.map((item, idx) => (
          <Card key={item.id} isDark={isDark}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>Card {idx + 1}</span>
              <div className="flex gap-1">
                <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} className="p-1 opacity-50 hover:opacity-100 disabled:opacity-20"><ChevronUp className="w-4 h-4" /></button>
                <button onClick={() => moveItem(idx, 1)} disabled={idx === data.items.length - 1} className="p-1 opacity-50 hover:opacity-100 disabled:opacity-20"><ChevronDown className="w-4 h-4" /></button>
                <button onClick={() => removeItem(item.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            {item.image && <div className="w-full h-24 rounded-lg overflow-hidden mb-3"><img src={item.image} alt={item.title} className="w-full h-full object-cover" /></div>}
            <TextField label="Title" value={item.title} onChange={v => updateItem(item.id, "title", v)} placeholder="Women's Cotton Pyjamas" isDark={isDark} />
            <ImageField label="Image" value={item.image} onChange={v => updateItem(item.id, "image", v)} isDark={isDark} />
            <TextField label="Link" value={item.href} onChange={v => updateItem(item.id, "href", v)} placeholder="/products?category=..." isDark={isDark} />
            <ToggleField label="Show on storefront" value={item.active} onChange={v => updateItem(item.id, "active", v)} isDark={isDark} />
          </Card>
        ))}
      </div>
      <button onClick={addItem} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed text-sm font-medium transition-colors ${isDark ? "border-gray-600 text-gray-400 hover:border-indigo-500 hover:text-indigo-400" : "border-gray-300 text-gray-500 hover:border-gray-600 hover:text-gray-700"}`}>
        <Plus className="w-4 h-4" /> Add Collection Card
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: NEW IN / BEST SELLERS / LINEN
// ══════════════════════════════════════════════════════════════════════════════
function NewInTab({ isDark }: { isDark: boolean }) {
  const { data, setData, loading, saving, status, save } = useCmsSection<{ tabs: { key: string; label: string }[]; products: NewInProduct[] }>(
    "new_in",
    { tabs: [], products: [] }
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState("all");

  const addProduct = () => {
    const newP: NewInProduct = { id: `prod-${Date.now()}`, name: "", price: "", numPrice: 0, image: "", category: "new-in", sizes: ["XS","S","M","L","XL"], isNew: true, active: true };
    setData(d => ({ ...d, products: [...d.products, newP] }));
    setExpandedId(newP.id);
  };
  const removeProduct = (id: string) => setData(d => ({ ...d, products: d.products.filter(p => p.id !== id) }));
  const updateProduct = (id: string, key: keyof NewInProduct, val: unknown) => {
    setData(d => ({ ...d, products: d.products.map(p => p.id === id ? { ...p, [key]: val } : p) }));
  };
  const updateTabLabel = (key: string, label: string) => {
    setData(d => ({ ...d, tabs: d.tabs.map(t => t.key === key ? { ...t, label } : t) }));
  };

  const displayed = filterCat === "all" ? data.products : data.products.filter(p => p.category === filterCat);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <SectionHeader title="New In / Best Sellers / Linen Blend" icon={Sparkles} isDark={isDark} />
        <SaveButton saving={saving} status={status} onClick={() => save(data)} isDark={isDark} />
      </div>

      {/* Tab Labels */}
      <Card isDark={isDark}>
        <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Tab Labels</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data.tabs.map(tab => (
            <TextField key={tab.key} label={tab.key} value={tab.label} onChange={v => updateTabLabel(tab.key, v)} isDark={isDark} />
          ))}
        </div>
      </Card>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", ...(data.tabs.map(t => t.key))].map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterCat === cat ? (isDark ? "bg-indigo-600 text-white" : "bg-gray-900 text-white") : (isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}`}>
            {cat === "all" ? "All Products" : data.tabs.find(t => t.key === cat)?.label ?? cat}
          </button>
        ))}
        <span className={`ml-auto text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{displayed.length} items</span>
      </div>

      <div className="space-y-2">
        {displayed.map(product => (
          <div key={product.id} className={`rounded-xl border transition-all ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"}`}>
            {/* Collapsed Row */}
            <div
              className="flex items-center gap-3 px-4 py-3 cursor-pointer"
              onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}
            >
              {product.image && <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0"><img src={product.image} alt={product.name} className="w-full h-full object-cover" /></div>}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isDark ? "text-gray-100" : "text-gray-900"}`}>{product.name || "Untitled product"}</p>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{product.price} · {product.category}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={e => { e.stopPropagation(); updateProduct(product.id, "active", !product.active); }} className={`p-1.5 rounded-lg transition-colors ${product.active ? "text-green-500" : (isDark ? "text-gray-600" : "text-gray-300")}`}>
                  {product.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={e => { e.stopPropagation(); removeProduct(product.id); }} className="p-1.5 text-red-400 hover:text-red-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                <ChevronDown className={`w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"} transition-transform ${expandedId === product.id ? "rotate-180" : ""}`} />
              </div>
            </div>

            {/* Expanded Form */}
            {expandedId === product.id && (
              <div className={`border-t px-4 py-4 space-y-4 ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField label="Product Name" value={product.name} onChange={v => updateProduct(product.id, "name", v)} isDark={isDark} />
                  <div className="grid grid-cols-2 gap-3">
                    <TextField label="Price Display" value={product.price} onChange={v => updateProduct(product.id, "price", v)} placeholder="৳5,800" isDark={isDark} />
                    <div>
                      <FieldLabel label="Numeric Price" isDark={isDark} />
                      <input type="number" value={product.numPrice} onChange={e => updateProduct(product.id, "numPrice", Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"} focus:outline-none`} />
                    </div>
                  </div>
                  <ImageField label="Image" value={product.image} onChange={v => updateProduct(product.id, "image", v)} isDark={isDark} />
                  <div>
                    <FieldLabel label="Category" isDark={isDark} />
                    <select value={product.category} onChange={e => updateProduct(product.id, "category", e.target.value)} className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"} focus:outline-none`}>
                      {data.tabs.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <FieldLabel label="Available Sizes (comma-separated)" isDark={isDark} />
                    <input type="text" value={product.sizes.join(",")} onChange={e => updateProduct(product.id, "sizes", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"} focus:outline-none`} placeholder="XS,S,M,L,XL" />
                  </div>
                  <div className="flex gap-6">
                    <ToggleField label="New In badge" value={product.isNew} onChange={v => updateProduct(product.id, "isNew", v)} isDark={isDark} />
                    <ToggleField label="Show on storefront" value={product.active} onChange={v => updateProduct(product.id, "active", v)} isDark={isDark} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={addProduct} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed text-sm font-medium transition-colors ${isDark ? "border-gray-600 text-gray-400 hover:border-indigo-500 hover:text-indigo-400" : "border-gray-300 text-gray-500 hover:border-gray-600 hover:text-gray-700"}`}>
        <Plus className="w-4 h-4" /> Add Product
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: FEATURED BANNERS
// ══════════════════════════════════════════════════════════════════════════════
function FeaturedBannersTab({ isDark }: { isDark: boolean }) {
  const { data, setData, loading, saving, status, save } = useCmsSection<{ items: FeaturedBanner[] }>(
    "featured_banners",
    { items: [] }
  );

  const updateItem = (id: string, key: keyof FeaturedBanner, val: string | boolean) => {
    setData(d => ({ items: d.items.map(i => i.id === id ? { ...i, [key]: val } : i) }));
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <SectionHeader title="Featured Product Banners" icon={Layers} isDark={isDark} />
        <SaveButton saving={saving} status={status} onClick={() => save(data)} isDark={isDark} />
      </div>
      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} -mt-2`}>Two large lifestyle banners displayed side by side.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data.items.map((item, idx) => (
          <Card key={item.id} isDark={isDark}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Banner {idx + 1}</p>
            {item.image && <div className="w-full h-28 rounded-lg overflow-hidden mb-3"><img src={item.image} alt={item.title} className="w-full h-full object-cover" /></div>}
            <div className="space-y-3">
              <TextField label="Title" value={item.title} onChange={v => updateItem(item.id, "title", v)} isDark={isDark} />
              <TextField label="Button Text" value={item.buttonText} onChange={v => updateItem(item.id, "buttonText", v)} isDark={isDark} />
              <TextField label="Link" value={item.href} onChange={v => updateItem(item.id, "href", v)} isDark={isDark} />
              <ImageField label="Image" value={item.image} onChange={v => updateItem(item.id, "image", v)} isDark={isDark} />
              <TextField label="Alt Text" value={item.alt} onChange={v => updateItem(item.id, "alt", v)} isDark={isDark} />
              <ToggleField label="Show on storefront" value={item.active} onChange={v => updateItem(item.id, "active", v)} isDark={isDark} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: MENS & KIDS BANNERS
// ══════════════════════════════════════════════════════════════════════════════
function MensKidsTab({ isDark }: { isDark: boolean }) {
  const { data, setData, loading, saving, status, save } = useCmsSection<{ banners: MensKidsBanner[] }>(
    "mens_kids",
    { banners: [] }
  );

  const updateBanner = (id: string, key: keyof MensKidsBanner, val: string | boolean) => {
    setData(d => ({ banners: d.banners.map(b => b.id === id ? { ...b, [key]: val } : b) }));
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <SectionHeader title="Mens & Kids Category Banners" icon={Users} isDark={isDark} />
        <SaveButton saving={saving} status={status} onClick={() => save(data)} isDark={isDark} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data.banners.map((banner, idx) => (
          <Card key={banner.id} isDark={isDark}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{banner.title || `Banner ${idx + 1}`}</p>
            {banner.image && <div className="w-full h-28 rounded-lg overflow-hidden mb-3"><img src={banner.image} alt={banner.title} className="w-full h-full object-cover" /></div>}
            <div className="space-y-3">
              <TextField label="Title" value={banner.title} onChange={v => updateBanner(banner.id, "title", v)} isDark={isDark} />
              <TextField label="Description" value={banner.description} onChange={v => updateBanner(banner.id, "description", v)} isDark={isDark} multiline />
              <TextField label="Button Text" value={banner.buttonText} onChange={v => updateBanner(banner.id, "buttonText", v)} isDark={isDark} />
              <TextField label="Link" value={banner.href} onChange={v => updateBanner(banner.id, "href", v)} isDark={isDark} />
              <ImageField label="Image" value={banner.image} onChange={v => updateBanner(banner.id, "image", v)} isDark={isDark} />
              <TextField label="Alt Text" value={banner.alt} onChange={v => updateBanner(banner.id, "alt", v)} isDark={isDark} />
              <ToggleField label="Show on storefront" value={banner.active} onChange={v => updateBanner(banner.id, "active", v)} isDark={isDark} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: OUR STORY
// ══════════════════════════════════════════════════════════════════════════════
function OurStoryTab({ isDark }: { isDark: boolean }) {
  const { data, setData, loading, saving, status, save } = useCmsSection<OurStoryData>(
    "our_story",
    { eyebrow: "Our Story", heading: "", ctaLabel: "Read more", ctaHref: "/about" }
  );

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <SectionHeader title="Our Story Section" icon={BookOpen} isDark={isDark} />
        <SaveButton saving={saving} status={status} onClick={() => save(data)} isDark={isDark} />
      </div>
      <Card isDark={isDark}>
        <div className="space-y-4">
          <TextField label="Eyebrow Label" value={data.eyebrow} onChange={v => setData(d => ({ ...d, eyebrow: v }))} placeholder="Our Story" isDark={isDark} />
          <TextField label="Brand Statement Heading" value={data.heading} onChange={v => setData(d => ({ ...d, heading: v }))} multiline isDark={isDark} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="CTA Label" value={data.ctaLabel} onChange={v => setData(d => ({ ...d, ctaLabel: v }))} placeholder="Read more" isDark={isDark} />
            <TextField label="CTA Link" value={data.ctaHref} onChange={v => setData(d => ({ ...d, ctaHref: v }))} placeholder="/about" isDark={isDark} />
          </div>
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const CMS_TABS = [
  { key: "announcements", label: "Announcement Bar", icon: Megaphone },
  { key: "hero", label: "Hero Slider", icon: ImageIcon },
  { key: "collections", label: "Collections Grid", icon: LayoutGrid },
  { key: "new_in", label: "New In / Bestsellers", icon: Sparkles },
  { key: "featured_banners", label: "Featured Banners", icon: Layers },
  { key: "mens_kids", label: "Mens & Kids", icon: Users },
  { key: "our_story", label: "Our Story", icon: BookOpen },
] as const;

type CmsTabKey = typeof CMS_TABS[number]["key"];

export default function SiteContentManager({ isDark, initialTab }: { isDark?: boolean; initialTab?: string }) {
  const dark = isDark ?? false;
  const [activeTab, setActiveTab] = useState<CmsTabKey>(
    (CMS_TABS.find(t => t.key === initialTab)?.key ?? "announcements") as CmsTabKey
  );

  // Sync when parent changes the selected section via sidebar
  useEffect(() => {
    const match = CMS_TABS.find(t => t.key === initialTab);
    if (match) setActiveTab(match.key);
  }, [initialTab]);

  const tabContent: Record<CmsTabKey, React.ReactNode> = {
    announcements: <AnnouncementsTab isDark={dark} />,
    hero: <HeroTab isDark={dark} />,
    collections: <CollectionsTab isDark={dark} />,
    new_in: <NewInTab isDark={dark} />,
    featured_banners: <FeaturedBannersTab isDark={dark} />,
    mens_kids: <MensKidsTab isDark={dark} />,
    our_story: <OurStoryTab isDark={dark} />,
  };

  const currentTabMeta = CMS_TABS.find(t => t.key === activeTab) ?? CMS_TABS[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-[#2563eb] flex items-center justify-center flex-shrink-0">
            <currentTabMeta.icon className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>
              {currentTabMeta.label}
            </h1>
            <p className={`text-xs sm:text-sm mt-0.5 ${dark ? "text-gray-400" : "text-gray-500"}`}>
              Live storefront section content. Changes are live immediately after saving.
            </p>
          </div>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors shadow-sm self-start sm:self-auto ${
            dark
              ? "border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Eye className="w-4 h-4 text-[#2563eb]" />
          <span>View Storefront</span>
        </a>
      </div>

      {/* Content */}
      <div className="w-full">
        {tabContent[activeTab]}
      </div>
    </div>
  );
}

