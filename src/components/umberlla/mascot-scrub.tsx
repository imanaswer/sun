import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function MascotCanvasScrub() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const START_FRAME = 24;
  const END_FRAME = 255;
  const frameCount = END_FRAME - START_FRAME + 1;

  const currentFrame = (index: number) =>
    `/assets/sun/sun-model/ezgif-frame-${(index + START_FRAME).toString().padStart(3, "0")}.png`;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const images: HTMLImageElement[] = [];
    const mascotObj = { frame: 0 };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    const render = () => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      const img = images[Math.round(mascotObj.frame)];
      
      if (img && img.complete && ctx) {
        if (canvasRef.current.width !== img.width) {
            canvasRef.current.width = img.width;
            canvasRef.current.height = img.height;
        }
        ctx.clearRect(0, 0, img.width, img.height);
        ctx.drawImage(img, 0, 0);
      }
    };

    images[0].onload = render;

    const ctx = gsap.context(() => {
      // Tie the frame sequence to the scroll position of the element
      gsap.to(mascotObj, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: render,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%", // Start animating when the element comes into view
          end: "bottom 10%", // End when it leaves
          scrub: 0.5,
        },
      });
      
      // Optionally add a slight horizontal drift within its container
      gsap.fromTo(
        canvasRef.current,
        { x: "20%" },
        {
          x: "-20%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            end: "bottom 10%",
            scrub: 0.5,
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative flex items-center justify-center w-[200px] h-[200px] md:w-[320px] md:h-[320px] -translate-y-6 md:-translate-y-10">
      <canvas
        ref={canvasRef}
        className="pointer-events-auto w-full h-auto drop-shadow-[0_4px_12px_rgba(16,27,51,0.15)]"
      />
    </div>
  );
}
