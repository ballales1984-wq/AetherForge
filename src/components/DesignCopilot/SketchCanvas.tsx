import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface Point {
  x: number;
  y: number;
  pressure: number; // 0..1
}

interface Path {
  points: Point[];
  color: string;
  width: number;
  tool: 'pen' | 'eraser';
}

interface SketchCanvasProps {
  width?: number;       // logical width (default 800)
  height?: number;      // logical height (default 600)
  onSketchChange?: (paths: Path[]) => void;
  className?: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────────

const CANVAS_BG = '#1a1a2e';
const GRID_COLOR = '#252542';
const GRID_STEP = 20;

const TOOL_PEN = 'pen' as const;
const TOOL_ERASER = 'eraser' as const;

const MAX_UNDO = 20;

// ─── Helpers ────────────────────────────────────────────────────────────────────

/** Distance between two points */
const dist = (a: Point, b: Point): number =>
  Math.hypot(b.x - a.x, b.y - a.y);

/** Simple line-segment simplification (Ramer–Douglas–Peucker, iterative) */
function simplifyPath(points: Point[], toleranceSq: number = 4): Point[] {
  if (points.length <= 2) return [...points];

  const result: Point[] = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const d = dist(points[i], points[i - 1]);
    if (d * d > toleranceSq) {
      result.push(points[i]);
    }
  }
  result.push(points[points.length - 1]);
  return result;
}

/** Compute pressure from pointer velocity */
function velocityPressure(
  prev: Point | null,
  curr: Point,
  next: Point | null,
): number {
  let speed = 0;
  if (prev) speed += dist(prev, curr);
  if (next) speed += dist(curr, next);
  // Clamp to [0.2, 1.0] so lines are always visible
  return Math.min(1, Math.max(0.2, 1 - speed / 40));
}

// ─── Component ─────────────────────────────────────────────────────────────────

