import * as React$1 from "react";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useInView } from "framer-motion";
import { motion as motion$1, useAnimate, useReducedMotion } from "motion/react";
import { Camera, Mesh, Plane, Program, RenderTarget, Renderer } from "ogl";
//#region src/components/umberlla/fluid-text.tsx
gsap.registerPlugin(ScrollTrigger);
var CHAR_STAGGER = .03;
var WORD_STAGGER = .1;
function ScrollHighlight({ text, dimColor = "rgba(255, 255, 255, 0.15)", highlightColor = "#FFFFFF", splitBy = "words", scrollStart = "top center", scrollEnd = "bottom center", scrub = true, className = "" }) {
	const containerRef = useRef(null);
	const words = text.trim().split(/\s+/).filter(Boolean);
	const chars = Array.from(text);
	const stagger = splitBy === "characters" ? CHAR_STAGGER : WORD_STAGGER;
	useEffect(() => {
		const paragraph = containerRef.current;
		if (!paragraph) return;
		const targets = paragraph.querySelectorAll(splitBy === "characters" ? ".char" : ".word");
		const ctx = gsap.context(() => {
			gsap.set(targets, { color: dimColor });
			gsap.to(targets, {
				color: highlightColor,
				stagger,
				scrollTrigger: {
					trigger: paragraph,
					start: scrollStart,
					end: scrollEnd,
					scrub
				}
			});
		}, paragraph);
		return () => ctx.revert();
	}, [
		text,
		dimColor,
		highlightColor,
		splitBy,
		stagger,
		scrollStart,
		scrollEnd,
		scrub
	]);
	return /* @__PURE__ */ jsx("p", {
		ref: containerRef,
		className,
		style: {
			display: "inline-block",
			whiteSpace: "pre-wrap",
			color: dimColor
		},
		children: splitBy === "characters" ? chars.map((char, index) => /* @__PURE__ */ jsx("span", {
			className: "char",
			style: {
				display: "inline-block",
				color: dimColor
			},
			children: char === " " ? "\xA0" : char
		}, `${char}-${index}`)) : words.map((word, index) => /* @__PURE__ */ jsxs(React$1.Fragment, { children: [/* @__PURE__ */ jsx("span", {
			className: "word",
			style: {
				display: "inline-block",
				color: dimColor
			},
			children: word
		}), index < words.length - 1 ? " " : null] }, `${word}-${index}`))
	});
}
//#endregion
//#region src/components/umberlla/type-sequence.tsx
function TypeSequence({ text, className = "" }) {
	const ref = useRef(null);
	const isInView = useInView(ref, {
		once: true,
		margin: "-10% 0px"
	});
	const container = {
		hidden: { opacity: 1 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: .03 }
		}
	};
	const child = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { duration: .01 }
		}
	};
	return /* @__PURE__ */ jsx(motion.span, {
		ref,
		className,
		variants: container,
		initial: "hidden",
		animate: isInView ? "visible" : "hidden",
		style: {
			display: "inline-block",
			whiteSpace: "pre-wrap"
		},
		"aria-label": text,
		children: /* @__PURE__ */ jsx("span", {
			"aria-hidden": "true",
			children: text.split("").map((char, index) => {
				if (char === " ") return " ";
				if (char === "\n") return /* @__PURE__ */ jsx("br", {}, index);
				return /* @__PURE__ */ jsx(motion.span, {
					variants: child,
					style: { display: "inline-block" },
					children: char
				}, index);
			})
		})
	});
}
//#endregion
//#region src/components/scroll-scrub/scroll-scrub.tsx
var clamp$1 = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
var smoothstep = (value) => {
	const x = clamp$1(value);
	return x * x * (3 - 2 * x);
};
var lingerEase = (value, amount) => {
	const x = clamp$1(value);
	const linger = clamp$1(amount, 0, .6);
	const centered = x - .5;
	return (1 - linger) * x + linger * (4 * centered ** 3 + .5);
};
function buildSegments(scenes, connectors) {
	const result = [];
	for (const [index, scene] of scenes.entries()) {
		if (scene.mobileClip && !scene.mobilePoster) throw new Error(`Scene ${scene.id} needs mobilePoster for mobileClip`);
		result.push({
			clip: scene.clip,
			key: `scene:${scene.id}`,
			kind: "scene",
			linger: scene.linger ?? 0,
			mobileClip: scene.mobileClip,
			mobilePoster: scene.mobilePoster,
			mobileObjectPosition: scene.mobileObjectPosition ?? scene.objectPosition ?? "50% 50%",
			nextSectionIndex: index,
			objectPosition: scene.objectPosition ?? "50% 50%",
			poster: scene.poster,
			scene,
			sectionIndex: index,
			weight: scene.scroll ?? 1.4
		});
		const connector = connectors[index];
		if (index < scenes.length - 1 && connector?.clip) {
			if (connector.mobileClip && !connector.mobilePoster) throw new Error(`Connector after ${scene.id} needs mobilePoster for mobileClip`);
			const nextScene = scenes[index + 1];
			result.push({
				clip: connector.clip,
				key: `connector:${scene.id}:${nextScene.id}`,
				kind: "connector",
				linger: 0,
				mobileClip: connector.mobileClip,
				mobilePoster: connector.mobilePoster,
				mobileObjectPosition: nextScene.mobileObjectPosition ?? nextScene.objectPosition ?? "50% 50%",
				nextSectionIndex: index + 1,
				objectPosition: nextScene.objectPosition ?? "50% 50%",
				poster: connector.poster,
				sectionIndex: index,
				weight: connector.scroll ?? .8
			});
		}
	}
	return result;
}
function ScrollScrub({ scenes, connectors, theme, className, onActiveSectionChange }) {
	const rootRef = useRef(null);
	const controllerRef = useRef(null);
	const onActiveRef = useRef(onActiveSectionChange);
	const [activeSection, setActiveSection] = useState(0);
	const segments = useMemo(() => buildSegments(scenes, connectors ?? []), [connectors, scenes]);
	useEffect(() => {
		onActiveRef.current = onActiveSectionChange;
	}, [onActiveSectionChange]);
	useEffect(() => {
		const root = rootRef.current;
		if (!root || segments.length === 0) return;
		const layerNodes = [...root.querySelectorAll("[data-scroll-scrub-layer]")];
		const bandNodes = [...root.querySelectorAll("[data-scroll-scrub-band]")];
		if (layerNodes.length !== segments.length || bandNodes.length !== segments.length) throw new Error("ScrollScrub segment markup is out of sync");
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const coarsePointer = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
		const smallViewport = window.matchMedia("(max-width: 860px)");
		const isMobile = () => coarsePointer || smallViewport.matches;
		const sourceFor = (segment) => isMobile() && segment.mobileClip ? segment.mobileClip : segment.clip;
		const runtime = segments.map((segment, index) => ({
			...segment,
			band: bandNodes[index],
			current: 0,
			end: 0,
			failed: false,
			layer: layerNodes[index],
			loading: false,
			ready: false,
			start: 0,
			target: 0,
			visible: index === 0
		}));
		let active = -1;
		let destroyed = false;
		let dirty = true;
		let frame = 0;
		let rootTop = 0;
		let total = 1;
		let viewportHeight = window.innerHeight;
		let layoutWidth = window.innerWidth;
		let userReady = false;
		const unloadClip = (segment) => {
			segment.abort?.abort();
			segment.video?.remove();
			if (segment.objectUrl) URL.revokeObjectURL(segment.objectUrl);
			delete segment.abort;
			delete segment.video;
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
				if (segment.loadedSource && segment.loadedSource !== sourceFor(segment)) unloadClip(segment);
				const rect = segment.band.getBoundingClientRect();
				segment.start = rect.top + pageY - rootTop;
				segment.end = segment.start + rect.height;
			}
			total = Math.max(runtime.at(-1)?.end ?? viewportHeight, viewportHeight);
			dirty = true;
		};
		const primeVideo = async (video) => {
			if (!video || !isMobile()) return;
			try {
				await video.play();
				video.pause();
			} catch {}
		};
		const loadClip = async (segment) => {
			const source = sourceFor(segment);
			if (reduceMotion || destroyed || segment.loading || segment.ready || segment.failed || !source) return;
			segment.loading = true;
			segment.loadedSource = source;
			segment.abort = new AbortController();
			const request = segment.abort;
			try {
				const response = await fetch(source, { signal: request.signal });
				if (!response.ok) throw new Error(`Clip failed: ${response.status}`);
				const blob = await response.blob();
				if (destroyed || request.signal.aborted || segment.loadedSource !== source) return;
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
					if (userReady && segment.video === video && segment.loadedSource === source) primeVideo(video);
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
					if (segment.video === video && segment.loadedSource === source) segment.layer.dataset.videoPainted = "true";
				}, { once: true });
				segment.layer.append(video);
				segment.objectUrl = objectUrl;
				segment.video = video;
			} catch (error) {
				if (request.signal.aborted || error instanceof Error && error.name === "AbortError" || segment.loadedSource !== source) return;
				segment.layer.dataset.videoFailed = "true";
				segment.failed = true;
				segment.loading = false;
			}
		};
		const readScroll = () => {
			const y = clamp$1((window.scrollY || window.pageYOffset) - rootTop, 0, total);
			const crossfade = .1 * viewportHeight;
			let currentIndex = 0;
			for (const [index, segment] of runtime.entries()) {
				if (y >= segment.start) currentIndex = index;
				const length = Math.max(segment.end - segment.start, 1);
				const local = clamp$1((y - segment.start) / length);
				segment.target = segment.linger ? lingerEase(local, segment.linger) : local;
				let outside = 0;
				if (y < segment.start) outside = segment.start - y;
				if (y > segment.end) outside = y - segment.end;
				let opacity = smoothstep(1 - outside / Math.max(crossfade, 1));
				if (reduceMotion) opacity = outside === 0 ? 1 : 0;
				segment.visible = opacity > .001;
				segment.layer.style.opacity = String(opacity);
				segment.layer.style.zIndex = index === currentIndex ? "2" : "1";
				if (y > segment.start - 1.5 * viewportHeight && y < segment.end + 1.5 * viewportHeight) loadClip(segment);
			}
			const current = runtime[currentIndex];
			const currentLength = Math.max(current.end - current.start, 1);
			const currentProgress = clamp$1((y - current.start) / currentLength);
			const nextActive = current.kind === "connector" && currentProgress >= .5 ? current.nextSectionIndex : current.sectionIndex;
			if (nextActive !== active) {
				active = nextActive;
				root.dataset.activeSection = String(active);
				setActiveSection(active);
				onActiveRef.current?.(active);
			}
			root.style.setProperty("--ss-progress", String(clamp$1(y / total)));
		};
		const updateVideos = () => {
			for (const segment of runtime) {
				const { video } = segment;
				if (!video || !segment.ready || video.seeking) continue;
				if (!segment.visible && Math.abs(segment.current - segment.target) < .002) continue;
				segment.current += (segment.target - segment.current) * .2;
				const targetTime = clamp$1(segment.current, 0, .999) * (video.duration || 1);
				const epsilon = isMobile() ? .02 : .008;
				if (Math.abs(video.currentTime - targetTime) > epsilon) try {
					video.currentTime = targetTime;
				} catch {}
			}
		};
		const tick = () => {
			if (destroyed) return;
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
			if (coarsePointer && window.innerWidth === layoutWidth) return;
			layout();
		};
		const onFirstGesture = () => {
			if (userReady) return;
			userReady = true;
			for (const segment of runtime) primeVideo(segment.video);
		};
		controllerRef.current = { jumpToSection(index) {
			const segment = runtime.find((candidate) => candidate.kind === "scene" && candidate.sectionIndex === index);
			if (!segment) return;
			const top = rootTop + segment.start + .15 * (segment.end - segment.start);
			window.scrollTo({
				behavior: reduceMotion ? "auto" : "smooth",
				top
			});
		} };
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onResize);
		window.addEventListener("orientationchange", layout);
		window.addEventListener("pointerdown", onFirstGesture, {
			once: true,
			passive: true
		});
		window.addEventListener("touchstart", onFirstGesture, {
			once: true,
			passive: true
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
	if (scenes.length === 0) return null;
	const themeStyle = {
		"--ss-accent": theme.accent,
		"--ss-bg": theme.background,
		"--ss-ink": theme.ink,
		"--ss-muted": theme.muted
	};
	return /* @__PURE__ */ jsxs("section", {
		className: ["scroll-scrub", className].filter(Boolean).join(" "),
		ref: rootRef,
		style: themeStyle,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "scroll-scrub__stage",
			children: [/* @__PURE__ */ jsx("div", {
				"aria-hidden": "true",
				className: "scroll-scrub__media",
				children: segments.map((segment, index) => {
					const layerStyle = {
						"--ss-mobile-position": segment.mobileObjectPosition,
						"--ss-object-position": segment.objectPosition
					};
					return /* @__PURE__ */ jsx("figure", {
						className: `scroll-scrub__layer scroll-scrub__layer--${segment.kind}`,
						"data-scroll-scrub-layer": "",
						style: layerStyle,
						children: /* @__PURE__ */ jsxs("picture", {
							className: "scroll-scrub__picture",
							children: [segment.mobilePoster ? /* @__PURE__ */ jsx("source", {
								media: "(hover: none) and (pointer: coarse), (max-width: 860px)",
								srcSet: segment.mobilePoster
							}) : null, /* @__PURE__ */ jsx("img", {
								alt: "",
								className: "scroll-scrub__poster",
								decoding: "async",
								fetchPriority: index === 0 ? "high" : "auto",
								loading: index === 0 ? "eager" : "lazy",
								src: segment.poster
							})]
						})
					}, segment.key);
				})
			}), /* @__PURE__ */ jsx("div", {
				"aria-hidden": "true",
				className: "scroll-scrub__progress",
				children: /* @__PURE__ */ jsx("span", {})
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "scroll-scrub__story",
			children: segments.map((segment) => {
				const bandStyle = { minHeight: `${Math.max(segment.weight, .2) * 100}dvh` };
				if (segment.kind === "connector") return /* @__PURE__ */ jsx("div", {
					"aria-hidden": "true",
					className: "scroll-scrub__connector-band",
					"data-scroll-scrub-band": "",
					style: bandStyle
				}, segment.key);
				const { scene } = segment;
				if (!scene) return null;
				const Heading = segment.sectionIndex === 0 ? "h1" : "h2";
				return /* @__PURE__ */ jsx("article", {
					className: "scroll-scrub__chapter",
					"data-align": scene.align ?? "left",
					"data-scroll-scrub-band": "",
					id: scene.id,
					style: bandStyle,
					children: /* @__PURE__ */ jsx("div", {
						className: "scroll-scrub__chapter-pin",
						children: /* @__PURE__ */ jsxs("div", {
							className: "scroll-scrub__copy",
							children: [
								scene.kicker ? /* @__PURE__ */ jsx("p", {
									className: "u-sticker bg-[#f2c230] text-[#101b33] inline-block mb-6 shadow-[4px_4px_0_0_rgba(16,27,51,1)]",
									children: scene.kicker
								}) : null,
								/* @__PURE__ */ jsx(Heading, {
									className: "u-fun-heading text-5xl md:text-7xl mb-6 !text-[#f2c230] drop-shadow-md",
									children: /* @__PURE__ */ jsx(TypeSequence, { text: scene.title })
								}),
								/* @__PURE__ */ jsx(ScrollHighlight, {
									text: scene.body,
									className: "text-xl md:text-2xl leading-relaxed mb-8 text-white/90 font-medium max-w-[36ch]",
									dimColor: "rgba(255, 255, 255, 0.2)",
									highlightColor: "rgba(255, 255, 255, 0.9)"
								}),
								scene.tags?.length ? /* @__PURE__ */ jsx("ul", {
									className: "flex gap-3 mb-8 flex-wrap",
									children: scene.tags.map((tag) => /* @__PURE__ */ jsx("li", {
										className: "u-sticker text-sm bg-white text-[#101b33] shadow-[3px_3px_0_0_rgba(242,194,48,1)]",
										children: tag
									}, tag))
								}) : null,
								scene.actions ? /* @__PURE__ */ jsx("div", {
									className: "scroll-scrub__actions mt-8",
									children: scene.actions
								}) : null
							]
						})
					})
				}, segment.key);
			})
		})]
	});
}
//#endregion
//#region src/components/umberlla/ctas.tsx
/** Chapter link: the yellow rule draws across, the arrow slides. */
function OpenTheStory() {
	return /* @__PURE__ */ jsxs("a", {
		href: "#collections",
		className: "u-btn-primary inline-flex items-center gap-2 group",
		children: ["Open the story", /* @__PURE__ */ jsx("span", {
			"aria-hidden": "true",
			className: "transition-transform group-hover:translate-x-1",
			children: "→"
		})]
	});
}
//#endregion
//#region src/scroll-scrub-scenes.ts
/** Brand tokens for the journey layer (locked in app/design-brief.md). */
var scrollScrubTheme = {
	accent: "#f2c230",
	background: "#101b33",
	ink: "#f3efe4",
	muted: "#9aa7bf"
};
//#endregion
//#region src/components/umberlla/journey-scenes.tsx
var journeyScenes = [
	{
		body: "For 135 years Sun Umbrella has stood between India and the sky. Built to be already in your hand when the monsoon turns, and to open before you are wet.",
		clip: "/assets/world/scene-01.mp4",
		id: "scene-01",
		label: "Since 1889",
		mobileClip: "/assets/world/scene-01-mobile.mp4",
		mobilePoster: "/assets/world/scene-01-mobile-poster.png",
		poster: "/assets/world/scene-01-poster.png",
		scroll: 1.6,
		tags: ["Est. 1889", "135 years of shelter"],
		title: "Monsoon never\nlooked this good"
	},
	{
		body: "One touch lifts the ribs in a single push. Auto open-and-close, UV-protective, windproof — it opens with your thumb while your other hand keeps the bag, the phone, the child.",
		clip: "/assets/world/scene-02.mp4",
		id: "scene-02",
		label: "The mechanism",
		mobileClip: "/assets/world/scene-02-mobile.mp4",
		mobilePoster: "/assets/world/scene-02-mobile-poster.png",
		poster: "/assets/world/scene-02-poster.png",
		scroll: 1.6,
		tags: ["Auto open & close", "One-hand release"],
		title: "One hand,\none second"
	},
	{
		body: "Rain leaves the canopy instead of soaking in, the frame springs back after a gust, and the sun never gets through. You arrive looking like the weather stayed outside.",
		clip: "/assets/world/scene-03.mp4",
		id: "scene-03",
		label: "All weather",
		mobileClip: "/assets/world/scene-03-mobile.mp4",
		mobilePoster: "/assets/world/scene-03-mobile-poster.png",
		poster: "/assets/world/scene-03-poster.png",
		scroll: 1.6,
		tags: ["Designed for style", "Built for all weather"],
		title: "Designed for style"
	}
].map((scene, index) => index === 0 ? {
	...scene,
	actions: /* @__PURE__ */ jsx(OpenTheStory, {})
} : scene);
//#endregion
//#region src/components/liquid-grid.tsx
function parseColor$2(color) {
	const s = String(color || "").trim();
	const m = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
	if (m) return [
		+m[1],
		+m[2],
		+m[3]
	];
	const h = s.replace("#", "");
	const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
	const n = parseInt(f, 16) || 0;
	return [
		n >> 16 & 255,
		n >> 8 & 255,
		n & 255
	];
}
function clamp(n, min, max, fallback) {
	const v = typeof n === "number" ? n : parseFloat(n);
	if (!Number.isFinite(v)) return fallback;
	return Math.min(max, Math.max(min, v));
}
var DEFAULTS = {
	mode: "dots",
	background: "#000000",
	lineColor: "#FFFFFF4D",
	glowColor: "#FFFFFF",
	cellSize: 16,
	lineWidth: 1,
	radius: 58,
	intensity: 100,
	collide: true,
	clickRipple: true
};
var DAMPING = .97;
var WAVE_HEIGHT = 14;
var STEP = 8;
var MAX_CELLS = 150;
var PAD = 20;
var WAVE_C = Math.SQRT1_2;
var MUR_K = (WAVE_C - 1) / (WAVE_C + 1);
var ABSORB_MAX = .6;
function settingsFor(p) {
	const weight = clamp(p?.lineWidth, 1, 10, DEFAULTS.lineWidth);
	return {
		mode: p?.mode === "dots" ? "dots" : "lines",
		background: p?.background ?? DEFAULTS.background,
		lineColor: p?.lineColor ?? DEFAULTS.lineColor,
		glowColor: p?.glowColor ?? DEFAULTS.glowColor,
		cellSize: clamp(p?.cellSize, 8, 120, DEFAULTS.cellSize),
		lineWidth: weight / 2,
		dotRadius: weight,
		radius: clamp(p?.radius, 20, 600, DEFAULTS.radius),
		hoverStrength: clamp(p?.intensity, 0, 100, DEFAULTS.intensity) / 100 * .6,
		collide: p?.collide ?? DEFAULTS.collide,
		click: p?.clickRipple ?? DEFAULTS.clickRipple
	};
}
function __OriginkitBase_LiquidGrid(props) {
	const canvasRef = useRef(null);
	const propsRef = useRef(props);
	propsRef.current = props;
	const repaintRef = useRef(null);
	const propKey = JSON.stringify(Object.keys(DEFAULTS).map((k) => props?.[k]));
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const rip = {
			cur: /* @__PURE__ */ new Float32Array(0),
			prev: /* @__PURE__ */ new Float32Array(0),
			W: 0,
			H: 0,
			rW: 0,
			rH: 0,
			gW: 0,
			gH: 0,
			live: false
		};
		function resize() {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const W = Math.max(1, canvas.clientWidth);
			const H = Math.max(1, canvas.clientHeight);
			const pw = Math.round(W * dpr);
			const ph = Math.round(H * dpr);
			if (canvas.width !== pw || canvas.height !== ph) {
				canvas.width = pw;
				canvas.height = ph;
			}
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			if (rip.W === W && rip.H === H) return;
			rip.W = W;
			rip.H = H;
			const scale = Math.min(1 / 3, MAX_CELLS / Math.max(W, H));
			rip.rW = Math.max(4, Math.floor(W * scale));
			rip.rH = Math.max(4, Math.floor(H * scale));
			rip.gW = rip.rW + PAD * 2;
			rip.gH = rip.rH + PAD * 2;
			rip.cur = new Float32Array(rip.gW * rip.gH);
			rip.prev = new Float32Array(rip.gW * rip.gH);
			rip.live = true;
		}
		resize();
		const ro = new ResizeObserver(() => resize());
		ro.observe(canvas);
		function addDrop(cx, cy, radius, strength, collide) {
			const { W, H, rW, rH, gW, gH, cur } = rip;
			if (!W || !gW) return;
			const gx = cx / W * rW + PAD;
			const gy = cy / H * rH + PAD;
			const gr = Math.max(1, radius * (rW / W));
			const loX = collide ? 21 : 1;
			const loY = collide ? 21 : 1;
			const hiX = collide ? PAD + rW - 2 : gW - 2;
			const hiY = collide ? PAD + rH - 2 : gH - 2;
			for (let y = Math.max(loY, Math.floor(gy - gr)); y <= Math.min(hiY, Math.ceil(gy + gr)); y++) for (let x = Math.max(loX, Math.floor(gx - gr)); x <= Math.min(hiX, Math.ceil(gx + gr)); x++) {
				const d = Math.sqrt((x - gx) ** 2 + (y - gy) ** 2);
				if (d < gr) cur[y * gW + x] += (1 - d / gr) ** 2 * strength;
			}
			rip.live = true;
		}
		function openEdges() {
			const { gW, gH, cur, prev } = rip;
			const last = gH - 1;
			const right = gW - 1;
			for (let x = 0; x < gW; x++) {
				const t = x;
				const b = last * gW + x;
				cur[t] = prev[gW + x] + MUR_K * (cur[gW + x] - prev[t]);
				cur[b] = prev[(last - 1) * gW + x] + MUR_K * (cur[(last - 1) * gW + x] - prev[b]);
			}
			for (let y = 0; y < gH; y++) {
				const l = y * gW;
				const r = l + right;
				cur[l] = prev[l + 1] + MUR_K * (cur[l + 1] - prev[l]);
				cur[r] = prev[r - 1] + MUR_K * (cur[r - 1] - prev[r]);
			}
			for (let y = 0; y < gH; y++) {
				const dy = Math.min(y, last - y);
				for (let x = 0; x < gW; x++) {
					const d = Math.min(dy, x, right - x);
					if (d >= PAD) {
						if (right - PAD <= x) break;
						x = right - PAD;
						continue;
					}
					const t = 1 - d / PAD;
					const f = 1 - ABSORB_MAX * t * t;
					const i = y * gW + x;
					cur[i] *= f;
					prev[i] *= f;
				}
			}
		}
		let lastCollide = null;
		function updateRipple(collide) {
			const { gW, gH, rW, rH, cur, prev } = rip;
			if (lastCollide !== null && lastCollide !== collide) {
				cur.fill(0);
				prev.fill(0);
				lastCollide = collide;
				rip.live = false;
				return;
			}
			lastCollide = collide;
			const x0 = collide ? 21 : 1;
			const y0 = collide ? 21 : 1;
			const x1 = collide ? PAD + rW - 1 : gW - 1;
			const y1 = collide ? PAD + rH - 1 : gH - 1;
			let energy = 0;
			let n = 0;
			for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
				const i = y * gW + x;
				const v = ((cur[(y - 1) * gW + x] + cur[(y + 1) * gW + x] + cur[y * gW + x - 1] + cur[y * gW + x + 1]) * .5 - prev[i]) * DAMPING;
				prev[i] = v;
				energy += v * v;
				n++;
			}
			rip.cur = prev;
			rip.prev = cur;
			if (!collide) openEdges();
			if (energy < n * 2e-6) {
				rip.live = false;
				rip.cur.fill(0);
				rip.prev.fill(0);
			}
		}
		function sample(cx, cy) {
			const { W, rW, gW, gH, cur } = rip;
			if (!rW || !W) return 0;
			const gx = cx / W * rW + PAD;
			const gy = cy / rip.H * rip.rH + PAD;
			const ix = Math.floor(gx);
			const iy = Math.floor(gy);
			if (ix < 0 || ix >= gW - 1 || iy < 0 || iy >= gH - 1) return 0;
			const fx = gx - ix;
			const fy = gy - iy;
			return cur[iy * gW + ix] * (1 - fx) * (1 - fy) + cur[iy * gW + ix + 1] * fx * (1 - fy) + cur[(iy + 1) * gW + ix] * (1 - fx) * fy + cur[(iy + 1) * gW + ix + 1] * fx * fy;
		}
		let px = /* @__PURE__ */ new Float32Array(0);
		let py = /* @__PURE__ */ new Float32Array(0);
		let pk = /* @__PURE__ */ new Float32Array(0);
		function fitScratch(n) {
			if (px.length >= n) return;
			px = new Float32Array(n);
			py = new Float32Array(n);
			pk = new Float32Array(n);
		}
		const BUCKETS = 4;
		const GLOW_FULL = 4;
		const TAU = Math.PI * 2;
		function drawFrame(S) {
			const { W, H } = rip;
			if (!W || !H) return;
			ctx.clearRect(0, 0, W, H);
			if (S.background && S.background !== "rgba(0,0,0,0)") {
				ctx.fillStyle = S.background;
				ctx.fillRect(0, 0, W, H);
			}
			const cs = S.cellSize;
			const base = new Path2D();
			const glow = [];
			for (let b = 0; b < BUCKETS; b++) glow.push(new Path2D());
			const [gr, gg, gb] = parseColor$2(S.glowColor);
			if (S.mode === "dots") {
				const numH = Math.ceil(H / cs);
				const offY = (H - numH * cs) / 2;
				const numV = Math.ceil(W / cs);
				const offX = (W - numV * cs) / 2;
				const rad = S.dotRadius;
				for (let iy = 0; iy <= numH; iy++) {
					const baseY = offY + iy * cs;
					for (let ix = 0; ix <= numV; ix++) {
						const cx = offX + ix * cs;
						const d = sample(cx, baseY) * WAVE_HEIGHT;
						const cy = baseY + d;
						base.moveTo(cx + rad, cy);
						base.arc(cx, cy, rad, 0, TAU);
						const k = Math.min(1, Math.abs(d) / GLOW_FULL);
						if (k < .06) continue;
						const bi = Math.min(BUCKETS - 1, Math.floor(k * BUCKETS));
						const lit = rad * (1 + k * .6);
						glow[bi].moveTo(cx + lit, cy);
						glow[bi].arc(cx, cy, lit, 0, TAU);
					}
				}
				ctx.fillStyle = S.lineColor;
				ctx.fill(base);
				for (let i = 0; i < BUCKETS; i++) {
					const t = (i + 1) / BUCKETS;
					ctx.fillStyle = t >= 1 ? `rgb(${gr},${gg},${gb})` : `rgba(${gr},${gg},${gb},${t.toFixed(2)})`;
					ctx.fill(glow[i]);
				}
				return;
			}
			fitScratch(Math.floor(Math.max(W, H) / STEP) + 2);
			function emit(n) {
				base.moveTo(px[0], py[0]);
				for (let i = 1; i < n; i++) base.lineTo(px[i], py[i]);
				for (let i = 1; i < n; i++) {
					const k = pk[i] > pk[i - 1] ? pk[i] : pk[i - 1];
					if (k < .06) continue;
					const b = Math.min(BUCKETS - 1, Math.floor(k * BUCKETS));
					glow[b].moveTo(px[i - 1], py[i - 1]);
					glow[b].lineTo(px[i], py[i]);
				}
			}
			const numH = Math.ceil(H / cs);
			const offY = (H - numH * cs) / 2;
			for (let li = 0; li <= numH; li++) {
				const baseY = offY + li * cs;
				let n = 0;
				for (let x = 0; x <= W; x += STEP) {
					const cx = x > W ? W : x;
					const d = sample(cx, baseY) * WAVE_HEIGHT;
					px[n] = cx;
					py[n] = baseY + d;
					pk[n] = Math.min(1, Math.abs(d) / GLOW_FULL);
					n++;
				}
				emit(n);
			}
			const numV = Math.ceil(W / cs);
			const offX = (W - numV * cs) / 2;
			for (let li = 0; li <= numV; li++) {
				const baseX = offX + li * cs;
				let n = 0;
				for (let y = 0; y <= H; y += STEP) {
					const cy = y > H ? H : y;
					const d = sample(baseX, cy) * WAVE_HEIGHT;
					px[n] = baseX + d;
					py[n] = cy;
					pk[n] = Math.min(1, Math.abs(d) / GLOW_FULL);
					n++;
				}
				emit(n);
			}
			ctx.lineWidth = S.lineWidth;
			ctx.strokeStyle = S.lineColor;
			ctx.stroke(base);
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			for (let i = 0; i < BUCKETS; i++) {
				const t = (i + 1) / BUCKETS;
				ctx.strokeStyle = t >= 1 ? `rgb(${gr},${gg},${gb})` : `rgba(${gr},${gg},${gb},${t.toFixed(2)})`;
				ctx.lineWidth = S.lineWidth * (1 + t * .9);
				ctx.stroke(glow[i]);
			}
			ctx.lineCap = "butt";
			ctx.lineJoin = "miter";
		}
		const paint = () => {
			resize();
			drawFrame(settingsFor(propsRef.current));
		};
		repaintRef.current = paint;
		let rect = canvas.getBoundingClientRect();
		function toLocal(clientX, clientY) {
			if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return null;
			return {
				x: clientX - rect.left,
				y: clientY - rect.top
			};
		}
		let queued = null;
		function onMove(e) {
			queued = toLocal(e.clientX, e.clientY);
		}
		function onClick(e) {
			const S = settingsFor(propsRef.current);
			if (!S.click) return;
			const local = toLocal(e.clientX, e.clientY);
			if (local) addDrop(local.x, local.y, S.radius * 1.6, 2.5, S.collide);
		}
		window.addEventListener("mousemove", onMove, { passive: true });
		window.addEventListener("click", onClick);
		let raf = 0;
		function loop() {
			rect = canvas.getBoundingClientRect();
			const S = settingsFor(propsRef.current);
			const { W, H } = rip;
			if (W > 0 && H > 0) {
				if (queued) {
					addDrop(queued.x, queued.y, S.radius, S.hoverStrength, S.collide);
					queued = null;
				}
				if (rip.live) {
					updateRipple(S.collide);
					drawFrame(S);
				}
			}
			raf = requestAnimationFrame(loop);
		}
		drawFrame(settingsFor(propsRef.current));
		raf = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(raf);
			repaintRef.current = null;
			ro.disconnect();
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("click", onClick);
		};
	}, []);
	useEffect(() => {
		repaintRef.current?.();
	}, [propKey]);
	return /* @__PURE__ */ jsx("canvas", {
		ref: canvasRef,
		style: {
			display: "block",
			width: "100%",
			height: "100%",
			pointerEvents: "none",
			...props.style || {}
		}
	});
}
var __originkitPresetProps$3 = {
	"background": "#F3EFE4",
	"glowColor": "#0B1324"
};
function LiquidGrid(props) {
	return /* @__PURE__ */ jsx(__OriginkitBase_LiquidGrid, {
		...__originkitPresetProps$3,
		...props
	});
}
//#endregion
//#region src/components/dotted-bg-2.tsx
var INTRINSIC_WIDTH = 600;
var INTRINSIC_HEIGHT = 600;
var perlinVertexShader = `#version 300 es
in vec2 uv;
in vec2 position;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0., 1.);
}`;
var perlinFragmentShader = `#version 300 es
precision mediump float;
uniform float uFrequency;
uniform float uTime;
uniform float uSpeed;
uniform float uValue;
uniform vec2 uResolution;
in vec2 vUv;
out vec4 fragColor;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  uv = (uv - 0.5) * vec2(aspect, 1.0) + 0.5;
  float hue = abs(snoise(vec3(uv * uFrequency, uTime * uSpeed)));
  vec3 rainbowColor = hsv2rgb(vec3(hue, 1.0, uValue));
  fragColor = vec4(rainbowColor, 1.0);
}`;
var dotVertexShader = `#version 300 es
in vec2 uv;
in vec2 position;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0., 1.);
}`;
var dotFragmentShader = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform int uPaletteCount;
uniform vec3 uPalette[10];
uniform float uPaletteAlpha[10];
uniform float uCellSize;
uniform float uGamma;
uniform float uPaletteBias;
out vec4 fragColor;

