import { useState } from "react";

const POSTS = [
  { id: 1, user: "КиберТигр", badge: "👑", userColor: "var(--neon-green)", time: "5 мин назад", title: "Гайд: как пройти Pixel Dungeon на max сложности", body: "Друзья, поделюсь секретом прохождения финального босса. Нужно сначала собрать все 5 кристаллов на 3 уровне, потом...", likes: 248, comments: 34, tag: "ГАЙД", tagColor: "var(--neon-green)" },
  { id: 2, user: "PixelWitch", badge: "🧙", userColor: "var(--neon-purple)", time: "23 мин назад", title: "Создала свою первую игру! Буду рада отзывам", body: "Привет всем! Наконец-то завершила свой первый проект — платформер в стиле 80-х. Буду очень рада вашим отзывам и советам!", likes: 182, comments: 21, tag: "ТВОРЧЕСТВО", tagColor: "var(--neon-purple)" },
  { id: 3, user: "SpeedRunner", badge: "⚡", userColor: "var(--neon-orange)", time: "1 час назад", title: "Новый рекорд в Neon Racer — 1:38!", body: "Только что поставил новый рекорд трассы Alpha-9. Если кто хочет попробовать побить — удачи 😄", likes: 97, comments: 15, tag: "РЕКОРД", tagColor: "var(--neon-orange)" },
  { id: 4, user: "МегаТанк", badge: "🛡️", userColor: "var(--neon-blue)", time: "2 часа назад", title: "Клан PIXEL WARRIORS набирает участников", body: "Ищем активных игроков 35+ уровня. Турниры каждую неделю, дружная атмосфера, Discord-сервер.", likes: 64, comments: 28, tag: "КЛАН", tagColor: "var(--neon-blue)" },
];

const ONLINE_MEMBERS = [
  { name: "КиберТигр", color: "var(--neon-green)", status: "🎮 В игре" },
  { name: "PixelWitch", color: "var(--neon-purple)", status: "✏️ Создаёт" },
  { name: "SpeedRunner", color: "var(--neon-orange)", status: "🏎️ Гоняет" },
  { name: "RapidFox", color: "var(--neon-blue)", status: "💬 В чате" },
  { name: "BitMaster", color: "#ffd700", status: "🏆 Турнир" },
  { name: "CoolByte", color: "var(--neon-pink)", status: "🛒 В магазине" },
];

export default function CommunityPage() {
  const [liked, setLiked] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLiked(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  return (
    <div className="grid-bg min-h-screen" style={{ paddingTop: '22px' }}>
      <div className="max-w-5xl mx-auto px-4 py-6">

        <div className="flex items-center justify-between mb-5 animate-fade-in">
          <h1 className="font-pixel text-xs" style={{ color: 'var(--neon-pink)', fontSize: '14px' }}>👥 СООБЩЕСТВО</h1>
          <button className="btn-pixel" style={{ background: 'var(--neon-pink)', fontSize: '8px' }}>+ СОЗДАТЬ ПОСТ</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Posts */}
          <div className="lg:col-span-2 space-y-3">
            {POSTS.map((post, i) => (
              <div key={post.id} className="retro-card p-4 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
                    style={{ background: `${post.userColor}20`, border: `1px solid ${post.userColor}`, color: post.userColor }}>
                    {post.badge}
                  </div>
                  <div>
                    <div className="font-orbitron font-bold text-white text-xs">{post.user}</div>
                    <div style={{ color: '#6b7280', fontSize: '10px', fontFamily: 'Rubik' }}>{post.time}</div>
                  </div>
                  <span className="ml-auto font-pixel text-xs px-2 py-0.5" style={{ background: `${post.tagColor}15`, color: post.tagColor, border: `1px solid ${post.tagColor}50`, fontSize: '7px' }}>
                    {post.tag}
                  </span>
                </div>
                <h3 className="font-orbitron font-bold text-white text-sm mb-2">{post.title}</h3>
                <p className="text-sm mb-3" style={{ color: '#8892a4', fontFamily: 'Rubik', lineHeight: 1.6 }}>{post.body}</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-1.5 text-sm transition-all"
                    style={{ color: liked.includes(post.id) ? 'var(--neon-pink)' : '#6b7280', fontFamily: 'Rubik' }}>
                    {liked.includes(post.id) ? '❤️' : '🤍'} {post.likes + (liked.includes(post.id) ? 1 : 0)}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm" style={{ color: '#6b7280', fontFamily: 'Rubik' }}>
                    💬 {post.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm" style={{ color: '#6b7280', fontFamily: 'Rubik' }}>
                    📤 Поделиться
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Online members */}
          <div className="animate-fade-in delay-300">
            <div className="retro-card p-4 sticky top-24">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--neon-green)' }} />
                <span className="font-pixel text-xs" style={{ color: 'var(--neon-green)', fontSize: '9px' }}>ОНЛАЙН: {ONLINE_MEMBERS.length}</span>
              </div>
              <div className="space-y-2">
                {ONLINE_MEMBERS.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 p-2" style={{ borderBottom: '1px solid var(--dark-border)' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                      style={{ background: `${m.color}20`, border: `1px solid ${m.color}`, color: m.color }}>
                      {m.name[0]}
                    </div>
                    <div>
                      <div className="font-orbitron font-bold text-white" style={{ fontSize: '10px' }}>{m.name}</div>
                      <div style={{ color: '#6b7280', fontSize: '9px', fontFamily: 'Rubik' }}>{m.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
