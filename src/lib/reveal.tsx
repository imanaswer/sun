import { useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";

/**
 * Scroll-reveal wrapper. Renders as its own element (so it can *be* the grid /
 * container, not an extra wrapper) and animates on scroll-in:
 *  - stagger=false → the element itself fades + lifts.
 *  - stagger=true  → its direct children cascade in one after another.
 *
 * Fired by a plain IntersectionObserver (independent of the smooth-scroll /
 * ScrollTrigger stack, so it can't get stuck). SSR-safe: the server renders the
 * content visible; the hidden from-state is only set once JS runs on the client
 * (in useLayoutEffect, before paint), so no-JS degrades to fully visible and
 * there's no flash. Respects reduced-motion.
 */
export function Reveal({
  children,
  className,
  as,
  stagger = false,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  stagger?: boolean;
  y?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "div") as ElementType;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = stagger
      ? gsap.utils.toArray<HTMLElement>(el.children)
      : [el];
    gsap.set(targets, { opacity: 0, y });

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: stagger ? 0.1 : 0,
        });
        io.disconnect();
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      gsap.set(targets, { clearProps: "opacity,transform" });
    };
  }, [stagger, y]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
