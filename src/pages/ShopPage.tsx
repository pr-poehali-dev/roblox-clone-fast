import { useState } from "react";

const CATEGORIES = ["Все", "Скины", "Оружие", "Питомцы", "Эффекты", "Эмоции"];

const ITEMS = [
  { id: 1, name: "Дракон-голограмма", cat: "Питомцы", price: 850, emoji: "🐲", rarity: "legendary", color: "var(--neon-orange)", hot: true },
  { id: 2, name: "Плазменный меч Mk.V", cat: "Оружие", price: 650, emoji: "⚔️", rarity: "legendary", color: "var(--neon-orange)", hot: false },
  { id: 3, name: "Кибер-экзоскелет", cat: "Скины", price: 400, emoji: "🤖", rarity: "epic", color: "var(--neon-purple)", hot: true },
  { id: 4, name: "Неоновый шлейф", cat: "Эффекты", price: 200, emoji: "✨", rarity: "rare", color: "var(--neon-blue)", hot: false },
  { id: 5, name: "Галактический зонтик", cat: "Эффекты", price: 180, emoji: "🌌", rarity: "rare", color: "var(--neon-blue)", hot: false },
  { id: 6, name: "Мини-робот", cat: "Питомцы", price: 320, emoji: "🤖", rarity: "epic", color: "var(--neon-purple)", hot: false },
  { id: 7, name: "Огненная аура", cat: "Эффекты", price: 280, emoji: "🔥", rarity: "epic", color: "var(--neon-purple)", hot: true },
  { id: 8, name: "Танец победы", cat: "Эмоции", price: 150, emoji: "💃", rarity: "rare", color: "var(--neon-blue)", hot: false },
  { id: 9, name: "Снайперская винтовка X", cat: "Оружие", price: 500, emoji: "🔫", rarity: "epic", color: "var(--neon-purple)", hot: false },
  { id: 10, name: "Пиксельный плащ", cat: "Скины", price: 220, emoji: "🦸", rarity: "rare", color: "var(--neon-blue)", hot: false },
  { id: 11, name: "Звёздная кошка", cat: "Питомцы", price: 380, emoji: "🐱", rarity: "epic", color: "var(--neon-purple)", hot: true },
  { id: 12, name: "Волна радости", cat: "Эмоции", price: 90, emoji: "👋", rarity: "common", color: "#6b7280", hot: false },
];

const RARITY_COLORS: Record<string, string> = {
  legendary: "var(--neon-orange)",
  epic: "var(--neon-purple)",
  rare: "var(--neon-blue)",
  common: "#6b7280",
};

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [coins] = useState(3580);

  const filtered = activeCategory === "Все" ? ITEMS : ITEMS.filter(i => i.cat === activeCategory);

  return (
    <div className="grid-bg min-h-screen" style={{ paddingTop: '22px' }}>
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5 animate-fade-in">
          <h1 className="font-pixel text-xs" style={{ color: 'var(--neon-orange)', fontSize: '14px' }}>🛒 МАГАЗИН</h1>
          <div className="flex items-center gap-2 px-4 py-2 font-pixel" style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid #ffd700', color: '#ffd700', fontSize: '10px' }}>
            💎 {coins.toLocaleString('ru')} монет
          </div>
        </div>

        {/* Banner */}
        <div className="retro-card p-4 mb-5 animate-fade-in delay-100 flex items-center justify-between overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #1a0535, #3d0020)' }}>
          <div className="absolute right-0 top-0 text-8xl opacity-10 select-none">🎮</div>
          <div>
            <div className="font-pixel text-xs mb-1" style={{ color: 'var(--neon-pink)', fontSize: '9px' }}>ОГРАНИЧЕННОЕ ПРЕДЛОЖЕНИЕ</div>
            <h2 className="font-orbitron font-black text-white text-lg">ПАКЕТ ЛЕГЕНДЫ</h2>
            <p className="text-sm" style={{ color: '#8892a4', fontFamily: 'Rubik' }}>5 предметов legendary · Скидка 40%</p>
          </div>
          <div className="text-right">
            <div className="font-pixel text-xs line-through mb-1" style={{ color: '#6b7280', fontSize: '9px' }}>2,500 💎</div>
            <div className="font-pixel text-lg" style={{ color: '#ffd700' }}>1,490 💎</div>
            <button className="btn-pixel mt-2" style={{ background: 'var(--neon-pink)', fontSize: '8px' }}>КУПИТЬ</button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 animate-fade-in delay-200">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="font-pixel whitespace-nowrap px-3 py-1.5 transition-all"
              style={{
                fontSize: '8px',
                background: activeCategory === cat ? 'var(--neon-orange)' : 'transparent',
                color: activeCategory === cat ? 'var(--dark-bg)' : '#8892a4',
                border: activeCategory === cat ? 'none' : '1px solid var(--dark-border)',
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 animate-fade-in delay-300">
          {filtered.map(item => (
            <div key={item.id} className="retro-card p-4 flex flex-col relative"
              style={{ border: `1px solid ${item.color}30` }}>
              {item.hot && (
                <div className="absolute top-2 right-2 font-pixel text-xs px-1.5 py-0.5" style={{ background: 'var(--neon-pink)', color: 'white', fontSize: '6px' }}>🔥 ХИТ</div>
              )}
              <div className="text-4xl mb-3 text-center">{item.emoji}</div>
              <div className="font-pixel text-xs mb-1 text-center" style={{ borderColor: RARITY_COLORS[item.rarity], color: RARITY_COLORS[item.rarity], fontSize: '6px', border: '1px solid', display: 'inline-block', padding: '1px 6px', margin: '0 auto 4px' }}>
                {item.rarity.toUpperCase()}
              </div>
              <h3 className="font-orbitron font-bold text-white text-xs text-center mb-1 leading-tight">{item.name}</h3>
              <div className="text-xs text-center mb-3" style={{ color: '#6b7280', fontFamily: 'Rubik' }}>{item.cat}</div>
              <div className="mt-auto">
                <div className="font-pixel text-center mb-2" style={{ color: '#ffd700', fontSize: '10px' }}>💎 {item.price}</div>
                <button className="w-full font-pixel py-2 transition-all hover:opacity-80"
                  style={{ background: item.color, color: 'var(--dark-bg)', fontSize: '7px' }}>
                  КУПИТЬ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
