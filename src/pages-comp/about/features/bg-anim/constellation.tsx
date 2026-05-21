// components/Constellation.tsx
'use client';
import { useEffect, useRef, useCallback, useMemo } from 'react';

interface ConstellationProps {
  starColor?: string;
  starMaxSize?: number;
  starVelocity?: number;
  lineColor?: string;
  lineWidth?: number;
  connectionDistance?: number;
  interactionRadius?: number;
  interactionLineColor?: string;
  backgroundColor?: string;
  height?: string;
  minHeight?: string;
  zIndex?: number;
  className?: string;
  totalStars?: number;
  resizeDebounce?: number;
}

interface StarInterface {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  canvas: HTMLCanvasElement;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}


const Constellation = ({
  starColor = 'rgba(255, 255, 255, .9)',
  starMaxSize = 3,
  starVelocity = 0.5,
  lineColor = 'rgba(157, 188, 225, 0.3)',
  lineWidth = 0.3,
  connectionDistance = 100,
  interactionRadius = 200,
  interactionLineColor = 'rgba(255, 255, 255, 0.8)',
  backgroundColor = 'bg-black',
  height = 'h-screen',
  minHeight = 'min-h-[400px]',
  zIndex = -10,
  className = '',
  totalStars = 120,
  resizeDebounce = 100,
}: ConstellationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const mousePos = useRef({ x: -1000, y: -1000 });
  const configRef = useRef<{
    stars: StarInterface[];
    canvas: HTMLCanvasElement | null;
  }>({ stars: [], canvas: null });

  // Фиксируем класс Star с useMemo
  const StarClass = useMemo(() => {
    return class Star implements StarInterface {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      canvas: HTMLCanvasElement;

      constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * starVelocity;
        this.vy = (Math.random() - 0.5) * starVelocity;
        this.radius = Math.random() * starMaxSize;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = starColor;
        ctx.fill();
      }
    };
  }, [starVelocity, starMaxSize, starColor]);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const container = canvas.parentElement!;
    const { width, height } = container.getBoundingClientRect();
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    ctx.scale(dpr, dpr);
    
    configRef.current.canvas = canvas;
    
    return { canvas, ctx, dpr };
  }, []);

  // Debounce функция для ресайза
  const debouncedResize = useCallback(
    (fn: () => void) => {
      let timeout: NodeJS.Timeout;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(fn, resizeDebounce);
      };
    },
    [resizeDebounce]
  );

  const debouncedResizeHandler = useMemo(
    () => debouncedResize(() => {
      const canvasData = initCanvas();
      if (!canvasData || !configRef.current.canvas) return;
      
      configRef.current.stars = Array.from(
        { length: totalStars }, 
        () => new StarClass(configRef.current.canvas!)
      );
    }),
    [debouncedResize, initCanvas, totalStars, StarClass]
  );
  
  const handleResize = useCallback(() => {
    debouncedResizeHandler();
  }, [debouncedResizeHandler]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mousePos.current = {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  }, []);

  useEffect(() => {
    const init = () => {
      const canvasData = initCanvas();
      if (!canvasData) return;
      
      const { canvas, ctx } = canvasData;
      let animationActive = true;

      // Явно указываем тип для массива звезд
      configRef.current.stars = Array.from(
        { length: totalStars }, 
        () => new StarClass(canvas)
      ) as StarInterface[];

      const drawConnections = () => {
        const mx = mousePos.current.x;
        const my = mousePos.current.y;

        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;
        
        configRef.current.stars.forEach((a: StarInterface, i: number) => {
          configRef.current.stars.slice(i + 1).forEach((b: StarInterface) => {
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < connectionDistance) {
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
            }
          });
        });
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = interactionLineColor;
        configRef.current.stars.forEach((star: StarInterface) => {
          const dx = star.x - mx;
          const dy = star.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < interactionRadius) {
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(mx, my);
          }
        });
        ctx.stroke();
      };

      const animate = () => {
        if (!animationActive) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        configRef.current.stars.forEach((star: StarInterface) => {
          star.update();
          star.draw(ctx);
        });

        drawConnections();
        animationFrameId.current = requestAnimationFrame(animate);
      };

      animate();

      window.addEventListener('resize', handleResize);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', () => {
        mousePos.current = { x: -1000, y: -1000 };
      });

      return () => {
        animationActive = false;
        window.removeEventListener('resize', handleResize);
        canvas.removeEventListener('mousemove', handleMouseMove);
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    };

    init();
  }, [
    initCanvas,
    handleMouseMove,
    handleResize,
    lineColor,
    lineWidth,
    connectionDistance,
    interactionRadius,
    interactionLineColor,
    totalStars,
    StarClass
  ]);

  return (
    <div 
      className={ `relative ${height} ${minHeight} ${backgroundColor} ${className}` }
      style={ { zIndex } }
    >
      <canvas
        ref={ canvasRef }
        className='absolute top-0 left-0 w-full h-full'
      />
    </div>
  );
};

export default Constellation;