const SketchCanvas: React.FC<SketchCanvasProps> = ({
  width = 800,
  height = 600,
  onSketchChange,
  className = '',
}) => {
  // ---- Refs ----
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const currentPathRef = useRef<Point[]>([]);

  // ---- State ----
  const [paths, setPaths] = useState<Path[]>([]);
  const [undoStack, setUndoStack] = useState<Path[][]>([]);
  const [redoStack, setRedoStack] = useState<Path[][]>([]);
  const [activeTool, setActiveTool] = useState<'pen' | 'eraser'>(TOOL_PEN);
  const [brushSize, setBrushSize] = useState(4);

  // Derived
  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  // ---- Canvas scaling (devicePixelRatio) ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    redrawAll(ctx, paths);
  }, [width, height, paths]);

  // ---- Redraw helper ----
  const redrawAll = useCallback(
    (ctx: CanvasRenderingContext2D, drawPaths: Path[]) => {
      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = CANVAS_BG;
      ctx.fillRect(0, 0, width, height);

      // Grid
      ctx.strokeStyle = GRID_COLOR;
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= width; x += GRID_STEP) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += GRID_STEP) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Paths
      drawPaths.forEach((p) => drawPath(ctx, p));
    },
    [width, height],
  );

  // ---- Draw single path ----
  const drawPath = useCallback(
    (ctx: CanvasRenderingContext2D, path: Path) => {
      if (path.points.length < 2) return;

      const pts = simplifyPath(path.points);

      ctx.save();
      ctx.strokeStyle = path.tool === 'eraser' ? CANVAS_BG : path.color;
      ctx.lineWidth = path.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (path.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      }

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);

      for (let i = 1; i < pts.length; i++) {
        const midX = (pts[i - 1].x + pts[i].x) / 2;
        const midY = (pts[i - 1].y + pts[i].y) / 2;
        ctx.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, midX, midY);
      }

      // Last segment
      const last = pts[pts.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();

      // Variable-width glow for pen
      if (path.tool === 'pen') {
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.08)';
        ctx.lineWidth = path.width * 3;
        ctx.stroke();
      }

      ctx.restore();
    },
    [CANVAS_BG],
  );

  // ---- Pointer handling (mouse + touch) ----
  const getPointerPos = useCallback(
    (e: React.PointerEvent | React.TouchEvent): Point => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const clientX =
        'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY =
        'touches' in e ? e.touches[0].clientY : e.clientY;
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
        pressure: 0.5,
      };
    },
    [width, height],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      canvasRef.current?.setPointerCapture(e.pointerId);
      isDrawingRef.current = true;
      lastPointRef.current = null;
      currentPathRef.current = [];

      const pos = getPointerPos(e);
      pos.pressure = e.pointerType === 'pen' ? (e as any).pressure || 0.5 : 0.8;
      currentPathRef.current.push(pos);
      lastPointRef.current = pos;
    },
    [getPointerPos],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();

      const pos = getPointerPos(e);
      // Velocity-based pressure if not a pen
      if (e.pointerType !== 'pen') {
        const prev = lastPointRef.current;
        pos.pressure = prev ? velocityPressure(prev, pos, null) : 0.6;
      } else {
        pos.pressure = (e as any).pressure ?? 0.5;
      }

      currentPathRef.current.push(pos);
      lastPointRef.current = pos;

      // Live preview: draw incremental segment
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const pts = currentPathRef.current;
      if (pts.length < 2) return;

      const prev = pts[pts.length - 2];
      const curr = pts[pts.length - 1];

      ctx.save();
      const effectiveWidth =
        activeTool === 'eraser' ? brushSize * 3 : brushSize * pos.pressure * 2;
      ctx.strokeStyle =
        activeTool === 'eraser' ? CANVAS_BG : '#00ffcc';
      ctx.lineWidth = Math.max(1, effectiveWidth);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (activeTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      }

      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.stroke();
      ctx.restore();
    },
    [activeTool, brushSize, getPointerPos, CANVAS_BG],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;

      const completedPath: Path = {
        points: [...currentPathRef.current],
        color: activeTool === 'eraser' ? CANVAS_BG : '#00ffcc',
        width: activeTool === 'eraser' ? brushSize * 3 : brushSize,
        tool: activeTool,
      };

      setPaths((prev) => {
        const newPaths = [...prev, completedPath];
        // Push old state to undo
        setUndoStack((u) => {
          const next = [...u, prev];
          if (next.length > MAX_UNDO) next.shift();
          return next;
        });
        setRedoStack([]);
        if (onSketchChange) onSketchChange(newPaths);
        return newPaths;
      });

      currentPathRef.current = [];
      lastPointRef.current = null;
    },
    [activeTool, brushSize, onSketchChange, CANVAS_BG],
  );

  // ---- Undo / Redo ----
  const handleUndo = useCallback(() => {
    setPaths((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setUndoStack((u) => {
        const next: Path[][] = [...u, prev];
        if (next.length > MAX_UNDO) next.shift();
        return next;
      });
      setRedoStack((r) => [[last], ...r]);
      if (onSketchChange) onSketchChange(prev.slice(0, -1));
      return prev.slice(0, -1);
    });
  }, [onSketchChange]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    setRedoStack((r) => {
      const restored = r[0]; // Path[]
      const nextRedo: Path[][] = r.slice(1);
      setUndoStack((u) => {
        const ns: Path[][] = [...u, paths];
        if (ns.length > MAX_UNDO) ns.shift();
        return ns;
      });
      if (onSketchChange) onSketchChange([...paths, ...restored]);
      return nextRedo;
    });
  }, [redoStack, onSketchChange, paths]);

  // ---- Clear ----
  const handleClear = useCallback(() => {
    setUndoStack((u) => {
      const ns = [...u, paths];
      if (ns.length > MAX_UNDO) ns.shift();
      return ns;
    });
    setRedoStack([]);
    setPaths([]);
    if (onSketchChange) onSketchChange([]);
  }, [paths, onSketchChange]);

  // ---- Keyboard shortcuts ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo(); else handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleUndo, handleRedo]);

  // ---- Export helper ----
  const exportSketch = useCallback((): string => {
    return JSON.stringify(paths, null, 2);
  }, [paths]);

  // ---- Touch events (prevent scroll while drawing) ----
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      handlePointerDown(e as any);
    },
    [handlePointerDown],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      handlePointerMove(e as any);
    },
    [handlePointerMove],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      handlePointerUp(e as any);
    },
    [handlePointerUp],
  );

  // ---- Memorable export info ----
  const exportInfo = useMemo(() => {
    const totalPoints = paths.reduce((s, p) => s + p.points.length, 0);
    return { count: paths.length, points: totalPoints };
  }, [paths]);

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      className={`sketch-canvas-container ${className}`}
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: 0,
        background: CANVAS_BG,
        border: '1px solid #00ffcc44',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: '#12122a',
          borderBottom: '1px solid #00ffcc33',
          flexWrap: 'wrap',
        }}
      >
        {/* Tool buttons */}
        {(['pen', 'eraser'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTool(t)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 6,
              border:
                activeTool === t
                  ? '1px solid #00ffcc'
                  : '1px solid #ffffff22',
              background:
                activeTool === t ? '#00ffcc18' : '#ffffff08',
              color: activeTool === t ? '#00ffcc' : '#aaa',
              cursor: 'pointer',
              fontSize: 13,
              fontFamily: 'inherit',
              transition: 'all .15s',
            }}
          >
            {t === 'pen' ? '✏️ Pen' : '🧹 Eraser'}
          </button>
        ))}

        <span style={{ color: '#ffffff22', fontSize: 12 }}>|</span>

        {/* Brush size */}
        <label style={{ color: '#aaa', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          Size
          <input
            type="range"
            min={1}
            max={24}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            style={{
              accentColor: '#00ffcc',
              width: 80,
            }}
          />
          <span style={{ color: '#00ffcc', minWidth: 18, textAlign: 'center' }}>
            {brushSize}
          </span>
        </label>

        <span style={{ flex: 1 }} />

        {/* Undo / Redo */}
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid #ffffff22',
            background: canUndo ? '#ffffff08' : '#ffffff04',
            color: canUndo ? '#ccc' : '#555',
            cursor: canUndo ? 'pointer' : 'default',
            fontSize: 13,
            fontFamily: 'inherit',
          }}
        >
          ↩ Undo
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid #ffffff22',
            background: canRedo ? '#ffffff08' : '#ffffff04',
            color: canRedo ? '#ccc' : '#555',
            cursor: canRedo ? 'pointer' : 'default',
            fontSize: 13,
            fontFamily: 'inherit',
          }}
        >
          ↪ Redo
        </button>

        {/* Clear */}
        <button
          onClick={handleClear}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid #ff444466',
            background: '#ff444418',
            color: '#ff8888',
            cursor: 'pointer',
            fontSize: 13,
            fontFamily: 'inherit',
          }}
        >
          🗑 Clear
        </button>

        {/* Export */}
        <button
          onClick={() => {
            const blob = new Blob([exportSketch()], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `automotive-sketch-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid #00ffcc44',
            background: '#00ffcc10',
            color: '#00ffcc',
            cursor: 'pointer',
            fontSize: 13,
            fontFamily: 'inherit',
          }}
        >
          💾 Export JSON
        </button>

        {/* Info badge */}
        <span
          style={{
            color: '#ffffff44',
            fontSize: 11,
            marginLeft: 4,
          }}
        >
          {exportInfo.count} path(s), {exportInfo.points} pt(s)
        </span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          flex: 1,
          display: 'block',
          width: '100%',
          height: '100%',
          minHeight: 0,
          cursor:
            activeTool === 'eraser'
              ? 'cell'
              : 'crosshair',
          touchAction: 'none',
          background: CANVAS_BG,
        }}
      />
    </div>
  );
};

export default SketchCanvas;

// ─── Re-export types for consumers ──────────────────────────────────────────────
export type { Path, Point };