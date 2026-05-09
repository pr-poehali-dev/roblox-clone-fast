const MY_GAMES = [
  { title: "Платформер Икс", status: "published", plays: "1,240", likes: 89, emoji: "🎮" },
  { title: "Лабиринт тьмы", status: "draft", plays: "0", likes: 0, emoji: "🌑" },
];

const TOOLS = [
  { name: "Конструктор уровней", desc: "Создавай уровни визуально, перетаскивая объекты", emoji: "🏗️", color: "var(--neon-green)" },
  { name: "Редактор скриптов", desc: "Простые блочные скрипты без кода", emoji: "⚙️", color: "var(--neon-blue)" },
  { name: "Банк ресурсов", desc: "Тысячи спрайтов, звуков и анимаций", emoji: "🎨", color: "var(--neon-purple)" },
  { name: "Тест-сервер", desc: "Запусти и протестируй игру онлайн", emoji: "▶️", color: "var(--neon-orange)" },
];

export default function CreativePage() {
  return (
    <div className="grid-bg min-h-screen" style={{ paddingTop: '22px' }}>
      <div className="max-w-5xl mx-auto px-4 py-6">

        <div className="flex items-center justify-between mb-5 animate-fade-in">
          <h1 className="font-pixel text-xs" style={{ color: 'var(--neon-purple)', fontSize: '14px' }}>🎨 ТВОРЧЕСТВО</h1>
          <button className="btn-pixel btn-pixel-purple">+ НОВАЯ ИГРА</button>
        </div>

        {/* CTA */}
        <div className="retro-card p-6 mb-6 text-center animate-fade-in delay-100 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0a0520, #200a3d)' }}>
          <div className="absolute inset-0 opacity-5 font-pixel text-6xl flex items-center justify-center pointer-events-none select-none">
            🎮
          </div>
          <h2 className="font-orbitron font-black text-white text-2xl mb-2">Создай свою игру</h2>
          <p className="text-sm mb-4" style={{ color: '#8892a4', fontFamily: 'Rubik' }}>
            Без кода, без ограничений. Используй наш конструктор и выложи игру для миллионов игроков.
          </p>
          <button className="btn-pixel btn-pixel-purple">🚀 НАЧАТЬ СОЗДАНИЕ</button>
        </div>

        {/* Tools */}
        <div className="mb-6 animate-fade-in delay-200">
          <h2 className="font-pixel text-xs mb-3" style={{ color: 'var(--neon-green)', fontSize: '10px' }}>🛠️ ИНСТРУМЕНТЫ</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TOOLS.map((tool, i) => (
              <div key={i} className="retro-card p-4 text-center cursor-pointer"
                style={{ border: `1px solid ${tool.color}30` }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = tool.color)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = `${tool.color}30`)}>
                <div className="text-3xl mb-2">{tool.emoji}</div>
                <h3 className="font-orbitron font-bold text-white text-xs mb-1 leading-tight">{tool.name}</h3>
                <p style={{ color: '#6b7280', fontSize: '10px', fontFamily: 'Rubik' }}>{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* My games */}
        <div className="animate-fade-in delay-300">
          <h2 className="font-pixel text-xs mb-3" style={{ color: 'var(--neon-green)', fontSize: '10px' }}>📁 МОИ ИГРЫ</h2>
          <div className="space-y-3">
            {MY_GAMES.map((game, i) => (
              <div key={i} className="retro-card p-4 flex items-center gap-4">
                <div className="text-3xl">{game.emoji}</div>
                <div className="flex-1">
                  <div className="font-orbitron font-bold text-white text-sm mb-1">{game.title}</div>
                  <div className="flex gap-3 text-xs" style={{ color: '#8892a4', fontFamily: 'Rubik' }}>
                    <span>👥 {game.plays} игроков</span>
                    <span>❤️ {game.likes} лайков</span>
                  </div>
                </div>
                <span className="font-pixel text-xs px-2 py-1" style={{
                  background: game.status === 'published' ? 'rgba(0,255,179,0.1)' : 'rgba(107,114,128,0.1)',
                  color: game.status === 'published' ? 'var(--neon-green)' : '#6b7280',
                  border: `1px solid ${game.status === 'published' ? 'var(--neon-green)' : '#374151'}`,
                  fontSize: '7px',
                }}>
                  {game.status === 'published' ? 'ОПУБЛИКОВАНА' : 'ЧЕРНОВИК'}
                </span>
                <button className="btn-pixel" style={{ fontSize: '7px', padding: '8px 12px' }}>ОТКРЫТЬ</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
