import { useEffect, useRef, useState, useCallback } from "react";

const W = 400, H = 500;
const PAD_W = 70, PAD_H = 10, PAD_SPEED = 6;
const BALL_R = 7;
const ROWS = 6, COLS = 8, BRICK_W = 44, BRICK_H = 18, BRICK_GAP = 4;
const BRICK_OFFSET_X = (W - (COLS * (BRICK_W + BRICK_GAP) - BRICK_GAP)) / 2;
const BRICK_OFFSET_Y = 48;

const BRICK_COLORS = [
  "#ff2d78", "#ff8c00", "#ffd700", "#00ffb3", "#00c8ff", "#9b59ff",
];

type Brick = { x: number; y: number; alive: boolean; color: string; hp: number };

const makeBricks = (): Brick[] => {
  const bricks: Brick[] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      bricks.push({
        x: BRICK_OFFSET_X + c * (BRICK_W + BRICK_GAP),
        y: BRICK_OFFSET_Y + r * (BRICK_H + BRICK_GAP),
        alive: true,
        color: BRICK_COLORS[r % BRICK_COLORS.length],
        hp: r === 0 ? 2 : 1,
      });
  return bricks;
};

export default function ArkanoidGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    padX: W / 2 - PAD_W / 2,
    ball: { x: W / 2, y: H - 80, vx: 3, vy: -4 },
    bricks: makeBricks(),
    score: 0,
    lives: 3,
    running: false,
    dead: false,
    win: false,
    keys: { left: false, right: false },
    touchX: null as number | null,
  });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [dead, setDead] = useState(false);
  const [win, setWin] = useState(false);
  const [started, setStarted] = useState(false);
  const rafRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;

    ctx.fillStyle = "#050810";
    ctx.fillRect(0, 0, W, H);

    // Stars bg
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    for (let i = 0; i < 40; i++) {
      const sx = (i * 97 + 13) % W, sy = (i * 53 + 7) % H;
      ctx.fillRect(sx, sy, 1, 1);
    }

    // Bricks
    s.bricks.forEach(b => {
      if (!b.alive) return;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = b.hp > 1 ? b.color : `${b.color}bb`;
      ctx.fillRect(b.x, b.y, BRICK_W, BRICK_H);
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillRect(b.x, b.y, BRICK_W, 4);
      if (b.hp > 1) {
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(b.x + 2, b.y + 2, BRICK_W - 4, BRICK_H - 4);
      }
    });
    ctx.shadowBlur = 0;

    // Paddle
    ctx.shadowColor = "var(--neon-green)";
    ctx.shadowBlur = 15;
    const grad = ctx.createLinearGradient(s.padX, 0, s.padX + PAD_W, 0);
    grad.addColorStop(0, "#00ffb3");
    grad.addColorStop(0.5, "#00ffd0");
    grad.addColorStop(1, "#00ffb3");
    ctx.fillStyle = grad;
    ctx.fillRect(s.padX, H - PAD_H - 20, PAD_W, PAD_H);
    ctx.shadowBlur = 0;

    // Ball
    ctx.shadowColor = "#ff2d78";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fillStyle = "#ff2d78";
    ctx.fill();
    ctx.shadowBlur = 0;

    // Lives
    for (let i = 0; i < s.lives; i++) {
      ctx.fillStyle = "var(--neon-pink)";
      ctx.fillRect(10 + i * 16, 12, 10, 10);
    }
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) return;

    // Paddle movement
    if (s.keys.left) s.padX = Math.max(0, s.padX - PAD_SPEED);
    if (s.keys.right) s.padX = Math.min(W - PAD_W, s.padX + PAD_SPEED);
    if (s.touchX !== null) s.padX = Math.max(0, Math.min(W - PAD_W, s.touchX - PAD_W / 2));

    // Ball movement
    s.ball.x += s.ball.vx;
    s.ball.y += s.ball.vy;

    // Wall bounce
    if (s.ball.x - BALL_R <= 0) { s.ball.x = BALL_R; s.ball.vx = Math.abs(s.ball.vx); }
    if (s.ball.x + BALL_R >= W) { s.ball.x = W - BALL_R; s.ball.vx = -Math.abs(s.ball.vx); }
    if (s.ball.y - BALL_R <= 0) { s.ball.y = BALL_R; s.ball.vy = Math.abs(s.ball.vy); }

    // Paddle bounce
    const py = H - PAD_H - 20;
    if (s.ball.y + BALL_R >= py && s.ball.y + BALL_R <= py + PAD_H + 5 &&
      s.ball.x >= s.padX - 5 && s.ball.x <= s.padX + PAD_W + 5) {
      const rel = (s.ball.x - (s.padX + PAD_W / 2)) / (PAD_W / 2);
      const speed = Math.sqrt(s.ball.vx ** 2 + s.ball.vy ** 2);
      s.ball.vx = rel * speed * 1.2;
      s.ball.vy = -Math.abs(s.ball.vy);
    }

    // Ball lost
    if (s.ball.y > H) {
      s.lives--;
      setLives(s.lives);
      if (s.lives <= 0) { s.running = false; s.dead = true; setDead(true); draw(); return; }
      s.ball = { x: W / 2, y: H - 120, vx: 3 * (Math.random() > 0.5 ? 1 : -1), vy: -4 };
    }

    // Brick collision
    s.bricks.forEach(b => {
      if (!b.alive) return;
      if (s.ball.x + BALL_R > b.x && s.ball.x - BALL_R < b.x + BRICK_W &&
        s.ball.y + BALL_R > b.y && s.ball.y - BALL_R < b.y + BRICK_H) {
        b.hp--;
        if (b.hp <= 0) { b.alive = false; s.score += 10; setScore(s.score); }
        const fromLeft = s.ball.x < b.x || s.ball.x > b.x + BRICK_W;
        if (fromLeft) s.ball.vx *= -1; else s.ball.vy *= -1;
      }
    });

    // Win check
    if (s.bricks.every(b => !b.alive)) {
      s.running = false; s.win = true; setWin(true); draw(); return;
    }

    draw();
    rafRef.current = requestAnimationFrame(tick);
  }, [draw]);

  const start = useCallback(() => {
    const s = stateRef.current;
    s.padX = W / 2 - PAD_W / 2;
    s.ball = { x: W / 2, y: H - 120, vx: 3, vy: -4 };
    s.bricks = makeBricks();
    s.score = 0; s.lives = 3; s.running = true; s.dead = false; s.win = false;
    setScore(0); setLives(3); setDead(false); setWin(false); setStarted(true);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => { draw(); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const down = e.type === "keydown";
      if (e.key === "ArrowLeft" || e.key === "a") s.keys.left = down;
      if (e.key === "ArrowRight" || e.key === "d") s.keys.right = down;
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKey); };
  }, []);

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    stateRef.current.touchX = e.clientX - rect.left;
  };
  const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    stateRef.current.touchX = e.touches[0].clientX - rect.left;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6">
        <div className="font-pixel text-xs" style={{ color: "var(--neon-green)", fontSize: "10px" }}>СЧЁТ: <span style={{ color: "white" }}>{score}</span></div>
        <div className="font-pixel text-xs" style={{ color: "var(--neon-pink)", fontSize: "10px" }}>ЖИЗНИ: {"❤️".repeat(lives)}</div>
      </div>
      <div style={{ position: "relative" }}>
        <canvas ref={canvasRef} width={W} height={H}
          style={{ border: "2px solid var(--neon-orange)", boxShadow: "0 0 30px rgba(255,140,0,0.3)", display: "block", cursor: "none" }}
          onMouseMove={onMouseMove}
          onTouchMove={onTouchMove}
        />
        {(!started || dead || win) && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,13,20,0.88)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            {win && <div className="font-pixel" style={{ color: "#ffd700", fontSize: "14px", textAlign: "center" }}>🎉 ПОБЕДА!<br /><span style={{ color: "white" }}>Счёт: {score}</span></div>}
            {dead && <div className="font-pixel" style={{ color: "var(--neon-pink)", fontSize: "14px", textAlign: "center" }}>ИГРА ОКОНЧЕНА<br /><span style={{ color: "white" }}>Счёт: {score}</span></div>}
            {!started && !dead && !win && <div className="font-pixel" style={{ color: "var(--neon-orange)", fontSize: "14px" }}>АРКАНОИД 🧱</div>}
            <button className="btn-pixel" style={{ background: "var(--neon-orange)" }} onClick={start}>{dead || win ? "▶ СНОВА" : "▶ ИГРАТЬ"}</button>
            <div className="font-pixel" style={{ color: "#6b7280", fontSize: "7px", textAlign: "center" }}>← → / WASD / МЫШЬ / КАСАНИЕ</div>
          </div>
        )}
      </div>
    </div>
  );
}
