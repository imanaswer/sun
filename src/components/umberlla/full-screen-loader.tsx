import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { scrollScrubScenes } from "@/scroll-scrub-scenes";

const START_FRAME = 24;
// The loader only displays ~2.5s (~60 frames at 24fps) before sweeping away, so
// only load that many frames instead of all 232 (~66MB → ~18MB). The rest of
// the sequence is never shown.
const END_FRAME = 113;
const TOTAL_FRAMES = END_FRAME - START_FRAME + 1;
const FPS = 24;
const FRAME_DURATION = 1000 / FPS;

export function FullScreenLoader() {
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);
  const imgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isRemoved, setIsRemoved] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Lock body scrolling
    document.body.style.overflow = "hidden";

    // 2. Preload frames (Staggered to prevent startup lag)
    const images: string[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      images.push(`/assets/sun/sun-model/ezgif-frame-${(i + START_FRAME).toString().padStart(3, "0")}.png`);
    }

    // Preload first 10 frames immediately so the animation can start smoothly
    for (let i = 0; i < Math.min(10, TOTAL_FRAMES); i++) {
      const img = new Image();
      img.src = images[i];
    }
    setProgress(Math.round((Math.min(10, TOTAL_FRAMES) / TOTAL_FRAMES) * 100));

    // Preload the rest in chunks to avoid blocking the main thread and network
    let currentPreloadIndex = 10;
    const preloadRest = () => {
      if (currentPreloadIndex >= TOTAL_FRAMES) {
        setProgress(100);
        return;
      }
      // Preload 10 frames at a time
      const end = Math.min(currentPreloadIndex + 10, TOTAL_FRAMES);
      for (let i = currentPreloadIndex; i < end; i++) {
        const img = new Image();
        img.src = images[i];
      }
      currentPreloadIndex = end;
      setProgress(Math.round((currentPreloadIndex / TOTAL_FRAMES) * 100));
      // Schedule the next chunk
      setTimeout(preloadRest, 50);
    };
    
    // Start background preloading after a short delay
    setTimeout(preloadRest, 100);

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

    // Gate the reveal on the hero's scrub videos being downloaded, so the
    // scroll/scrub is smooth the instant the loader lifts. Warm the HTTP cache
    // by fetching the exact clips the ScrollScrub will use (mobile variants on
    // small screens). Never hang longer than MAX_LOAD_TIME on a slow network.
    const MAX_LOAD_TIME = 15000;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const heroClips = scrollScrubScenes.map((s) =>
      isMobile && s.mobileClip ? s.mobileClip : s.clip,
    );
    let heroReady = false;
    Promise.allSettled(
      heroClips.map((url) => fetch(url).then((r) => r.blob())),
    ).then(() => {
      heroReady = true;
    });

    const attemptExit = () => {
      const elapsed = Date.now() - startTime;
      if ((elapsed >= MIN_LOAD_TIME && heroReady) || elapsed >= MAX_LOAD_TIME) {
        exitLoader();
      } else {
        setTimeout(attemptExit, 150);
      }
    };
    attemptExit();

    return () => {
      cancelAnimationFrame(rafId);
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
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#f3efe4] overflow-hidden"
        style={{ transformOrigin: "top center" }}
      >
        {/* Giant Background Percentage */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0">
          <span className="text-[35vw] font-bold text-[#3A2A21] opacity-5 tracking-tighter leading-none translate-y-12">
            {progress.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="relative flex flex-col items-center justify-center z-10 w-full h-full">
          {/* Unified Container for Mascot, Ring, and Text */}
          <div className="relative flex flex-col items-center justify-center w-[340px] h-[340px] md:w-[540px] md:h-[540px] translate-y-4 md:translate-y-8">
            {/* Circular Progress Ring (bounds exactly to container) */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-0"
              viewBox="0 0 540 540"
            >
              <circle
                cx="270"
                cy="270"
                r="250"
                fill="none"
                stroke="#3A2A21"
                strokeOpacity="0.05"
                strokeWidth="2"
              />
              <circle
                cx="270"
                cy="270"
                r="250"
                fill="none"
                stroke="#f2c230"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 250}
                strokeDashoffset={2 * Math.PI * 250 - (progress / 100) * (2 * Math.PI * 250)}
                className="transition-all duration-300 ease-out"
              />
            </svg>

            {/* Mascot Image (shrunk to fit) */}
            <img
              ref={imgRef}
              id="loader-sequence"
              className="w-[240px] md:w-[380px] h-auto drop-shadow-[0_4px_24px_rgba(16,27,51,0.15)] relative z-10"
              alt=""
              aria-hidden="true"
              src={`/assets/sun/sun-model/ezgif-frame-${START_FRAME.toString().padStart(3, "0")}.png`}
            />

            {/* Inner Text (shrunk and nested below the mascot) */}
            <div className="flex flex-col items-center mt-2 md:mt-4 relative z-10">
              <div
                ref={textRef}
                id="loader-text"
                className="font-bold uppercase tracking-[0.2em] text-[#3A2A21] text-[11px] md:text-base text-center"
              >
                SUMMONING THE SUN...
              </div>
              <div className="font-mono text-[10px] md:text-xs text-[#3A2A21]/60 tracking-widest mt-1 md:mt-2">
                {progress}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
