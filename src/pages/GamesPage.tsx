import { useState, useRef, useEffect, lazy, Suspense } from "react";
import Icon from "@/components/ui/icon";

const SnakeGame = lazy(() => import("@/games/SnakeGame"));
const TetrisGame = lazy(() => import("@/games/TetrisGame"));
const ArkanoidGame = lazy(() => import("@/games/ArkanoidGame"));
const AsteroidsGame = lazy(() => import("@/games/AsteroidsGame"));

interface GameDef {
  id: string;
  title: string;
  genre: string;
  players: string;
  rating: number;
  tag: string;
  tagColor: string;
  emoji: string;
  bg: string;
  desc: string;
  playable: boolean;
  component?: React.ComponentType;
}

const GAMES_LIST: GameDef[] = [
  { id: "snake",     title: "ЗМЕЙКА",           genre: "Аркада",     players: "124K", rating: 4.9, tag: "ИГРАТЬ", tagColor: "var(--neon-green)",  emoji: "🐍", bg: "linear-gradient(135deg, #0a1628, #0a2010)", desc: "Классическая змейка с неоновым стилем",    playable: true,  component: SnakeGame },
  { id: "tetris",    title: "ТЕТРИС",            genre: "Головоломка",players: "89K",  rating: 4.7, tag: "ИГРАТЬ", tagColor: "var(--neon-purple)", emoji: "🟦", bg: "linear-gradient(135deg, #0a0520, #200a3d)", desc: "Складывай блоки, очищай линии",           playable: true,  component: TetrisGame },
  { id: "arkanoid",  title: "АРКАНОИД",          genre: "Аркада",     players: "67K",  rating: 4.6, tag: "ИГРАТЬ", tagColor: "var(--neon-orange)", emoji: "🧱", bg: "linear-gradient(135deg, #1a0a05, #2d1500)", desc: "Разбивай блоки мячом",                    playable: true,  component: ArkanoidGame },
  { id: "asteroids", title: "АСТЕРОИДЫ",         genre: "Шутер",      players: "52K",  rating: 4.8, tag: "ИГРАТЬ", tagColor: "var(--neon-blue)",   emoji: "🚀", bg: "linear-gradient(135deg, #030810, #0a1535)", desc: "Уничтожай астероиды в открытом космосе", playable: true,  component: AsteroidsGame },
  { id: "warriors",  title: "Galactic Warriors", genre: "Экшн",       players: "45K",  rating: 4.5, tag: "СКОРО",  tagColor: "#ffd700",            emoji: "⚔️", bg: "linear-gradient(135deg, #1a0535, #3d0020)", desc: "Битвы в открытом космосе — уже скоро!",  playable: false },
  { id: "racer",     title: "Neon Racer",        genre: "Гонки",      players: "38K",  rating: 4.4, tag: "СКОРО",  tagColor: "#6b7280",            emoji: "🏎️", bg: "linear-gradient(135deg, #051520, #002535)", desc: "Скоростные гонки в мире нео-панка",       playable: false },
  { id: "dungeon",   title: "Pixel Dungeon X",   genre: "RPG",        players: "31K",  rating: 4.3, tag: "СКОРО",  tagColor: "#6b7280",            emoji: "🏰", bg: "linear-gradient(135deg, #200510, #3d0020)", desc: "Подземелья, монстры и сокровища",         playable: false },
  { id: "tycoon",    title: "Cyber Tycoon",      genre: "Симулятор",  players: "27K",  rating: 4.2, tag: "СКОРО",  tagColor: "#6b7280",            emoji: "💼", bg: "linear-gradient(135deg, #1a1500, #2d2500)", desc: "Построй свою кибер-империю",             playable: false },
];

const CHAT_COLORS = ["var(--neon-green)", "var(--neon-purple)", "var(--neon-orange)", "var(--neon-pink)", "var(--neon-blue)", "#ffd700"];

