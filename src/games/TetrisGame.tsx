import { useEffect, useRef, useState, useCallback } from "react";

const COLS = 10;
const ROWS = 20;
const CELL = 28;
const W = COLS * CELL;
const H = ROWS * CELL;

const PIECES = [
  { shape: [[1,1,1,1]], color: "#00c8ff" },           // I
  { shape: [[1,1],[1,1]], color: "#ffd700" },          // O
  { shape: [[0,1,0],[1,1,1]], color: "#9b59ff" },      // T
  { shape: [[1,0,0],[1,1,1]], color: "#ff8c00" },      // L
  { shape: [[0,0,1],[1,1,1]], color: "#00ffb3" },      // J
  { shape: [[0,1,1],[1,1,0]], color: "#ff2d78" },      // S
  { shape: [[1,1,0],[0,1,1]], color: "#ff6b6b" },      // Z
];

type Board = (string | null)[][];

const emptyBoard = (): Board => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

const rotate = (m: number[][]): number[][] =>
  m[0].map((_, i) => m.map(row => row[i]).reverse());

const randPiece = () => {
  const p = PIECES[Math.floor(Math.random() * PIECES.length)];
  return { shape: p.shape.map(r => [...r]), color: p.color, x: 3, y: 0 };
};

type Piece = { shape: number[][]; color: string; x: number; y: number };

const fits = (board: Board, piece: Piece, dx = 0, dy = 0, shape = piece.shape) => {
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++)
      if (shape[r][c]) {
        const nx = piece.x + c + dx, ny = piece.y + r + dy;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
        if (ny >= 0 && board[ny][nx]) return false;
      }
  return true;
};

const place = (board: Board, piece: Piece): Board => {
  const b = board.map(r => [...r]);
  piece.shape.forEach((row, r) =>
    row.forEach((v, c) => { if (v) { const ny = piece.y + r; if (ny >= 0) b[ny][piece.x + c] = piece.color; } })
  );
  return b;
};

const clearLines = (board: Board): { board: Board; lines: number } => {
  const kept = board.filter(row => row.some(c => !c));
  const lines = ROWS - kept.length;
  const newRows: Board = Array.from({ length: lines }, () => Array(COLS).fill(null));
  return { board: [...newRows, ...kept], lines };
};