void main() {
  vec2 pix = gl_FragCoord.xy;
  float cell = max(uCellSize, 1.0);

  vec2 cellIdx = floor(pix / cell);
  vec2 cellCenter = (cellIdx + 0.5) * cell;
  vec3 col = texture(uTexture, cellCenter / uResolution.xy).rgb;
  float gray = 0.3 * col.r + 0.59 * col.g + 0.11 * col.b;
  gray = pow(clamp(gray, 0.0001, 1.0), uGamma);

  vec2 cellUV = fract(pix / cell) - 0.5;
  float dist = length(cellUV);
  float radius = clamp(gray + uPaletteBias, 0.0, 1.0) * 0.5;
  float aa = fwidth(dist) + 1e-4;
  float mark = 1.0 - smoothstep(radius - aa, radius + aa, dist);

  float g2 = clamp(gray + uPaletteBias, 0.0, 1.0);
  int cnt = max(uPaletteCount, 1);
  vec3 dotCol;
  float dotOpacity;
  if (cnt <= 1) {
    dotCol = uPalette[0];
    dotOpacity = uPaletteAlpha[0];
  } else {
    float scaled = g2 * float(cnt - 1);
    int seg = int(floor(scaled));
    seg = clamp(seg, 0, cnt - 2);
    float f = clamp(scaled - float(seg), 0.0, 1.0);
    dotCol = mix(uPalette[seg], uPalette[seg + 1], f);
    dotOpacity = mix(uPaletteAlpha[seg], uPaletteAlpha[seg + 1], f);
  }
  fragColor = vec4(dotCol, mark * dotOpacity);
}`;
var cssVariableRegex = /var\s*\(\s*(--[\w-]+)(?:\s*,\s*((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*))?\s*\)/;
function extractDefaultValue(cssVar) {
	if (!cssVar || !cssVar.startsWith("var(")) return cssVar;
	const match = cssVariableRegex.exec(cssVar);
	if (!match) return cssVar;
	const fallback = (match[2] || "").trim();
	if (fallback.startsWith("var(")) return extractDefaultValue(fallback);
	return fallback || cssVar;
}
function resolveTokenColor(input) {
	if (typeof input !== "string") return input;
	if (!input.startsWith("var(")) return input;
	return extractDefaultValue(input);
}
function parseColorToRgba(input) {
	if (!input) return {
		r: 0,
		g: 0,
		b: 0,
		a: 1
	};
	const str = input.trim();
	const rgbaMatch = str.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i);
	if (rgbaMatch) return {
		r: Math.max(0, Math.min(255, parseFloat(rgbaMatch[1]))) / 255,
		g: Math.max(0, Math.min(255, parseFloat(rgbaMatch[2]))) / 255,
		b: Math.max(0, Math.min(255, parseFloat(rgbaMatch[3]))) / 255,
		a: rgbaMatch[4] !== void 0 ? Math.max(0, Math.min(1, parseFloat(rgbaMatch[4]))) : 1
	};
	const hex = str.replace(/^#/, "");
	if (hex.length === 8) return {
		r: parseInt(hex.slice(0, 2), 16) / 255,
		g: parseInt(hex.slice(2, 4), 16) / 255,
		b: parseInt(hex.slice(4, 6), 16) / 255,
		a: parseInt(hex.slice(6, 8), 16) / 255
	};
	if (hex.length === 6) return {
		r: parseInt(hex.slice(0, 2), 16) / 255,
		g: parseInt(hex.slice(2, 4), 16) / 255,
		b: parseInt(hex.slice(4, 6), 16) / 255,
		a: 1
	};
	if (hex.length === 4) return {
		r: parseInt(hex[0] + hex[0], 16) / 255,
		g: parseInt(hex[1] + hex[1], 16) / 255,
		b: parseInt(hex[2] + hex[2], 16) / 255,
		a: parseInt(hex[3] + hex[3], 16) / 255
	};
	if (hex.length === 3) return {
		r: parseInt(hex[0] + hex[0], 16) / 255,
		g: parseInt(hex[1] + hex[1], 16) / 255,
		b: parseInt(hex[2] + hex[2], 16) / 255,
		a: 1
	};
	return {
		r: 0,
		g: 0,
		b: 0,
		a: 1
	};
}
function colorStringToVec4(input) {
	const { r, g, b, a } = parseColorToRgba(resolveTokenColor(input));
	return [
		r,
		g,
		b,
		a
	];
}
function mapLinear(value, inMin, inMax, outMin, outMax) {
	if (inMax === inMin) return outMin;
	return outMin + (value - inMin) / (inMax - inMin) * (outMax - outMin);
}
function mapFrequencyUiToShader(ui) {
	return mapLinear(ui, 1, 10, .3, 6);
}
function mapSpeedUiToShader(ui) {
	return ui * .05;
}
function mapCellSizeUiToShader(ui) {
	return mapLinear(ui, 1, 100, 6, 60);
}
function mapGammaUiToShader(ui) {
	return mapLinear(ui, 1, 20, .5, 8);
}
function mapPaletteBiasUiToShader(ui) {
	return ui * .05;
}
var MAX_COLORS = 10;
var DEFAULT_COLORS = ["#FFFFFF"];
function buildPaletteUniforms(colorList) {
	const rgb = [];
	const alpha = [];
	for (let i = 0; i < MAX_COLORS; i++) {
		const src = colorList[i];
		if (src != null) {
			const [r, g, b, a] = colorStringToVec4(src);
			rgb.push([
				r,
				g,
				b
			]);
			alpha.push(a);
		} else {
			rgb.push([
				0,
				0,
				0
			]);
			alpha.push(0);
		}
	}
	return {
		rgb,
		alpha
	};
}
function DottedBg2({ frequency = 1, speed = 4, bgColor = "#F2C230", colors, cellSize = 34, gamma = 6, paletteBias = -3, style }) {
	const paletteColors = Array.isArray(colors) && colors.length > 0 ? colors : DEFAULT_COLORS;
	const effPaletteCount = Math.min(MAX_COLORS, Math.max(1, paletteColors.length));
	const palette = buildPaletteUniforms(paletteColors);
	const paletteKey = paletteColors.slice(0, MAX_COLORS).join("|");
	const effectivePlay = true;
	const containerRef = useRef(null);
	const perlinProgramRef = useRef(null);
	const dotProgramRef = useRef(null);
	const rendererRef = useRef(null);
	const cameraRef = useRef(null);
	const perlinMeshRef = useRef(null);
	const dotMeshRef = useRef(null);
	const renderTargetRef = useRef(null);
	const glRef = useRef(null);
	const rafIdRef = useRef(null);
	const lastTimeRef = useRef(0);
	const isPlayingRef = useRef(effectivePlay);
	const renderOnce = () => {
		const renderer = rendererRef.current;
		const camera = cameraRef.current;
		const perlinMesh = perlinMeshRef.current;
		const dotMesh = dotMeshRef.current;
		const renderTarget = renderTargetRef.current;
		const gl = glRef.current;
		const dotProgram = dotProgramRef.current;
		if (!renderer || !camera || !perlinMesh || !dotMesh || !renderTarget || !gl || !dotProgram) return;
		renderer.render({
			scene: perlinMesh,
			camera,
			target: renderTarget
		});
		dotProgram.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
		renderer.render({
			scene: dotMesh,
			camera
		});
	};
	useEffect(() => {
		let resizeHandler = null;
		let resizeObserver = null;
		const container = containerRef.current;
		if (!container) return;
		const renderer = new Renderer({
			dpr: Math.min(window.devicePixelRatio || 1, 2),
			alpha: true,
			premultipliedAlpha: false
		});
		const gl = renderer.gl;
		container.appendChild(gl.canvas);
		rendererRef.current = renderer;
		glRef.current = gl;
		const camera = new Camera(gl, {
			near: .1,
			far: 100
		});
		camera.position.set(0, 0, 3);
		cameraRef.current = camera;
		const doResize = () => {
			const width = container.clientWidth || window.innerWidth;
			const height = container.clientHeight || window.innerHeight;
			renderer.setSize(width, height);
			camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
			if (renderTargetRef.current && renderTargetRef.current.setSize) renderTargetRef.current.setSize(gl.canvas.width, gl.canvas.height);
			if (perlinProgramRef.current) perlinProgramRef.current.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
		};
		let resizePending = false;
		const scheduleResize = () => {
			if (resizePending) return;
			resizePending = true;
			requestAnimationFrame(() => {
				resizePending = false;
				doResize();
				if (!isPlayingRef.current) renderOnce();
			});
		};
		resizeHandler = scheduleResize;
		window.addEventListener("resize", scheduleResize);
		if (typeof window.ResizeObserver !== "undefined") {
			resizeObserver = new window.ResizeObserver(scheduleResize);
			resizeObserver.observe(container);
		}
		scheduleResize();
		const perlinProgram = new Program(gl, {
			vertex: perlinVertexShader,
			fragment: perlinFragmentShader,
			uniforms: {
				uTime: { value: 0 },
				uFrequency: { value: mapFrequencyUiToShader(frequency) },
				uSpeed: { value: mapSpeedUiToShader(speed) },
				uValue: { value: 1 },
				uResolution: { value: [gl.canvas.width, gl.canvas.height] }
			}
		});
		perlinProgramRef.current = perlinProgram;
		const perlinMesh = new Mesh(gl, {
			geometry: new Plane(gl, {
				width: 2,
				height: 2
			}),
			program: perlinProgram
		});
		perlinMeshRef.current = perlinMesh;
		const renderTarget = new RenderTarget(gl);
		renderTargetRef.current = renderTarget;
		const dotProgram = new Program(gl, {
			vertex: dotVertexShader,
			fragment: dotFragmentShader,
			uniforms: {
				uResolution: { value: [gl.canvas.width, gl.canvas.height] },
				uTexture: { value: renderTarget.texture },
				uPaletteCount: { value: effPaletteCount },
				uPalette: { value: palette.rgb },
				uPaletteAlpha: { value: palette.alpha },
				uCellSize: { value: mapCellSizeUiToShader(cellSize) },
				uGamma: { value: mapGammaUiToShader(gamma) },
				uPaletteBias: { value: mapPaletteBiasUiToShader(paletteBias) }
			}
		});
		dotProgramRef.current = dotProgram;
		const dotMesh = new Mesh(gl, {
			geometry: new Plane(gl, {
				width: 2,
				height: 2
			}),
			program: dotProgram
		});
		dotMeshRef.current = dotMesh;
		const frameInterval = 1e3 / 30;
		const update = (time) => {
			if (!isPlayingRef.current) {
				rafIdRef.current = null;
				return;
			}
			if (time - lastTimeRef.current < frameInterval) {
				rafIdRef.current = requestAnimationFrame(update);
				return;
			}
			lastTimeRef.current = time;
			perlinProgram.uniforms.uTime.value = time * .001;
			renderer.render({
				scene: perlinMesh,
				camera,
				target: renderTarget
			});
			dotProgram.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
			perlinProgram.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
			renderer.render({
				scene: dotMesh,
				camera
			});
			rafIdRef.current = requestAnimationFrame(update);
		};
		renderOnce();
		isPlayingRef.current = effectivePlay;
		if (rafIdRef.current == null) {
			lastTimeRef.current = 0;
			rafIdRef.current = requestAnimationFrame(update);
		}
		return () => {
			if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
			if (resizeHandler) window.removeEventListener("resize", resizeHandler);
			if (resizeObserver) {
				try {
					resizeObserver.disconnect();
				} catch {}
				resizeObserver = null;
			}
			if (gl && gl.canvas && gl.canvas.parentElement === container) container.removeChild(gl.canvas);
			perlinProgramRef.current = null;
			dotProgramRef.current = null;
			rendererRef.current = null;
			cameraRef.current = null;
			perlinMeshRef.current = null;
			dotMeshRef.current = null;
			renderTargetRef.current = null;
			glRef.current = null;
			rafIdRef.current = null;
		};
	}, []);
	useEffect(() => {
		const perlin = perlinProgramRef.current;
		if (perlin) {
			perlin.uniforms.uFrequency.value = mapFrequencyUiToShader(frequency);
			perlin.uniforms.uSpeed.value = mapSpeedUiToShader(speed);
		}
		const dot = dotProgramRef.current;
		if (dot) {
			dot.uniforms.uPaletteCount.value = effPaletteCount;
			dot.uniforms.uPalette.value = palette.rgb;
			dot.uniforms.uPaletteAlpha.value = palette.alpha;
			dot.uniforms.uCellSize.value = mapCellSizeUiToShader(cellSize);
			dot.uniforms.uGamma.value = mapGammaUiToShader(gamma);
			dot.uniforms.uPaletteBias.value = mapPaletteBiasUiToShader(paletteBias);
		}
		if (rendererRef.current && glRef.current) {
			const gl = glRef.current;
			if (perlin) perlin.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
			if (dot) dot.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
		}
		if (!isPlayingRef.current) renderOnce();
	}, [
		effectivePlay,
		frequency,
		speed,
		effPaletteCount,
		bgColor,
		paletteKey,
		cellSize,
		gamma,
		paletteBias
	]);
	useEffect(() => {
		isPlayingRef.current = effectivePlay;
		if (!rendererRef.current) return;
		if (rafIdRef.current == null) {
			lastTimeRef.current = 0;
			rafIdRef.current = requestAnimationFrame(function update(time) {
				const perlin = perlinProgramRef.current;
				const dot = dotProgramRef.current;
				const renderer = rendererRef.current;
				const camera = cameraRef.current;
				const perlinMesh = perlinMeshRef.current;
				const dotMesh = dotMeshRef.current;
				const renderTarget = renderTargetRef.current;
				const gl = glRef.current;
				if (!isPlayingRef.current || !perlin || !dot || !renderer || !camera || !perlinMesh || !dotMesh || !renderTarget || !gl) {
					rafIdRef.current = null;
					return;
				}
				if (time - lastTimeRef.current < 1e3 / 30) {
					rafIdRef.current = requestAnimationFrame(update);
					return;
				}
				lastTimeRef.current = time;
				perlin.uniforms.uTime.value = time * .001;
				renderer.render({
					scene: perlinMesh,
					camera,
					target: renderTarget
				});
				dot.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
				renderer.render({
					scene: dotMesh,
					camera
				});
				rafIdRef.current = requestAnimationFrame(update);
			});
		}
	}, [effectivePlay]);
	return /* @__PURE__ */ jsxs("div", {
		style: {
			position: "relative",
			width: "100%",
			height: "100%",
			background: bgColor,
			lineHeight: 0,
			minWidth: 0,
			minHeight: 0,
			overflow: "hidden",
			...style
		},
		children: [/* @__PURE__ */ jsx("div", { style: {
			width: `${INTRINSIC_WIDTH}px`,
			height: `${INTRINSIC_HEIGHT}px`,
			minWidth: `${INTRINSIC_WIDTH}px`,
			minHeight: `${INTRINSIC_HEIGHT}px`,
			visibility: "hidden",
			position: "absolute",
			pointerEvents: "none"
		} }), /* @__PURE__ */ jsx("div", {
			ref: containerRef,
			style: {
				position: "absolute",
				inset: 0
			}
		})]
	});
}
//#endregion
//#region src/components/ui/testimonials-columns-1.tsx
var TestimonialsColumn = (props) => {
	return /* @__PURE__ */ jsx("div", {
		className: props.className,
		children: /* @__PURE__ */ jsx(motion$1.div, {
			animate: { translateY: "-50%" },
			transition: {
				duration: props.duration || 10,
				repeat: Infinity,
				ease: "linear",
				repeatType: "loop"
			},
			className: "flex flex-col gap-6 pb-6",
			children: [...new Array(2).fill(0).map((_, index) => /* @__PURE__ */ jsx(React.Fragment, { children: props.testimonials.map(({ text, image, name, role }, i) => /* @__PURE__ */ jsxs("div", {
				className: "w-full max-w-xs rounded-3xl border border-neutral-200 bg-white p-10 text-neutral-800 shadow-xl shadow-black/5",
				children: [/* @__PURE__ */ jsx("div", { children: text }), /* @__PURE__ */ jsxs("div", {
					className: "mt-5 flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("img", {
						width: 40,
						height: 40,
						src: image,
						alt: name,
						loading: "lazy",
						className: "h-10 w-10 rounded-full object-cover"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ jsx("div", {
							className: "font-medium leading-5 tracking-tight text-neutral-900",
							children: name
						}), /* @__PURE__ */ jsx("div", {
							className: "leading-5 tracking-tight opacity-60",
							children: role
						})]
					})]
				})]
			}, i)) }, index))]
		})
	});
};
//#endregion
//#region src/lib/reveal.tsx
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
function Reveal({ children, className, as, stagger = false, y = 28 }) {
	const ref = useRef(null);
	const Tag = as ?? "div";
	useLayoutEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const targets = stagger ? gsap.utils.toArray(el.children) : [el];
		gsap.set(targets, {
			opacity: 0,
			y
		});
		const io = new IntersectionObserver((entries) => {
			if (!entries[0].isIntersecting) return;
			gsap.to(targets, {
				opacity: 1,
				y: 0,
				duration: .9,
				ease: "power3.out",
				stagger: stagger ? .1 : 0
			});
			io.disconnect();
		}, {
			threshold: .15,
			rootMargin: "0px 0px -8% 0px"
		});
		io.observe(el);
		return () => {
			io.disconnect();
			gsap.set(targets, { clearProps: "opacity,transform" });
		};
	}, [stagger, y]);
	return /* @__PURE__ */ jsx(Tag, {
		ref,
		className,
		children
	});
}
//#endregion
//#region src/components/elemental-water.tsx
var MAX_DPR$1 = 2;
var D_RANGE = 256 / 512;
var SIM_RES = 512;
var MASK_SIZE = 512;
var VERT_SRC$1 = `#version 300 es
out vec2 vUv;
void main(){
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;
var FRAG_SRC$1 = `#version 300 es
` + `
precision highp float;
uniform sampler2D uSDF;
uniform float uTime;
uniform float uAspect;
uniform vec2  uScale;
uniform vec2  uShift;
uniform vec3  uBg, uBase, uAccent;
in vec2 vUv;
out vec4 frag;

float hash21(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i), b = hash21(i + vec2(1,0));
  float c = hash21(i + vec2(0,1)), d = hash21(i + vec2(1,1));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++){ v += a * vnoise(p); p = r * p * 2.03; a *= 0.5; }
  return v;
}
/* signed distance in mask-uv units; extended analytically past the texture
   border so out-of-range samples keep growing instead of clamping (kills
   the rectangular clamp artifacts) */
float sdf(vec2 uv){
  vec2 m = 0.5 + (uv - 0.5 - uShift) * uScale;
  vec2 mc = clamp(m, 0.0, 1.0);
  float d = (texture(uSDF, vec2(mc.x, 1.0 - mc.y)).r - 0.5) * ${D_RANGE.toFixed(4)};
  return d + length(m - mc);
}
// The old Highlight dial, derived: one lightened step off Accent. Three colour
// controls instead of four, and nothing about the look changes.
vec3 uHigh(){ return mix(uAccent, vec3(1.0), 0.55); }
float edgeFade(vec2 uv){
  return smoothstep(0.0, 0.05, uv.x) * smoothstep(1.0, 0.95, uv.x)
       * smoothstep(0.0, 0.05, uv.y) * smoothstep(1.0, 0.95, uv.y);
}
`.replace("${D_RANGE.toFixed(4)}", D_RANGE.toFixed(4)) + `
uniform sampler2D uState;
uniform vec2 uSimTexel;
uniform float uRipple, uRefract, uGlint;
/* cover-map panel uv into the square sim so rings stay circular on screen */
vec2 simUV(vec2 uv){
  return 0.5 + (uv - 0.5) * vec2(uAspect, 1.0) / max(uAspect, 1.0);
}
void main(){
  vec2 suv = simUV(vUv);
  float h  = texture(uState, suv).r;
  float hx = texture(uState, suv + vec2(uSimTexel.x, 0.0)).r - texture(uState, suv - vec2(uSimTexel.x, 0.0)).r;
  float hy = texture(uState, suv + vec2(0.0, uSimTexel.y)).r - texture(uState, suv - vec2(0.0, uSimTexel.y)).r;
  vec2 grad = vec2(hx, hy);
  vec3 nrm = normalize(vec3(-grad * 30.0, 1.0));

  vec2 ruv = vUv + grad * 0.22 * uRefract;          // refracted lookup
  float d  = sdf(ruv);

  // deep water base
  vec3 col = mix(uBg, mix(uBg, uBase, 0.30), vUv.y * 0.8 + h * 0.25);
  col += uBase * 0.20 * fbm(vUv * vec2(uAspect, 1.0) * 3.0 + uTime * 0.05) * 0.3;

  // the mark, seen through the surface
  float logo = smoothstep(0.005, -0.005, d);
  float glow = exp(-max(d, 0.0) / 0.09) * 0.26;
  vec3 markCol = mix(uAccent, uHigh(), logo * 0.6);
  col += markCol * (logo * 0.92 + glow);

  // ripple shading: crests bright, troughs barely darker
  col += uBase * 0.85 * clamp(h * 1.8 * uRipple, -0.06, 1.0);
  col += uAccent * 0.62 * pow(clamp(h * 2.6 * uRipple, 0.0, 1.0), 2.0) * 0.5;

  // specular glint
  vec3 L = normalize(vec3(-0.35, 0.55, 0.75));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(nrm, H), 0.0), 150.0);
  col += spec * uHigh() * 0.9 * uGlint;

  col *= 0.35 + 0.65 * edgeFade(vUv);
  col += (hash21(vUv * 617.0 + uTime) - 0.5) / 128.0;
  frag = vec4(col, 1.0);
}
`;
var SIM_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uState;
uniform vec2 uTexel;
uniform vec3 uDrop; // sim-uv.xy, strength
in vec2 vUv;
out vec4 frag;
void main(){
  vec2 s = texture(uState, vUv).rg;
  float l = texture(uState, vUv - vec2(uTexel.x, 0.0)).r;
  float r = texture(uState, vUv + vec2(uTexel.x, 0.0)).r;
  float u = texture(uState, vUv + vec2(0.0, uTexel.y)).r;
  float d = texture(uState, vUv - vec2(0.0, uTexel.y)).r;
  float next = (l + r + u + d) * 0.5 - s.g;
  next *= 0.984;
  if (uDrop.z != 0.0){
    float dd = distance(vUv, uDrop.xy);
    next += uDrop.z * exp(-dd * dd * 3800.0);
  }
  frag = vec4(next, s.r, 0.0, 1.0);
}
`;
var PART_VERT = `#version 300 es
precision highp float;
layout(location=0) in vec2 aPos;    // spawn point, y-up mask uv
layout(location=1) in vec2 aNorm;   // outward contour normal
layout(location=2) in float aSeed;
uniform float uTime;
uniform vec2  uScale;
uniform vec2  uShift;
uniform float uDpr;
uniform float uWind;
uniform vec4  uCfgA;  // travel, lifeMin, lifeMax, alongNormal
uniform vec4  uCfgB;  // wiggle, sizeMin, sizeMax, sparse
out float vFade;
out float vMixC;
float h1(float n){ return fract(sin(n) * 43758.5453); }
void main(){
  float hs   = h1(aSeed * 1.31);
  float life = mix(uCfgA.y, uCfgA.z, hs);
  float tt   = uTime / life + aSeed * 13.7;
  float ph   = fract(tt);
  float cyc  = floor(tt);
  float r1 = h1(aSeed + cyc * 0.317);
  float r2 = h1(aSeed * 2.13 + cyc * 0.771);
  float on = step(uCfgB.w, r2);

  vec2 dir = normalize(mix(vec2(0.0, 1.0), aNorm, uCfgA.w) + (vec2(r1, h1(r1 * 7.0)) - 0.5) * 0.8);
  float trav = uCfgA.x * (0.45 + 0.9 * r1);
  vec2 p = aPos + aNorm * 0.004 + dir * trav * ph;
  p.x += sin(ph * 10.0 + r1 * 40.0 + uTime * 0.5) * uCfgB.x * ph;
  p.x += uWind * 0.08 * ph;

  vec2 uv = 0.5 + uShift + (p - 0.5) / uScale;
  vFade = on * smoothstep(0.0, 0.12, ph) * smoothstep(1.0, 0.5, ph) * mix(0.35, 1.0, r2);
  vMixC = h1(aSeed * 3.7 + cyc);
  gl_Position = vec4(uv * 2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = mix(uCfgB.y, uCfgB.z, h1(aSeed * 5.11 + cyc)) * uDpr * (1.0 - 0.45 * ph);
}
`;
var PART_FRAG = `#version 300 es
precision highp float;
uniform vec3 uColA;
uniform vec3 uColB;
in float vFade;
in float vMixC;
out vec4 frag;
void main(){
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(q, q);
  if (r2 > 1.0) discard;
  float a = exp(-r2 * 3.5) * (1.0 - r2);
  frag = vec4(mix(uColA, uColB, vMixC) * a * vFade, 1.0);
}
`;
function compile$1(gl, type, src, tag) {
	const sh = gl.createShader(type);
	if (!sh) return null;
	gl.shaderSource(sh, src);
	gl.compileShader(sh);
	if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
		console.error("ElementalWater " + tag + " shader:", gl.getShaderInfoLog(sh));
		gl.deleteShader(sh);
		return null;
	}
	return sh;
}
function link(gl, vs, fs, tag) {
	const v = compile$1(gl, gl.VERTEX_SHADER, vs, tag);
	const f = compile$1(gl, gl.FRAGMENT_SHADER, fs, tag);
	if (!v || !f) return null;
	const p = gl.createProgram();
	if (!p) return null;
	gl.attachShader(p, v);
	gl.attachShader(p, f);
	gl.linkProgram(p);
	if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
		console.error("ElementalWater " + tag + " link:", gl.getProgramInfoLog(p));
		return null;
	}
	return p;
}
function num$1(v, fb) {
	return typeof v === "number" && isFinite(v) ? v : fb;
}
function clampN$1(v, lo, hi) {
	return v < lo ? lo : v > hi ? hi : v;
}
function rng(seed) {
	let a = seed >>> 0;
	return function() {
		a += 1831565813;
		let t = a;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function parseColor$1(input, fb) {
	if (!input) return fb;
	const str = String(input).trim();
	if (str.charAt(0) === "#") {
		let hex = str.slice(1);
		if (hex.length === 3 || hex.length === 4) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		if (hex.length >= 6) {
			const r = parseInt(hex.slice(0, 2), 16);
			const g = parseInt(hex.slice(2, 4), 16);
			const b = parseInt(hex.slice(4, 6), 16);
			if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return [
				r / 255,
				g / 255,
				b / 255
			];
		}
		return fb;
	}
	const m = str.match(/[\d.]+/g);
	if (m && m.length >= 3) return [
		Math.min(255, parseFloat(m[0])) / 255,
		Math.min(255, parseFloat(m[1])) / 255,
		Math.min(255, parseFloat(m[2])) / 255
	];
	return fb;
}
function maskCanvas(size) {
	const c = document.createElement("canvas");
	c.width = size;
	c.height = size;
	return c;
}
function rasterizePath(pathStr, size) {
	if (typeof document === "undefined" || typeof Path2D === "undefined") return null;
	const ctx = maskCanvas(size).getContext("2d", { willReadFrequently: true });
	if (!ctx) return null;
	const box = size * .6;
	const s = box / 24;
	const off = (size - box) / 2;
	ctx.setTransform(s, 0, 0, s, off, off);
	ctx.fillStyle = "#fff";
	try {
		ctx.fill(new Path2D(pathStr));
	} catch {
		return null;
	}
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	return ctx.getImageData(0, 0, size, size);
}
function chamfer(d, w, h) {
	const D1 = 1;
	const D2 = Math.SQRT2;
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
		const i = y * w + x;
		let v = d[i];
		if (x > 0) v = Math.min(v, d[i - 1] + D1);
		if (y > 0) {
			v = Math.min(v, d[i - w] + D1);
			if (x > 0) v = Math.min(v, d[i - w - 1] + D2);
			if (x < w - 1) v = Math.min(v, d[i - w + 1] + D2);
		}
		d[i] = v;
	}
	for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
		const i = y * w + x;
		let v = d[i];
		if (x < w - 1) v = Math.min(v, d[i + 1] + D1);
		if (y < h - 1) {
			v = Math.min(v, d[i + w] + D1);
			if (x < w - 1) v = Math.min(v, d[i + w + 1] + D2);
			if (x > 0) v = Math.min(v, d[i + w - 1] + D2);
		}
		d[i] = v;
	}
}
function buildSDF(img, size) {
	const n = size * size;
	const spread = size / 4;
	const dOut = new Float32Array(n);
	const dIn = new Float32Array(n);
	for (let i = 0; i < n; i++) {
		const inside = img.data[i * 4 + 3] > 127;
		dOut[i] = inside ? 0 : 1e9;
		dIn[i] = inside ? 1e9 : 0;
	}
	chamfer(dOut, size, size);
	chamfer(dIn, size, size);
	const enc = new Uint8Array(n);
	for (let i = 0; i < n; i++) {
		const d = dOut[i] - dIn[i];
		enc[i] = Math.max(0, Math.min(255, Math.round((.5 + .5 * d / spread) * 255)));
	}
	return enc;
}
function edgePoints(img, size) {
	const pts = [];
	const a = (x, y) => img.data[(y * size + x) * 4 + 3] > 127;
	const stride = Math.max(1, Math.round(size / 512));
	for (let y = 1; y < size - 1; y += stride) for (let x = 1; x < size - 1; x += stride) {
		if (!a(x, y)) continue;
		const l = a(x - 1, y);
		const r = a(x + 1, y);
		const up = a(x, y - 1);
		const dn = a(x, y + 1);
		if (l && r && up && dn) continue;
		const gx = (r ? 1 : 0) - (l ? 1 : 0);
		const gy = (dn ? 1 : 0) - (up ? 1 : 0);
		let nx = -gx;
		let ny = gy;
		const len = Math.hypot(nx, ny);
		if (!len) {
			nx = 0;
			ny = 1;
		} else {
			nx /= len;
			ny /= len;
		}
		pts.push((x + .5) / size, 1 - (y + .5) / size, nx, ny);
	}
	return pts;
}
var GROUP_DEFAULTS = {
	ripple: 100,
	refraction: 100,
	glint: 100
};
function OriginkitBase_ElementalWater(props) {
	const { style, background = "#02080E", baseColor = "#FFFFFF", density = 160, speed = 50, hover = 100, zoom = 106, water, width, height } = props;
	const g_ = {
		...GROUP_DEFAULTS,
		...water || {}
	};
	const canvasRef = useRef(null);
	const sizeRef = useRef({
		w: 0,
		h: 0
	});
	const ptrRef = useRef({
		x: .5,
		y: .5,
		on: 0,
		lastX: .5,
		lastY: .5,
		wind: 0,
		t: 0
	});
	const vRef = useRef({});
	useEffect(() => {
		sizeRef.current = {
			w: num$1(width, 0),
			h: num$1(height, 0)
		};
		vRef.current = {
			bg: background,
			base: baseColor,
			accent: "#8CEBFF",
			density: Math.round(clampN$1(num$1(density, 160), 0, 2e3)),
			speed: clampN$1(num$1(speed, 50), 0, 100) / 50,
			hover: clampN$1(num$1(hover, 100), 0, 200) / 100,
			zoom: clampN$1(num$1(zoom, 106), 40, 300) / 100,
			ripple: clampN$1(num$1(g_.ripple, 100), 0, 300) / 100,
			refraction: clampN$1(num$1(g_.refraction, 100), 0, 400) / 100,
			glint: clampN$1(num$1(g_.glint, 100), 0, 300) / 100
		};
	});
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const gl = canvas.getContext("webgl2", {
			alpha: false,
			antialias: false
		});
		if (!gl) {
			console.error("ElementalWater: WebGL2 unavailable");
			return;
		}
		const prog = link(gl, VERT_SRC$1, FRAG_SRC$1, "main");
		const partProg = link(gl, PART_VERT, PART_FRAG, "particles");
		if (!prog || !partProg) return;
		const locs = /* @__PURE__ */ new Map();
		const u = (n) => {
			if (!locs.has("m:" + n)) locs.set("m:" + n, gl.getUniformLocation(prog, n));
			return locs.get("m:" + n);
		};
		const pu = (n) => {
			if (!locs.has("p:" + n)) locs.set("p:" + n, gl.getUniformLocation(partProg, n));
			return locs.get("p:" + n);
		};
		const R = rng(20260825);
		const simTex = [null, null];
		const simFbo = [null, null];
		let simSrc = 0;
		let simOk = false;
		if (gl.getExtension("EXT_color_buffer_float")) {
			for (let i = 0; i < 2; i++) {
				const t = gl.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, t);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, SIM_RES, SIM_RES, 0, gl.RG, gl.HALF_FLOAT, null);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				const f = gl.createFramebuffer();
				gl.bindFramebuffer(gl.FRAMEBUFFER, f);
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
				gl.clearColor(0, 0, 0, 0);
				gl.clear(gl.COLOR_BUFFER_BIT);
				simTex[i] = t;
				simFbo[i] = f;
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			simOk = true;
		} else console.warn("ElementalWater: EXT_color_buffer_float unavailable, ripples off");
		const simProg = simOk ? link(gl, VERT_SRC$1, SIM_FRAG, "sim") : null;
		const uSim = (n) => simProg ? gl.getUniformLocation(simProg, n) : null;
		const drops = [];
		let nextAutoDrop = .6;
		const sdfTex = gl.createTexture();
		const partBuf = gl.createBuffer();
		const partVao = gl.createVertexArray();
		let edges = [];
		let partCount = 0;
		let builtCount = -1;
		const uploadMask = (img, size) => {
			if (!img) return false;
			gl.bindTexture(gl.TEXTURE_2D, sdfTex);
			gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, size, size, 0, gl.RED, gl.UNSIGNED_BYTE, buildSDF(img, size));
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			edges = edgePoints(img, size);
			builtCount = -1;
			return true;
		};
		uploadMask(rasterizePath("", MASK_SIZE), MASK_SIZE);
		const buildParticles = (count) => {
			builtCount = count;
			partCount = edges.length ? count : 0;
			if (!partCount) return;
			const nPts = edges.length / 4;
			const data = new Float32Array(count * 5);
			for (let i = 0; i < count; i++) {
				const j = R() * nPts | 0;
				data[i * 5] = edges[j * 4];
				data[i * 5 + 1] = edges[j * 4 + 1];
				data[i * 5 + 2] = edges[j * 4 + 2];
				data[i * 5 + 3] = edges[j * 4 + 3];
				data[i * 5 + 4] = R() * 100 + i * .618;
			}
			gl.bindVertexArray(partVao);
			gl.bindBuffer(gl.ARRAY_BUFFER, partBuf);
			gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
			gl.enableVertexAttribArray(0);
			gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 20, 0);
			gl.enableVertexAttribArray(1);
			gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 20, 8);
			gl.enableVertexAttribArray(2);
			gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 20, 16);
			gl.bindVertexArray(null);
		};
		let raf = 0;
		let last = performance.now();
		let clock = 0;
		const render = (now) => {
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			const v = vRef.current;
			const sp = v.speed;
			clock += dt * sp;
			const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR$1);
			const cw = sizeRef.current.w || canvas.clientWidth || 1200;
			const ch = sizeRef.current.h || canvas.clientHeight || 800;
			const bw = Math.max(2, Math.round(cw * dpr));
			const bh = Math.max(2, Math.round(ch * dpr));
			if (canvas.width !== bw || canvas.height !== bh) {
				canvas.width = bw;
				canvas.height = bh;
			}
			if (v.density !== builtCount) buildParticles(v.density);
			const ptr = ptrRef.current;
			ptr.wind += (0 - ptr.wind) * (1 - Math.exp(-dt * sp * 2.4));
			const aspect = bw / Math.max(bh, 1);
			const fit = Math.min(aspect, 1);
			const zoomK = v.zoom;
			const scx = aspect / fit * zoomK;
			const scy = 1 / fit * zoomK;
			if (simProg && simOk) {
				if (clock > nextAutoDrop) {
					drops.push({
						x: .12 + R() * .76,
						y: .12 + R() * .76,
						s: (.12 + R() * .3) * v.ripple
					});
					nextAutoDrop = clock + .5 + R() * 1.4;
				}
				gl.useProgram(simProg);
				gl.viewport(0, 0, SIM_RES, SIM_RES);
				gl.uniform2f(uSim("uTexel"), 1 / SIM_RES, 1 / SIM_RES);
				for (let i = 0; i < 2; i++) {
					const drop = drops.shift();
					if (drop) {
						const a2 = bw / Math.max(bh, 1);
						const f = Math.max(a2, 1);
						gl.uniform3f(uSim("uDrop"), .5 + (drop.x - .5) * (a2 / f), .5 + (drop.y - .5) * (1 / f), drop.s);
					} else gl.uniform3f(uSim("uDrop"), 0, 0, 0);
					gl.bindFramebuffer(gl.FRAMEBUFFER, simFbo[1 - simSrc]);
					gl.activeTexture(gl.TEXTURE1);
					gl.bindTexture(gl.TEXTURE_2D, simTex[simSrc]);
					gl.uniform1i(uSim("uState"), 1);
					gl.drawArrays(gl.TRIANGLES, 0, 3);
					simSrc = 1 - simSrc;
				}
				gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			}
			gl.useProgram(prog);
			gl.viewport(0, 0, bw, bh);
			gl.uniform1f(u("uTime"), clock);
			gl.uniform1f(u("uAspect"), aspect);
			gl.uniform2f(u("uScale"), scx, scy);
			gl.uniform2f(u("uShift"), 0, 0);
			gl.uniform3f(u("uBg"), ...parseColor$1(v.bg, [
				.01,
				.02,
				.04
			]));
			gl.uniform3f(u("uBase"), ...parseColor$1(v.base, [
				.4,
				.6,
				.8
			]));
			gl.uniform3f(u("uAccent"), ...parseColor$1(v.accent, [
				.8,
				.9,
				1
			]));
			gl.uniform1f(u("uRipple"), v.ripple);
			gl.uniform1f(u("uRefract"), v.refraction);
			gl.uniform1f(u("uGlint"), v.glint);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, sdfTex);
			gl.uniform1i(u("uSDF"), 0);
			if (simOk) {
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, simTex[simSrc]);
				gl.uniform1i(u("uState"), 1);
				gl.uniform2f(u("uSimTexel"), 1 / SIM_RES, 1 / SIM_RES);
			}
			gl.drawArrays(gl.TRIANGLES, 0, 3);
			if (partCount > 0) {
				gl.useProgram(partProg);
				gl.uniform1f(pu("uTime"), clock);
				gl.uniform2f(pu("uScale"), scx, scy);
				gl.uniform2f(pu("uShift"), 0, 0);
				gl.uniform1f(pu("uDpr"), dpr);
				gl.uniform1f(pu("uWind"), ptr.wind * v.hover);
				gl.uniform4f(pu("uCfgA"), .1, 4, 8, .15);
				gl.uniform4f(pu("uCfgB"), .02, 1.5, 3.5, .5);
				gl.uniform3f(pu("uColA"), .1, .24, .3);
				gl.uniform3f(pu("uColB"), .22, .4, .48);
				gl.enable(gl.BLEND);
				gl.blendFunc(gl.ONE, gl.ONE);
				gl.bindVertexArray(partVao);
				gl.drawArrays(gl.POINTS, 0, partCount);
				gl.bindVertexArray(null);
				gl.disable(gl.BLEND);
			}
			raf = requestAnimationFrame(render);
		};
		const track = (e) => {
			const r = canvas.getBoundingClientRect();
			if (r.width <= 0 || r.height <= 0) return;
			const ptr = ptrRef.current;
			const x = clampN$1((e.clientX - r.left) / r.width, 0, 1);
			const y = clampN$1(1 - (e.clientY - r.top) / r.height, 0, 1);
			const dx = x - ptr.lastX;
			const dy = y - ptr.lastY;
			ptr.wind = clampN$1(ptr.wind + dx * 6, -1, 1);
			const sped = Math.hypot(dx, dy) / Math.max(1 / 240, (performance.now() - ptr.t) / 1e3);
			ptr.t = performance.now();
			if (sped > .05 && drops.length < 6) drops.push({
				x,
				y,
				s: Math.min(sped * .14, .55) * vRef.current.hover
			});
			ptr.lastX = x;
			ptr.lastY = y;
			ptr.x = x;
			ptr.y = y;
			ptr.on = 1;
		};
		const onLeave = () => {
			ptrRef.current.on = 0;
		};
		canvas.addEventListener("pointermove", track);
		canvas.addEventListener("pointerenter", track);
		canvas.addEventListener("pointerleave", onLeave);
		raf = requestAnimationFrame(render);
		return () => {
			cancelAnimationFrame(raf);
			canvas.removeEventListener("pointermove", track);
			canvas.removeEventListener("pointerenter", track);
			canvas.removeEventListener("pointerleave", onLeave);
		};
	}, []);
	return /* @__PURE__ */ jsx("div", {
		style: {
			position: "relative",
			overflow: "hidden",
			background,
			minWidth: 1200,
			minHeight: 800,
			width: typeof width === "number" && width > 0 ? width : "100%",
			height: typeof height === "number" && height > 0 ? height : "100%",
			...style
		},
		children: /* @__PURE__ */ jsx("canvas", {
			ref: canvasRef,
			style: {
				position: "absolute",
				inset: 0,
				width: "100%",
				height: "100%",
				display: "block"
			}
		})
	});
}
var __originkitPresetProps$2 = {
	"background": "#101D2C",
	"baseColor": "#101D2C",
	"water": {
		"glint": 100,
		"ripple": 200,
		"refraction": 100
	}
};
function ElementalWater(props) {
	return /* @__PURE__ */ jsx(OriginkitBase_ElementalWater, {
		...__originkitPresetProps$2,
		...props
	});
}
//#endregion
//#region src/components/fluid-field.tsx
/**
* FluidField — a soft beam of light dragged through a noise-warped plane.
*/
var MAX_DPR = 2;
var VERT_SRC = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;
var FRAG_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2  uRes;
uniform float uTime, uScale, uWarp, uBeam, uGlowK, uHover;
uniform vec2  uPtr;   // aspect-corrected uv space
uniform vec3  uBg, uBase, uAccent;


vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x){ return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}


void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  uv.x *= uRes.x / max(uRes.y, 1.0);

  vec2 st = uv * 0.7 * uScale;
  st += vec2(snoise(st + uTime * 0.05), snoise(st - uTime * 0.05)) * 0.3 * uWarp;

  vec2 d = uv - uPtr;
  float swirl = exp(-dot(d, d) / 0.06) * uHover;
  st += vec2(-d.y, d.x) * swirl * 1.2;

  float lo = 0.1;
  float hi = max(lo + 0.02, 0.1 + 0.7 * uBeam);
  float beam = smoothstep(lo, hi, snoise(vec2(st.x + st.y * 1.5 - uTime * 0.15, uTime * 0.02)));

  vec3 glow = mix(uBase, uAccent, snoise(uv * 1.5 + uTime * 0.1) * 0.5 + 0.5);

  gl_FragColor = vec4(uBg + glow * beam * 0.7 * uGlowK, 1.0);
}
`;
function compile(gl, type, src) {
	const sh = gl.createShader(type);
	if (!sh) return null;
	gl.shaderSource(sh, src);
	gl.compileShader(sh);
	if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
		console.error("FluidField shader:", gl.getShaderInfoLog(sh));
		gl.deleteShader(sh);
		return null;
	}
	return sh;
}
function parseColor(input, fb) {
	if (!input) return fb;
	const str = String(input).trim();
	if (str.charAt(0) === "#") {
		let hex = str.slice(1);
		if (hex.length === 3 || hex.length === 4) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		if (hex.length >= 6) {
			const r = parseInt(hex.slice(0, 2), 16);
			const g = parseInt(hex.slice(2, 4), 16);
			const b = parseInt(hex.slice(4, 6), 16);
			if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return [
				r / 255,
				g / 255,
				b / 255
			];
		}
		return fb;
	}
	const m = str.match(/[\d.]+/g);
	if (m && m.length >= 3) return [
		Math.min(255, parseFloat(m[0])) / 255,
		Math.min(255, parseFloat(m[1])) / 255,
		Math.min(255, parseFloat(m[2])) / 255
	];
	return fb;
}
function num(v, fb) {
	return typeof v === "number" && isFinite(v) ? v : fb;
}
function clampN(v, lo, hi) {
	return v < lo ? lo : v > hi ? hi : v;
}
var FLOW_DEFAULTS = {
	scale: 87,
	warp: 100,
	beam: 154,
	glow: 400
};
function OriginkitBase_FluidField(props) {
	const { style, background = "#101B33", baseColor = "#F3EFE4", accentColor = "#F3EFE4", speed = 100, hover = 185, flow, width, height, className } = props;
	const flow_ = {
		...FLOW_DEFAULTS,
		...flow || {}
	};
	const canvasRef = useRef(null);
	const ptrRef = useRef({
		tx: .5,
		ty: .5,
		x: .5,
		y: .5,
		on: 0,
		onS: 0
	});
	const sizeRef = useRef({
		w: 0,
		h: 0
	});
	const vRef = useRef({});
	useEffect(() => {
		sizeRef.current = {
			w: num(width, 0),
			h: num(height, 0)
		};
		vRef.current = {
			bg: background,
			base: baseColor,
			accent: accentColor,
			speed: clampN(num(speed, 50), 0, 100) / 50,
			hover: clampN(num(hover, 100), 0, 200) / 100,
			scale: clampN(num(flow_.scale, 100), 20, 400) / 100,
			warp: clampN(num(flow_.warp, 100), 0, 400) / 100,
			beam: clampN(num(flow_.beam, 100), 10, 300) / 100,
			glow: clampN(num(flow_.glow, 100), 0, 400) / 100
		};
	});
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const gl = canvas.getContext("webgl", {
			alpha: false,
			antialias: false,
			depth: false
		});
		if (!gl) {
			console.error("FluidField: WebGL unavailable");
			return;
		}
		const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
		const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
		if (!vs || !fs) return;
		const prog = gl.createProgram();
		if (!prog) return;
		gl.attachShader(prog, vs);
		gl.attachShader(prog, fs);
		gl.linkProgram(prog);
		if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
			console.error("FluidField link:", gl.getProgramInfoLog(prog));
			return;
		}
		gl.useProgram(prog);
		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-1,
			-1,
			3,
			-1,
			-1,
			3
		]), gl.STATIC_DRAW);
		const aPos = gl.getAttribLocation(prog, "a_pos");
		gl.enableVertexAttribArray(aPos);
		gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
		const locs = {};
		const u = (name) => {
			if (!(name in locs)) locs[name] = gl.getUniformLocation(prog, name);
			return locs[name];
		};
		let raf = 0;
		let last = performance.now();
		let clock = 0;
		const PTR_RATE = 5;
		const render = (now) => {
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			const v = vRef.current;
			clock = (clock + dt * v.speed) % 31416;
			const ptr = ptrRef.current;
			const k = 1 - Math.exp(-dt * PTR_RATE);
			ptr.x += (ptr.tx - ptr.x) * k;
			ptr.y += (ptr.ty - ptr.y) * k;
			ptr.onS += (ptr.on - ptr.onS) * k;
			const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
			const cw = sizeRef.current.w || canvas.clientWidth || 1200;
			const ch = sizeRef.current.h || canvas.clientHeight || 800;
			const bw = Math.max(1, Math.round(cw * dpr));
			const bh = Math.max(1, Math.round(ch * dpr));
			if (canvas.width !== bw || canvas.height !== bh) {
				canvas.width = bw;
				canvas.height = bh;
			}
			gl.viewport(0, 0, bw, bh);
			gl.uniform2f(u("uRes"), bw, bh);
			gl.uniform1f(u("uTime"), clock);
			gl.uniform1f(u("uScale"), v.scale);
			gl.uniform1f(u("uWarp"), v.warp);
			gl.uniform1f(u("uBeam"), v.beam);
			gl.uniform1f(u("uGlowK"), v.glow);
			gl.uniform1f(u("uHover"), v.hover * ptr.onS);
			gl.uniform2f(u("uPtr"), ptr.x * (bw / Math.max(bh, 1)), 1 - ptr.y);
			const cg = parseColor(v.bg, [
				.012,
				.012,
				.02
			]);
			const cb = parseColor(v.base, [
				.15,
				.25,
				.85
			]);
			const ca = parseColor(v.accent, [
				.4,
				.2,
				.9
			]);
			gl.uniform3f(u("uBg"), cg[0], cg[1], cg[2]);
			gl.uniform3f(u("uBase"), cb[0], cb[1], cb[2]);
			gl.uniform3f(u("uAccent"), ca[0], ca[1], ca[2]);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
			raf = requestAnimationFrame(render);
		};
		const track = (e) => {
			const r = canvas.getBoundingClientRect();
			if (r.width <= 0 || r.height <= 0) return;
			ptrRef.current.tx = clampN((e.clientX - r.left) / r.width, 0, 1);
			ptrRef.current.ty = clampN((e.clientY - r.top) / r.height, 0, 1);
			ptrRef.current.on = 1;
		};
		const onLeave = () => {
			ptrRef.current.tx = .5;
			ptrRef.current.ty = .5;
			ptrRef.current.on = 0;
		};
		canvas.addEventListener("pointermove", track);
		canvas.addEventListener("pointerenter", track);
		canvas.addEventListener("pointerleave", onLeave);
		raf = requestAnimationFrame(render);
		return () => {
			cancelAnimationFrame(raf);
			canvas.removeEventListener("pointermove", track);
			canvas.removeEventListener("pointerenter", track);
			canvas.removeEventListener("pointerleave", onLeave);
		};
	}, []);
	return /* @__PURE__ */ jsx("div", {
		className,
		style: {
			position: "relative",
			overflow: "hidden",
			background,
			minWidth: "100%",
			minHeight: "100%",
			width: typeof width === "number" && width > 0 ? width : "100%",
			height: typeof height === "number" && height > 0 ? height : "100%",
			...style
		},
		children: /* @__PURE__ */ jsx("canvas", {
			ref: canvasRef,
			style: {
				position: "absolute",
				inset: 0,
				width: "100%",
				height: "100%",
				display: "block"
			}
		})
	});
}
var __originkitPresetProps$1 = {
	"background": "#101B33",
	"baseColor": "#F3EFE4",
	"accentColor": "#F3EFE4",
	"flow": {
		"beam": 154,
		"glow": 400,
		"warp": 100,
		"scale": 160
	}
};
function FluidField(props) {
	return /* @__PURE__ */ jsx(OriginkitBase_FluidField, {
		...__originkitPresetProps$1,
		...props
	});
}
//#endregion
//#region src/components/tactile-button.tsx
/** Rounded is a percent of the MAXIMUM possible radius — half the short side —
*  so 100 is a true pill at any button size and 0 is a square corner. A CSS
*  percentage border-radius is not the same thing: it resolves per axis and
*  gives an ellipse, so a wide button would bulge instead of forming a stadium.
*  Hence the measured conversion. */
var radiusFromPercent = (w, h, pct) => Math.min(w, h) / 2 * (Math.max(0, Math.min(100, pct)) / 100);
var useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
var PRESS_DOWN = {
	type: "tween",
	ease: "easeOut",
	duration: .05
};
/**
* Tactile Button — a keycap sitting on a fixed base plate. The base is a real
* sibling element offset by Depth — down, leaning to the chosen Base Side — not
* a box-shadow on the cap: a shadow travels with whatever casts it, so the old
* version moved the "well" along with the key and read as a duplicate slab.
* Anchoring the base and translating only the cap makes the two read as one
* body — the cap bottoms out flush into the base on press, exactly covering it.
*
* Imperative useAnimate only, per framer.md: no `initial` / `animate` /
* `whileHover` / `whileTap` variant props.
*/
function OriginkitBase_TactileButton(props) {
	const { label = "TACTILE BUTTON", font, showText = true, padding = "40px 64px 40px 64px", rounded = 100, fill: fillProp, textColor: textColorProp, colors, addIcon = false, icon = {
		"side": "left",
		"size": 24,
		"type": "symbol",
		"color": "#FFFFFF",
		"image": "",
		"symbol": "→",
		"padding": 0,
		"rounded": 0,
		"hoverColor": "#FFFFFF"
	}, gap = 12, border, hover = {}, base = {
		"color": "#FC731C",
		"offsetX": -1,
		"offsetY": 11
	}, shadowColor: shadowColorLegacy, shadowSide: shadowSideLegacy, shadowDistance: shadowDistanceLegacy, link, transition = {
		"mass": 1,
		"type": "spring",
		"delay": 0,
		"damping": 60,
		"stiffness": 800
	}, newTab = false, style } = props;
	const fill = colors?.fill ?? fillProp ?? "#6366F1";
	const textColor = colors?.textColor ?? textColorProp ?? "#FFFFFF";
	const { fill: hoverFill = colors?.hoverFill ?? "#FC731C", textColor: hoverTextColor = colors?.hoverTextColor ?? "#FFFFFF" } = hover;
	const { color: baseColor = shadowColorLegacy ?? "#3730A3", offsetX: baseOffsetX, offsetY: baseOffsetY, side: baseSide = shadowSideLegacy ?? "right", depth: baseDepth = shadowDistanceLegacy ?? 7 } = base;
	const [scope, animate] = useAnimate();
	const [radiusBox, setRadiusBox] = useState({
		w: 0,
		h: 0
	});
	useIsoLayoutEffect(() => {
		const el = scope.current;
		if (!el) return;
		const read = () => setRadiusBox((prev) => prev.w === el.offsetWidth && prev.h === el.offsetHeight ? prev : {
			w: el.offsetWidth,
			h: el.offsetHeight
		});
		read();
		const ro = new ResizeObserver(read);
		ro.observe(el);
		return () => ro.disconnect();
	}, [scope]);
	const radiusPx = radiusFromPercent(radiusBox.w, radiusBox.h, rounded);
	const capRef = useRef(null);
	const iconRef = useRef(null);
	const hovered = useRef(false);
	const pressed = useRef(false);
	const reducedMotion = useReducedMotion();
	const fontStyles = font ?? {};
	const legacyDepth = Math.max(0, Math.round(baseDepth));
	const dx = Math.round(baseOffsetX ?? (baseSide === "left" ? -legacyDepth : legacyDepth));
	const dy = Math.round(baseOffsetY ?? legacyDepth);
	const { type: iconKind = "symbol", symbol: iconSymbol = "→", image, color: iconColor = "#FFFFFF", hoverColor: iconHoverColor = "#FFFFFF", side: iconSide = "left", size: iconSize = 24, padding: iconPaddingProp = 0, rounded: iconRounded = 0 } = icon;
	const iconSrc = typeof image === "string" ? image : image && image.src ? image.src : "";
	const iconMode = iconKind === "image" && iconSrc ? "image" : "symbol";
	const iconPx = Math.max(1, Math.round(iconSize));
	const iconPadPx = Math.max(0, Math.round(iconPaddingProp));
	const iconRadius = radiusFromPercent(iconPx, iconPx, iconRounded);
	const gapPx = Math.max(0, Math.round(gap));
	const iconEl = !addIcon ? null : iconMode === "image" ? /* @__PURE__ */ jsx("img", {
		src: iconSrc,
		alt: "",
		"aria-hidden": true,
		draggable: false,
		style: {
			width: iconPx,
			height: iconPx,
			margin: iconPadPx,
			objectFit: iconRadius > 0 ? "cover" : "contain",
			borderRadius: Math.min(iconRadius, iconPx / 2),
			display: "block",
			flex: "none",
			pointerEvents: "none"
		}
	}) : /* @__PURE__ */ jsx("span", {
		ref: iconRef,
		"aria-hidden": true,
		style: {
			fontSize: iconPx,
			margin: iconPadPx,
			lineHeight: 1,
			color: iconColor,
			flex: "none",
			pointerEvents: "none"
		},
		children: iconSymbol
	});
	/** Colour swap only — hover never moves the key. */
	const paint = useCallback((toHover, instant) => {
		const el = capRef.current;
		if (!el) return;
		const t = instant || reducedMotion ? { duration: 0 } : transition;
		animate(el, toHover ? {
			backgroundColor: hoverFill,
			color: hoverTextColor
		} : {
			backgroundColor: fill,
			color: textColor
		}, t);
		if (iconRef.current) animate(iconRef.current, { color: toHover ? iconHoverColor : iconColor }, t);
	}, [
		animate,
		transition,
		reducedMotion,
		fill,
		hoverFill,
		textColor,
		hoverTextColor,
		iconColor,
		iconHoverColor
	]);
	/** The key stroke: cap slides down the base's own offset until flush. */
	const press = useCallback((down, instant) => {
		const el = capRef.current;
		if (!el) return;
		animate(el, {
			x: down ? dx : 0,
			y: down ? dy : 0
		}, instant ? { duration: 0 } : reducedMotion ? { duration: 0 } : down ? PRESS_DOWN : transition);
	}, [
		animate,
		transition,
		reducedMotion,
		dx,
		dy
	]);
	useEffect(() => {
		paint(hovered.current, true);
	}, [paint]);
	useEffect(() => {
		press(pressed.current, true);
	}, [press]);
	const onEnter = () => {
		hovered.current = true;
		paint(true, false);
	};
	const onLeave = () => {
		hovered.current = false;
		paint(false, false);
		if (pressed.current) {
			pressed.current = false;
			press(false, false);
		}
	};
	const onDown = () => {
		pressed.current = true;
		press(true, false);
	};
	const onUp = () => {
		pressed.current = false;
		press(false, false);
	};
	useEffect(() => {
		const release = () => {
			if (!pressed.current) return;
			pressed.current = false;
			press(false, false);
		};
		window.addEventListener("pointerup", release);
		window.addEventListener("pointercancel", release);
		return () => {
			window.removeEventListener("pointerup", release);
			window.removeEventListener("pointercancel", release);
		};
	}, [press]);
	const isLink = typeof link === "string" && link.length > 0;
	const Tag = isLink ? "a" : "button";
	const tagProps = {
		"aria-label": showText ? void 0 : label || void 0,
		...isLink ? {
			href: link,
			target: newTab ? "_blank" : void 0,
			rel: newTab ? "noopener noreferrer" : void 0
		} : { type: "button" }
	};
	return /* @__PURE__ */ jsx("div", {
		style: {
			display: "inline-block",
			boxSizing: "border-box",
			paddingTop: Math.max(0, -dy),
			paddingBottom: Math.max(0, dy),
			paddingLeft: Math.max(0, -dx),
			paddingRight: Math.max(0, dx),
			...style
		},
		children: /* @__PURE__ */ jsxs("div", {
			ref: scope,
			style: {
				position: "relative",
				display: "inline-flex",
				width: "100%",
				height: "100%"
			},
			children: [/* @__PURE__ */ jsx("div", {
				"aria-hidden": "true",
				style: {
					position: "absolute",
					inset: 0,
					transform: `translate(${dx}px, ${dy}px)`,
					borderRadius: radiusPx,
					...border ?? {},
					backgroundColor: baseColor,
					boxSizing: "border-box",
					pointerEvents: "none"
				}
			}), /* @__PURE__ */ jsx(Tag, {
				...tagProps,
				ref: capRef,
				onPointerEnter: onEnter,
				onPointerLeave: onLeave,
				onPointerDown: onDown,
				onPointerUp: onUp,
				style: {
					position: "relative",
					display: "inline-block",
					width: "100%",
					padding,
					borderRadius: radiusPx,
					...border ?? {},
					backgroundColor: fill,
					textDecoration: "none",
					cursor: "pointer",
					boxSizing: "border-box",
					userSelect: "none",
					whiteSpace: "nowrap",
					textAlign: "center",
					WebkitTapHighlightColor: "transparent",
					...fontStyles,
					color: textColor
				},
				children: /* @__PURE__ */ jsxs("span", {
					style: {
						display: "inline-flex",
						alignItems: "center",
						gap: iconEl && showText ? gapPx : 0,
						flexDirection: iconSide === "right" ? "row-reverse" : "row"
					},
					children: [iconEl, showText && /* @__PURE__ */ jsx("span", { children: label })]
				})
			})]
		})
	});
}
var __originkitPresetProps = {
	"label": "Shop all umbrellas",
	"padding": "12px 24px",
	"font": {
		"variant": "Semibold",
		"fontSize": 18,
		"textAlign": "left",
		"fontFamily": "Outfit",
		"fontWeight": 600,
		"lineHeight": "1.5em",
		"letterSpacing": "0em"
	},
	"colors": {
		"fill": "#F2C330",
		"hoverFill": "#101B33",
		"textColor": "#000000",
		"hoverTextColor": "#74777C"
	},
	"base": {
		"color": "#74777C",
		"offsetX": -1,
		"offsetY": 11
	},
	"newTab": true
};
function TactileButton(props) {
	return /* @__PURE__ */ jsx(OriginkitBase_TactileButton, {
		...__originkitPresetProps,
		...props
	});
}
//#endregion
//#region src/sun-data.ts
/**
* Sun Umbrella storefront data. Collections + bestsellers with copy, prices and
* links pulled from the live Shopify store (sunumbrella.in). Images are local
* placeholders in /assets/sun/ — swap for final brand photography before launch.
* Links point at the real Shopify collections/products, so the storefront is
* navigable today and maps cleanly onto the Shopify Storefront API later.
*/
var SHOP$1 = "https://sunumbrella.in";
var COLLECTIONS = [
	{
		name: "Non-Fold",
		sub: "Black & Colours",
		blurb: "The full-length stick that lives by the door. Rose-wood finish, UV-protective, windproof.",
		image: "/assets/sun/prod-walkingstick.png",
		href: `${SHOP$1}/collections/non-fold`
	},
	{
		name: "2-Fold",
		sub: "Black & Colours",
		blurb: "Auto-open compact that still spans wide — the everyday monsoon carry for the bag.",
		image: "/assets/sun/blue-droplet.jpg",
		href: `${SHOP$1}/collections/2-fold`
	},
	{
		name: "3-Fold",
		sub: "Black & Colours",
		blurb: "Folds to a paperback. Auto open-and-close, double-rib storm frames that spring back.",
		image: "/assets/sun/prod-reporter-silver.png",
		href: `${SHOP$1}/collections/3-fold`
	},
	{
		name: "Kids",
		sub: "Bright & safe",
		blurb: "Light sticks and non-folds sized for small hands, big puddles and brighter walks to school.",
		image: "/assets/sun/sun-poster.png",
		href: `${SHOP$1}/collections/kids`
	},
	{
		name: "Promotional",
		sub: "Your brand on top",
		blurb: "Custom-branded umbrellas for corporates. Trusted by Bosch, Mercedes-Benz, Shell and more.",
		image: "/assets/sun/prod-pidilite.png",
		href: `${SHOP$1}/collections/promotional-umbrella`
	},
	{
		name: "Outdoor & Golf",
		sub: "Maximum Shade",
		blurb: "Extra-large canopies built for shade. Perfect for the beach, the golf course, and long summer days.",
		image: "/assets/sun/prod-reporter-silver.png",
		href: `${SHOP$1}/collections/outdoor`
	}
];
`${SHOP$1}`, `${SHOP$1}`, `${SHOP$1}`, `${SHOP$1}`;
/**
* Portrait product video reels (the "Next-Gen Premium Umbrellas" section). Real
* clips pulled from the live store; the other reel entries on sunumbrella.in are
* HLS-only and need transcoding to mp4 before they can be added here.
*/
var REEL = [
	{
		src: "/assets/sun/videos/reel-walkingstick.mp4",
		poster: "",
		label: "Come rain or shine",
		caption: "Built for every downpour",
		href: `${SHOP$1}/collections/all`
	},
	{
		src: "/assets/sun/videos/reel-maybach.mp4",
		poster: "",
		label: "Designed for style",
		caption: "UV protective · windproof",
		href: `${SHOP$1}/collections/all`
	},
	{
		src: "/assets/sun/videos/reel-walkingstick.mp4",
		poster: "",
		label: "Unmatched durability",
		caption: "Tested in heavy storms",
		href: `${SHOP$1}/collections/all`
	}
];
/** Sun Umbrella customer reviews (placeholder copy; swap for real reviews). */
var TESTIMONIALS = [
	{
		text: "Survived three Mumbai monsoons and still opens with one push. The auto-open is a lifesaver on a crowded local train.",
		image: "https://randomuser.me/api/portraits/women/68.jpg",
		name: "Priya Nair",
		role: "Mumbai"
	},
	{
		text: "Bought the 3-fold for my bag — folds to a paperback, opens huge. The UV coating actually keeps the heat off on Chennai afternoons.",
		image: "https://randomuser.me/api/portraits/men/32.jpg",
		name: "Rahul Menon",
		role: "Chennai"
	},
	{
		text: "We ordered 500 branded umbrellas for our dealership event. Premium quality, delivered on time, and everyone kept one.",
		image: "https://randomuser.me/api/portraits/women/44.jpg",
		name: "Anjali Rao",
		role: "Brand Manager"
	},
	{
		text: "135 years and it shows — the frame took a Bengaluru pre-monsoon gust head-on and sprang right back into shape.",
		image: "https://randomuser.me/api/portraits/men/52.jpg",
		name: "Vikram Shetty",
		role: "Bengaluru"
	},
	{
		text: "My kids love their bright umbrellas and I love that they're genuinely windproof, not the flimsy ones that flip inside out.",
		image: "https://randomuser.me/api/portraits/women/26.jpg",
		name: "Fatima Sheikh",
		role: "Kochi"
	},
	{
		text: "The walking-stick model gives my father support and shelter in one. Beautifully made, and the rose-wood handle feels solid.",
		image: "https://randomuser.me/api/portraits/women/12.jpg",
		name: "Deepa Iyer",
		role: "Mysuru"
	},
	{
		text: "Gifted these to the whole team for Diwali. Everyone keeps asking where they're from — best corporate gift we've done.",
		image: "https://randomuser.me/api/portraits/men/76.jpg",
		name: "Arjun Kapoor",
		role: "HR Lead"
	},
	{
		text: "The rose-wood finish looks so premium people think it cost triple. Rain just beads and slides straight off the canopy.",
		image: "https://randomuser.me/api/portraits/women/90.jpg",
		name: "Sana Qureshi",
		role: "Hyderabad"
	},
	{
		text: "Ordered on Amazon, arrived next day, and it has already outlasted every cheap umbrella I've ever owned. Worth every rupee.",
		image: "https://randomuser.me/api/portraits/men/18.jpg",
		name: "Karthik Reddy",
		role: "Pune"
	}
];
var RETAIL = [
	{
		name: "Amazon",
		image: "/assets/sun/retail-amazon.png"
	},
	{
		name: "Myntra",
		image: "/assets/sun/retail-myntra.png"
	},
	{
		name: "Reliance",
		image: "/assets/sun/retail-reliance.png"
	},
	{
		name: "Blinkit",
		image: "/assets/sun/retail-blinkit.png"
	},
	{
		name: "Swiggy",
		image: "/assets/sun/retail-swiggy.png"
	},
	{
		name: "DMart",
		image: "/assets/sun/retail-dmart.png"
	}
];
//#endregion
//#region src/components/umberlla/sections.tsx
/**
* Sun Umbrella storefront sections. Cinematic hero (owned by ScrollScrub) is
* composed in the route; these are the storefront body: the monsoon category
* grid, the bestsellers strip, and the footer. Copy, prices and links come from
* the live Shopify store via src/sun-data.ts.
*/
var SHOP = "https://sunumbrella.in";
var SU = "https://www.sunumbrellas.in";
var NAV_LINKS = [
	{
		label: "Gents",
		href: `${SU}/GENTS/1/products`,
		items: [
			{
				label: "2 Fold",
				href: `${SU}/GENTS/1/frames/9`
			},
			{
				label: "3 Fold",
				href: `${SU}/GENTS/1/frames/10`
			},
			{
				label: "Stick & Non-Foldable",
				href: `${SU}/GENTS/1/frames/12`
			}
		]
	},
	{
		label: "Ladies",
		href: `${SU}/LADIES/2/products`,
		items: [
			{
				label: "2 Fold",
				href: `${SU}/LADIES/2/frames/9`
			},
			{
				label: "3 Fold",
				href: `${SU}/LADIES/2/frames/10`
			},
			{
				label: "Stick & Non-Foldable",
				href: `${SU}/LADIES/2/frames/12`
			}
		]
	},
	{
		label: "Kids",
		href: `${SU}/KIDS/3/products`,
		items: [{
			label: "Stick & Non-Foldable",
			href: `${SU}/KIDS/3/frames/12`
		}]
	},
	{
		label: "Promotional",
		href: `${SU}/PROMOTIONAL/4/products`,
		items: [
			{
				label: "2 Fold",
				href: `${SU}/PROMOTIONAL/4/frames/9`
			},
			{
				label: "3 Fold",
				href: `${SU}/PROMOTIONAL/4/frames/10`
			},
			{
				label: "Stick & Non-Foldable",
				href: `${SU}/PROMOTIONAL/4/frames/12`
			}
		]
	},
	{
		label: "Premium",
		href: `${SU}/PREMIUM/5/products`,
		items: [{
			label: "3 Fold",
			href: `${SU}/PREMIUM/5/frames/10`
		}, {
			label: "Stick & Non-Foldable",
			href: `${SU}/PREMIUM/5/frames/12`
		}]
	},
	{
		label: "Exclusive",
		href: `${SU}/EXCLUSIVE/7/products`,
		items: [{
			label: "3 Fold",
			href: `${SU}/EXCLUSIVE/7/frames/10`
		}, {
			label: "Stick & Non-Foldable",
			href: `${SU}/EXCLUSIVE/7/frames/12`
		}]
	}
];
/** Rotated, white-bordered sticker badge (CRAV-style). */
function Sticker({ children, tone = "yellow", rotate = -4, className = "" }) {
	return /* @__PURE__ */ jsx("span", {
		className: `u-sticker ${{
			yellow: "bg-[var(--u-yellow)] text-[var(--u-navy)]",
			navy: "bg-[var(--u-navy)] text-white",
			cream: "bg-[var(--u-bone)] text-[var(--u-navy)]"
		}[tone]} ${className}`,
		style: { transform: `rotate(${rotate}deg)` },
		children
	});
}
function SiteNav() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [navTheme, setNavTheme] = useState("light");
	const [navVisible, setNavVisible] = useState(true);
	const [isScrolled, setIsScrolled] = useState(false);
	const [indicatorStyle, setIndicatorStyle] = useState({
		left: 0,
		width: 0,
		opacity: 0
	});
	useEffect(() => {
		const check = () => {
			const sentinel = document.getElementById("hero-end");
			setIsScrolled(window.scrollY > 20);
			let currentTheme = "light";
			const sections = Array.from(document.querySelectorAll("section"));
			for (const sec of sections) {
				const rect = sec.getBoundingClientRect();
				if (rect.top <= 90 && rect.bottom >= 90) {
					if (sec.id === "next-gen" || sec.id === "bestsellers") currentTheme = "light";
					else currentTheme = "dark";
					break;
				}
			}
			const footer = document.querySelector("footer");
			if (footer) {
				if (footer.getBoundingClientRect().top <= 90) currentTheme = "dark";
			}
			if (sentinel && sentinel.getBoundingClientRect().top >= 90) currentTheme = "light";
			setNavTheme(currentTheme);
			const collections = document.getElementById("collections");
			if (collections) setNavVisible(collections.getBoundingClientRect().bottom >= 50);
			else setNavVisible(true);
		};
		check();
		window.addEventListener("scroll", check, { passive: true });
		window.addEventListener("resize", check);
		return () => {
			window.removeEventListener("scroll", check);
			window.removeEventListener("resize", check);
		};
	}, []);
	useEffect(() => {
		const lenis = window.__lenis;
		if (menuOpen) {
			lenis?.stop();
			document.body.style.overflow = "hidden";
		} else {
			lenis?.start();
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [menuOpen]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("header", {
		className: ["fixed inset-x-0 top-0 z-50 bg-transparent transition-all duration-300", navVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"].join(" "),
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-28 md:px-8",
			children: [
				/* @__PURE__ */ jsx("a", {
					href: "#top",
					className: "flex h-12 items-center md:h-24",
					children: /* @__PURE__ */ jsxs("div", {
						className: ["flex flex-col items-center transition-opacity duration-300", isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"].join(" "),
						children: [/* @__PURE__ */ jsx("img", {
							src: "/assets/sun/logo-icon-transparent.png",
							alt: "Sun Umbrella",
							className: "h-8 w-auto md:h-16"
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-center mt-1 font-sans",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[10px] md:text-sm font-black tracking-wider text-white leading-none",
								children: "Umbrellas"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[6px] md:text-[8px] font-medium tracking-tight text-white/80 mt-0.5 whitespace-nowrap",
								children: "Trusted over 100 years"
							})]
						})]
					})
				}),
				/* @__PURE__ */ jsx("svg", {
					width: "0",
					height: "0",
					className: "absolute pointer-events-none",
					children: /* @__PURE__ */ jsx("filter", {
						id: "glass-displacement",
						colorInterpolationFilters: "linearRGB",
						filterUnits: "objectBoundingBox",
						primitiveUnits: "userSpaceOnUse",
						children: /* @__PURE__ */ jsx("feDisplacementMap", {
							in: "SourceGraphic",
							in2: "SourceGraphic",
							scale: "5",
							xChannelSelector: "A",
							yChannelSelector: "A",
							x: "5",
							y: "-5",
							width: "100%",
							height: "100%",
							result: "displacementMap"
						})
					})
				}),
				/* @__PURE__ */ jsxs("nav", {
					"aria-label": "Categories",
					className: ["hidden items-center md:flex relative rounded-full backdrop-blur-md p-1 shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-colors duration-300", navTheme === "dark" ? "bg-[var(--u-navy)]/[0.02] border border-[var(--u-navy)]/5" : "bg-white/5 border border-white/10"].join(" "),
					onMouseLeave: () => setIndicatorStyle((prev) => ({
						...prev,
						opacity: 0
					})),
					children: [/* @__PURE__ */ jsx("div", {
						className: "absolute top-1 bottom-1 z-0 rounded-full transition-all duration-500 overflow-hidden",
						style: {
							...indicatorStyle,
							backdropFilter: "url(#glass-displacement) blur(4px)",
							border: "1px solid rgba(255, 255, 255, 0.8)",
							boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
							transitionTimingFunction: "linear(0, 0.0018, 0.0069 1.15%, 0.026 2.3%, 0.0637, 0.1135 5.18%, 0.2229 7.78%, 0.5977 15.84%, 0.7014, 0.7904, 0.8641, 0.9228, 0.9676 28.8%, 1.0032 31.68%, 1.0225, 1.0352 36.29%, 1.0431 38.88%, 1.046 42.05%, 1.0448 44.35%, 1.0407 47.23%, 1.0118 61.63%, 1.0025 69.41%, 0.9981 80.35%, 0.9992 99.94%)"
						},
						children: /* @__PURE__ */ jsx("div", {
							className: "absolute inset-0 rounded-full pointer-events-none",
							style: {
								background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 100%)",
								boxShadow: "inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 6px rgba(255, 255, 255, 0.2)"
							}
						})
					}), NAV_LINKS.map((l) => /* @__PURE__ */ jsxs("div", {
						className: "group relative z-10 px-4 py-2 lg:px-6",
						onMouseEnter: (e) => {
							setIndicatorStyle({
								left: e.currentTarget.offsetLeft,
								width: e.currentTarget.offsetWidth,
								opacity: 1
							});
						},
						children: [/* @__PURE__ */ jsxs("a", {
							href: l.href,
							className: ["u-mono inline-flex items-center gap-1 whitespace-nowrap text-xs uppercase tracking-[0.14em] transition-colors relative z-10", navTheme === "dark" ? "text-[var(--u-navy)]/70 group-hover:text-[var(--u-navy)]" : "text-[var(--u-bone)]/80 group-hover:text-[var(--u-navy)]"].join(" "),
							children: [l.label, /* @__PURE__ */ jsx("span", {
								"aria-hidden": "true",
								className: "text-[0.7em] opacity-70 transition-transform duration-200 group-hover:rotate-180",
								children: "▾"
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "pointer-events-none absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100",
							children: /* @__PURE__ */ jsx("div", {
								className: "min-w-[210px] overflow-hidden rounded-xl border border-[var(--u-navy)]/10 bg-white p-1.5 shadow-[0_18px_40px_-12px_rgba(16,27,51,0.28)]",
								children: l.items.map((s) => /* @__PURE__ */ jsx("a", {
									href: s.href,
									className: "block rounded-lg px-3 py-2 text-xs uppercase tracking-[0.12em] text-[var(--u-navy)]/75 transition-colors hover:bg-[var(--u-yellow)] hover:text-[var(--u-navy)]",
									children: s.label
								}, s.href))
							})
						})]
					}, l.href))]
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					"aria-label": "Open menu",
					"aria-expanded": menuOpen,
					onClick: () => setMenuOpen(true),
					className: "flex h-11 w-11 items-center justify-center md:hidden",
					children: /* @__PURE__ */ jsxs("span", {
						className: "relative block h-4 w-6",
						children: [
							/* @__PURE__ */ jsx("span", { className: `absolute left-0 top-0 h-0.5 w-6 rounded-full ${navTheme === "dark" ? "bg-[var(--u-navy)]" : "bg-[var(--u-bone)]"}` }),
							/* @__PURE__ */ jsx("span", { className: `absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 rounded-full ${navTheme === "dark" ? "bg-[var(--u-navy)]" : "bg-[var(--u-bone)]"}` }),
							/* @__PURE__ */ jsx("span", { className: `absolute bottom-0 left-0 h-0.5 w-6 rounded-full ${navTheme === "dark" ? "bg-[var(--u-navy)]" : "bg-[var(--u-bone)]"}` })
						]
					})
				})
			]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: ["fixed inset-0 z-[60] flex flex-col bg-[var(--u-bone)] transition-[opacity,transform] duration-300 md:hidden", menuOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"].join(" "),
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between px-6 pt-5 pb-3",
			children: [/* @__PURE__ */ jsx("img", {
				src: "/assets/sun/logo.png",
				alt: "Sun Umbrella",
				className: "h-11 w-auto"
			}), /* @__PURE__ */ jsx("button", {
				type: "button",
				"aria-label": "Close menu",
				onClick: () => setMenuOpen(false),
				className: "grid h-10 w-10 place-items-center rounded-full bg-[var(--u-navy)]/[0.06] text-2xl leading-none text-[var(--u-navy)] transition-colors active:bg-[var(--u-navy)]/10",
				children: "×"
			})]
		}), /* @__PURE__ */ jsxs("nav", {
			"aria-label": "Categories",
			className: "flex-1 overflow-y-auto px-6 pb-10",
			children: [NAV_LINKS.map((l, i) => /* @__PURE__ */ jsxs("div", {
				className: "border-t border-[var(--u-navy)]/10 py-4 first:border-t-0",
				children: [/* @__PURE__ */ jsxs("a", {
					href: l.href,
					onClick: () => setMenuOpen(false),
					className: "flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ jsx("span", {
						className: "u-fun-head text-[2rem] leading-none text-[var(--u-navy)]",
						children: l.label
					}), /* @__PURE__ */ jsx("span", {
						className: "u-mono text-[11px] tracking-[0.1em] text-[var(--u-navy)]/35",
						children: `0${i + 1}`
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: l.items.map((s) => /* @__PURE__ */ jsx("a", {
						href: s.href,
						onClick: () => setMenuOpen(false),
						className: "u-mono rounded-full bg-[var(--u-navy)]/[0.05] px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[var(--u-navy)]/65 transition-colors active:bg-[var(--u-yellow)] active:text-[var(--u-navy)]",
						children: s.label
					}, s.href))
				})]
			}, l.href)), /* @__PURE__ */ jsxs("div", {
				className: "mt-8 border-t border-[var(--u-navy)]/10 pt-7",
				children: [/* @__PURE__ */ jsx(TactileButton, {
					link: `${SU}/GENTS/1/products`,
					style: {
						width: "100%",
						justifyContent: "center"
					},
					label: "Shop all umbrellas"
				}), /* @__PURE__ */ jsxs("div", {
					className: "u-mono mt-6 space-y-1.5 text-xs uppercase tracking-[0.14em] text-[var(--u-navy)]/60",
					children: [
						/* @__PURE__ */ jsx("a", {
							href: "mailto:info@sunumbrellas.in",
							className: "block",
							children: "info@sunumbrellas.in"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "tel:+918212514578",
							className: "block",
							children: "+91 821 2514578"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-[var(--u-navy)]/40",
							children: "Mysuru · Mumbai · Calicut"
						})
					]
				})]
			})]
		})]
	})] });
}
/**
* A single reel clip. The mp4s are large, so nothing loads until the card
* scrolls into view (preload="none" + IntersectionObserver), then it autoplays
* muted/looping and pauses again when it leaves the viewport.
*/
function ReelVideo({ src, poster, label, caption, href, index }) {
	const ref = useRef(null);
	useEffect(() => {
		const v = ref.current;
		if (!v) return;
		const io = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				if (v.preload !== "auto") v.preload = "auto";
				v.play().catch(() => {});
			} else v.pause();
		}, { threshold: .4 });
		io.observe(v);
		return () => io.disconnect();
	}, []);
	return /* @__PURE__ */ jsxs("a", {
		href,
		className: ["u-tilt-card u-wobble group relative block w-[76vw] max-w-[300px] shrink-0 snap-center bg-black sm:w-auto", index % 2 === 0 ? "u-tilt-left" : "u-tilt-right"].join(" "),
		children: [
			/* @__PURE__ */ jsx("video", {
				ref,
				src,
				poster: poster || void 0,
				muted: true,
				loop: true,
				playsInline: true,
				preload: "none",
				"aria-label": `${label} — ${caption}`,
				className: "aspect-[9/16] w-full object-cover"
			}),
			/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" }),
			/* @__PURE__ */ jsxs("div", {
				className: "pointer-events-none absolute inset-x-0 bottom-0 p-4",
				children: [/* @__PURE__ */ jsx("p", {
					className: "u-mono text-[10px] uppercase tracking-[0.18em] text-[var(--u-yellow)]",
					children: caption
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-lg font-semibold tracking-tight text-white",
					children: label
				})]
			})
		]
	});
}
function VideoReelSection() {
	return /* @__PURE__ */ jsxs("section", {
		id: "next-gen",
		className: "u-section-cream relative overflow-hidden px-5 py-24 md:px-8 md:py-32",
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0 z-0",
			children: /* @__PURE__ */ jsx(ElementalWater, {})
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative z-10 mx-auto max-w-[1400px]",
			children: [
				/* @__PURE__ */ jsx(Sticker, {
					tone: "yellow",
					rotate: -5,
					className: "mb-6",
					children: "☂ Next-Gen"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-6 md:flex-row md:items-center md:justify-between",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "u-fun-heading max-w-[16ch] shrink-0 text-5xl md:text-7xl !text-[#F3EFE4]",
						children: /* @__PURE__ */ jsx(TypeSequence, { text: "Designed for style.\nBuilt for all weather." })
					}), /* @__PURE__ */ jsx("div", {
						className: "shrink-0",
						children: /* @__PURE__ */ jsx(TactileButton, { link: `${SHOP}/collections/all` })
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-14 flex snap-x snap-mandatory gap-8 overflow-x-auto pb-4 md:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
					children: REEL.map((r, i) => /* @__PURE__ */ jsx(ReelVideo, {
						...r,
						index: i
					}, r.label))
				})
			]
		})]
	});
}
/** Tilted marquee strip — scrolling monsoon feature callouts. */
function MonsoonMarquee() {
	const items = "☂ MONSOON READY \xA0\xA0 AUTO OPEN & CLOSE \xA0\xA0 UV PROTECTIVE \xA0\xA0 WINDPROOF \xA0\xA0 EST. 1889 \xA0\xA0 ";
	return /* @__PURE__ */ jsx("div", {
		className: "u-marquee-banner",
		"aria-hidden": "true",
		children: /* @__PURE__ */ jsxs("div", {
			className: "u-marquee",
			children: [
				/* @__PURE__ */ jsx("span", { children: items }),
				/* @__PURE__ */ jsx("span", { children: items }),
				/* @__PURE__ */ jsx("span", { children: items }),
				/* @__PURE__ */ jsx("span", { children: items })
			]
		})
	});
}
function CollectionsSection() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(MonsoonMarquee, {}), /* @__PURE__ */ jsxs("section", {
		id: "collections",
		className: "relative u-section-warm px-5 py-24 md:px-8 md:py-32 overflow-hidden",
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0 z-0",
			children: /* @__PURE__ */ jsx(DottedBg2, { bgColor: "var(--u-yellow)" })
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative z-10 mx-auto max-w-[1400px]",
			children: [
				/* @__PURE__ */ jsx(Sticker, {
					tone: "navy",
					rotate: -4,
					className: "mb-6",
					children: "☂ Monsoon Essentials"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "u-fun-heading whitespace-nowrap text-5xl md:text-7xl",
						children: /* @__PURE__ */ jsx(TypeSequence, { text: "Find your umbrella" })
					}), /* @__PURE__ */ jsx(TactileButton, {
						link: `${SHOP}/collections/all`,
						label: "Find your size"
					})]
				}),
				/* @__PURE__ */ jsx(Reveal, {
					className: "mt-16 grid gap-8 md:grid-cols-6",
					stagger: true,
					children: COLLECTIONS.map((c, index) => /* @__PURE__ */ jsxs("a", {
						href: c.href,
						className: "u-card-on-yellow group relative flex flex-col md:col-span-3",
						style: { transform: `rotate(${index % 2 === 0 ? -1.5 : 1.5}deg)` },
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative aspect-[4/3] w-full overflow-hidden",
							children: [/* @__PURE__ */ jsx("img", {
								src: c.image,
								alt: `${c.name} umbrellas by Sun Umbrella`,
								loading: "lazy",
								className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
							}), /* @__PURE__ */ jsx(Sticker, {
								tone: "yellow",
								rotate: 6,
								className: "absolute top-3 right-3 text-[11px]",
								children: c.sub
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-1 flex-col bg-white p-6",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "text-2xl font-bold tracking-tight text-[var(--u-navy)]",
									style: { fontFamily: "var(--u-fun)" },
									children: c.name
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 max-w-[44ch] text-sm leading-relaxed text-[var(--u-navy)]/65",
									children: c.blurb
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "u-mono mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--u-navy)]",
									children: [
										"Shop ",
										c.name,
										/* @__PURE__ */ jsx("span", {
											"aria-hidden": "true",
											className: "transition-transform duration-300 group-hover:translate-x-1.5",
											children: "→"
										})
									]
								})
							]
						})]
					}, c.name))
				})
			]
		})]
	})] });
}
function TestimonialMarquee() {
	const items = "★ 5-STAR REVIEWS \xA0\xA0 TRUSTED QUALITY \xA0\xA0 LOVED BY MILLIONS \xA0\xA0 SINCE 1889 \xA0\xA0 ";
	return /* @__PURE__ */ jsx("div", {
		className: "u-marquee-banner",
		"aria-hidden": "true",
		children: /* @__PURE__ */ jsxs("div", {
			className: "u-marquee",
			children: [
				/* @__PURE__ */ jsx("span", { children: items }),
				/* @__PURE__ */ jsx("span", { children: items }),
				/* @__PURE__ */ jsx("span", { children: items }),
				/* @__PURE__ */ jsx("span", { children: items })
			]
		})
	});
}
var reviewCol1 = TESTIMONIALS.slice(0, 3);
var reviewCol2 = TESTIMONIALS.slice(3, 6);
var reviewCol3 = TESTIMONIALS.slice(6, 9);
function TestimonialsSection() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(TestimonialMarquee, {}), /* @__PURE__ */ jsxs("section", {
		id: "reviews",
		className: "u-section-cream relative overflow-hidden px-5 py-24 md:px-8 md:py-32",
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0 z-0",
			children: /* @__PURE__ */ jsx(FluidField, {})
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative z-10 mx-auto max-w-[1400px]",
			children: [/* @__PURE__ */ jsxs(motion$1.div, {
				initial: {
					opacity: 0,
					y: 20
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .8,
					delay: .1,
					ease: [
						.16,
						1,
						.3,
						1
					]
				},
				viewport: { once: true },
				className: "mx-auto flex max-w-[560px] flex-col items-center text-center",
				children: [
					/* @__PURE__ */ jsx(Sticker, {
						tone: "yellow",
						rotate: 6,
						className: "mb-5",
						children: "❤️ Loved"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "u-fun-heading mt-2 text-4xl md:text-6xl !text-[#F3EFE4]",
						children: /* @__PURE__ */ jsx(TypeSequence, { text: "What our customers say" })
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-4 text-[#F3EFE4]",
						children: "135 years of keeping India dry — here’s what people carry, and why."
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-14 flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]",
				children: [
					/* @__PURE__ */ jsx(TestimonialsColumn, {
						testimonials: reviewCol1,
						duration: 15
					}),
					/* @__PURE__ */ jsx(TestimonialsColumn, {
						testimonials: reviewCol2,
						className: "hidden md:block",
						duration: 19
					}),
					/* @__PURE__ */ jsx(TestimonialsColumn, {
						testimonials: reviewCol3,
						className: "hidden lg:block",
						duration: 17
					})
				]
			})]
		})]
	})] });
}
function SiteFooter() {
	return /* @__PURE__ */ jsxs("footer", {
		id: "contact",
		className: "relative overflow-hidden border-t border-[var(--u-navy)]/10 bg-[var(--u-bone)] px-5 pt-20 pb-10 md:px-8",
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0 z-0 opacity-40",
			children: /* @__PURE__ */ jsx(LiquidGrid, {
				mode: "dots",
				lineColor: "rgba(11, 19, 36, 0.05)",
				glowColor: "rgba(11, 19, 36, 0.15)"
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative z-10 mx-auto max-w-[1400px]",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-x-6 gap-y-11 md:grid-cols-4 md:gap-10",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-navy)]/70",
							children: "Shop"
						}), /* @__PURE__ */ jsx("ul", {
							className: "mt-4 space-y-2 text-base text-[var(--u-navy)]/90",
							children: COLLECTIONS.map((c) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								className: "hover:text-[var(--u-navy)]",
								href: c.href,
								children: c.name
							}) }, c.name))
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-navy)]/70",
							children: "Company"
						}), /* @__PURE__ */ jsxs("ul", {
							className: "mt-4 space-y-2 text-base text-[var(--u-navy)]/90",
							children: [
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									className: "hover:text-[var(--u-navy)]",
									href: `${SHOP}/pages/about-us`,
									children: "Our heritage"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									className: "hover:text-[var(--u-navy)]",
									href: `${SHOP}/collections/promotional-umbrella`,
									children: "Corporate & branding"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									className: "hover:text-[var(--u-navy)]",
									href: `${SHOP}/pages/contact`,
									children: "Store locations"
								}) })
							]
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-navy)]/70",
							children: "Contact"
						}), /* @__PURE__ */ jsxs("ul", {
							className: "mt-4 space-y-2 text-base text-[var(--u-navy)]/90",
							children: [
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									className: "hover:text-[var(--u-navy)]",
									href: "mailto:info@sunumbrellas.in",
									children: "info@sunumbrellas.in"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									className: "hover:text-[var(--u-navy)]",
									href: "tel:+918212514578",
									children: "+91 821 2514578"
								}) }),
								/* @__PURE__ */ jsx("li", {
									className: "text-[var(--u-navy)]/70",
									children: "Mysuru · Mumbai · Calicut"
								})
							]
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-navy)]/70",
							children: "Our retail circle"
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-4 grid grid-cols-2 gap-2",
							children: RETAIL.map((r) => /* @__PURE__ */ jsx("div", {
								className: "relative flex h-9 items-center justify-center overflow-hidden rounded-lg border border-[var(--u-navy)]/12 bg-white",
								children: /* @__PURE__ */ jsx("img", {
									src: r.image,
									alt: r.name,
									loading: "lazy",
									className: "h-4 w-auto max-w-[80%] object-contain"
								})
							}, r.name))
						})] })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative mt-20 inline-block w-full",
					children: [/* @__PURE__ */ jsx("p", {
						"aria-hidden": "true",
						className: "u-wordmark w-full text-[13vw] uppercase leading-[0.82] text-[var(--u-navy)]/[0.07]",
						children: "Sun Umbrella"
					}), /* @__PURE__ */ jsx(Sticker, {
						tone: "yellow",
						rotate: -8,
						className: "absolute bottom-4 right-[10%] text-sm",
						children: "Est. 1889"
					})]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "u-mono mt-8 text-xs uppercase tracking-[0.2em] text-[var(--u-navy)]/70",
					children: "Sun Umbrella · Est. 1889 · Mysuru, India. All rights reserved."
				})
			]
		})]
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
function Index() {
	return /* @__PURE__ */ jsxs("div", {
		className: "u-page",
		id: "top",
		children: [
			/* @__PURE__ */ jsx(SiteNav, {}),
			/* @__PURE__ */ jsxs("main", { children: [
				/* @__PURE__ */ jsx(ScrollScrub, {
					scenes: journeyScenes,
					theme: scrollScrubTheme
				}),
				/* @__PURE__ */ jsx("div", {
					id: "hero-end",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ jsx(VideoReelSection, {}),
				/* @__PURE__ */ jsx(CollectionsSection, {}),
				/* @__PURE__ */ jsx(TestimonialsSection, {})
			] }),
			/* @__PURE__ */ jsx(SiteFooter, {})
		]
	});
}
//#endregion
export { Index as component };
