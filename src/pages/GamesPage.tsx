import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const GAMES_LIST = [
  { id: 1, title: "Galactic Warriors", genre: "Экшн", players: "124K", rating: 4.9, tag: "НОВИНКА", tagColor: "var(--neon-green)", emoji: "🚀", bg: "linear-gradient(135deg, #0a1628, #1a0535)", desc: "Битвы в открытом космосе" },
  { id: 2, title: "Pixel Dungeon X", genre: "RPG", players: "89K", rating: 4.7, tag: "ХИТ", tagColor: "var(--neon-orange)", emoji: "⚔️", bg: "linear-gradient(135deg, #1a0a05, #2d1500)", desc: "Подземелья и сокровища" },
  { id: 3, title: "Neon Racer", genre: "Гонки", players: "67K", rating: 4.6, tag: "ТОПОВАЯ", tagColor: "var(--neon-purple)", emoji: "🏎️", bg: "linear-gradient(135deg, #0a0520, #200a3d)", desc: "Скорость без предела" },
  { id: 4, title: "Tower Defense Z", genre: "Стратегия", players: "45K", rating: 4.5, tag: "СТРАТЕГИЯ", tagColor: "var(--neon-blue)", emoji: "🏰", bg: "linear-gradient(135deg, #051520, #002535)", desc: "Защити свою башню" },
  { id: 5, title: "Cyber Tycoon", genre: "Симулятор", players: "38K", rating: 4.4, tag: "СИМУЛЯТОР", tagColor: "#ffd700", emoji: "💼", bg: "linear-gradient(135deg, #1a1500, #2d2500)", desc: "Построй кибер-империю" },
  { id: 6, title: "Arena Fighters", genre: "Файтинг", players: "52K", rating: 4.8, tag: "PVP", tagColor: "var(--neon-pink)", emoji: "🥊", bg: "linear-gradient(135deg, #200510, #3d0020)", desc: "1v1 бои на арене" },
  { id: 7, title: "Space Miners", genre: "Выживание", players: "31K", rating: 4.3, tag: "CO-OP", tagColor: "var(--neon-green)", emoji: "⛏️", bg: "linear-gradient(135deg, #050a20, #0a1535)", desc: "Добыча ресурсов в космосе" },
  { id: 8, title: "Shadow Stealth", genre: "Стелс", players: "27K", rating: 4.2, tag: "СТЕЛС", tagColor: "#6b7280", emoji: "🥷", bg: "linear-gradient(135deg, #050505, #151515)", desc: "Невидимый охотник" },
];

const CHAT_COLORS = [
  "var(--neon-green)", "var(--neon-purple)", "var(--neon-orange)",
  "var(--neon-pink)", "var(--neon-blue)", "#ffd700", "#ff6b6b", "#a8e6cf",
];

interface ChatMessage {
  id: number;
  user: string;
  text: string;
  color: string;
  time: string;
  badge?: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 1, user: "КиберТигр", text: "Всем привет! Кто идёт в рейд?", color: "var(--neon-green)", time: "14:21", badge: "👑" },
  { id: 2, user: "ПиксельКот", text: "я готов! ждите меня в лобби galactic warriors", color: "var(--neon-purple)", time: "14:21" },
  { id: 3, user: "НеонДракон", text: "поиграем в pixel dungeon? там новый босс появился 🔥", color: "var(--neon-orange)", time: "14:22" },
  { id: 4, user: "RapidFox", text: "galactic warriors forever!! кто со мной?", color: "var(--neon-blue)", time: "14:22" },
  { id: 5, user: "CoolByte", text: "зашёл новый скин в магазин, советую взять пока не поздно", color: "var(--neon-pink)", time: "14:23" },
  { id: 6, user: "МегаТанк", text: "только что прошёл shadow stealth без урона 😎", color: "#ffd700", time: "14:23", badge: "⚡" },
  { id: 7, user: "PixelWitch", text: "кто знает как разблокировать секретный уровень в Tower Defense?", color: "#a8e6cf", time: "14:24" },
  { id: 8, user: "КиберТигр", text: "нужно собрать все 5 кристаллов за один прогон", color: "var(--neon-green)", time: "14:24", badge: "👑" },
  { id: 9, user: "SpeedRunner", text: "прошёл neon racer за 1:42, кто быстрее?", color: "#ff6b6b", time: "14:25" },
  { id: 10, user: "BitMaster", text: "лол я за 1:38 🏎️", color: "var(--neon-purple)", time: "14:25" },
];

