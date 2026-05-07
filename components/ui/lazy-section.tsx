"use client";

import { useEffect, useRef, useState } from "react";

interface LazySectionProps {
  children: React.ReactNode;
  /** Pre-mount distance — start mounting this many pixels before the section enters the viewport. */
  rootMargin?: string;
  /** Reserved height shown while content is unmounted (prevents layout-shift + makes anchor scroll work). */
  minHeight?: string;
  /** Wrapper className passed through (e.g. for `id` anchors set on a parent). */
  className?: string;
}

/**
 * Defers child mount until the wrapper enters the viewport (or comes within
 * `rootMargin` of it). Reduces the number of compositing layers on initial
 * paint — material on iOS Safari where pinch-zoom rasterizes every loaded
 * compositing layer at zoom_factor² and pushes past the WebContent process
 * memory ceiling. Below-fold sections that aren't visible at first paint
 * shouldn't take rasterization budget when the user pinches the hero.
 *
 * Wraps in a div with reserved minHeight so the page layout (and `#anchor`
 * scroll targets) keep working before the content hydrates.
 */
export function LazySection({
  children,
  rootMargin = "300px",
  minHeight = "400px",
  className,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || visible) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ minHeight: visible ? undefined : minHeight }}
    >
      {visible ? children : null}
    </div>
  );
}
