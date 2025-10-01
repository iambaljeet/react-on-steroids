"use client";

import { useEffect, useState, useRef } from "react";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState<"default" | "hover" | "click">("default");
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    
    // Ring position with slight delay
    let ringX = 0;
    let ringY = 0;
    const ringSpeed = 0.15; // Lower = more delay/trailing

    const updateRingPosition = () => {
      ringX += (mousePosition.x - ringX) * ringSpeed;
      ringY += (mousePosition.y - ringY) * ringSpeed;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(updateRingPosition);
    };

    updateRingPosition();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [mousePosition]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Update dot position immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const handleMouseDown = () => setCursorState("click");
    const handleMouseUp = () => setCursorState("default");

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest("a") ||
        target.closest("button") ||
        target.tagName === "A" ||
        target.tagName === "BUTTON";

      setCursorState(isInteractive ? "hover" : "default");
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  const sizes = {
    default: { dot: 8, ring: 40 },
    hover: { dot: 8, ring: 60 },
    click: { dot: 6, ring: 30 },
  };

  const currentSize = sizes[cursorState];

  return (
    <>
      {/* Dot - follows instantly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference rounded-full bg-indigo-500 dark:bg-indigo-400"
        style={{
          width: `${currentSize.dot}px`,
          height: `${currentSize.dot}px`,
          transition: "width 0.2s ease, height 0.2s ease",
          willChange: "transform",
        }}
      />

      {/* Ring - trails behind */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference rounded-full border-2 border-indigo-500/50 dark:border-indigo-400/50"
        style={{
          width: `${currentSize.ring}px`,
          height: `${currentSize.ring}px`,
          transition: "width 0.3s ease, height 0.3s ease",
          willChange: "transform",
        }}
      />
    </>
  );
}
