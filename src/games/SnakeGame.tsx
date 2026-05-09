import { useEffect, useRef, useState, useCallback } from "react";

const GRID = 20;
const CELL = 20;
const W = GRID * CELL;
const H = GRID * CELL;
const SPEED = 120;

type Dir = { x: number; y: number };
type Pt = { x: number; y: number };

const rand = () => ({ x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) });

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }] as Pt[],
    dir: { x: 1, y: 0 } as Dir,
    nextDir: { x: 1, y: 0 } as Dir,
    food: rand() as Pt,
    score: 0,
    running: false,
    dead: false,
  });
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);
  const [started, setStarted] = useState(false);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;

    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    // grid dots
    ctx.fillStyle = "rgba(0,255,179,0.05)";
    for (let x = 0; x < GRID; x++)
      for (let y = 0; y < GRID; y++)
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);

    // food
    const fx = s.food.x * CELL;
    const fy = s.food.y * CELL;
    ctx.shadowColor = "#ff2d78";
    ctx.shadowBlur = 15;
    ctx.fillStyle = "#ff2d78";
    ctx.fillRect(fx + 4, fy + 4, CELL - 8, CELL - 8);
    ctx.shadowBlur = 0;

    // snake
    s.snake.forEach((seg, i) => {
      const alpha = 1 - (i / s.snake.length) * 0.5;
      ctx.shadowColor = `rgba(0,255,179,${alpha})`;
      ctx.shadowBlur = i === 0 ? 20 : 8;
      ctx.fillStyle = i === 0 ? "#00ffb3" : `rgba(0,200,140,${alpha})`;
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
    ctx.shadowBlur = 0;

    // eyes on head
    const head = s.snake[0];
    ctx.fillStyle = "#0a0d14";
    const ex = head.x * CELL, ey = head.y * CELL;
    if (s.dir.x === 1) { ctx.fillRect(ex + 14, ey + 4, 3, 3); ctx.fillRect(ex + 14, ey + 13, 3, 3); }
    else if (s.dir.x === -1) { ctx.fillRect(ex + 3, ey + 4, 3, 3); ctx.fillRect(ex + 3, ey + 13, 3, 3); }
    else if (s.dir.y === -1) { ctx.fillRect(ex + 4, ey + 3, 3, 3); ctx.fillRect(ex + 13, ey + 3, 3, 3); }
    else { ctx.fillRect(ex + 4, ey + 14, 3, 3); ctx.fillRect(ex + 13, ey + 14, 3, 3); }
  }, []);

  const tick = useCallback((now: number) => {
    const s = stateRef.current;
    if (!s.running) return;
    if (now - lastRef.current < SPEED) { rafRef.current = requestAnimationFrame(tick); return; }
    lastRef.current = now;

    s.dir = { ...s.nextDir };
    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

    if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID ||
      s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      s.running = false;
      s.dead = true;
      setDead(true);
      draw();
      return;
    }

    s.snake.unshift(head);
    if (head.x === s.food.x && head.y === s.food.y) {
      s.score++;
      setScore(s.score);
      let newFood: Pt;
      do { newFood = rand(); } while (s.snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
      s.food = newFood;
    } else {
      s.snake.pop();
    }

    draw();
    rafRef.current = requestAnimationFrame(tick);
  }, [draw]);

  const start = useCallback(() => {
    const s = stateRef.current;
    s.snake = [{ x: 10, y: 10 }];
    s.dir = { x: 1, y: 0 };
    s.nextDir = { x: 1, y: 0 };
    s.food = rand();
    s.score = 0;
    s.running = true;
    s.dead = false;
    setScore(0);
    setDead(false);
    setStarted(true);
    lastRef.current = 0;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (!s.running) return;
      const dirs: Record<string, Dir> = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 },
      };
      const nd = dirs[e.key];
      if (nd && !(nd.x === -s.dir.x && nd.y === -s.dir.y)) {
        e.preventDefault();
        s.nextDir = nd;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Mobile swipe
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    const s = stateRef.current;
    if (!s.running) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20 && s.dir.x !== -1) s.nextDir = { x: 1, y: 0 };
      if (dx < -20 && s.dir.x !== 1) s.nextDir = { x: -1, y: 0 };
    } else {
      if (dy > 20 && s.dir.y !== -1) s.nextDir = { x: 0, y: 1 };
      if (dy < -20 && s.dir.y !== 1) s.nextDir = { x: 0, y: -1 };
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6">
        <div className="font-pixel text-xs" style={{ color: "var(--neon-green)", fontSize: "10px" }}>СЧЁТ: <span style={{ color: "white" }}>{score}</span></div>
        <div className="font-pixel text-xs" style={{ color: "#ffd700", fontSize: "10px" }}>ЕДА: <span style={{ color: "white" }}>{score}</span> 🍎</div>
      </div>
      <div style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          width={W} height={H}
          style={{ border: "2px solid var(--neon-green)", boxShadow: "0 0 30px rgba(0,255,179,0.3)", display: "block" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        />
        {(!started || dead) && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,13,20,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            {dead && <div className="font-pixel" style={{ color: "var(--neon-pink)", fontSize: "14px", textAlign: "center" }}>ИГРА ОКОНЧЕНА<br /><span style={{ color: "white" }}>Счёт: {score}</span></div>}
            {!started && !dead && <div className="font-pixel" style={{ color: "var(--neon-green)", fontSize: "12px" }}>ЗМЕЙКА 🐍</div>}
            <button className="btn-pixel" onClick={start}>{dead ? "▶ СНОВА" : "▶ ИГРАТЬ"}</button>
            <div className="font-pixel" style={{ color: "#6b7280", fontSize: "8px", textAlign: "center" }}>WASD / СТРЕЛКИ / СВАЙП</div>
          </div>
        )}
      </div>
      {started && !dead && (
        <div className="grid grid-cols-3 gap-2" style={{ width: 120 }}>
          <div />
          <button className="btn-pixel" style={{ fontSize: "12px", padding: "10px" }} onClick={() => { const s = stateRef.current; if (s.running) s.nextDir = { x: 0, y: -1 }; }}>▲</button>
          <div />
          <button className="btn-pixel" style={{ fontSize: "12px", padding: "10px" }} onClick={() => { const s = stateRef.current; if (s.running) s.nextDir = { x: -1, y: 0 }; }}>◀</button>
          <button className="btn-pixel" style={{ fontSize: "12px", padding: "10px", background: "#374151", color: "#9ca3af" }} onClick={() => { stateRef.current.running = false; setDead(true); }}>■</button>
          <button className="btn-pixel" style={{ fontSize: "12px", padding: "10px" }} onClick={() => { const s = stateRef.current; if (s.running) s.nextDir = { x: 1, y: 0 }; }}>▶</button>
          <div />
          <button className="btn-pixel" style={{ fontSize: "12px", padding: "10px" }} onClick={() => { const s = stateRef.current; if (s.running) s.nextDir = { x: 0, y: 1 }; }}>▼</button>
          <div />
        </div>
      )}
    </div>
  );
}