const GENRES = ["Все", "Экшн", "RPG", "Гонки", "Стратегия", "Симулятор", "Файтинг", "Выживание", "Стелс"];

export default function GamesPage() {
  const [activeGenre, setActiveGenre] = useState("Все");
  const [selectedGame, setSelectedGame] = useState(GAMES_LIST[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [myColor] = useState(CHAT_COLORS[Math.floor(Math.random() * CHAT_COLORS.length)]);
  const [onlineCount] = useState(Math.floor(Math.random() * 3000) + 1200);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const filteredGames = activeGenre === "Все"
    ? GAMES_LIST
    : GAMES_LIST.filter(g => g.genre === activeGenre);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const bots = [
      { user: "АвтоПилот", texts: ["gg всем!", "кто играет сейчас?", "новая игра от разработчиков выйдет на следующей неделе", "топ событие этой недели стартует в 20:00"], color: "var(--neon-blue)" },
      { user: "Spectator", texts: ["посмотрите мой стрим!", "кто хочет в тим?", "лут сегодня огонь 🔥"], color: "#a8e6cf" },
    ];
    const interval = setInterval(() => {
      const bot = bots[Math.floor(Math.random() * bots.length)];
      const text = bot.texts[Math.floor(Math.random() * bot.texts.length)];
      const now = new Date();
      const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      setMessages(prev => [...prev.slice(-50), {
        id: Date.now(),
        user: bot.user,
        text,
        color: bot.color,
        time,
      }]);
    }, 5000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMessages(prev => [...prev.slice(-50), {
      id: Date.now(),
      user: "ДракоМастер",
      text: inputValue.trim(),
      color: myColor,
      time,
      badge: "⚔️",
    }]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ paddingTop: '22px', height: 'calc(100vh - 36px)', display: 'flex', flexDirection: 'column' }}>

      {/* Games + Chat layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: Game catalog */}
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* Genre filter */}
          <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto" style={{ borderBottom: '1px solid var(--dark-border)', background: 'var(--dark-card)', flexShrink: 0 }}>
            <Icon name="Filter" size={14} style={{ color: '#6b7280', flexShrink: 0 }} />
            <div className="flex gap-2">
              {GENRES.map(genre => (
                <button
                  key={genre}
                  onClick={() => setActiveGenre(genre)}
                  className="font-pixel whitespace-nowrap px-3 py-1.5 transition-all"
                  style={{
                    fontSize: '8px',
                    background: activeGenre === genre ? 'var(--neon-green)' : 'transparent',
                    color: activeGenre === genre ? 'var(--dark-bg)' : '#8892a4',
                    border: activeGenre === genre ? 'none' : '1px solid var(--dark-border)',
                  }}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Games grid */}
          <div className="flex-1 overflow-y-auto p-4 grid-bg">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredGames.map(game => (
                <div
                  key={game.id}
                  className="retro-card cursor-pointer group overflow-hidden"
                  style={{
                    background: game.bg,
                    border: selectedGame.id === game.id ? `2px solid ${game.tagColor}` : '1px solid var(--dark-border)',
                    boxShadow: selectedGame.id === game.id ? `0 0 20px ${game.tagColor}30` : 'none',
                  }}
                  onClick={() => setSelectedGame(game)}
                >
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-3xl">{game.emoji}</span>
                      <span className="font-pixel px-1.5 py-0.5" style={{ background: game.tagColor, color: 'var(--dark-bg)', fontSize: '6px' }}>{game.tag}</span>
                    </div>
                    <h3 className="font-orbitron font-bold text-white text-xs mb-1 leading-tight">{game.title}</h3>
                    <p className="text-xs mb-2" style={{ color: '#6b7280', fontFamily: 'Rubik' }}>{game.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: '#8892a4', fontFamily: 'Rubik' }}>👥 {game.players}</span>
                      <span className="text-xs" style={{ color: '#ffd700', fontFamily: 'Rubik' }}>★ {game.rating}</span>
                    </div>
                  </div>
                  <div className="px-3 pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="w-full font-pixel py-2 transition-all"
                      style={{ background: game.tagColor, color: 'var(--dark-bg)', fontSize: '7px' }}
                    >
                      ▶ ИГРАТЬ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Chat panel */}
        <div className="w-72 xl:w-80 flex-shrink-0 flex flex-col" style={{ borderLeft: '1px solid var(--dark-border)', background: 'rgba(10,13,20,0.98)' }}>

          {/* Chat header */}
          <div className="flex items-center justify-between px-3 py-3" style={{ borderBottom: '1px solid var(--dark-border)', background: 'var(--dark-card)', flexShrink: 0 }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--neon-green)' }} />
              <span className="font-pixel" style={{ color: 'var(--neon-green)', fontSize: '8px' }}>ЧАТТЕР</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="Users" size={12} style={{ color: '#6b7280' }} />
              <span className="text-xs" style={{ color: '#8892a4', fontFamily: 'Rubik', fontSize: '11px' }}>{onlineCount.toLocaleString('ru')}</span>
            </div>
          </div>

          {/* Selected game info */}
          <div className="px-3 py-2 flex items-center gap-2" style={{ background: `${selectedGame.tagColor}10`, borderBottom: '1px solid var(--dark-border)', flexShrink: 0 }}>
            <span className="text-lg">{selectedGame.emoji}</span>
            <div>
              <div className="font-orbitron font-bold text-white" style={{ fontSize: '10px' }}>{selectedGame.title}</div>
              <div style={{ color: selectedGame.tagColor, fontSize: '9px', fontFamily: 'Rubik' }}>#{selectedGame.genre.toLowerCase()} · {selectedGame.players} онлайн</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-2" style={{ minHeight: 0 }}>
            {messages.map(msg => (
              <div key={msg.id} className="chat-message group">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-xs" style={{ color: '#4b5563', fontFamily: 'Rubik', fontSize: '10px', flexShrink: 0 }}>{msg.time}</span>
                  {msg.badge && <span style={{ fontSize: '10px' }}>{msg.badge}</span>}
                  <span className="font-bold text-xs" style={{ color: msg.color, fontFamily: 'Orbitron, sans-serif', fontSize: '10px', flexShrink: 0 }}>{msg.user}:</span>
                  <span className="text-xs" style={{ color: '#c8d0dc', fontFamily: 'Rubik', fontSize: '12px' }}>{msg.text}</span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-2" style={{ borderTop: '1px solid var(--dark-border)', flexShrink: 0 }}>
            <div className="flex gap-2">
              <input
                className="chat-input flex-1 px-3 py-2 text-xs"
                placeholder="Написать в чат..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={200}
              />
              <button
                onClick={sendMessage}
                className="px-3 py-2 transition-all"
                style={{ background: inputValue.trim() ? 'var(--neon-green)' : 'var(--dark-border)', color: inputValue.trim() ? 'var(--dark-bg)' : '#4b5563' }}
              >
                <Icon name="Send" size={14} />
              </button>
            </div>
            <div className="flex items-center gap-1 mt-1.5 px-1">
              <span style={{ fontSize: '9px', color: '#4b5563', fontFamily: 'Rubik' }}>Ты: </span>
              <span className="font-bold" style={{ fontSize: '9px', color: myColor, fontFamily: 'Orbitron' }}>ДракоМастер ⚔️</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