interface ChatMessage { id: number; user: string; text: string; color: string; time: string; badge?: string; }

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 1, user: "КиберТигр",   text: "Всем привет! Кто играет в Змейку?",               color: "var(--neon-green)",  time: "14:21", badge: "👑" },
  { id: 2, user: "ПиксельКот",  text: "я только что прошёл тетрис до 20 уровня!",        color: "var(--neon-purple)", time: "14:21" },
  { id: 3, user: "НеонДракон",  text: "в арканоиде новый рекорд — 4800 очков 🔥",         color: "var(--neon-orange)", time: "14:22" },
  { id: 4, user: "RapidFox",    text: "астероиды топ! дошёл до 7 волны",                  color: "var(--neon-blue)",   time: "14:22" },
  { id: 5, user: "МегаТанк",    text: "змейка на 99 клеток — реально?",                   color: "#ffd700",            time: "14:23", badge: "⚡" },
  { id: 6, user: "КиберТигр",   text: "реально, главное не врезаться 😄",                 color: "var(--neon-green)",  time: "14:23", badge: "👑" },
  { id: 7, user: "PixelWitch",  text: "когда выйдет galactic warriors?",                  color: "#a8e6cf",            time: "14:24" },
  { id: 8, user: "SpeedRunner", text: "говорят на следующей неделе!",                     color: "#ff6b6b",            time: "14:25" },
];

const GENRES = ["Все", "Аркада", "Головоломка", "Шутер", "Экшн", "Гонки", "RPG", "Симулятор"];
const BOT_MSGS = [
  { user: "АвтоПилот", texts: ["gg всем!", "кто набрал больше 1000 в тетрисе?", "новый рекорд в астероидах!"], color: "var(--neon-blue)" },
  { user: "Spectator", texts: ["классные игры!", "подскажите совет для змейки", "арканоид огонь 🔥"], color: "#a8e6cf" },
];

