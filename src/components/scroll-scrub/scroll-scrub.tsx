/* Scroll scrub React/TanStack reference implementation. */

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import ScrollHighlight from "@/components/umberlla/fluid-text";
import { TypeSequence } from "@/components/umberlla/type-sequence";

import "./scroll-scrub.css";

export interface ScrollScrubScene {
  id: string;
  label: string;
  /** Exact first frame of the deployed desktop clip. */
  poster: string;
  /** Exact first frame of mobileClip; provide whenever mobileClip is set. */
  mobilePoster?: string;
  clip: string;
  mobileClip?: string;
  mobileFrameCount?: number;
  mobileFramePrefix?: string;
  mobileFrameSuffix?: string;
  title: string;
  body: string;
  kicker?: string;
  tags?: string[];
  actions?: ReactNode;
  align?: "left" | "right";
  /** Viewport-heights assigned to this scene. More distance means slower scrub. */
  scroll?: number;
  /** 0..0.6. Slow the middle of the clip without changing either seam frame. */
  linger?: number;
  objectPosition?: string;
  mobileObjectPosition?: string;
}

export interface ScrollScrubConnector {
  /** Exact first frame of this connector clip; never substitute a scene still. */
  poster: string;
  /** Exact first frame of mobileClip; provide whenever mobileClip is set. */
  mobilePoster?: string;
  clip: string;
  mobileClip?: string;
  scroll?: number;
}

export interface ScrollScrubTheme {
  background: string;
  ink: string;
  muted: string;
  accent: string;
}

export interface ScrollScrubProps {
  scenes: ScrollScrubScene[];
  /** Leave empty for continuous-forward architecture A. */
  connectors?: (ScrollScrubConnector | null)[];
  theme: ScrollScrubTheme;
  className?: string;
  onActiveSectionChange?: (index: number) => void;
}

interface Segment {
  key: string;
  kind: "scene" | "connector";
  sectionIndex: number;
  nextSectionIndex: number;
  poster: string;
  mobilePoster?: string;
  clip: string;
  mobileClip?: string;
  weight: number;
  linger: number;
  objectPosition: string;
  mobileObjectPosition: string;
  scene?: ScrollScrubScene;
}

interface RuntimeSegment extends Segment {
  id: string;
  source: string;
  posterSource: string;
  
  isImageSequence: boolean;
  frameCount: number;
  framePrefix: string;
  frameSuffix: string;
  images: HTMLImageElement[];
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;

  video?: HTMLVideoElement;
  objectUrl?: string;
  layer: HTMLElement;
  band: HTMLElement;
  abort?: AbortController;
  start: number;
  end: number;
  target: number;
  current: number;
  visible: boolean;
  ready: boolean;
  loading: boolean;
  failed: boolean;
  loadedSource?: string;
}

interface Controller {
  jumpToSection: (index: number) => void;
}

type ThemeStyle = CSSProperties & Record<`--ss-${string}`, string | number>;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const smoothstep = (value: number) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};

const lingerEase = (value: number, amount: number) => {
  const x = clamp(value);
  const linger = clamp(amount, 0, 0.6);
  const centered = x - 0.5;
  return (1 - linger) * x + linger * (4 * centered ** 3 + 0.5);
};

function buildSegments(
  scenes: ScrollScrubScene[],
  connectors: (ScrollScrubConnector | null)[]
): Segment[] {
  const result: Segment[] = [];

  for (const [index, scene] of scenes.entries()) {
    if (scene.mobileClip && !scene.mobilePoster) {
      throw new Error(`Scene ${scene.id} needs mobilePoster for mobileClip`);
    }
    result.push({
      clip: scene.clip,
      key: `scene:${scene.id}`,
      kind: "scene",
      linger: scene.linger ?? 0,
      mobileClip: scene.mobileClip,
      mobilePoster: scene.mobilePoster,
      mobileObjectPosition:
        scene.mobileObjectPosition ?? scene.objectPosition ?? "50% 50%",
      nextSectionIndex: index,
      objectPosition: scene.objectPosition ?? "50% 50%",
      poster: scene.poster,
      scene,
      sectionIndex: index,
      weight: scene.scroll ?? 1.4,
    });

    const connector = connectors[index];
    if (index < scenes.length - 1 && connector?.clip) {
      if (connector.mobileClip && !connector.mobilePoster) {
        throw new Error(
          `Connector after ${scene.id} needs mobilePoster for mobileClip`
        );
      }
      const nextScene = scenes[index + 1];
      result.push({
        clip: connector.clip,
        key: `connector:${scene.id}:${nextScene.id}`,
        kind: "connector",
        linger: 0,
        mobileClip: connector.mobileClip,
        mobilePoster: connector.mobilePoster,
        mobileObjectPosition:
          nextScene.mobileObjectPosition ??
          nextScene.objectPosition ??
          "50% 50%",
        nextSectionIndex: index + 1,
        objectPosition: nextScene.objectPosition ?? "50% 50%",
        poster: connector.poster,
        sectionIndex: index,
        weight: connector.scroll ?? 0.8,
      });
    }
  }

  return result;
}

