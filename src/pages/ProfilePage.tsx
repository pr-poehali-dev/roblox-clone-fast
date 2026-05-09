const STATS = [
  { label: "Побед", value: "248", icon: "🏆" },
  { label: "Матчей", value: "1,240", icon: "⚔️" },
  { label: "Монет", value: "3,580", icon: "💎" },
  { label: "Уровень", value: "42", icon: "⚡" },
  { label: "Рейтинг", value: "#127", icon: "📊" },
  { label: "Дней в игре", value: "186", icon: "📅" },
];

const EQUIPPED = [
  { slot: "Оружие", item: "Плазменный меч Mk.V", rarity: "legendary", emoji: "⚔️" },
  { slot: "Броня", item: "Нео-экзоскелет X", rarity: "epic", emoji: "🛡️" },
  { slot: "Шлем", item: "Кибер-визор Pro", rarity: "rare", emoji: "🪖" },
  { slot: "Питомец", item: "Дракон-голограмма", rarity: "legendary", emoji: "🐲" },
];

const RARITY_COLORS: Record<string, string> = {
  legendary: "var(--neon-orange)",
  epic: "var(--neon-purple)",
  rare: "var(--neon-blue)",
  common: "#6b7280",
};

export default function ProfilePage() {
  return (
    <div className="grid-bg min-h-screen" style={{ paddingTop: '22px' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Profile header */}
        <div className="retro-card p-6 mb-6 animate-fade-in" style={{ background: 'linear-gradient(135deg, rgba(155,89,255,0.08), var(--dark-card))' }}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black"
                style={{ background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-pink))', color: 'white' }}>
                Д
              </div>
              <div className="absolute -bottom-1 -right-1 font-pixel px-2 py-1" style={{ background: 'var(--neon-orange)', color: 'var(--dark-bg)', fontSize: '8px' }}>
                LVL 42
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-1">
                <h1 className="font-orbitron font-black text-2xl text-white">ДракоМастер</h1>
                <span className="font-pixel px-2 py-0.5 border" style={{ border: '1px solid var(--neon-orange)', color: 'var(--neon-orange)', fontSize: '7px' }}>LEGENDARY</span>
              </div>
              <p className="text-sm mb-3" style={{ color: '#8892a4', fontFamily: 'Rubik' }}>Покоритель космических подземелий · В игре с марта 2023</p>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="font-pixel text-xs" style={{ color: 'var(--neon-orange)', fontSize: '8px' }}>XP:</span>
                <div className="w-48 xp-bar"><div className="xp-bar-fill" style={{ width: '68%' }} /></div>
                <span style={{ color: '#6b7280', fontSize: '10px', fontFamily: 'Rubik' }}>68,420 / 100,000</span>
              </div>
            </div>
            <button className="btn-pixel">✏️ РЕДАКТИРОВАТЬ</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Stats */}
          <div className="animate-fade-in delay-100">
            <h2 className="font-pixel text-xs mb-3" style={{ color: 'var(--neon-green)', fontSize: '10px' }}>📊 СТАТИСТИКА</h2>
            <div className="grid grid-cols-3 gap-2">
              {STATS.map((stat, i) => (
                <div key={i} className="retro-card p-3 text-center">
                  <div className="text-xl mb-1">{stat.icon}</div>
                  <div className="font-orbitron font-black text-white text-sm">{stat.value}</div>
                  <div style={{ color: '#6b7280', fontSize: '10px', fontFamily: 'Rubik' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipped items */}
          <div className="animate-fade-in delay-200">
            <h2 className="font-pixel text-xs mb-3" style={{ color: 'var(--neon-green)', fontSize: '10px' }}>🎮 СНАРЯЖЕНИЕ</h2>
            <div className="space-y-2">
              {EQUIPPED.map((item, i) => (
                <div key={i} className="retro-card p-3 flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1">
                    <div className="text-xs mb-0.5" style={{ color: '#6b7280', fontFamily: 'Rubik' }}>{item.slot}</div>
                    <div className="font-orbitron font-bold text-xs text-white">{item.item}</div>
                  </div>
                  <span className="font-pixel text-xs px-2 py-0.5 border" style={{ borderColor: RARITY_COLORS[item.rarity], color: RARITY_COLORS[item.rarity], fontSize: '6px' }}>
                    {item.rarity.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
