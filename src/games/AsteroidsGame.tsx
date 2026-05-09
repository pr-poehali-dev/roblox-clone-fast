import { useEffect, useRef, useState, useCallback } from "react";

const W = 480, H = 500;

type Vec = { x: number; y: number };
type Asteroid = { pos: Vec; vel: Vec; r: number; angle: number; spin: number; verts: Vec[] };
type Bullet = { pos: Vec; vel: Vec; life: number };
type Particle = { pos: Vec; vel: Vec; life: number; color: string };

const v2 = (x: number, y: number): Vec => ({ x, y });
const add = (a: Vec, b: Vec): Vec => v2(a.x + b.x, a.y + b.y);
const scale = (a: Vec, s: number): Vec => v2(a.x * s, a.y * s);
const wrap = (p: Vec): Vec => v2(((p.x % W) + W) % W, ((p.y % H) + H) % H);
const dist = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);

const makeVerts = (r: number): Vec[] =>
  Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    const nr = r * (0.75 + Math.random() * 0.5);
    return v2(Math.cos(a) * nr, Math.sin(a) * nr);
  });

const makeAsteroid = (r: number, pos?: Vec): Asteroid => ({
  pos: pos || v2(Math.random() * W, Math.random() * H),
  vel: v2((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2),
  r,
  angle: 0,
  spin: (Math.random() - 0.5) * 0.04,
  verts: makeVerts(r),
});

export default function AsteroidsGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    ship: { pos: v2(W / 2, H / 2), vel: v2(0, 0), angle: -Math.PI / 2, alive: true },
    asteroids: [] as Asteroid[],
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    score: 0,
    lives: 3,
    running: false,
    dead: false,
    level: 1,
    keys: { up: false, left: false, right: false, space: false },
    shootCooldown: 0,
    invincible: 0,
    shake: 0,
  });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [dead, setDead] = useState(false);
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const rafRef = useRef(0);

  const spawnLevel = (lvl: number) => {
    stateRef.current.asteroids = Array.from({ length: 3 + lvl }, () => {
      const a = makeAsteroid(35 + Math.random() * 10);
      const ship = stateRef.current.ship.pos;
      while (dist(a.pos, ship) < 120) {
        a.pos = v2(Math.random() * W, Math.random() * H);
      }
      return a;
    });
  };

  const explode = (pos: Vec, count: number, color: string) => {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 1 + Math.random() * 3;
      stateRef.current.particles.push({
        pos: { ...pos },
        vel: v2(Math.cos(a) * spd, Math.sin(a) * spd),
        life: 40 + Math.random() * 20,
        color,
      });
    }
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;

    ctx.save();
    if (s.shake > 0) { ctx.translate((Math.random() - 0.5) * s.shake * 4, (Math.random() - 0.5) * s.shake * 4); }

    ctx.fillStyle = "#030508";
    ctx.fillRect(-10, -10, W + 20, H + 20);

    // Stars
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    for (let i = 0; i < 60; i++) ctx.fillRect((i * 73 + 11) % W, (i * 41 + 23) % H, 1, 1);

    // Asteroids
    s.asteroids.forEach(a => {
      ctx.save();
      ctx.translate(a.pos.x, a.pos.y);
      ctx.rotate(a.angle);
      ctx.shadowColor = "rgba(100,150,255,0.5)";
      ctx.shadowBlur = 8;
      ctx.strokeStyle = "#6496ff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      a.verts.forEach((v, i) => i === 0 ? ctx.moveTo(v.x, v.y) : ctx.lineTo(v.x, v.y));
      ctx.closePath();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();
    });

    // Bullets
    s.bullets.forEach(b => {
      ctx.shadowColor = "#ffd700";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.arc(b.pos.x, b.pos.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Particles
    s.particles.forEach(p => {
      ctx.globalAlpha = p.life / 60;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.pos.x - 1, p.pos.y - 1, 3, 3);
    });
    ctx.globalAlpha = 1;

    // Ship
    if (s.ship.alive && (s.invincible % 6 < 4)) {
      ctx.save();
      ctx.translate(s.ship.pos.x, s.ship.pos.y);
      ctx.rotate(s.ship.angle + Math.PI / 2);
      ctx.shadowColor = "var(--neon-green)";
      ctx.shadowBlur = 20;
      ctx.strokeStyle = "#00ffb3";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(10, 10);
      ctx.lineTo(0, 6);
      ctx.lineTo(-10, 10);
      ctx.closePath();
      ctx.stroke();

      if (s.keys.up) {
        ctx.fillStyle = "#ff8c00";
        ctx.shadowColor = "#ff8c00";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(-5, 8);
        ctx.lineTo(0, 16 + Math.random() * 6);
        ctx.lineTo(5, 8);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    ctx.restore();
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) return;

    if (s.shake > 0) s.shake--;
    if (s.invincible > 0) s.invincible--;
    if (s.shootCooldown > 0) s.shootCooldown--;

    // Ship physics
    if (s.ship.alive) {
      if (s.keys.left) s.ship.angle -= 0.07;
      if (s.keys.right) s.ship.angle += 0.07;
      if (s.keys.up) {
        s.ship.vel.x += Math.cos(s.ship.angle) * 0.3;
        s.ship.vel.y += Math.sin(s.ship.angle) * 0.3;
      }
      const spd = Math.hypot(s.ship.vel.x, s.ship.vel.y);
      if (spd > 8) { s.ship.vel.x = (s.ship.vel.x / spd) * 8; s.ship.vel.y = (s.ship.vel.y / spd) * 8; }
      s.ship.vel.x *= 0.98;
      s.ship.vel.y *= 0.98;
      s.ship.pos = wrap(add(s.ship.pos, s.ship.vel));

      // Shoot
      if (s.keys.space && s.shootCooldown <= 0) {
        s.bullets.push({
          pos: { x: s.ship.pos.x + Math.cos(s.ship.angle) * 14, y: s.ship.pos.y + Math.sin(s.ship.angle) * 14 },
          vel: v2(Math.cos(s.ship.angle) * 10 + s.ship.vel.x, Math.sin(s.ship.angle) * 10 + s.ship.vel.y),
          life: 50,
        });
        s.shootCooldown = 12;
      }
    }

    // Asteroids
    s.asteroids.forEach(a => {
      a.pos = wrap(add(a.pos, a.vel));
      a.angle += a.spin;
    });

    // Bullets
    s.bullets = s.bullets.filter(b => { b.pos = wrap(add(b.pos, b.vel)); return --b.life > 0; });

    // Particles
    s.particles = s.particles.filter(p => { p.pos = add(p.pos, p.vel); return --p.life > 0; });

    // Bullet-asteroid collision
    const toAdd: Asteroid[] = [];
    s.bullets = s.bullets.filter(b => {
      let hit = false;
      s.asteroids = s.asteroids.filter(a => {
        if (!hit && dist(b.pos, a.pos) < a.r) {
          hit = true;
          const pts = a.r > 30 ? 20 : a.r > 15 ? 50 : 100;
          s.score += pts;
          setScore(s.score);
          explode(a.pos, 12, a.r > 30 ? "#6496ff" : "#ff8c00");
          s.shake = 3;
          if (a.r > 18) {
            for (let i = 0; i < 2; i++) {
              const child = makeAsteroid(a.r * 0.55, { x: a.pos.x + (Math.random() - 0.5) * 20, y: a.pos.y + (Math.random() - 0.5) * 20 });
              child.vel = v2((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);
              toAdd.push(child);
            }
          }
          return false;
        }
        return true;
      });
      return !hit;
    });
    s.asteroids.push(...toAdd);

    // Ship-asteroid collision
    if (s.ship.alive && s.invincible <= 0) {
      s.asteroids.forEach(a => {
        if (dist(s.ship.pos, a.pos) < a.r + 8) {
          s.lives--;
          setLives(s.lives);
          explode(s.ship.pos, 20, "#00ffb3");
          s.shake = 8;
          s.ship.vel = v2(0, 0);
          s.ship.pos = v2(W / 2, H / 2);
          s.invincible = 120;
          if (s.lives <= 0) { s.ship.alive = false; s.running = false; setDead(true); }
        }
      });
    }

    // Level up
    if (s.asteroids.length === 0) {
      s.level++;
      setLevel(s.level);
      spawnLevel(s.level);
    }

    draw();
    rafRef.current = requestAnimationFrame(tick);
  }, [draw]);

  const start = useCallback(() => {
    const s = stateRef.current;
    s.ship = { pos: v2(W / 2, H / 2), vel: v2(0, 0), angle: -Math.PI / 2, alive: true };
    s.bullets = []; s.particles = [];
    s.score = 0; s.lives = 3; s.level = 1; s.running = true; s.dead = false;
    s.shootCooldown = 0; s.invincible = 0; s.shake = 0;
    setScore(0); setLives(3); setLevel(1); setDead(false); setStarted(true);
    spawnLevel(1);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => { draw(); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  useEffect(() => {
    const map: Record<string, string> = {
      ArrowUp: "up", w: "up", ArrowLeft: "left", a: "left",
      ArrowRight: "right", d: "right", " ": "space",
    };
    const onKey = (e: KeyboardEvent) => {
      const k = map[e.key];
      if (k) { e.preventDefault(); (stateRef.current.keys as Record<string, boolean>)[k] = e.type === "keydown"; }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKey); };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6">
        <div className="font-pixel text-xs" style={{ color: "var(--neon-blue)", fontSize: "10px" }}>СЧЁТ: <span style={{ color: "white" }}>{score}</span></div>
        <div className="font-pixel text-xs" style={{ color: "#ffd700", fontSize: "10px" }}>ВОЛНА: <span style={{ color: "white" }}>{level}</span></div>
        <div className="font-pixel text-xs" style={{ color: "var(--neon-pink)", fontSize: "10px" }}>ЖИЗНИ: {"❤️".repeat(Math.max(0, lives))}</div>
      </div>
      <div style={{ position: "relative" }}>
        <canvas ref={canvasRef} width={W} height={H}
          style={{ border: "2px solid var(--neon-blue)", boxShadow: "0 0 30px rgba(0,200,255,0.3)", display: "block" }} />
        {(!started || dead) && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(3,5,8,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            {dead && <div className="font-pixel" style={{ color: "var(--neon-pink)", fontSize: "14px", textAlign: "center" }}>GAME OVER<br /><span style={{ color: "white" }}>Счёт: {score}</span></div>}
            {!started && !dead && <div className="font-pixel" style={{ color: "var(--neon-blue)", fontSize: "14px" }}>АСТЕРОИДЫ 🚀</div>}
            <button className="btn-pixel" style={{ background: "var(--neon-blue)", color: "var(--dark-bg)" }} onClick={start}>{dead ? "▶ СНОВА" : "▶ ИГРАТЬ"}</button>
            <div className="font-pixel" style={{ color: "#6b7280", fontSize: "7px", textAlign: "center" }}>← → ПОВОРОТ &nbsp; ↑/W ДВИГАТЕЛЬ<br />ПРОБЕЛ — ОГОНЬ</div>
          </div>
        )}
      </div>
      {started && !dead && (
        <div className="flex flex-col items-center gap-2">
          <button className="btn-pixel" style={{ background: "var(--neon-blue)", color: "var(--dark-bg)", fontSize: "8px", padding: "8px 16px" }}
            onPointerDown={() => stateRef.current.keys.up = true}
            onPointerUp={() => stateRef.current.keys.up = false}>🚀 ДВИГАТЕЛЬ</button>
          <div className="flex gap-3">
            <button className="btn-pixel" style={{ fontSize: "14px", padding: "10px 14px" }}
              onPointerDown={() => stateRef.current.keys.left = true}
              onPointerUp={() => stateRef.current.keys.left = false}>◀</button>
            <button className="btn-pixel" style={{ background: "#ffd700", color: "var(--dark-bg)", fontSize: "8px", padding: "10px 14px" }}
              onPointerDown={() => stateRef.current.keys.space = true}
              onPointerUp={() => stateRef.current.keys.space = false}>🔫 ОГОНЬ</button>
            <button className="btn-pixel" style={{ fontSize: "14px", padding: "10px 14px" }}
              onPointerDown={() => stateRef.current.keys.right = true}
              onPointerUp={() => stateRef.current.keys.right = false}>▶</button>
          </div>
        </div>
      )}
    </div>
  );
}
