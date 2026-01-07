import React, { useState, useRef, useEffect } from "react";

export default function FullscreenImageViewer({ images, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const lastDistance = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const getDistance = (t) => {
    const dx = t[0].clientX - t[1].clientX;
    const dy = t[0].clientY - t[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      lastDistance.current = getDistance(e.touches);
      return;
    }

    touchStartX.current = e.touches[0].clientX;

    if (scale > 1) {
      dragStart.current = {
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      };
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2 && lastDistance.current) {
      e.preventDefault();
      const dist = getDistance(e.touches);
      setScale((s) => Math.min(Math.max(s * (dist / lastDistance.current), 1), 4));
      lastDistance.current = dist;
      return;
    }

    if (scale > 1) {
      e.preventDefault();
      setOffset({
        x: e.touches[0].clientX - dragStart.current.x,
        y: e.touches[0].clientY - dragStart.current.y,
      });
      return;
    }

    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    lastDistance.current = null;

    if (scale > 1) return;

    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) < 50) return;

    setIndex((i) =>
      distance > 0
        ? Math.min(i + 1, images.length - 1)
        : Math.max(i - 1, 0)
    );
  };

  useEffect(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, [index]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#f9f6ef] flex flex-col">
      <button
        onClick={onClose}
        className="absolute text-[#737144] top-4 right-4 text-2xl z-10"
      >
        ✕
      </button>

      <div
        className="flex-1 flex items-center justify-center overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={images[index]}
          className="max-h-full max-w-full object-contain select-none"
          draggable={false}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: scale === 1 ? "transform 0.3s ease" : "none",
            touchAction: "none",
          }}
        />
      </div>

      <div className="flex text-[#737144] items-center justify-center gap-8 py-4 border-t">
        <button onClick={() => setIndex((i) => Math.max(i - 1, 0))}>←</button>
        <span>{index + 1} / {images.length}</span>
        <button onClick={() => setIndex((i) => Math.min(i + 1, images.length - 1))}>→</button>
      </div>
    </div>
  );
}
