import { r as button, t as Route$4 } from "./app-Cw5QUrpY.js";
import { useEffect, useRef, useState } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, useRouter } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Lenis from "lenis";
import { gsap } from "gsap";
//#region packages/quanta/src/not-found.tsx
/** quanta NotFound boundary. */
function NotFound(props) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-q-title-md-semi-bold text-q-text-primary",
				children: "Page not found"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-q-body-sm-regular text-q-text-secondary",
				children: props?.children ?? "The page you’re looking for doesn’t exist."
			}),
			/* @__PURE__ */ jsx("a", {
				href: "/",
				className: button({
					variant: "primary",
					size: "md"
				}),
				children: "Back home"
			})
		]
	});
}
//#endregion
//#region src/styles.css?url
var styles_default = "/assets/styles-C0fFLLz0.css";
//#endregion
//#region src/lib/higgsfield-error-reporting.ts
function reportHiggsfieldError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__higgsfieldEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var app_meta_default = {
	og_title: "Sun Umbrella — Monsoon never looked this good",
	og_description: "135 years of sheltering India. Non-fold, 2-fold, 3-fold, kids and promotional umbrellas — UV-protective, auto open & close, built for all weather.",
	og_image_url: "https://d2ol7oe51mr4n9.cloudfront.net/user_3BQMqPj3509SddMch0fklByrbUU/e12a218b-9ffe-4864-929e-976790b910b9.png",
	favicon_url: "https://d2ol7oe51mr4n9.cloudfront.net/user_3BQMqPj3509SddMch0fklByrbUU/a7ab0fad-1bac-48c3-9fc4-c4f8755559cb.png",
	og_video_url: null,
	marketplace_cover_url: "https://d2ol7oe51mr4n9.cloudfront.net/user_3BQMqPj3509SddMch0fklByrbUU/45c2765f-7232-4ece-b9b7-7a26ddc4af3e.png"
};
//#endregion
//#region src/umberlla-tokens.ts
/**
* UMBERLLA brand constants used outside CSS (document head values).
* Keeps raw colour literals out of route files.
*/
var BRAND_THEME_COLOR = "#101B33";
//#endregion
//#region src/lib/smooth-scroll.tsx
/**
* Site-wide inertia scroll (Lenis). Client-only, disabled under
* prefers-reduced-motion. Lenis eases the *native* document scroll, so the
* hero scroll-scrub (which reads window.scrollY) keeps working unchanged.
* Runs its own rAF loop — no dependency on any other animation system.
*/
function SmoothScroll() {
	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const lenis = new Lenis({
			duration: 1.1,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true
		});
		window.__lenis = lenis;
		let frame = requestAnimationFrame(function loop(time) {
			lenis.raf(time);
			frame = requestAnimationFrame(loop);
		});
		return () => {
			cancelAnimationFrame(frame);
			delete window.__lenis;
			lenis.destroy();
		};
	}, []);
	return null;
}
//#endregion
//#region src/lib/wave-transition.tsx
/**
* Bi-directional organic wave/liquid page transition at the hero ↔ white
* storefront boundary. Asymmetrical, hand-tuned multi-curve edges (not sine).
*
*  - DOWN (hero → white): a white curtain with a yellow crest rises from below,
*    covers the hero (which blurs), scroll is reset to the TOP of the white
*    section under cover, then it reveals the storefront in focus.
*  - UP (white → hero): a navy curtain with a yellow crest descends from above,
*    covers the storefront, scroll is reset to the END of the hero under cover,
*    then it reveals the hero in focus.
*
* Scroll is locked for the ~1.4s so you always land deterministically at the
* top of the storefront / end of the hero, whatever your scroll speed. GSAP,
* transform + filter only, responsive, reduced-motion safe, with a safety net
* so the full-screen overlay can never get stuck.
*/
var WAVES_DOWN = [{
	fill: "var(--u-yellow)",
	d: "M0,150 C260,250 470,90 760,190 C1030,280 1230,110 1440,210 L1440,1400 L0,1400 Z"
}, {
	fill: "#ffffff",
	d: "M0,200 C220,90 440,270 720,180 C1010,85 1210,260 1440,160 L1440,1400 L0,1400 Z"
}];
var WAVES_UP = [{
	fill: "var(--u-yellow)",
	d: "M0,0 L1440,0 L1440,1250 C1180,1160 980,1330 690,1230 C410,1135 210,1320 0,1230 Z"
}, {
	fill: "var(--u-navy)",
	d: "M0,0 L1440,0 L1440,1200 C1210,1100 1010,1290 720,1190 C430,1090 220,1280 0,1190 Z"
}];
function WaveTransition() {
	const overlayRef = useRef(null);
	const downRef = useRef([]);
	const upRef = useRef([]);
	useEffect(() => {
		const overlay = overlayRef.current;
		const downLayers = downRef.current.filter(Boolean);
		const upLayers = upRef.current.filter(Boolean);
		const sentinel = document.getElementById("hero-end");
		if (!overlay || downLayers.length === 0 || upLayers.length === 0 || !sentinel) return;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const hero = document.querySelector(".scroll-scrub");
		const white = document.getElementById("next-gen");
		const getLenis = () => window.__lenis;
		const rest = () => {
			gsap.set(downLayers, { yPercent: 120 });
			gsap.set(upLayers, { yPercent: -120 });
		};
		rest();
		let playing = false;
		const play = (dir) => {
			if (playing || reduced) return;
			playing = true;
			const lenis = getLenis();
			lenis?.stop();
			gsap.set(overlay, { autoAlpha: 1 });
			rest();
			const layers = dir === "down" ? downLayers : upLayers;
			const outgoing = dir === "down" ? hero : white;
			const incoming = dir === "down" ? white : hero;
			const finish = () => {
				gsap.set(overlay, { autoAlpha: 0 });
				rest();
				if (outgoing) gsap.set(outgoing, { clearProps: "filter" });
				lenis?.start();
				playing = false;
			};
			const safety = window.setTimeout(finish, 2600);
			const tl = gsap.timeline({ onComplete: () => {
				window.clearTimeout(safety);
				finish();
			} });
			tl.to(layers, {
				yPercent: 0,
				duration: .9,
				ease: "power3.out",
				stagger: .09
			}, 0);
			if (outgoing) tl.to(outgoing, {
				filter: "blur(8px)",
				duration: .7,
				ease: "power2.in"
			}, 0);
			tl.call(() => {
				const l = getLenis();
				if (!l) return;
				const heroEndAbs = sentinel.getBoundingClientRect().top + window.scrollY;
				const target = dir === "down" ? heroEndAbs : heroEndAbs - window.innerHeight;
				l.scrollTo(Math.max(0, target), {
					immediate: true,
					force: true
				});
			}, [], .9);
			tl.to(overlay, {
				autoAlpha: 0,
				duration: .45,
				ease: "power2.inOut"
			}, 1.02);
			if (incoming) tl.fromTo(incoming, { filter: "blur(10px)" }, {
				filter: "blur(0px)",
				duration: .6,
				ease: "power2.out"
			}, 1);
		};
		window.__wave = {
			play,
			seekDown: (p) => {
				gsap.set(overlay, { autoAlpha: 1 });
				gsap.set(upLayers, { yPercent: -120 });
				gsap.set(downLayers, { yPercent: gsap.utils.interpolate(120, 0, p) });
			},
			seekUp: (p) => {
				gsap.set(overlay, { autoAlpha: 1 });
				gsap.set(downLayers, { yPercent: 120 });
				gsap.set(upLayers, { yPercent: gsap.utils.interpolate(-120, 0, p) });
			}
		};
		const boundary = () => window.innerHeight * .4;
		let inWhite = sentinel.getBoundingClientRect().top < boundary();
		const onScroll = () => {
			if (playing) return;
			const nowWhite = sentinel.getBoundingClientRect().top < boundary();
			if (nowWhite && !inWhite) {
				inWhite = true;
				play("down");
			} else if (!nowWhite && inWhite) {
				inWhite = false;
				play("up");
			}
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		ref: overlayRef,
		"aria-hidden": "true",
		className: "wave-transition",
		style: {
			visibility: "hidden",
			opacity: 0
		},
		children: [WAVES_DOWN.map((w, i) => /* @__PURE__ */ jsx("svg", {
			ref: (el) => {
				if (el) downRef.current[i] = el;
			},
			className: "wave-transition__layer",
			viewBox: "0 0 1440 1400",
			preserveAspectRatio: "none",
			children: /* @__PURE__ */ jsx("path", {
				d: w.d,
				fill: w.fill
			})
		}, `d${i}`)), WAVES_UP.map((w, i) => /* @__PURE__ */ jsx("svg", {
			ref: (el) => {
				if (el) upRef.current[i] = el;
			},
			className: "wave-transition__layer",
			viewBox: "0 0 1440 1400",
			preserveAspectRatio: "none",
			children: /* @__PURE__ */ jsx("path", {
				d: w.d,
				fill: w.fill
			})
		}, `u${i}`))]
	});
}
//#endregion
//#region src/components/umberlla/full-screen-loader.tsx
var START_FRAME = 24;
var TOTAL_FRAMES = 232;
var FRAME_DURATION = 1e3 / 24;
function FullScreenLoader() {
	const layersRef = useRef([]);
	const imgRef = useRef(null);
	const textRef = useRef(null);
	const [isRemoved, setIsRemoved] = useState(false);
	const [progress, setProgress] = useState(0);
	useEffect(() => {
		document.body.style.overflow = "hidden";
		const images = [];
		for (let i = 0; i < TOTAL_FRAMES; i++) images.push(`/assets/sun/sun-model/ezgif-frame-${(i + START_FRAME).toString().padStart(3, "0")}.png`);
		for (let i = 0; i < Math.min(10, TOTAL_FRAMES); i++) {
			const img = new Image();
			img.src = images[i];
		}
		setProgress(Math.round(Math.min(10, TOTAL_FRAMES) / TOTAL_FRAMES * 100));
		let currentPreloadIndex = 10;
		const preloadRest = () => {
			if (currentPreloadIndex >= TOTAL_FRAMES) {
				setProgress(100);
				return;
			}
			const end = Math.min(currentPreloadIndex + 10, TOTAL_FRAMES);
			for (let i = currentPreloadIndex; i < end; i++) {
				const img = new Image();
				img.src = images[i];
			}
			currentPreloadIndex = end;
			setProgress(Math.round(currentPreloadIndex / TOTAL_FRAMES * 100));
			setTimeout(preloadRest, 50);
		};
		setTimeout(preloadRest, 100);
		let currentFrame = 0;
		let lastTime = performance.now();
		let rafId;
		let isExiting = false;
		const loop = (time) => {
			if (isExiting) return;
			const elapsed = time - lastTime;
			if (elapsed > FRAME_DURATION) {
				currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
				lastTime = time - elapsed % FRAME_DURATION;
				if (imgRef.current) imgRef.current.src = images[currentFrame];
				if (textRef.current) if (currentFrame < 45) textRef.current.innerText = "SUMMONING THE SUN...";
				else if (currentFrame < 90) textRef.current.innerText = "WEAVING THE CANOPY...";
				else if (currentFrame < 135) textRef.current.innerText = "CHECKING THE WEATHER...";
				else if (currentFrame < 180) textRef.current.innerText = "TESTING WIND RESISTANCE...";
				else textRef.current.innerText = "READY FOR THE SHADE!";
			}
			rafId = requestAnimationFrame(loop);
		};
		rafId = requestAnimationFrame(loop);
		const MIN_LOAD_TIME = 2500;
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
			gsap.to(layers, {
				yPercent: -100,
				borderBottomLeftRadius: "50%",
				borderBottomRightRadius: "50%",
				ease: "power4.inOut",
				duration: 1.2,
				stagger: .15,
				onComplete: () => {
					setIsRemoved(true);
				}
			});
			setTimeout(() => {
				document.body.style.overflow = "";
				const scrollProxy = { y: window.scrollY };
				gsap.to(scrollProxy, {
					y: window.scrollY + window.innerHeight * .6,
					duration: 2.5,
					ease: "power2.inOut",
					onUpdate: () => window.scrollTo(0, scrollProxy.y)
				});
			}, 600);
		};
		const attemptExit = () => {
			const elapsed = Date.now() - startTime;
			if (elapsed >= MIN_LOAD_TIME) exitLoader();
			else setTimeout(exitLoader, MIN_LOAD_TIME - elapsed);
		};
		if (document.readyState === "complete") attemptExit();
		else window.addEventListener("load", attemptExit);
		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener("load", attemptExit);
			document.body.style.overflow = "";
		};
	}, []);
	if (isRemoved) return null;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("div", {
			ref: (el) => {
				if (el) layersRef.current[2] = el;
			},
			className: "fixed inset-0 z-[99997] bg-[#f2c230]",
			style: { transformOrigin: "top center" }
		}),
		/* @__PURE__ */ jsx("div", {
			ref: (el) => {
				if (el) layersRef.current[1] = el;
			},
			className: "fixed inset-0 z-[99998] bg-[#101b33]",
			style: { transformOrigin: "top center" }
		}),
		/* @__PURE__ */ jsxs("div", {
			ref: (el) => {
				if (el) layersRef.current[0] = el;
			},
			id: "loader-wrapper",
			className: "fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#f3efe4] overflow-hidden",
			style: { transformOrigin: "top center" },
			children: [/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0",
				children: /* @__PURE__ */ jsx("span", {
					className: "text-[35vw] font-bold text-[#3A2A21] opacity-5 tracking-tighter leading-none translate-y-12",
					children: progress.toString().padStart(2, "0")
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "relative flex flex-col items-center justify-center z-10 w-full h-full",
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative flex flex-col items-center justify-center w-[340px] h-[340px] md:w-[540px] md:h-[540px] translate-y-4 md:translate-y-8",
					children: [
						/* @__PURE__ */ jsxs("svg", {
							className: "absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-0",
							viewBox: "0 0 540 540",
							children: [/* @__PURE__ */ jsx("circle", {
								cx: "270",
								cy: "270",
								r: "250",
								fill: "none",
								stroke: "#3A2A21",
								strokeOpacity: "0.05",
								strokeWidth: "2"
							}), /* @__PURE__ */ jsx("circle", {
								cx: "270",
								cy: "270",
								r: "250",
								fill: "none",
								stroke: "#f2c230",
								strokeWidth: "4",
								strokeLinecap: "round",
								strokeDasharray: 2 * Math.PI * 250,
								strokeDashoffset: 2 * Math.PI * 250 - progress / 100 * (2 * Math.PI * 250),
								className: "transition-all duration-300 ease-out"
							})]
						}),
						/* @__PURE__ */ jsx("img", {
							ref: imgRef,
							id: "loader-sequence",
							className: "w-[240px] md:w-[380px] h-auto drop-shadow-[0_4px_24px_rgba(16,27,51,0.15)] relative z-10",
							alt: "",
							"aria-hidden": "true",
							src: `/assets/sun/sun-model/ezgif-frame-${START_FRAME.toString().padStart(3, "0")}.png`
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-center mt-2 md:mt-4 relative z-10",
							children: [/* @__PURE__ */ jsx("div", {
								ref: textRef,
								id: "loader-text",
								className: "font-bold uppercase tracking-[0.2em] text-[#3A2A21] text-[11px] md:text-base text-center",
								children: "SUMMONING THE SUN..."
							}), /* @__PURE__ */ jsxs("div", {
								className: "font-mono text-[10px] md:text-xs text-[#3A2A21]/60 tracking-widest mt-1 md:mt-2",
								children: [progress, "%"]
							})]
						})
					]
				})
			})]
		})
	] });
}
//#endregion
//#region src/routes/__root.tsx
var DEFAULT_TITLE = "Higgsfield App";
var DEFAULT_DESCRIPTION = "Higgsfield Generated Project";
var appMeta = app_meta_default;
var APP_HOST_ZONES = ["higgsfield.app", "higgsfield-dev.app"];
function toOwnAssetUrl(value) {
	if (!value) return null;
	if (value.startsWith("/")) return value;
	try {
		const u = new URL(value);
		if (APP_HOST_ZONES.some((zone) => u.hostname === zone || u.hostname.endsWith(`.${zone}`))) return u.pathname + u.search;
		return value;
	} catch {
		return value;
	}
}
function buildHead(meta) {
	const title = meta.og_title ?? DEFAULT_TITLE;
	const description = meta.og_description ?? DEFAULT_DESCRIPTION;
	const ogImage = toOwnAssetUrl(meta.og_image_url);
	const favicon = toOwnAssetUrl(meta.favicon_url);
	const ogVideo = toOwnAssetUrl(meta.og_video_url);
	return {
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title },
			{
				name: "description",
				content: description
			},
			{
				name: "author",
				content: "Higgsfield"
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: ogImage ? "summary_large_image" : "summary"
			},
			{
				name: "twitter:site",
				content: "@Higgsfield"
			},
			...ogImage ? [{
				property: "og:image",
				content: ogImage
			}, {
				name: "twitter:image",
				content: ogImage
			}] : [],
			...ogVideo ? [{
				property: "og:video",
				content: ogVideo
			}] : [],
			{
				name: "theme-color",
				content: BRAND_THEME_COLOR
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Outfit:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				sizes: "any"
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/assets/brand/favicon-32.png"
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/assets/brand/favicon-16.png"
			},
			{
				rel: "apple-touch-icon",
				href: "/assets/brand/apple-touch-icon.png"
			},
			{
				rel: "manifest",
				href: "/site.webmanifest"
			},
			...favicon ? [{
				rel: "icon",
				href: favicon
			}] : []
		]
	};
}
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-dvh items-center justify-center bg-q-background-primary px-4",
		children: /* @__PURE__ */ jsx(NotFound, {
			className: "mx-auto max-w-md",
			icon: /* @__PURE__ */ jsx("span", {
				className: "text-q-title-md-semi-bold text-q-text-primary",
				children: "404"
			}),
			title: "Page not found",
			subtitle: "The page you're looking for doesn't exist or has been moved.",
			children: /* @__PURE__ */ jsx(Link, {
				to: "/",
				className: button({
					variant: "primary",
					size: "md"
				}, "mt-3"),
				children: "Go home"
			})
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	useEffect(() => {
		reportHiggsfieldError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-dvh items-center justify-center bg-q-background-primary px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-q-title-lg-semi-bold text-q-text-primary",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-q-body-sm-regular text-q-text-secondary",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-4 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: button({
							variant: "primary",
							size: "md"
						}),
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: button({
							variant: "outline",
							size: "md"
						}),
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$3 = createRootRouteWithContext()({
	head: () => buildHead(appMeta),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		"data-theme": "default-dark",
		style: { colorScheme: "dark" },
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", {
			className: "bg-q-background-primary text-q-text-primary",
			children: [children, /* @__PURE__ */ jsx(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$3.useRouteContext();
	useEffect(() => {}, []);
	return /* @__PURE__ */ jsxs(QueryClientProvider, {
		client: queryClient,
		children: [
			/* @__PURE__ */ jsx(FullScreenLoader, {}),
			/* @__PURE__ */ jsx(SmoothScroll, {}),
			/* @__PURE__ */ jsx(WaveTransition, {}),
			/* @__PURE__ */ jsx("div", {
				className: "u-grain",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ jsx(Outlet, {})
		]
	});
}
//#endregion
//#region src/routes/sitemap[.]xml.ts
var Route$2 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async ({ request }) => {
	const origin = new URL(request.url).origin;
	const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	const xml = [
		"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
		"<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
		"  <url>",
		`    <loc>${origin}/</loc>`,
		`    <lastmod>${today}</lastmod>`,
		"    <changefreq>weekly</changefreq>",
		"    <priority>1.0</priority>",
		"  </url>",
		"</urlset>"
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml; charset=utf-8",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
//#endregion
//#region src/routes/robots[.]txt.ts
var Route$1 = createFileRoute("/robots.txt")({ server: { handlers: { GET: async ({ request }) => {
	const body = [
		"User-agent: *",
		"Allow: /",
		"",
		`Sitemap: ${new URL(request.url).origin}/sitemap.xml`
	].join("\n");
	return new Response(body, { headers: {
		"Content-Type": "text/plain; charset=utf-8",
		"Cache-Control": "public, max-age=86400"
	} });
} } } });
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter = () => import("./routes-B4B6T2s1.js");
var Route = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
//#endregion
//#region src/routeTree.gen.ts
var SitemapDotxmlRoute = Route$2.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$3
});
var RobotsDottxtRoute = Route$1.update({
	id: "/robots.txt",
	path: "/robots.txt",
	getParentRoute: () => Route$3
});
var AppRoute = Route$4.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => Route$3
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	AppRoute,
	RobotsDottxtRoute,
	SitemapDotxmlRoute
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