export function ScrollScrub({
  scenes,
  connectors,
  theme,
  className,
  onActiveSectionChange,
}: ScrollScrubProps) {
  const rootRef = useRef<HTMLElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const onActiveRef = useRef(onActiveSectionChange);
  const [activeSection, setActiveSection] = useState(0);
  const segments = useMemo(
    () => buildSegments(scenes, connectors ?? []),
    [connectors, scenes]
  );

  useEffect(() => {
    onActiveRef.current = onActiveSectionChange;
  }, [onActiveSectionChange]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || segments.length === 0) {
      return;
    }

    const layerNodes = [
      ...root.querySelectorAll<HTMLElement>("[data-scroll-scrub-layer]"),
    ];
    const bandNodes = [
      ...root.querySelectorAll<HTMLElement>("[data-scroll-scrub-band]"),
    ];
    if (
      layerNodes.length !== segments.length ||
      bandNodes.length !== segments.length
    ) {
      throw new Error("ScrollScrub segment markup is out of sync");
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarsePointer = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;
    const smallViewport = window.matchMedia("(max-width: 860px)");
    const isMobile = () => coarsePointer || smallViewport.matches;
    
    const runtime: RuntimeSegment[] = segments.map((segment, index) => {
      const scene = segment.scene;
      const isImgSeq = !!(scene && isMobile() && scene.mobileFrameCount && scene.mobileFramePrefix && scene.mobileFrameSuffix);
      
      return {
        ...segment,
        id: scene?.id ?? "",
        layer: layerNodes[index],
        band: bandNodes[index],
        current: 0,
        end: 0,
        failed: false,
        loading: false,
        ready: false,
        start: 0,
        target: 0,
        visible: index === 0,
        posterSource: isMobile() ? (segment.mobilePoster || segment.poster) : segment.poster,
        source: isMobile() ? (segment.mobileClip || segment.clip) : segment.clip,
        isImageSequence: isImgSeq,
        frameCount: scene?.mobileFrameCount || 0,
        framePrefix: scene?.mobileFramePrefix || "",
        frameSuffix: scene?.mobileFrameSuffix || "",
        images: []
      };
    });

    let active = -1;
    let destroyed = false;
    let dirty = true;
    let frame = 0;
    let rootTop = 0;
    let total = 1;
    let viewportHeight = window.innerHeight;
    let layoutWidth = window.innerWidth;
    let userReady = false;

    const unloadClip = (segment: RuntimeSegment) => {
      segment.abort?.abort();
      segment.video?.remove();
      segment.canvas?.remove();
      if (segment.objectUrl) {
        URL.revokeObjectURL(segment.objectUrl);
      }
      delete segment.abort;
      delete segment.video;
      delete segment.canvas;
      delete segment.ctx;
      delete segment.objectUrl;
      delete segment.loadedSource;
      segment.loading = false;
      segment.ready = false;
      segment.failed = false;
      segment.current = segment.target;
      delete segment.layer.dataset.videoPainted;
      delete segment.layer.dataset.videoFailed;
    };

    const layout = () => {
      const pageY = window.scrollY || window.pageYOffset;
      rootTop = root.getBoundingClientRect().top + pageY;
      viewportHeight = window.innerHeight;
      layoutWidth = window.innerWidth;

      for (const segment of runtime) {
        const currentSource = segment.isImageSequence ? segment.framePrefix : segment.source;
        if (
          segment.loadedSource &&
          segment.loadedSource !== currentSource
        ) {
          unloadClip(segment);
        }
        const rect = segment.band.getBoundingClientRect();
        segment.start = rect.top + pageY - rootTop;
        segment.end = segment.start + rect.height;
      }
      total = Math.max(runtime.at(-1)?.end ?? viewportHeight, viewportHeight);
      dirty = true;
    };

    const primeVideo = async (video?: HTMLVideoElement) => {
      if (!video || !isMobile()) {
        return;
      }
      try {
        await video.play();
        video.pause();
      } catch {
      }
    };

    const loadClip = async (segment: RuntimeSegment) => {
      const source = segment.isImageSequence ? segment.framePrefix : segment.source;
      if (
        reduceMotion ||
        destroyed ||
        segment.loading ||
        segment.ready ||
        segment.failed ||
        (!source && !segment.isImageSequence)
      ) {
        return;
      }

      segment.loading = true;
      segment.loadedSource = source;
      segment.abort = new AbortController();
      const request = segment.abort;

      try {
        if (segment.isImageSequence) {
          const canvas = document.createElement("canvas");
          canvas.className = "scroll-scrub__video";
          const ctx = canvas.getContext("2d", { alpha: false });
          
          if (!ctx) throw new Error("No 2D context");
          
          segment.canvas = canvas;
          segment.ctx = ctx;
          segment.layer.append(canvas);

          const batch1 = 5;
          const loadFrame = (i: number): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = `${segment.framePrefix}${(i).toString().padStart(3, "0")}${segment.frameSuffix}`;
              img.onload = () => resolve(img);
              img.onerror = () => reject();
            });
          };

          for (let i = 1; i <= Math.min(batch1, segment.frameCount); i++) {
            if (request.signal.aborted) return;
            segment.images[i] = await loadFrame(i);
          }
          
          if (segment.images[1]) {
            canvas.width = segment.images[1].width;
            canvas.height = segment.images[1].height;
            ctx.drawImage(segment.images[1], 0, 0, canvas.width, canvas.height);
            segment.layer.dataset.videoPainted = "true";
          }

          segment.ready = true;
          segment.loading = false;
          dirty = true;

          const loadRest = async () => {
            for (let i = batch1 + 1; i <= segment.frameCount; i++) {
              if (request.signal.aborted || destroyed) break;
              try {
                segment.images[i] = await loadFrame(i);
              } catch {}
              if (i % 5 === 0) await new Promise((r) => setTimeout(r, 10));
            }
          };
          void loadRest();
        } else {
          const response = await fetch(source, {
            signal: request.signal,
          });
          if (!response.ok) {
            throw new Error(`Clip failed: ${response.status}`);
          }
          const blob = await response.blob();
          if (
            destroyed ||
            request.signal.aborted ||
            segment.loadedSource !== source
          ) {
            return;
          }

          const objectUrl = URL.createObjectURL(blob);
          const video = document.createElement("video");
          video.className = "scroll-scrub__video";
          video.muted = true;
          video.playsInline = true;
          video.preload = "auto";
          video.setAttribute("muted", "");
          video.setAttribute("playsinline", "");
          video.src = objectUrl;

          video.addEventListener("loadedmetadata", () => {
            if (segment.video !== video || segment.loadedSource !== source) return;
            segment.ready = true;
            segment.loading = false;
            dirty = true;
          }, { once: true });
          video.addEventListener("loadeddata", () => {
            if (userReady && segment.video === video && segment.loadedSource === source) {
              void primeVideo(video);
            }
          }, { once: true });
          video.addEventListener("error", () => {
            if (segment.video !== video) return;
            video.remove();
            URL.revokeObjectURL(objectUrl);
            delete segment.video;
            delete segment.objectUrl;
            segment.failed = true;
            segment.loading = false;
            segment.ready = false;
            delete segment.layer.dataset.videoPainted;
            segment.layer.dataset.videoFailed = "true";
          }, { once: true });
          video.addEventListener("seeked", () => {
            if (segment.video === video && segment.loadedSource === source) {
              segment.layer.dataset.videoPainted = "true";
            }
          }, { once: true });

          segment.layer.append(video);
          segment.objectUrl = objectUrl;
          segment.video = video;
        }
      } catch (error) {
        if (
          request.signal.aborted ||
          (error instanceof Error && error.name === "AbortError") ||
          segment.loadedSource !== source
        ) {
          return;
        }
        segment.layer.dataset.videoFailed = "true";
        segment.failed = true;
        segment.loading = false;
      }
    };

    const readScroll = () => {
      const pageY = window.scrollY || window.pageYOffset;
      const y = clamp(pageY - rootTop, 0, total);
      const crossfade = 0.1 * viewportHeight;
      let currentIndex = 0;

      for (const [index, segment] of runtime.entries()) {
        if (y >= segment.start) {
          currentIndex = index;
        }

        const length = Math.max(segment.end - segment.start, 1);
        const local = clamp((y - segment.start) / length);
        segment.target = segment.linger
          ? lingerEase(local, segment.linger)
          : local;

        let outside = 0;
        if (y < segment.start) outside = segment.start - y;
        if (y > segment.end) outside = y - segment.end;
        
        let opacity = smoothstep(1 - outside / Math.max(crossfade, 1));
        if (reduceMotion) opacity = outside === 0 ? 1 : 0;

        segment.visible = opacity > 0.001;
        segment.layer.style.opacity = String(opacity);
        segment.layer.style.zIndex = index === currentIndex ? "2" : "1";

        if (
          y > segment.start - 1.5 * viewportHeight &&
          y < segment.end + 1.5 * viewportHeight
        ) {
          void loadClip(segment);
        }
      }

      const current = runtime[currentIndex];
      const currentLength = Math.max(current.end - current.start, 1);
      const currentProgress = clamp((y - current.start) / currentLength);
      const nextActive =
        current.kind === "connector" && currentProgress >= 0.5
          ? current.nextSectionIndex
          : current.sectionIndex;

      if (nextActive !== active) {
        active = nextActive;
        root.dataset.activeSection = String(active);
        setActiveSection(active);
        onActiveRef.current?.(active);
      }

      root.style.setProperty("--ss-progress", String(clamp(y / total)));
    };

    const updateVideos = () => {
      for (const segment of runtime) {
        if (!segment.ready || !segment.visible || reduceMotion) {
          continue;
        }
        segment.current += (segment.target - segment.current) * 0.2;
        
        if (segment.isImageSequence && segment.canvas && segment.ctx) {
          const targetFrame = Math.floor(clamp(segment.current, 0, 0.999) * segment.frameCount) + 1;
          const img = segment.images[targetFrame];
          if (img && img.complete && img.naturalHeight !== 0) {
            segment.ctx.drawImage(img, 0, 0, segment.canvas.width, segment.canvas.height);
          }
        } else {
          const video = segment.video;
          if (!video) continue;
          const targetTime = clamp(segment.current, 0, 0.999) * (video.duration || 1);
          const epsilon = isMobile() ? 0.02 : 0.008;
          if (Math.abs(video.currentTime - targetTime) > epsilon) {
            try {
              video.currentTime = targetTime;
            } catch {}
          }
        }
      }
    };

    const tick = () => {
      if (destroyed) {
        return;
      }
      if (dirty) {
        dirty = false;
        readScroll();
      }
      updateVideos();
      frame = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      dirty = true;
    };
    const onResize = () => {
      if (coarsePointer && window.innerWidth === layoutWidth) {
        return;
      }
      layout();
    };
    const onFirstGesture = () => {
      if (userReady) {
        return;
      }
      userReady = true;
      for (const segment of runtime) {
        void primeVideo(segment.video);
      }
    };

    controllerRef.current = {
      jumpToSection(index) {
        const segment = runtime.find(
          (candidate) =>
            candidate.kind === "scene" && candidate.sectionIndex === index
        );
        if (!segment) {
          return;
        }
        const top =
          rootTop + segment.start + 0.15 * (segment.end - segment.start);
        window.scrollTo({
          behavior: reduceMotion ? "auto" : "smooth",
          top,
        });
      },
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", layout);
    window.addEventListener("pointerdown", onFirstGesture, {
      once: true,
      passive: true,
    });
    window.addEventListener("touchstart", onFirstGesture, {
      once: true,
      passive: true,
    });

    layout();
    frame = window.requestAnimationFrame(tick);

    return () => {
      destroyed = true;
      controllerRef.current = null;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", layout);
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("touchstart", onFirstGesture);
      root.style.removeProperty("--ss-progress");
      delete root.dataset.activeSection;

      for (const segment of runtime) {
        unloadClip(segment);
        segment.layer.style.removeProperty("opacity");
        segment.layer.style.removeProperty("z-index");
      }
    };
  }, [segments]);

  if (scenes.length === 0) {
    return null;
  }

  const themeStyle: ThemeStyle = {
    "--ss-accent": theme.accent,
    "--ss-bg": theme.background,
    "--ss-ink": theme.ink,
    "--ss-muted": theme.muted,
  };

  return (
    <section
      className={["scroll-scrub", className].filter(Boolean).join(" ")}
      ref={rootRef}
      style={themeStyle}
    >
      <div className="scroll-scrub__stage">
        <div aria-hidden="true" className="scroll-scrub__media">
          {segments.map((segment, index) => {
            const layerStyle: ThemeStyle = {
              "--ss-mobile-position": segment.mobileObjectPosition,
              "--ss-object-position": segment.objectPosition,
            };
            return (
              <figure
                className={`scroll-scrub__layer scroll-scrub__layer--${segment.kind}`}
                data-scroll-scrub-layer=""
                key={segment.key}
                style={layerStyle}
              >
                <picture className="scroll-scrub__picture">
                  {segment.mobilePoster ? (
                    <source
                      media="(hover: none) and (pointer: coarse), (max-width: 860px)"
                      srcSet={segment.mobilePoster}
                    />
                  ) : null}
                  <img
                    alt=""
                    className="scroll-scrub__poster"
                    decoding="async"
                    fetchPriority={index === 0 ? "high" : "auto"}
                    loading={index === 0 ? "eager" : "lazy"}
                    src={segment.poster}
                  />
                </picture>
              </figure>
            );
          })}
        </div>

        <div aria-hidden="true" className="scroll-scrub__progress">
          <span />
        </div>
      </div>

      <div className="scroll-scrub__story">
        {segments.map((segment) => {
          const bandStyle: CSSProperties = {
            minHeight: `${Math.max(segment.weight, 0.2) * 100}dvh`,
          };

          if (segment.kind === "connector") {
            return (
              <div
                aria-hidden="true"
                className="scroll-scrub__connector-band"
                data-scroll-scrub-band=""
                key={segment.key}
                style={bandStyle}
              />
            );
          }

          const { scene } = segment;
          if (!scene) {
            return null;
          }
          const Heading = segment.sectionIndex === 0 ? "h1" : "h2";

          return (
            <article
              className="scroll-scrub__chapter"
              data-align={scene.align ?? "left"}
              data-scroll-scrub-band=""
              id={scene.id}
              key={segment.key}
              style={bandStyle}
            >
              <div className="scroll-scrub__chapter-pin">
                <div className="scroll-scrub__copy">
                  {scene.kicker ? (
                    <p className="u-sticker bg-[#f2c230] text-[#101b33] inline-block mb-6 shadow-[4px_4px_0_0_rgba(16,27,51,1)]">{scene.kicker}</p>
                  ) : null}
                  <Heading className="u-fun-heading text-5xl md:text-7xl mb-6 !text-[#f2c230] drop-shadow-md">
                    <TypeSequence text={scene.title} />
                  </Heading>
                  <ScrollHighlight
                    text={scene.body}
                    className="text-xl md:text-2xl leading-relaxed mb-8 text-white/90 font-medium max-w-[36ch]"
                    dimColor="rgba(255, 255, 255, 0.2)"
                    highlightColor="rgba(255, 255, 255, 0.9)"
                  />
                  {scene.tags?.length ? (
                    <ul className="flex gap-3 mb-8 flex-wrap">
                      {scene.tags.map((tag) => (
                        <li key={tag} className="u-sticker text-sm bg-white text-[#101b33] shadow-[3px_3px_0_0_rgba(242,194,48,1)]">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {scene.actions ? (
                    <div className="scroll-scrub__actions mt-8">{scene.actions}</div>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
