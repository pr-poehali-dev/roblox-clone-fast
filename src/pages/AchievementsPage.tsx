const ACHIEVEMENTS = [
  { icon: "🏆", title: "Первая победа", desc: "Выиграй свой первый матч", rarity: "common", unlocked: true, date: "12 марта 2023" },
  { icon: "💎", title: "Коллекционер", desc: "Собери 50 уникальных предметов", rarity: "rare", unlocked: true, date: "5 апреля 2023" },
  { icon: "⚡", title: "Молния", desc: "Победи противника за 60 секунд", rarity: "epic", unlocked: true, date: "20 апреля 2023" },
  { icon: "🔥", title: "Легенда арены", desc: "Одержи 1000 побед подряд", rarity: "legendary", unlocked: false, progress: 248, total: 1000 },
  { icon: "👑", title: "Чемпион сезона", desc: "Займи 1-е место в рейтинге", rarity: "legendary", unlocked: false, progress: 127, total: 1 },
  { icon: "🚀", title: "Астронавт", desc: "Пройди Galactic Warriors на максимальной сложности", rarity: "epic", unlocked: false, progress: 3, total: 5 },
  { icon: "🎯", title: "Снайпер", desc: "100% точность в 10 матчах подряд", rarity: "epic", unlocked: false, progress: 4, total: 10 },
  { icon: "🤝", title: "Командный игрок", desc: "Сыграй 500 матчей в команде", rarity: "rare", unlocked: true, date: "1 мая 2023" },
  { icon: "💰", title: "Богач", desc: "Накопи 10,000 монет", rarity: "rare", unlocked: false, progress: 3580, total: 10000 },
  { icon: "🎮", title: "Хардкорщик", desc: "Сыграй 24 часа подряд", rarity: "epic", unlocked: true, date: "15 июня 2023" },
  { icon: "🌟", title: "Суперзвезда", desc: "Получи 500 лайков на своей игре", rarity: "legendary", unlocked: false, progress: 89, total: 500 },
  { icon: "🏗️", title: "Строитель", desc: "Создай свою первую игру", rarity: "common", unlocked: false, progress: 0, total: 1 },
];

const RARITY_COLORS: Record<string, string> = {
  legendary: "var(--neon-orange)",
  epic: "var(--neon-purple)",
  rare: "var(--neon-blue)",
  common: "#6b7280",
};

const RARITY_BG: Record<string, string> = {
  legendary: "rgba(255,140,0,0.08)",
  epic: "rgba(155,89,255,0.08)",
  rare: "rgba(0,200,255,0.08)",
  common: "rgba(107,114,128,0.08)",
};

export default function AchievementsPage() {
  const unlocked = ACHIEVEMENTS.filter(a => a.unlocked).length;

  return (
    <div className="grid-bg min-h-screen" style={{ paddingTop: '22px' }}>
      <div className="max-w-5xl mx-auto px-4 py-6">

        <div className="flex items-center justify-between mb-5 animate-fade-in">
          <h1 className="font-pixel text-xs" style={{ color: '#ffd700', fontSize: '14px' }}>🏅 ДОСТИЖЕНИЯ</h1>
          <div className="font-pixel text-xs" style={{ color: '#8892a4', fontSize: '9px' }}>
            {unlocked} / {ACHIEVEMENTS.length} разблокировано
          </div>
        </div>

        {/* Progress bar */}
        <div className="retro-card p-4 mb-5 animate-fade-in delay-100">
          <div className="flex justify-between mb-2">
            <span className="font-pixel text-xs" style={{ color: '#ffd700', fontSize: '8px' }}>ОБЩИЙ ПРОГРЕСС</span>
            <span className="font-pixel text-xs" style={{ color: '#ffd700', fontSize: '8px' }}>{Math.round(unlocked / ACHIEVEMENTS.length * 100)}%</span>
          </div>
          <div className="xp-bar" style={{ height: '12px' }}>
            <div className="xp-bar-fill" style={{ width: `${unlocked / ACHIEVEMENTS.length * 100}%`, background: 'linear-gradient(90deg, #ffd700, var(--neon-orange))' }} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map((ach, i) => (
            <div key={i}
              className="retro-card p-4 animate-fade-in"
              style={{
                animationDelay: `${i * 0.05}s`,
                background: ach.unlocked ? RARITY_BG[ach.rarity] : 'rgba(10,13,20,0.8)',
                border: `1px solid ${ach.unlocked ? RARITY_COLORS[ach.rarity] : 'var(--dark-border)'}`,
                opacity: ach.unlocked ? 1 : 0.7,
              }}>
              <div className="flex items-start gap-3">
                <div className="text-3xl" style={{ filter: ach.unlocked ? 'none' : 'grayscale(1) opacity(0.4)' }}>{ach.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-orbitron font-bold text-xs text-white">{ach.title}</h3>
                    {ach.unlocked && <span style={{ color: 'var(--neon-green)', fontSize: '12px' }}>✓</span>}
                  </div>
                  <p className="text-xs mb-2" style={{ color: '#8892a4', fontFamily: 'Rubik', fontSize: '11px' }}>{ach.desc}</p>
                  <span className="font-pixel text-xs px-1.5 py-0.5 border" style={{ borderColor: RARITY_COLORS[ach.rarity], color: RARITY_COLORS[ach.rarity], fontSize: '6px' }}>
                    {ach.rarity.toUpperCase()}
                  </span>
                  {ach.unlocked && ach.date && (
                    <div className="mt-2 text-xs" style={{ color: '#4b5563', fontFamily: 'Rubik', fontSize: '10px' }}>✓ {ach.date}</div>
                  )}
                  {!ach.unlocked && ach.progress !== undefined && (
                    <div className="mt-2">
                      <div className="flex justify-between mb-1">
                        <span style={{ color: '#6b7280', fontSize: '10px', fontFamily: 'Rubik' }}>{ach.progress} / {ach.total}</span>
                        <span style={{ color: '#6b7280', fontSize: '10px', fontFamily: 'Rubik' }}>{Math.round((ach.progress / ach.total) * 100)}%</span>
                      </div>
                      <div className="xp-bar" style={{ height: '4px' }}>
                        <div className="xp-bar-fill" style={{ width: `${Math.min((ach.progress / ach.total) * 100, 100)}%`, background: RARITY_COLORS[ach.rarity] }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