export default function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<Board>(emptyBoard());
  const pieceRef = useRef<Piece>(randPiece());
  const nextPieceRef = useRef<Piece>(randPiece());
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [dead, setDead] = useState(false);
  const [started, setStarted] = useState(false);
  const runningRef = useRef(false);
  const scoreRef = useRef(0);
  const linesRef = useRef(0);
  const levelRef = useRef(1);
  const rafRef = useRef(0);
  const lastRef = useRef(0);

  const getSpeed = () => Math.max(100, 600 - (levelRef.current - 1) * 50);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ncanvas = nextRef.current;
    if (!canvas || !ncanvas) return;
    const ctx = canvas.getContext("2d")!;
    const nctx = ncanvas.getContext("2d")!;

    // Board
    ctx.fillStyle = "#050810";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(0,255,179,0.06)";
    ctx.lineWidth = 1;
    for (let r = 0; r < ROWS; r++) { ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(W, r * CELL); ctx.stroke(); }
    for (let c = 0; c < COLS; c++) { ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, H); ctx.stroke(); }

    // Placed blocks
    boardRef.current.forEach((row, r) =>
      row.forEach((color, c) => {
        if (color) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 8;
          ctx.fillStyle = color;
          ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
          ctx.fillStyle = "rgba(255,255,255,0.15)";
          ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, 4);
          ctx.shadowBlur = 0;
        }
      })
    );

    // Ghost piece
    const piece = pieceRef.current;
    let ghostY = 0;
    while (fits(boardRef.current, piece, 0, ghostY + 1)) ghostY++;
    if (ghostY > 0) {
      piece.shape.forEach((row, r) =>
        row.forEach((v, c) => {
          if (v) {
            ctx.fillStyle = "rgba(255,255,255,0.08)";
            ctx.fillRect((piece.x + c) * CELL + 1, (piece.y + r + ghostY) * CELL + 1, CELL - 2, CELL - 2);
          }
        })
      );
    }

    // Current piece
    ctx.shadowColor = piece.color;
    ctx.shadowBlur = 15;
    piece.shape.forEach((row, r) =>
      row.forEach((v, c) => {
        if (v) {
          ctx.fillStyle = piece.color;
          ctx.fillRect((piece.x + c) * CELL + 1, (piece.y + r) * CELL + 1, CELL - 2, CELL - 2);
          ctx.fillStyle = "rgba(255,255,255,0.2)";
          ctx.fillRect((piece.x + c) * CELL + 1, (piece.y + r) * CELL + 1, CELL - 2, 4);
        }
      })
    );
    ctx.shadowBlur = 0;

    // Next piece preview
    const np = nextPieceRef.current;
    nctx.fillStyle = "#050810";
    nctx.fillRect(0, 0, 5 * CELL, 4 * CELL);
    const ox = Math.floor((5 - np.shape[0].length) / 2);
    const oy = Math.floor((4 - np.shape.length) / 2);
    nctx.shadowColor = np.color;
    nctx.shadowBlur = 10;
    np.shape.forEach((row, r) =>
      row.forEach((v, c) => {
        if (v) {
          nctx.fillStyle = np.color;
          nctx.fillRect((ox + c) * CELL + 1, (oy + r) * CELL + 1, CELL - 2, CELL - 2);
        }
      })
    );
    nctx.shadowBlur = 0;
  }, []);

  const tick = useCallback((now: number) => {
    if (!runningRef.current) return;
    if (now - lastRef.current < getSpeed()) { rafRef.current = requestAnimationFrame(tick); return; }
    lastRef.current = now;

    const piece = pieceRef.current;
    if (fits(boardRef.current, piece, 0, 1)) {
      pieceRef.current = { ...piece, y: piece.y + 1 };
    } else {
      boardRef.current = place(boardRef.current, piece);
      const { board, lines: cleared } = clearLines(boardRef.current);
      boardRef.current = board;
      if (cleared > 0) {
        const pts = [0, 100, 300, 500, 800][cleared] * levelRef.current;
        scoreRef.current += pts;
        linesRef.current += cleared;
        levelRef.current = Math.floor(linesRef.current / 10) + 1;
        setScore(scoreRef.current);
        setLines(linesRef.current);
        setLevel(levelRef.current);
      }
      pieceRef.current = { ...nextPieceRef.current, x: 3, y: 0 };
      nextPieceRef.current = randPiece();
      if (!fits(boardRef.current, pieceRef.current)) {
        runningRef.current = false;
        setDead(true);
        draw();
        return;
      }
    }
    draw();
    rafRef.current = requestAnimationFrame(tick);
  }, [draw]);

  const start = useCallback(() => {
    boardRef.current = emptyBoard();
    pieceRef.current = randPiece();
    nextPieceRef.current = randPiece();
    scoreRef.current = 0; linesRef.current = 0; levelRef.current = 1;
    setScore(0); setLines(0); setLevel(1); setDead(false); setStarted(true);
    runningRef.current = true;
    lastRef.current = 0;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => { draw(); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!runningRef.current) return;
      const p = pieceRef.current;
      if (e.key === "ArrowLeft" || e.key === "a") { if (fits(boardRef.current, p, -1)) { pieceRef.current = { ...p, x: p.x - 1 }; draw(); } }
      else if (e.key === "ArrowRight" || e.key === "d") { if (fits(boardRef.current, p, 1)) { pieceRef.current = { ...p, x: p.x + 1 }; draw(); } }
      else if (e.key === "ArrowDown" || e.key === "s") { if (fits(boardRef.current, p, 0, 1)) { pieceRef.current = { ...p, y: p.y + 1 }; lastRef.current = performance.now(); draw(); } }
      else if (e.key === "ArrowUp" || e.key === "w") {
        const rot = rotate(p.shape);
        if (fits(boardRef.current, p, 0, 0, rot)) { pieceRef.current = { ...p, shape: rot }; draw(); }
      } else if (e.key === " ") {
        e.preventDefault();
        let dy = 0;
        while (fits(boardRef.current, p, 0, dy + 1)) dy++;
        pieceRef.current = { ...p, y: p.y + dy };
        lastRef.current = 0;
        draw();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [draw]);

  return (
    <div className="flex gap-4 items-start justify-center flex-wrap">
      <div style={{ position: "relative" }}>
        <canvas ref={canvasRef} width={W} height={H}
          style={{ border: "2px solid var(--neon-purple)", boxShadow: "0 0 30px rgba(155,89,255,0.3)", display: "block" }} />
        {(!started || dead) && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,13,20,0.88)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            {dead && <div className="font-pixel" style={{ color: "var(--neon-pink)", fontSize: "14px", textAlign: "center" }}>ИГРА ОКОНЧЕНА<br /><span style={{ color: "white" }}>Счёт: {score}</span></div>}
            {!started && !dead && <div className="font-pixel" style={{ color: "var(--neon-purple)", fontSize: "14px" }}>ТЕТРИС</div>}
            <button className="btn-pixel btn-pixel-purple" onClick={start}>{dead ? "▶ СНОВА" : "▶ ИГРАТЬ"}</button>
            <div className="font-pixel" style={{ color: "#6b7280", fontSize: "7px", textAlign: "center" }}>← → MOVE &nbsp; ↑/W ROTATE<br />↓ SOFT DROP &nbsp; SPACE HARD DROP</div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3" style={{ minWidth: 120 }}>
        <div className="retro-card p-3">
          <div className="font-pixel text-xs mb-1" style={{ color: "#6b7280", fontSize: "7px" }}>СЧЁТ</div>
          <div className="font-orbitron font-black text-white text-lg">{score.toLocaleString()}</div>
        </div>
        <div className="retro-card p-3">
          <div className="font-pixel text-xs mb-1" style={{ color: "#6b7280", fontSize: "7px" }}>ЛИНИЙ</div>
          <div className="font-orbitron font-black text-white text-lg">{lines}</div>
        </div>
        <div className="retro-card p-3">
          <div className="font-pixel text-xs mb-1" style={{ color: "#6b7280", fontSize: "7px" }}>УРОВЕНЬ</div>
          <div className="font-orbitron font-black" style={{ color: "var(--neon-purple)", fontSize: "24px" }}>{level}</div>
        </div>
        <div className="retro-card p-2">
          <div className="font-pixel text-xs mb-2" style={{ color: "#6b7280", fontSize: "7px" }}>СЛЕДУЮЩАЯ</div>
          <canvas ref={nextRef} width={5 * CELL} height={4 * CELL} style={{ display: "block" }} />
        </div>
        {started && !dead && (
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex gap-2 justify-center">
              <button className="btn-pixel" style={{ fontSize: "14px", padding: "10px 14px" }} onClick={() => { const p = pieceRef.current; const rot = rotate(p.shape); if (fits(boardRef.current, p, 0, 0, rot)) { pieceRef.current = { ...p, shape: rot }; draw(); } }}>↻</button>
            </div>
            <div className="flex gap-2 justify-center">
              <button className="btn-pixel" style={{ fontSize: "14px", padding: "10px" }} onClick={() => { const p = pieceRef.current; if (fits(boardRef.current, p, -1)) { pieceRef.current = { ...p, x: p.x - 1 }; draw(); } }}>◀</button>
              <button className="btn-pixel" style={{ fontSize: "14px", padding: "10px" }} onClick={() => { const p = pieceRef.current; if (fits(boardRef.current, p, 0, 1)) { pieceRef.current = { ...p, y: p.y + 1 }; lastRef.current = performance.now(); draw(); } }}>▼</button>
              <button className="btn-pixel" style={{ fontSize: "14px", padding: "10px" }} onClick={() => { const p = pieceRef.current; if (fits(boardRef.current, p, 1)) { pieceRef.current = { ...p, x: p.x + 1 }; draw(); } }}>▶</button>
            </div>
            <button className="btn-pixel btn-pixel-purple" style={{ fontSize: "8px" }} onClick={() => { let dy = 0; const p = pieceRef.current; while (fits(boardRef.current, p, 0, dy + 1)) dy++; pieceRef.current = { ...p, y: p.y + dy }; lastRef.current = 0; draw(); }}>⬇ DROP</button>
          </div>
        )}
      </div>
    </div>
  );
}
