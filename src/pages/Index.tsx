type Page = "home" | "games" | "creative" | "profile" | "community" | "shop" | "achievements" | "settings";

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const FEATURED_GAMES = [
  { id: 1, title: "Galactic Warriors", genre: "Экшн", players: "124K", rating: 4.9, tag: "НОВИНКА", tagColor: "var(--neon-green)", emoji: "🚀", bg: "linear-gradient(135deg, #0a1628 0%, #1a0535 100%)" },
  { id: 2, title: "Pixel Dungeon X", genre: "RPG", players: "89K", rating: 4.7, tag: "ХИТ", tagColor: "var(--neon-orange)", emoji: "⚔️", bg: "linear-gradient(135deg, #1a0a05 0%, #2d1500 100%)" },
  { id: 3, title: "Neon Racer", genre: "Гонки", players: "67K", rating: 4.6, tag: "ТОПОВАЯ", tagColor: "var(--neon-purple)", emoji: "🏎️", bg: "linear-gradient(135deg, #0a0520 0%, #200a3d 100%)" },
  { id: 4, title: "Tower Defense Z", genre: "Стратегия", players: "45K", rating: 4.5, tag: "ПОПУЛЯРНАЯ", tagColor: "var(--neon-blue)", emoji: "🏰", bg: "linear-gradient(135deg, #051520 0%, #002535 100%)" },
  { id: 5, title: "Cyber Tycoon", genre: "Симулятор", players: "38K", rating: 4.4, tag: "РЕКОМЕНДУЕМ", tagColor: "#ffd700", emoji: "💼", bg: "linear-gradient(135deg, #1a1500 0%, #2d2500 100%)" },
  { id: 6, title: "Arena Fighters", genre: "Файтинг", players: "52K", rating: 4.8, tag: "PVP", tagColor: "var(--neon-pink)", emoji: "🥊", bg: "linear-gradient(135deg, #200510 0%, #3d0020 100%)" },
];

const LEADERBOARD = [
  { rank: 1, name: "КиберТигр", level: 99, xp: "4.2M", avatar: "К", color: "#ffd700", badge: "👑" },
  { rank: 2, name: "ПиксельКот", level: 87, xp: "3.8M", avatar: "П", color: "var(--neon-purple)", badge: "🥈" },
  { rank: 3, name: "НеонДракон", level: 82, xp: "3.5M", avatar: "Н", color: "var(--neon-orange)", badge: "🥉" },
  { rank: 4, name: "ГалактикViper", level: 78, xp: "3.1M", avatar: "Г", color: "var(--neon-blue)", badge: "" },
  { rank: 5, name: "РетроПанк", level: 75, xp: "2.9M", avatar: "Р", color: "var(--neon-pink)", badge: "" },
  { rank: 6, name: "BitMaster88", level: 71, xp: "2.7M", avatar: "Б", color: "var(--neon-green)", badge: "" },
  { rank: 7, name: "QuantumWolf", level: 69, xp: "2.5M", avatar: "Q", color: "#6b7280", badge: "" },
];