export default function GamesPage() {
  const [activeGenre, setActiveGenre] = useState("Все");
  const [activeGame, setActiveGame] = useState<GameDef | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [myColor] = useState(CHAT_COLORS[Math.floor(Math.random() * CHAT_COLORS.length)]);
  const [onlineCount] = useState(Math.floor(Math.random() * 3000) + 1200);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const filtered = activeGenre === "Все" ? GAMES_LIST : GAMES_LIST.filter(g => g.genre === activeGenre);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    const iv = setInterval(() => {
      const bot = BOT_MSGS[Math.floor(Math.random() * BOT_MSGS.length)];
      const text = bot.texts[Math.floor(Math.random() * bot.texts.length)];
      const now = new Date();
      setMessages(prev => [...prev.slice(-60), { id: Date.now(), user: bot.user, text, color: bot.color, time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}` }]);
    }, 6000 + Math.random() * 6000);
    return () => clearInterval(iv);
  }, []);

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    const now = new Date();
    setMessages(prev => [...prev.slice(-60), { id: Date.now(), user: "ДракоМастер", text: inputValue.trim(), color: myColor, time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`, badge: "⚔️" }]);
    setInputValue("");
  };

  return (
    <div style={{ paddingTop: "22px", height: "calc(100vh - 36px)", display: "flex", flexDirection: "column" }}>
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: catalog */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto flex-shrink-0" style={{ borderBottom: "1px solid var(--dark-border)", background: "var(--dark-card)" }}>
            <Icon name="Filter" size={13} style={{ color: "#6b7280", flexShrink: 0 }} />
            <div className="flex gap-1.5">
              {GENRES.map(genre => (
                <button key={genre} onClick={() => setActiveGenre(genre)}
                  className="font-pixel whitespace-nowrap px-3 py-1 transition-all"
                  style={{ fontSize: "7px", background: activeGenre === genre ? "var(--neon-green)" : "transparent", color: activeGenre === genre ? "var(--dark-bg)" : "#8892a4", border: activeGenre === genre ? "none" : "1px solid var(--dark-border)" }}>
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 grid-bg">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map(game => (
                <div key={game.id}
                  className="retro-card group overflow-hidden flex flex-col"
                  style={{ background: game.bg, border: `1px solid ${game.playable ? game.tagColor + "40" : "var(--dark-border)"}`, cursor: game.playable ? "pointer" : "default" }}
                  onClick={() => game.playable && setActiveGame(game)}>
                  <div className="p-3 flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-3xl">{game.emoji}</span>
                      <span className="font-pixel px-1.5 py-0.5" style={{ background: game.playable ? game.tagColor : "#374151", color: game.playable ? "var(--dark-bg)" : "#6b7280", fontSize: "6px" }}>{game.tag}</span>
                    </div>
                    <h3 className="font-orbitron font-bold text-white text-xs mb-1 leading-tight">{game.title}</h3>
                    <p className="text-xs mb-2" style={{ color: "#6b7280", fontFamily: "Rubik", fontSize: "11px" }}>{game.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "#8892a4", fontFamily: "Rubik" }}>👥 {game.players}</span>
                      <span className="text-xs" style={{ color: "#ffd700", fontFamily: "Rubik" }}>★ {game.rating}</span>
                    </div>
                  </div>
                  {game.playable && (
                    <div className="px-3 pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-full font-pixel py-2" style={{ background: game.tagColor, color: "var(--dark-bg)", fontSize: "7px" }}>▶ ИГРАТЬ</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Chat */}
        <div className="w-64 xl:w-72 flex-shrink-0 flex flex-col" style={{ borderLeft: "1px solid var(--dark-border)", background: "rgba(10,13,20,0.98)" }}>
          <div className="flex items-center justify-between px-3 py-2.5 flex-shrink-0" style={{ borderBottom: "1px solid var(--dark-border)", background: "var(--dark-card)" }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--neon-green)" }} />
              <span className="font-pixel" style={{ color: "var(--neon-green)", fontSize: "8px" }}>ЧАТТЕР</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Users" size={11} style={{ color: "#6b7280" }} />
              <span style={{ color: "#8892a4", fontFamily: "Rubik", fontSize: "11px" }}>{onlineCount.toLocaleString("ru")}</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-1" style={{ minHeight: 0 }}>
            {messages.map(msg => (
              <div key={msg.id} className="chat-message">
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span style={{ color: "#374151", fontFamily: "Rubik", fontSize: "10px", flexShrink: 0 }}>{msg.time}</span>
                  {msg.badge && <span style={{ fontSize: "10px" }}>{msg.badge}</span>}
                  <span className="font-bold" style={{ color: msg.color, fontFamily: "Orbitron, sans-serif", fontSize: "10px", flexShrink: 0 }}>{msg.user}:</span>
                  <span style={{ color: "#c8d0dc", fontFamily: "Rubik", fontSize: "12px" }}>{msg.text}</span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-2 flex-shrink-0" style={{ borderTop: "1px solid var(--dark-border)" }}>
            <div className="flex gap-1.5">
              <input className="chat-input flex-1 px-2 py-1.5 text-xs" placeholder="Написать..."
                value={inputValue} onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } }} maxLength={200} />
              <button onClick={sendMessage} className="px-2 py-1.5 transition-all"
                style={{ background: inputValue.trim() ? "var(--neon-green)" : "var(--dark-border)", color: inputValue.trim() ? "var(--dark-bg)" : "#4b5563" }}>
                <Icon name="Send" size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== GAME MODAL ===== */}
      {activeGame && activeGame.component && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(3,5,8,0.97)", display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto", paddingTop: 16, paddingBottom: 24 }}>
          <div style={{ width: "100%", maxWidth: 700, padding: "0 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 28 }}>{activeGame.emoji}</span>
              <div>
                <div className="font-pixel" style={{ color: activeGame.tagColor, fontSize: "12px" }}>{activeGame.title}</div>
                <div style={{ color: "#6b7280", fontFamily: "Rubik", fontSize: "11px" }}>{activeGame.genre}</div>
              </div>
            </div>
            <button onClick={() => setActiveGame(null)}
              className="font-pixel flex items-center gap-1.5 px-3 py-2 transition-all"
              style={{ color: "#6b7280", fontSize: "8px", border: "1px solid var(--dark-border)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--neon-pink)"; (e.currentTarget as HTMLElement).style.color = "var(--neon-pink)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--dark-border)"; (e.currentTarget as HTMLElement).style.color = "#6b7280"; }}>
              <Icon name="X" size={12} /> ВЫЙТИ
            </button>
          </div>
          <div style={{ flexShrink: 0 }}>
            <Suspense fallback={<div className="font-pixel" style={{ color: "var(--neon-green)", fontSize: "12px", padding: 60 }}>ЗАГРУЗКА...</div>}>
              <activeGame.component />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}
