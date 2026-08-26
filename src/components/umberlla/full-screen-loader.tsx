import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const START_FRAME = 24;
const END_FRAME = 255;
const TOTAL_FRAMES = END_FRAME - START_FRAME + 1;
const FPS = 24;
const FRAME_DURATION = 1000 / FPS;

export function FullScreenLoader() {
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);
  const imgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    // 1. Lock body scrolling
    document.body.style.overflow = "hidden";

    // 2. Preload frames
    const images: string[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const src = `/assets/sun/sun-model/ezgif-frame-${(i + START_FRAME).toString().padStart(3, "0")}.png`;
      images.push(src);
      // Preloading the image to ensure it's in the browser cache
      const img = new Image();
      img.src = src;
    }

    // 3. Playback loop
    let currentFrame = 0;
    let lastTime = performance.now();
    let rafId: number;
    let isExiting = false;

    const loop = (time: number) => {
      if (isExiting) return;
      
      const elapsed = time - lastTime;
      if (elapsed > FRAME_DURATION) {
        currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
        lastTime = time - (elapsed % FRAME_DURATION);
        
        if (imgRef.current) {
          imgRef.current.src = images[currentFrame];
        }

        if (textRef.current) {
          if (currentFrame < 45) {
            textRef.current.innerText = "SUMMONING THE SUN...";
          } else if (currentFrame < 90) {
            textRef.current.innerText = "WEAVING THE CANOPY...";
          } else if (currentFrame < 135) {
            textRef.current.innerText = "CHECKING THE WEATHER...";
          } else if (currentFrame < 180) {
            textRef.current.innerText = "TESTING WIND RESISTANCE...";
          } else {
            textRef.current.innerText = "READY FOR THE SHADE!";
          }
        }
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    // 4. GSAP Exit Trigger
    const MIN_LOAD_TIME = 2500; // Force 2.5s display so they see the branding
    const startTime = Date.now();

    const exitLoader = () => {
      if (isExiting) return;
      isExiting = true;
      cancelAnimationFrame(rafId);
      
      const layers = layersRef.current.filter(Boolean);
      if (layers.length === 0) {
        setIsRemoved(true);
        document.body.style.overflow = "";
        return;
      }
      
      // Multi-layer curve sweep
      gsap.to(layers, {
        yPercent: -100,
        borderBottomLeftRadius: "50%",
        borderBottomRightRadius: "50%",
        ease: "power4.inOut",
        duration: 1.2,
        stagger: 0.15,
        onComplete: () => {
          setIsRemoved(true);
        }
      });

      // Start scrolling while the loader is still sweeping up (at 600ms).
      // Unlock the body scroll right before we start scrolling so it actually works.
      setTimeout(() => {
        document.body.style.overflow = "";
        
        const scrollProxy = { y: window.scrollY };
        gsap.to(scrollProxy, {
          y: window.scrollY + window.innerHeight * 0.6,
          duration: 2.5,
          ease: "power2.inOut",
          onUpdate: () => window.scrollTo(0, scrollProxy.y)
        });
      }, 600);
    };

    const attemptExit = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= MIN_LOAD_TIME) {
        exitLoader();
      } else {
        setTimeout(exitLoader, MIN_LOAD_TIME - elapsed);
      }
    };

    if (document.readyState === "complete") {
      attemptExit();
    } else {
      window.addEventListener("load", attemptExit);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("load", attemptExit);
      document.body.style.overflow = "";
    };
  }, []);

  if (isRemoved) return null;

  return (
    <>
      {/* Base Transition Layer */}
      <div
        ref={(el) => {
          if (el) layersRef.current[2] = el;
        }}
        className="fixed inset-0 z-[99997] bg-[#f2c230]"
        style={{ transformOrigin: "top center" }}
      />
      {/* Middle Transition Layer */}
      <div
        ref={(el) => {
          if (el) layersRef.current[1] = el;
        }}
        className="fixed inset-0 z-[99998] bg-[#101b33]"
        style={{ transformOrigin: "top center" }}
      />
      {/* Main Loader Layer (Cream) */}
      <div
        ref={(el) => {
          if (el) layersRef.current[0] = el;
        }}
        id="loader-wrapper"
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#f3efe4]"
        style={{ transformOrigin: "top center" }}
      >
        <img
          ref={imgRef}
          id="loader-sequence"
          className="w-[280px] h-auto md:w-[450px] translate-y-8 md:translate-y-12 drop-shadow-[0_4px_12px_rgba(16,27,51,0.15)]"
          alt=""
          aria-hidden="true"
          src={`/assets/sun/sun-model/ezgif-frame-${START_FRAME.toString().padStart(3, "0")}.png`}
        />
        <div
          ref={textRef}
          id="loader-text"
          className="mt-12 font-bold uppercase tracking-[0.2em] text-[#3A2A21] text-sm md:text-lg translate-y-8 md:translate-y-12"
        >
          SUMMONING THE SUN...
        </div>
      </div>
    </>
  );
}