const ACHIEVEMENTS_RECENT = [
  { icon: "🏆", title: "Первая победа", desc: "Выиграй 1 матч", rarity: "common" },
  { icon: "💎", title: "Коллекционер", desc: "Собери 50 предметов", rarity: "rare" },
  { icon: "⚡", title: "Молния", desc: "Победи за 60 секунд", rarity: "epic" },
  { icon: "🔥", title: "Легенда арены", desc: "1000 побед подряд", rarity: "legendary" },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="grid-bg min-h-screen" style={{ paddingTop: '22px' }}>

      {/* Hero */}
      <section className="relative px-4 py-10 text-center overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,255,179,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="relative max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border" style={{ borderColor: 'var(--neon-green)', background: 'rgba(0,255,179,0.07)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--neon-green)' }} />
            <span className="font-pixel text-xs" style={{ color: 'var(--neon-green)', fontSize: '8px' }}>ONLINE: 12,847 ИГРОКОВ</span>
          </div>

          <h1 className="font-pixel mb-3 leading-tight" style={{ color: 'var(--neon-green)', fontSize: 'clamp(18px, 4vw, 32px)', lineHeight: 1.4 }}>
            ДОБРО ПОЖАЛОВАТЬ<br />
            <span style={{ color: 'white' }}>В </span>
            PIXELVERSE
          </h1>
          <p className="font-rubik text-base mb-6 max-w-lg mx-auto" style={{ color: '#8892a4' }}>
            Играй, создавай, побеждай. Твоя игровая вселенная — здесь.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button className="btn-pixel" onClick={() => onNavigate("games")}>
              ▶ ИГРАТЬ СЕЙЧАС
            </button>
            <button className="btn-pixel btn-pixel-purple" onClick={() => onNavigate("creative")}>
              🎨 СОЗДАТЬ ИГРУ
            </button>
          </div>
        </div>

        {/* Floating pixel decorations */}
        <div className="absolute top-8 left-8 font-pixel text-2xl animate-float opacity-30" style={{ animationDelay: '0s' }}>★</div>
        <div className="absolute top-16 right-12 font-pixel text-xl animate-float opacity-20" style={{ animationDelay: '1s', color: 'var(--neon-purple)' }}>◆</div>
        <div className="absolute bottom-4 left-16 font-pixel text-xl animate-float opacity-20" style={{ animationDelay: '2s', color: 'var(--neon-orange)' }}>▲</div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left: Games + Achievements */}
          <div className="xl:col-span-2 space-y-6">

            {/* My character card */}
            <div className="retro-card p-5 animate-fade-in delay-100" style={{ background: 'linear-gradient(135deg, rgba(0,255,179,0.05) 0%, var(--dark-card) 100%)' }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black relative flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-pink))', color: 'white' }}>
                  Д
                  <div className="absolute -bottom-1 -right-1 font-pixel text-xs px-1.5 py-0.5" style={{ background: 'var(--neon-orange)', color: 'var(--dark-bg)', fontSize: '7px' }}>42</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-orbitron font-bold text-white">ДракоМастер</span>
                    <span className="font-pixel text-xs px-1.5 py-0.5 border badge-epic" style={{ fontSize: '7px' }}>EPIC</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm mb-2" style={{ color: '#8892a4' }}>
                    <span>🏆 248 побед</span>
                    <span>⚔️ 1,240 матчей</span>
                    <span>💎 3,580 монет</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-xs" style={{ color: 'var(--neon-orange)', fontSize: '8px' }}>XP:</span>
                    <div className="flex-1 xp-bar">
                      <div className="xp-bar-fill" style={{ width: '68%' }} />
                    </div>
                    <span className="text-xs" style={{ color: '#8892a4', fontSize: '10px' }}>68,420 / 100,000</span>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="font-pixel text-xs mb-1" style={{ color: '#8892a4', fontSize: '8px' }}>РЕЙТИНГ</div>
                  <div className="font-orbitron font-black text-2xl" style={{ color: 'var(--neon-green)' }}>#127</div>
                </div>
              </div>
            </div>

            {/* Featured games */}
            <div className="animate-fade-in delay-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-pixel text-xs" style={{ color: 'var(--neon-green)', fontSize: '10px' }}>🎮 ПОПУЛЯРНЫЕ ИГРЫ</h2>
                <button onClick={() => onNavigate("games")} className="text-xs" style={{ color: '#8892a4', fontFamily: 'Rubik, sans-serif' }}>Все игры →</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {FEATURED_GAMES.map((game) => (
                  <div key={game.id} className="retro-card cursor-pointer group overflow-hidden" style={{ background: game.bg }}>
                    <div className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-3xl">{game.emoji}</span>
                        <span className="font-pixel text-xs px-1.5 py-0.5" style={{ background: game.tagColor, color: 'var(--dark-bg)', fontSize: '6px' }}>{game.tag}</span>
                      </div>
                      <h3 className="font-orbitron font-bold text-white text-xs mb-1 leading-tight">{game.title}</h3>
                      <div className="text-xs" style={{ color: '#6b7280', fontFamily: 'Rubik, sans-serif' }}>{game.genre}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs" style={{ color: '#8892a4', fontFamily: 'Rubik, sans-serif' }}>👥 {game.players}</span>
                        <span className="text-xs" style={{ color: '#ffd700', fontFamily: 'Rubik, sans-serif' }}>★ {game.rating}</span>
                      </div>
                    </div>
                    <div className="px-3 pb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-full font-pixel text-xs py-1.5" style={{ background: 'var(--neon-green)', color: 'var(--dark-bg)', fontSize: '7px' }}>
                        ИГРАТЬ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent achievements */}
            <div className="animate-fade-in delay-300">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-pixel text-xs" style={{ color: 'var(--neon-green)', fontSize: '10px' }}>🏅 ДОСТИЖЕНИЯ</h2>
                <button onClick={() => onNavigate("achievements")} className="text-xs" style={{ color: '#8892a4', fontFamily: 'Rubik, sans-serif' }}>Все →</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ACHIEVEMENTS_RECENT.map((ach, i) => (
                  <div key={i} className={`retro-card p-3 text-center border ${ach.rarity === 'legendary' ? 'badge-legendary' : ach.rarity === 'epic' ? 'badge-epic' : ach.rarity === 'rare' ? 'badge-rare' : 'badge-common'}`}>
                    <div className="text-2xl mb-1">{ach.icon}</div>
                    <div className="font-orbitron font-bold text-xs text-white mb-0.5 leading-tight">{ach.title}</div>
                    <div className="text-xs" style={{ color: '#6b7280', fontFamily: 'Rubik, sans-serif', fontSize: '10px' }}>{ach.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Leaderboard */}
          <div className="animate-fade-in delay-400">
            <div className="retro-card p-4 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-pixel text-xs" style={{ color: '#ffd700', fontSize: '10px' }}>🏆 ЛИДЕРБОРД</span>
                <span className="ml-auto font-pixel text-xs px-2 py-0.5" style={{ background: 'rgba(255,215,0,0.1)', color: '#ffd700', border: '1px solid #ffd700', fontSize: '7px' }}>СЕЗОН 7</span>
              </div>

              <div className="space-y-2">
                {LEADERBOARD.map((player) => (
                  <div key={player.rank} className="flex items-center gap-3 p-2 transition-all cursor-pointer" style={{ borderBottom: '1px solid var(--dark-border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="w-6 text-center font-pixel text-xs" style={{ color: player.rank <= 3 ? '#ffd700' : '#6b7280', fontSize: '9px' }}>
                      {player.badge || `#${player.rank}`}
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{ background: `${player.color}20`, border: `1px solid ${player.color}`, color: player.color }}>
                      {player.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-orbitron font-bold text-white text-xs truncate">{player.name}</div>
                      <div className="text-xs" style={{ color: '#6b7280', fontSize: '10px', fontFamily: 'Rubik' }}>Lv.{player.level} · {player.xp} XP</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-2 border" style={{ borderColor: 'rgba(0,255,179,0.2)', background: 'rgba(0,255,179,0.05)' }}>
                <div className="text-xs text-center" style={{ color: '#8892a4', fontFamily: 'Rubik' }}>Ты на месте <span style={{ color: 'var(--neon-green)' }}>#127</span></div>
              </div>

              <button onClick={() => onNavigate("achievements")} className="w-full mt-3 font-pixel text-xs py-2 text-center transition-all"
                style={{ border: '1px solid var(--dark-border)', color: '#8892a4', fontSize: '8px' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--neon-green)'; (e.currentTarget as HTMLElement).style.color = 'var(--neon-green)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dark-border)'; (e.currentTarget as HTMLElement).style.color = '#8892a4'; }}
              >
                ПОЛНЫЙ РЕЙТИНГ →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
