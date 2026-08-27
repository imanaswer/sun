import { n as Button, t as Route } from "./app-Cw5QUrpY.js";
import * as React$1 from "react";
import { Children, isValidElement, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Activity, BarChart3, Blocks, CheckCircle2, ChevronUp, Clock3, Cloud, Copy, Download, Ellipsis, EllipsisVertical, FolderOpen, Heart, Info, PanelLeftClose, PanelRightClose, Plus, Share2, Sparkle, Sparkles, Trash2, Video, X } from "lucide-react";
import { GearSix, Pulse, Sparkle as Sparkle$1, SquaresFour } from "@phosphor-icons/react";
import { useRender } from "@base-ui/react/use-render";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Dialog } from "@base-ui/react/dialog";
//#region packages/quanta/src/icon.tsx
var cx$10 = (...a) => a.filter(Boolean).join(" ");
var SIZE$2 = {
	xs: "size-3",
	sm: "size-4",
	md: "size-5",
	lg: "size-6",
	xl: "size-8"
};
var COLOR$1 = {
	primary: "text-q-icon-primary",
	secondary: "text-q-text-secondary",
	tertiary: "text-q-text-tertiary",
	inverse: "text-q-icon-inverse",
	brand: "text-q-brand-primary",
	danger: "text-red-500",
	neutral: ""
};
/** Class-name helper mirroring quanta's `icon({ size, color })`. */
function icon(opts = {}, extra = "") {
	const { size = "md", color } = opts;
	return cx$10(SIZE$2[size] ?? SIZE$2.md, color ? COLOR$1[color] ?? "" : "", extra);
}
function Icon({ as: As, size = "md", color, className, ...rest }) {
	if (!As) return null;
	return /* @__PURE__ */ jsx(As, {
		className: icon({
			size,
			color
		}, className),
		...rest
	});
}
//#endregion
//#region packages/quanta/src/input.tsx
var cx$9 = (...a) => a.filter(Boolean).join(" ");
/** quanta Input — optional `label`, styled text field. */
var Input = React$1.forwardRef(function Input({ label, className, id, ...rest }, ref) {
	const field = /* @__PURE__ */ jsx("input", {
		ref,
		id,
		className: cx$9("h-9 w-full rounded-lg border border-q-border-default bg-q-transparent-light-05 px-3 text-sm text-q-text-primary outline-none placeholder:text-q-text-tertiary focus:border-q-brand-primary", className),
		...rest
	});
	if (!label) return field;
	return /* @__PURE__ */ jsxs("label", {
		className: "flex flex-col gap-1",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-q-caption-sm-medium text-q-text-secondary",
			children: label
		}), field]
	});
});
//#endregion
//#region packages/quanta/src/modal.tsx
var cx$8 = (...a) => a.filter(Boolean).join(" ");
var Ctx$1 = React$1.createContext({
	open: false,
	setOpen: () => {}
});
function Root$3({ children, open: c, onOpenChange }) {
	const [u, setU] = React$1.useState(false);
	const open = c ?? u;
	const setOpen = onOpenChange ?? setU;
	return /* @__PURE__ */ jsx(Ctx$1.Provider, {
		value: {
			open,
			setOpen
		},
		children
	});
}
function Trigger$1({ children, className, ...rest }) {
	const { setOpen } = React$1.useContext(Ctx$1);
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		onClick: () => setOpen(true),
		className: cx$8(className),
		...rest,
		children
	});
}
function Content$1({ children, className, ...rest }) {
	const { open, setOpen } = React$1.useContext(Ctx$1);
	if (!open) return null;
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-q-transparent-dark-80 p-4",
		onClick: () => setOpen(false),
		children: /* @__PURE__ */ jsx("div", {
			role: "dialog",
			"aria-modal": "true",
			className: cx$8("flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-q-border-subtle bg-q-background-primary text-q-text-primary shadow-2xl", className),
			onClick: (e) => e.stopPropagation(),
			...rest,
			children
		})
	});
}
var Header$1 = ({ className, children, ...p }) => /* @__PURE__ */ jsx("div", {
	className: cx$8("flex items-center justify-between gap-3 border-b border-q-border-subtle p-4", className),
	...p,
	children
});
var Title$1 = ({ className, children, ...p }) => /* @__PURE__ */ jsx("h2", {
	className: cx$8("text-q-title-md-semi-bold text-q-text-primary", className),
	...p,
	children
});
var Body$2 = ({ className, children, ...p }) => /* @__PURE__ */ jsx("div", {
	className: cx$8("flex-1 overflow-auto p-4", className),
	...p,
	children
});
var Footer$1 = ({ className, children, ...p }) => /* @__PURE__ */ jsx("div", {
	className: cx$8("flex items-center justify-between gap-3 border-t border-q-border-subtle p-4", className),
	...p,
	children
});
var FooterActions = ({ className, children, ...p }) => /* @__PURE__ */ jsx("div", {
	className: cx$8("flex items-center gap-2", className),
	...p,
	children
});
var FooterCaption = ({ className, children, ...p }) => /* @__PURE__ */ jsx("span", {
	className: cx$8("text-q-caption-sm-regular text-q-text-tertiary", className),
	...p,
	children
});
function Close({ children, className, ...rest }) {
	const { setOpen } = React$1.useContext(Ctx$1);
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		onClick: () => setOpen(false),
		className: cx$8(className),
		...rest,
		children
	});
}
function CloseButton({ className, ...rest }) {
	const { setOpen } = React$1.useContext(Ctx$1);
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		"aria-label": "Close",
		onClick: () => setOpen(false),
		className: cx$8("grid size-8 place-items-center rounded-lg text-q-text-secondary hover:bg-q-transparent-light-05 hover:text-q-text-primary", className),
		...rest,
		children: /* @__PURE__ */ jsx(X, { className: "size-4" })
	});
}
var Modal = {
	Root: Root$3,
	Trigger: Trigger$1,
	Content: Content$1,
	Header: Header$1,
	Title: Title$1,
	Body: Body$2,
	Footer: Footer$1,
	FooterActions,
	FooterCaption,
	Close,
	CloseButton
};
//#endregion
//#region packages/quanta/src/typography.tsx
var cx$7 = (...a) => a.filter(Boolean).join(" ");
var COLOR = {
	primary: "text-q-text-primary",
	secondary: "text-q-text-secondary",
	tertiary: "text-q-text-tertiary",
	inverse: "text-q-text-inverse",
	brand: "text-q-brand-primary",
	danger: "text-red-500"
};
/**
* quanta Typography: `variant` maps to the `text-q-<variant>` utility (defined
* in tailwind.css), `color` to a semantic text color. `as` picks the element.
*/
function Typography({ as: As = "span", variant = "body-md-regular", color = "primary", truncate, className, children, ...rest }) {
	return /* @__PURE__ */ jsx(As, {
		className: cx$7(variant && `text-q-${variant}`, color && (COLOR[color] ?? `text-q-text-${color}`), truncate && "truncate", className),
		...rest,
		children
	});
}
//#endregion
//#region src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region src/components/prompt-box/prompt-box.tsx
var SURFACE_CLASS = {
	plain: "",
	glass: "q-prompt-box-glass"
};
function Root$2({ surface = "plain", className, children: childrenProp, ...props }) {
	const children = Children.toArray(childrenProp);
	const modeRailChildren = [];
	const dockChildren = [];
	for (const child of children) if (isValidElement(child) && child.type === ModeRail) modeRailChildren.push(child);
	else dockChildren.push(child);
	return /* @__PURE__ */ jsxs("div", {
		className: cn("q-prompt-box", SURFACE_CLASS[surface], className),
		...props,
		children: [modeRailChildren, dockChildren.length > 0 ? /* @__PURE__ */ jsx("div", {
			className: "q-prompt-box-dock",
			children: /* @__PURE__ */ jsx("div", {
				className: "q-prompt-box-dock-surface",
				children: dockChildren
			})
		}) : null]
	});
}
function ModeRail({ hidden = false, className, ...props }) {
	if (hidden) return null;
	return /* @__PURE__ */ jsx("div", {
		className: cn("q-prompt-box-mode-rail", className),
		...props
	});
}
function Mode({ active = false, hidden = false, start, children, render, className, ref, ...props }) {
	const element = useRender({
		render,
		defaultTagName: "button",
		ref,
		props: {
			className: cn("q-prompt-box-mode", active && "q-prompt-box-mode-active", className),
			...render == null ? { type: "button" } : {},
			...active ? { "aria-pressed": true } : {},
			children: /* @__PURE__ */ jsxs(Fragment, { children: [start != null ? /* @__PURE__ */ jsx("span", {
				className: "q-prompt-box-mode-icon",
				children: start
			}) : null, children != null ? /* @__PURE__ */ jsx("span", {
				className: "q-prompt-box-mode-label",
				children
			}) : null] }),
			...props
		}
	});
	return hidden ? null : element;
}
function Body$1({ className, surfaceClassName, children, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("q-prompt-box-body", className),
		...props,
		children: /* @__PURE__ */ jsx("div", {
			className: cn("q-prompt-box-surface", surfaceClassName),
			children
		})
	});
}
function Field({ className, rows = 1, ...props }) {
	return /* @__PURE__ */ jsx("textarea", {
		rows,
		className: cn("q-prompt-box-field", className),
		...props
	});
}
function Actions({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("q-prompt-box-actions", className),
		...props
	});
}
function Pill({ start, end, children, iconOnly = false, hidden = false, render, className, ref, ...props }) {
	const element = useRender({
		render,
		defaultTagName: "button",
		ref,
		props: {
			className: cn("q-prompt-box-pill", iconOnly && "q-prompt-box-pill-icon-only", className),
			...render == null ? { type: "button" } : {},
			children: /* @__PURE__ */ jsxs(Fragment, { children: [
				start != null ? /* @__PURE__ */ jsx("span", {
					className: "q-prompt-box-pill-start",
					children: start
				}) : null,
				children != null ? /* @__PURE__ */ jsx("span", {
					className: "q-prompt-box-pill-label",
					children
				}) : null,
				end != null ? /* @__PURE__ */ jsx("span", {
					className: "q-prompt-box-pill-end",
					children: end
				}) : null
			] }),
			...props
		}
	});
	return hidden ? null : element;
}
function Uploads({ hidden = false, className, ...props }) {
	if (hidden) return null;
	return /* @__PURE__ */ jsx("div", {
		className: cn("q-prompt-box-uploads", className),
		...props
	});
}
function Upload({ label, src, alt = "", hidden = false, add, children, render, className, ref, ...props }) {
	const element = useRender({
		render,
		defaultTagName: "button",
		ref,
		props: {
			className: cn("q-prompt-box-upload", src != null && "q-prompt-box-upload-filled", className),
			...render == null ? { type: "button" } : {},
			children: /* @__PURE__ */ jsxs(Fragment, { children: [
				src != null ? /* @__PURE__ */ jsx("img", {
					className: "q-prompt-box-upload-media",
					src,
					alt
				}) : null,
				/* @__PURE__ */ jsx("span", {
					className: "q-prompt-box-upload-add",
					children: add ?? /* @__PURE__ */ jsx(PlusGlyph, {})
				}),
				label != null ? /* @__PURE__ */ jsx("span", {
					className: "q-prompt-box-upload-label",
					children: label
				}) : null,
				children
			] }),
			...props
		}
	});
	return hidden ? null : element;
}
/** The small "+" corner glyph rendered inside an empty Upload tile by default. */
function PlusGlyph() {
	return /* @__PURE__ */ jsx("svg", {
		viewBox: "0 0 16 16",
		fill: "none",
		"aria-hidden": true,
		width: "16",
		height: "16",
		children: /* @__PURE__ */ jsx("path", {
			d: "M8 3.5v9M3.5 8h9",
			stroke: "currentColor",
			strokeWidth: "1.5",
			strokeLinecap: "round"
		})
	});
}
function Generate({ cost, oldCost, start, children = "Generate", render, className, ref, ...props }) {
	const hasMeta = cost != null || oldCost != null || start != null;
	return useRender({
		render,
		defaultTagName: "button",
		ref,
		props: {
			className: cn("q-prompt-box-generate", className),
			...render == null ? { type: "button" } : {},
			children: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
				className: "q-prompt-box-generate-label",
				children
			}), hasMeta ? /* @__PURE__ */ jsxs("span", {
				className: "q-prompt-box-generate-meta",
				children: [
					start ?? /* @__PURE__ */ jsx(Sparkle, {}),
					oldCost != null ? /* @__PURE__ */ jsx("span", {
						className: "q-prompt-box-generate-old",
						children: oldCost
					}) : null,
					cost != null ? /* @__PURE__ */ jsx("span", {
						className: "q-prompt-box-generate-cost",
						children: cost
					}) : null
				]
			}) : null] }),
			...props
		}
	});
}
var PromptBox = {
	Root: Root$2,
	ModeRail,
	Mode,
	Body: Body$1,
	Field,
	Actions,
	Pill,
	Uploads,
	Upload,
	Generate
};
//#endregion
//#region packages/quanta/src/loader.tsx
var cx$6 = (...a) => a.filter(Boolean).join(" ");
var SIZE$1 = {
	xs: "size-3",
	sm: "size-4",
	md: "size-5",
	lg: "size-6"
};
/** quanta Loader — a spinning ring. */
function Loader({ size = "sm", className, ...rest }) {
	return /* @__PURE__ */ jsx("span", {
		role: "status",
		className: cx$6("inline-block animate-spin rounded-full border-2 border-current border-t-transparent opacity-70", SIZE$1[size] ?? SIZE$1.sm, className),
		...rest
	});
}
//#endregion
//#region packages/quanta/src/media.tsx
var cx$5 = (...a) => a.filter(Boolean).join(" ");
/** quanta Media — a framed media container with Image/Video/Overlay/Fallback. */
function Media({ className, children, ...rest }) {
	return /* @__PURE__ */ jsx("div", {
		className: cx$5("relative overflow-hidden bg-q-background-secondary", className),
		...rest,
		children
	});
}
Media.Image = ({ className, ...p }) => /* @__PURE__ */ jsx("img", {
	className: cx$5("h-full w-full object-cover", className),
	...p
});
Media.Video = ({ className, ...p }) => /* @__PURE__ */ jsx("video", {
	className: cx$5("h-full w-full object-cover", className),
	...p
});
Media.Overlay = ({ className, children, ...p }) => /* @__PURE__ */ jsx("div", {
	className: cx$5("absolute inset-0", className),
	...p,
	children
});
Media.Fallback = ({ className, children, ...p }) => /* @__PURE__ */ jsx("div", {
	className: cx$5("flex h-full w-full items-center justify-center bg-q-background-secondary text-q-text-tertiary", className),
	...p,
	children
});
//#endregion
//#region src/components/generation-card/generation-card.tsx
/** The pulsing top glow + "Generating" status pill (Cinema-Studio-V4 20037:25838). */
function GeneratingOverlay({ label }) {
	return /* @__PURE__ */ jsxs("span", {
		className: "q-generation-card-generating",
		children: [/* @__PURE__ */ jsx("span", {
			className: "q-generation-card-glow",
			"aria-hidden": "true"
		}), /* @__PURE__ */ jsxs("span", {
			className: "q-generation-card-status",
			children: [/* @__PURE__ */ jsx(Loader, {
				variant: "circle",
				size: "xs",
				color: "brand",
				"aria-label": typeof label === "string" ? label : "Generating"
			}), /* @__PURE__ */ jsx(Typography, {
				as: "span",
				variant: "body-sm-medium",
				color: "brand",
				"aria-hidden": "true",
				children: label
			})]
		})]
	});
}
function GenerationCard({ state = "ready", src, alt = "", ratio = "video", media, title, generatingLabel = "Generating", className, children, render, ref, ...props }) {
	const generating = state === "generating";
	const content = /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(Media, {
			ratio,
			rounded: "md",
			className: "q-generation-card-media",
			children: generating ? media ?? /* @__PURE__ */ jsx(Media.Fallback, { className: "q-generation-card-canvas" }) : media ?? (src != null ? /* @__PURE__ */ jsx(Media.Image, {
				src,
				alt
			}) : /* @__PURE__ */ jsx(Media.Fallback, {}))
		}),
		!generating && title != null ? /* @__PURE__ */ jsx(Media.Overlay, {
			placement: "bottom",
			className: "q-generation-card-caption",
			children: /* @__PURE__ */ jsx(Typography, {
				as: "span",
				variant: "body-sm-semi-bold",
				color: "primary",
				className: "q-generation-card-title",
				children: title
			})
		}) : null,
		generating ? /* @__PURE__ */ jsx(GeneratingOverlay, { label: generatingLabel }) : null,
		children
	] });
	return useRender({
		render,
		defaultTagName: "div",
		ref,
		props: {
			className: cn("q-generation-card", className),
			"data-state": state,
			children: content,
			...props
		}
	});
}
//#endregion
//#region packages/quanta/src/avatar.tsx
var cx$4 = (...a) => a.filter(Boolean).join(" ");
var SIZE = {
	xxs: "size-4 text-[8px]",
	xs: "size-6 text-[10px]",
	sm: "size-8 text-xs",
	md: "size-10 text-sm",
	lg: "size-12 text-base"
};
var BG = {
	mint: "bg-emerald-500/30 text-emerald-200",
	blue: "bg-sky-500/30 text-sky-200",
	violet: "bg-violet-500/30 text-violet-200",
	amber: "bg-amber-500/30 text-amber-100",
	rose: "bg-rose-500/30 text-rose-200",
	slate: "bg-slate-500/30 text-slate-200"
};
/** quanta Avatar — image or initial fallback. */
function Avatar({ size = "sm", color = "slate", src, alt, className, ...rest }) {
	const initial = (alt ?? "").trim().charAt(0).toUpperCase() || "•";
	return /* @__PURE__ */ jsx("span", {
		className: cx$4("inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium", SIZE[size] ?? SIZE.sm, BG[color] ?? BG.slate, className),
		...rest,
		children: src ? /* @__PURE__ */ jsx("img", {
			src,
			alt,
			className: "h-full w-full object-cover"
		}) : initial
	});
}
//#endregion
//#region packages/quanta/src/glass.ts
var cx$3 = (...a) => a.filter(Boolean).join(" ");
/** quanta `glass()` class helper — translucent frosted surface. */
function glass(extra = "") {
	return cx$3("bg-q-transparent-light-05 backdrop-blur-md border border-q-border-subtle", extra);
}
//#endregion
//#region src/lib/download-media.ts
var EXTENSION_BY_TYPE = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
	"image/gif": "gif",
	"video/mp4": "mp4",
	"video/webm": "webm"
};
function filenameFromUrl(url, contentType) {
	try {
		const name = new URL(url, window.location.href).pathname.split("/").pop();
		if (name && name.includes(".")) return decodeURIComponent(name);
	} catch {}
	return `generation.${(contentType ? EXTENSION_BY_TYPE[contentType.split(";")[0] ?? ""] : void 0) ?? "bin"}`;
}
function clickDownload(href, filename, openInNewTab = false) {
	const anchor = document.createElement("a");
	anchor.href = href;
	anchor.download = filename;
	anchor.rel = "noopener";
	if (openInNewTab) anchor.target = "_blank";
	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();
}
/**
* Download a generated image or video. Fetching to a blob makes `download`
* reliable for same-origin and CORS-enabled media; the direct-link fallback
* still handles storage URLs that intentionally disallow fetch access.
*/
async function downloadMedia(url, filename) {
	if (typeof document === "undefined" || !url) return;
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`Download failed with ${response.status}`);
		const blob = await response.blob();
		const objectUrl = URL.createObjectURL(blob);
		clickDownload(objectUrl, filename ?? filenameFromUrl(url, blob.type));
		window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1e3);
	} catch {
		clickDownload(url, filename ?? filenameFromUrl(url), true);
	}
}
//#endregion
//#region src/components/generation-detail.tsx
var DEMO_GENERATION = {
	src: "/presets/how-product-works.png",
	mediaType: "image",
	aspectRatio: 2 / 3,
	author: {
		name: "retro_strawberry",
		role: "Author"
	},
	status: "Uploaded",
	fileType: "JPG",
	size: "2.4 MB",
	uploadedAt: "12.05.2026, 01:22",
	lastUsedAt: "12.05.2026, 16:43",
	prompt: "A model in a translucent floral raincoat standing beside pale horses in a windswept meadow, editorial fashion photography, soft daylight."
};
/** The canonical lime CTA — used when `primaryAction` is omitted. */
var DEFAULT_PRIMARY_ACTION = {
	label: "Turn to video",
	icon: Video
};
/** The canonical footer action row — used when `actions` is omitted. */
var DEFAULT_ACTIONS = [
	{
		id: "download",
		label: "Download",
		icon: Download
	},
	{
		id: "like",
		label: "Like",
		icon: Heart,
		iconOnly: true
	},
	{
		id: "share",
		label: "Share",
		icon: Share2,
		iconOnly: true
	},
	{
		id: "more",
		label: "More",
		icon: Ellipsis,
		iconOnly: true
	}
];
/** A single "label ⋯ value" detail row. `value` may embed an icon/node. */
function DetailRow({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(Typography, {
			as: "span",
			variant: "body-sm-regular",
			className: "shrink-0 text-q-transparent-light-50",
			children: label
		}), /* @__PURE__ */ jsx("div", {
			className: "flex min-w-0 flex-1 items-center justify-end gap-1.5",
			children: typeof value === "string" ? /* @__PURE__ */ jsx(Typography, {
				as: "span",
				variant: "body-sm-regular",
				color: "primary",
				truncate: true,
				className: "text-right",
				children: value
			}) : value
		})]
	});
}
function InfoPanel({ generation, detailRows, primaryAction, actions }) {
	const [detailsOpen, setDetailsOpen] = useState(true);
	const data = {
		...DEMO_GENERATION,
		...generation,
		author: {
			...DEMO_GENERATION.author,
			...generation.author
		}
	};
	const rows = detailRows ?? [
		{
			id: "status",
			label: "Status",
			value: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Icon, {
				as: Cloud,
				size: "sm",
				color: "secondary"
			}), /* @__PURE__ */ jsx(Typography, {
				as: "span",
				variant: "body-sm-regular",
				color: "primary",
				truncate: true,
				children: data.status
			})] })
		},
		{
			id: "type",
			label: "Type",
			value: data.fileType
		},
		{
			id: "size",
			label: "Size",
			value: data.size
		},
		{
			id: "uploaded",
			label: "Uploaded",
			value: data.uploadedAt
		},
		{
			id: "lastUsed",
			label: "Last used",
			value: data.lastUsedAt
		}
	];
	const primary = primaryAction === void 0 ? DEFAULT_PRIMARY_ACTION : primaryAction;
	const footerActions = (actions ?? DEFAULT_ACTIONS).map((action) => action.id === "download" && action.onSelect == null ? {
		...action,
		onSelect: () => void downloadMedia(data.src)
	} : action);
	return /* @__PURE__ */ jsxs("aside", {
		className: "flex h-full w-full flex-col gap-2 p-2",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 p-1",
				children: [
					/* @__PURE__ */ jsx(Avatar, {
						size: "sm",
						src: data.author?.avatarSrc,
						alt: data.author?.name,
						color: "mint"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex min-w-0 flex-1 flex-col",
						children: [/* @__PURE__ */ jsx(Typography, {
							as: "span",
							variant: "body-sm-medium",
							color: "primary",
							truncate: true,
							children: data.author?.name
						}), /* @__PURE__ */ jsx(Typography, {
							as: "span",
							variant: "caption-xs-regular",
							color: "secondary",
							truncate: true,
							children: data.author?.role ?? "Author"
						})]
					}),
					/* @__PURE__ */ jsx(Dialog.Close, {
						"aria-label": "Close",
						className: "flex size-8 shrink-0 items-center justify-center rounded-q-full bg-q-transparent-light-05 text-q-icon-primary transition-colors hover:bg-q-transparent-light-10",
						children: /* @__PURE__ */ jsx(Icon, {
							as: X,
							size: "md"
						})
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-2 rounded-q-300 bg-q-transparent-light-05 p-2",
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setDetailsOpen((o) => !o),
					className: "flex items-center gap-2 px-1 py-1.5",
					"aria-expanded": detailsOpen,
					children: [
						/* @__PURE__ */ jsx(Icon, {
							as: Info,
							size: "sm",
							color: "secondary"
						}),
						/* @__PURE__ */ jsx(Typography, {
							as: "span",
							variant: "label-xs-medium",
							color: "secondary",
							className: "flex-1 text-left uppercase",
							children: "Details"
						}),
						/* @__PURE__ */ jsx(Icon, {
							as: ChevronUp,
							size: "sm",
							color: "secondary",
							className: detailsOpen ? void 0 : "rotate-180"
						})
					]
				}), detailsOpen ? /* @__PURE__ */ jsxs(Fragment, { children: [rows.length > 0 ? /* @__PURE__ */ jsx("div", {
					className: "flex flex-col gap-1 rounded-q-200 bg-q-transparent-light-05 p-3",
					children: rows.map((row) => /* @__PURE__ */ jsx(DetailRow, {
						label: row.label,
						value: row.value
					}, row.id))
				}) : null, data.prompt != null && data.prompt !== "" ? /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-1 rounded-q-200 bg-q-transparent-light-05 p-3",
					children: [/* @__PURE__ */ jsx(Typography, {
						as: "span",
						variant: "body-sm-regular",
						className: "text-q-transparent-light-50",
						children: "Prompt"
					}), /* @__PURE__ */ jsx(Typography, {
						as: "p",
						variant: "body-sm-regular",
						color: "primary",
						children: data.prompt
					})]
				}) : null] }) : null]
			}),
			/* @__PURE__ */ jsx("span", {
				"aria-hidden": true,
				className: "flex-1"
			}),
			primary != null || footerActions.length > 0 ? /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-2 p-2",
				children: [primary != null ? /* @__PURE__ */ jsx(Button, {
					variant: "marketingPrimary",
					size: "sm",
					className: "w-full",
					onClick: primary.onSelect,
					start: primary.icon != null ? /* @__PURE__ */ jsx(Icon, {
						as: primary.icon,
						size: "sm"
					}) : void 0,
					children: primary.label
				}) : null, footerActions.length > 0 ? /* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-2",
					children: footerActions.map((action) => action.iconOnly ? /* @__PURE__ */ jsx(Button, {
						variant: "marketingTertiary",
						size: "sm",
						iconOnly: true,
						"aria-label": action.label,
						onClick: action.onSelect,
						start: /* @__PURE__ */ jsx(Icon, {
							as: action.icon,
							size: "sm"
						})
					}, action.id) : /* @__PURE__ */ jsx(Button, {
						variant: "marketingTertiary",
						size: "sm",
						className: "flex-1",
						onClick: action.onSelect,
						start: /* @__PURE__ */ jsx(Icon, {
							as: action.icon,
							size: "sm"
						}),
						children: action.label
					}, action.id))
				}) : null]
			}) : null
		]
	});
}
function GenerationDetailModal({ trigger, generation, detailRows, primaryAction, actions, open, onOpenChange, defaultOpen }) {
	const data = {
		...DEMO_GENERATION,
		...generation
	};
	const stageRatio = data.aspectRatio ?? 2 / 3;
	const stageFrameClass = stageRatio >= 1 ? "max-h-full max-w-full shadow-q-overlay" : "h-full max-h-full w-auto! max-w-full shadow-q-overlay";
	return /* @__PURE__ */ jsxs(Dialog.Root, {
		open,
		onOpenChange,
		defaultOpen,
		children: [/* @__PURE__ */ jsx(Dialog.Trigger, { render: trigger }), /* @__PURE__ */ jsxs(Dialog.Portal, { children: [/* @__PURE__ */ jsx(Dialog.Backdrop, { className: "q-modal-backdrop" }), /* @__PURE__ */ jsxs(Dialog.Popup, {
			"aria-label": "Generation preview",
			className: "fixed inset-0 z-q-modal flex outline-none transition-opacity duration-200 ease-out data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
			children: [
				/* @__PURE__ */ jsxs("div", {
					"aria-hidden": true,
					className: "pointer-events-none absolute inset-0 overflow-hidden bg-q-background-primary",
					children: [
						/* @__PURE__ */ jsx("img", {
							src: data.src,
							alt: "",
							className: "absolute inset-0 size-full object-cover"
						}),
						/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-q-transparent-dark-80" }),
						/* @__PURE__ */ jsx("div", { className: "absolute inset-0 backdrop-blur-3xl" })
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden p-6",
					children: data.mediaType === "video" ? /* @__PURE__ */ jsx(Media, {
						ratio: stageRatio,
						rounded: "md",
						className: stageFrameClass,
						children: /* @__PURE__ */ jsx(Media.Video, {
							src: data.src,
							poster: data.poster,
							autoPlayInView: true,
							loop: true,
							fit: "cover"
						})
					}) : /* @__PURE__ */ jsx(Media, {
						ratio: stageRatio,
						rounded: "md",
						className: stageFrameClass,
						children: /* @__PURE__ */ jsx(Media.Image, {
							src: data.src,
							alt: "",
							fit: "cover"
						})
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "relative flex w-[366px] shrink-0 p-2",
					children: /* @__PURE__ */ jsx("div", {
						className: cn(glass(), "backdrop-blur-md rounded-[32px] flex min-h-0 flex-1 flex-col overflow-y-auto"),
						children: /* @__PURE__ */ jsx(InfoPanel, {
							generation: generation ?? DEMO_GENERATION,
							detailRows,
							primaryAction,
							actions
						})
					})
				})
			]
		})] })]
	});
}
//#endregion
//#region packages/quanta/src/dropdown.tsx
var cx$2 = (...a) => a.filter(Boolean).join(" ");
var Ctx = React$1.createContext({
	open: false,
	setOpen: () => {}
});
function Root$1({ children, open: c, onOpenChange }) {
	const [u, setU] = React$1.useState(false);
	const open = c ?? u;
	const setOpen = onOpenChange ?? setU;
	const ref = React$1.useRef(null);
	React$1.useEffect(() => {
		if (!open) return;
		const onDoc = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, [open, setOpen]);
	return /* @__PURE__ */ jsx(Ctx.Provider, {
		value: {
			open,
			setOpen
		},
		children: /* @__PURE__ */ jsx("div", {
			ref,
			className: "relative inline-block",
			children
		})
	});
}
function Trigger({ children, className, ...rest }) {
	const { open, setOpen } = React$1.useContext(Ctx);
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		"aria-expanded": open,
		onClick: () => setOpen(!open),
		className: cx$2(className),
		...rest,
		children
	});
}
function Content({ children, className, align = "start", ...rest }) {
	const { open } = React$1.useContext(Ctx);
	if (!open) return null;
	return /* @__PURE__ */ jsx("div", {
		role: "menu",
		className: cx$2("absolute z-50 mt-1 min-w-40 rounded-lg border border-q-border-subtle bg-q-background-secondary p-1 shadow-lg", align === "end" ? "right-0" : "left-0", className),
		...rest,
		children
	});
}
function Item$1({ children, className, onSelect, onClick, ...rest }) {
	const { setOpen } = React$1.useContext(Ctx);
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		role: "menuitem",
		onClick: (e) => {
			onClick?.(e);
			onSelect?.(e);
			setOpen(false);
		},
		className: cx$2("flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-q-text-primary hover:bg-q-transparent-light-05", className),
		...rest,
		children
	});
}
var Dropdown = {
	Root: Root$1,
	Trigger,
	Content,
	Item: Item$1
};
//#endregion
//#region src/components/generation-card/card-actions.tsx
/** Glass circular icon button shared by the inline actions and the more-trigger. */
var GLASS_BUTTON = "pointer-events-auto flex size-8 shrink-0 items-center justify-center rounded-q-full bg-q-transparent-dark-40 text-q-icon-primary backdrop-blur-md transition-colors hover:bg-q-transparent-dark-60 focus-visible:outline-2 focus-visible:outline-q-border-focus";
function stop(event) {
	event.stopPropagation();
}
/** One inline glass icon button. */
function ActionButton({ action }) {
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		"aria-label": action.label,
		className: GLASS_BUTTON,
		onPointerDown: stop,
		onClick: (event) => {
			event.stopPropagation();
			action.onSelect?.();
		},
		children: /* @__PURE__ */ jsx(Icon, {
			as: action.icon,
			size: "sm"
		})
	});
}
/** The overflow menu — a three-dots trigger over a Dropdown of the extra rows. */
function MoreMenu({ actions }) {
	return /* @__PURE__ */ jsxs(Dropdown.Root, { children: [/* @__PURE__ */ jsx(Dropdown.Trigger, {
		"aria-label": "More actions",
		className: GLASS_BUTTON,
		onPointerDown: stop,
		onClick: stop,
		children: /* @__PURE__ */ jsx(Icon, {
			as: EllipsisVertical,
			size: "sm"
		})
	}), /* @__PURE__ */ jsx(Dropdown.Content, {
		surface: "solid",
		side: "bottom",
		align: "end",
		sideOffset: 6,
		children: actions.map((action) => /* @__PURE__ */ jsx(Dropdown.Item, {
			value: action.id,
			danger: action.danger,
			start: /* @__PURE__ */ jsx(Icon, {
				as: action.icon,
				size: "sm"
			}),
			title: action.label,
			onSelect: () => action.onSelect?.()
		}, action.id))
	})] });
}
function CardActions({ actions, max = 3 }) {
	if (actions.length === 0) return null;
	const overflow = actions.length > max;
	const inline = overflow ? actions.slice(0, max - 1) : actions;
	const extra = overflow ? actions.slice(max - 1) : [];
	return /* @__PURE__ */ jsxs("div", {
		className: "pointer-events-none absolute right-2 top-2 z-[2] flex flex-col items-center gap-1.5 opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-within:opacity-100",
		children: [inline.map((action) => /* @__PURE__ */ jsx(ActionButton, { action }, action.id)), extra.length > 0 ? /* @__PURE__ */ jsx(MoreMenu, { actions: extra }) : null]
	});
}
//#endregion
//#region src/components/generation-card/generation-tile.tsx
function GenerationTile({ state = "ready", generation, src, alt = "", media, ratio = "auto", title, generatingLabel = "Generating", actions, children, openable, detail, openLabel, className, style, onMouseEnter, onMouseLeave, onFocus, onBlur }) {
	if (state === "generating") return /* @__PURE__ */ jsx(GenerationCard, {
		state: "generating",
		ratio,
		generatingLabel,
		className,
		style
	});
	const canOpen = openable !== false && generation != null;
	const downloadUrl = generation?.src ?? src;
	const resolvedActions = actions?.map((action) => action.id === "download" && action.onSelect == null && downloadUrl ? {
		...action,
		onSelect: () => void downloadMedia(downloadUrl)
	} : action);
	return /* @__PURE__ */ jsxs(GenerationCard, {
		ratio,
		src: media == null ? src ?? generation?.src : void 0,
		alt,
		title,
		media,
		className: cn("group", className),
		style,
		onMouseEnter,
		onMouseLeave,
		children: [
			canOpen ? /* @__PURE__ */ jsx(GenerationDetailModal, {
				generation,
				detailRows: detail?.rows,
				primaryAction: detail?.primaryAction,
				actions: detail?.actions,
				trigger: /* @__PURE__ */ jsx("button", {
					type: "button",
					"aria-label": openLabel ?? (generation?.prompt != null ? `Open generation: ${generation.prompt}` : "Open generation"),
					className: "absolute inset-0 z-[1] cursor-pointer rounded-q-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-q-border-focus",
					onFocus,
					onBlur
				})
			}) : null,
			children,
			resolvedActions != null && resolvedActions.length > 0 ? /* @__PURE__ */ jsx(CardActions, { actions: resolvedActions }) : null
		]
	});
}
//#endregion
//#region src/components/gallery/gallery-tile.tsx
function rectStyle(rect, top) {
	return {
		left: rect.x,
		top,
		width: rect.width,
		height: rect.height
	};
}
/** Neutral fallback behind media that has not painted yet. */
function Placeholder() {
	return /* @__PURE__ */ jsx("span", {
		className: "qg-placeholder",
		"aria-hidden": "true"
	});
}
/** Still image with native tier-driven loading and no remount fade. */
function StillMedia({ item, tier }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Placeholder, {}), /* @__PURE__ */ jsx("img", {
		className: "absolute inset-0 size-full object-cover",
		src: item.src,
		alt: item.alt,
		loading: tier === "full" ? "eager" : "lazy",
		decoding: "async"
	})] });
}
/**
* Hover-to-play video: poster still by default, plays (muted / looped /
* playsInline) on hover & focus, pauses and resets on leave. Respects reduced
* motion — when set, the poster stays put and the clip never autoplays on hover.
*/
function HoverVideo({ item, tier, playing, reducedMotion }) {
	const ref = useRef(null);
	const [videoLoaded, setVideoLoaded] = useState(false);
	const active = playing && !reducedMotion;
	const hasPoster = item.src.length > 0;
	const showVideo = active && videoLoaded;
	useEffect(() => {
		const v = ref.current;
		if (v == null) return;
		if (active) v.play()?.catch(() => {});
		else {
			v.pause();
			try {
				v.currentTime = 0;
			} catch {}
		}
	}, [active]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(Placeholder, {}),
		hasPoster ? /* @__PURE__ */ jsx("img", {
			className: "absolute inset-0 size-full object-cover",
			src: item.src,
			alt: item.alt,
			loading: tier === "full" ? "eager" : "lazy",
			decoding: "async",
			style: { opacity: showVideo ? 0 : 1 }
		}) : null,
		/* @__PURE__ */ jsx("video", {
			ref,
			className: "absolute inset-0 size-full object-cover",
			muted: true,
			loop: true,
			playsInline: true,
			preload: "none",
			poster: hasPoster ? item.src : void 0,
			onLoadedData: () => setVideoLoaded(true),
			style: { opacity: showVideo ? 1 : 0 },
			children: /* @__PURE__ */ jsx("source", {
				src: item.videoSrc,
				type: "video/mp4"
			})
		})
	] });
}
function GalleryTileComponent({ item, rect, top, tier, reducedMotion }) {
	const [hovered, setHovered] = useState(false);
	const [liked, setLiked] = useState(false);
	if (item.status === "generating") return /* @__PURE__ */ jsx(GenerationTile, {
		state: "generating",
		ratio: "auto",
		className: "qg-tile",
		style: rectStyle(rect, top)
	});
	const isVideo = item.kind === "video";
	const media = isVideo ? /* @__PURE__ */ jsx(HoverVideo, {
		item,
		tier,
		playing: hovered,
		reducedMotion
	}) : /* @__PURE__ */ jsx(StillMedia, {
		item,
		tier
	});
	const actions = [
		{
			id: "like",
			label: liked ? "Unlike" : "Like",
			icon: Heart,
			onSelect: () => setLiked((v) => !v)
		},
		{
			id: "download",
			label: "Download",
			icon: Download
		},
		{
			id: "copy",
			label: "Copy prompt",
			icon: Copy,
			onSelect: () => void navigator.clipboard?.writeText(item.prompt)
		},
		{
			id: "share",
			label: "Share",
			icon: Share2
		},
		{
			id: "delete",
			label: "Delete",
			icon: Trash2,
			danger: true
		}
	];
	return /* @__PURE__ */ jsx(GenerationTile, {
		ratio: "auto",
		className: "qg-tile",
		style: rectStyle(rect, top),
		media,
		actions,
		generation: {
			src: isVideo ? item.videoSrc ?? item.src : item.src,
			poster: isVideo ? item.src : void 0,
			mediaType: isVideo ? "video" : "image",
			aspectRatio: item.width / item.height,
			prompt: item.prompt
		},
		openLabel: `Open generation: ${item.prompt}`,
		onMouseEnter: isVideo ? () => setHovered(true) : void 0,
		onMouseLeave: isVideo ? () => setHovered(false) : void 0,
		onFocus: isVideo ? () => setHovered(true) : void 0,
		onBlur: isVideo ? () => setHovered(false) : void 0
	});
}
var GalleryTile = memo(GalleryTileComponent);
//#endregion
//#region packages/quanta/src/slider.tsx
var cx$1 = (...a) => a.filter(Boolean).join(" ");
/**
* quanta Slider — native range input. Supports either `steps` (array of allowed
* values, index-driven) or plain min/max/step, with an `onChange(value)`.
*/
function Slider({ steps, value, onChange, className, min, max, step, ...rest }) {
	if (Array.isArray(steps) && steps.length > 0) {
		const idx = Math.max(0, steps.indexOf(value));
		return /* @__PURE__ */ jsx("input", {
			type: "range",
			min: 0,
			max: steps.length - 1,
			step: 1,
			value: idx < 0 ? 0 : idx,
			onChange: (e) => onChange?.(steps[Number(e.target.value)]),
			className: cx$1("accent-q-brand-primary", className),
			...rest
		});
	}
	return /* @__PURE__ */ jsx("input", {
		type: "range",
		min: min ?? 0,
		max: max ?? 100,
		step: step ?? 1,
		value,
		onChange: (e) => onChange?.(Number(e.target.value)),
		className: cx$1("accent-q-brand-primary", className),
		...rest
	});
}
//#endregion
//#region src/components/gallery/justified-engine.ts
var DEFAULT_CONFIG = {
	containerWidth: 0,
	targetRowHeight: 200,
	gap: 6,
	headerHeight: 44,
	groupGap: 20,
	maxRowHeight: 460,
	grouped: true
};
var JustifiedLayoutEngine = class {
	items = [];
	groups = [];
	config = { ...DEFAULT_CONFIG };
	layout = {
		rows: [],
		totalHeight: 0,
		itemCount: 0
	};
	/** Per-item resolved geometry, indexed by item index — powers scroll anchoring. */
	itemTops = [];
	itemHeights = [];
	dirty = true;
	setItems(items) {
		this.items = items;
		this.recomputeGroups();
		this.dirty = true;
	}
	/** Returns true if any geometry field actually changed. */
	setConfig(patch) {
		let changed = false;
		let groupingChanged = false;
		for (const key of Object.keys(patch)) {
			const next = patch[key];
			if (next != null && next !== this.config[key]) {
				this.config[key] = next;
				changed = true;
				if (key === "grouped") groupingChanged = true;
			}
		}
		if (groupingChanged) this.recomputeGroups();
		if (changed) this.dirty = true;
		return changed;
	}
	getConfig() {
		return this.config;
	}
	recomputeGroups() {
		if (!this.config.grouped) {
			this.groups = this.items.length > 0 ? [{
				id: "all",
				label: "",
				start: 0,
				end: this.items.length
			}] : [];
			return;
		}
		const groups = [];
		let current = null;
		for (let i = 0; i < this.items.length; i++) {
			const item = this.items[i];
			if (current == null || current.id !== item.groupId) {
				if (current != null) current.end = i;
				current = {
					id: item.groupId,
					label: item.groupLabel,
					start: i,
					end: i + 1
				};
				groups.push(current);
			}
		}
		if (current != null) current.end = this.items.length;
		this.groups = groups;
	}
	/** Compute (or return cached) layout for the current items + config. */
	compute() {
		if (!this.dirty) return this.layout;
		const { containerWidth, targetRowHeight, gap, headerHeight, groupGap, maxRowHeight } = this.config;
		const rows = [];
		const itemTops = new Array(this.items.length).fill(0);
		const itemHeights = new Array(this.items.length).fill(0);
		if (containerWidth <= 0) {
			this.layout = {
				rows: [],
				totalHeight: 0,
				itemCount: this.items.length
			};
			this.itemTops = itemTops;
			this.itemHeights = itemHeights;
			this.dirty = false;
			return this.layout;
		}
		let y = 0;
		let rowKey = 0;
		const { grouped } = this.config;
		for (const group of this.groups) {
			if (grouped) {
				rows.push({
					type: "header",
					y,
					height: headerHeight,
					key: `h-${group.id}`,
					label: group.label
				});
				y += headerHeight;
			}
			let rowStart = group.start;
			let aspectSum = 0;
			const flushRow = (endExclusive, isLastRowOfGroup) => {
				const n = endExclusive - rowStart;
				if (n <= 0) return;
				const totalGap = gap * (n - 1);
				let rowHeight = (containerWidth - totalGap) / aspectSum;
				if (isLastRowOfGroup && rowHeight > targetRowHeight) rowHeight = targetRowHeight;
				rowHeight = Math.min(rowHeight, maxRowHeight);
				const tiles = [];
				let x = 0;
				for (let i = rowStart; i < endExclusive; i++) {
					const item = this.items[i];
					const aspect = item.width / item.height;
					const w = rowHeight * aspect;
					tiles.push({
						index: i,
						item,
						x,
						width: w,
						height: rowHeight
					});
					itemTops[i] = y;
					itemHeights[i] = rowHeight;
					x += w + gap;
				}
				rows.push({
					type: "tiles",
					y,
					height: rowHeight,
					key: `r-${rowKey++}`,
					tiles
				});
				y += rowHeight + gap;
			};
			for (let i = group.start; i < group.end; i++) {
				const item = this.items[i];
				const aspect = item.width / item.height;
				aspectSum += aspect;
				if (targetRowHeight * aspectSum + gap * (i - rowStart) >= containerWidth) {
					flushRow(i + 1, false);
					rowStart = i + 1;
					aspectSum = 0;
				}
			}
			if (rowStart < group.end) flushRow(group.end, true);
			y = y - gap + groupGap;
		}
		const totalHeight = Math.max(0, y - groupGap);
		this.layout = {
			rows,
			totalHeight,
			itemCount: this.items.length
		};
		this.itemTops = itemTops;
		this.itemHeights = itemHeights;
		this.dirty = false;
		return this.layout;
	}
	getLayout() {
		return this.compute();
	}
	/**
	* The visible window: the [startRow, endRow) slice of rows intersecting the
	* viewport expanded by `overscanPx` on each edge. Binary-searches the rows
	* (which are sorted by `y`) so cost is O(log n), independent of dataset size.
	*/
	getWindow(scrollTop, viewportHeight, overscanPx) {
		const { rows } = this.compute();
		if (rows.length === 0) return {
			startRow: 0,
			endRow: 0
		};
		const top = scrollTop - overscanPx;
		const bottom = scrollTop + viewportHeight + overscanPx;
		let lo = 0;
		let hi = rows.length - 1;
		let startRow = rows.length;
		while (lo <= hi) {
			const mid = lo + hi >> 1;
			const row = rows[mid];
			if (row.y + row.height >= top) {
				startRow = mid;
				hi = mid - 1;
			} else lo = mid + 1;
		}
		lo = 0;
		hi = rows.length - 1;
		let endRow = rows.length;
		while (lo <= hi) {
			const mid = lo + hi >> 1;
			if (rows[mid].y > bottom) {
				endRow = mid;
				hi = mid - 1;
			} else lo = mid + 1;
		}
		return {
			startRow: Math.min(startRow, rows.length),
			endRow
		};
	}
	/** Top offset of an item — used to re-pin the scroll after a re-layout. */
	getItemTop(index) {
		this.compute();
		return this.itemTops[index] ?? 0;
	}
	getItemHeight(index) {
		this.compute();
		return this.itemHeights[index] ?? 0;
	}
	/**
	* The topmost item at least partially visible at `scrollTop`, plus the pixel
	* offset between the viewport top and that item's top. The React layer stores
	* this before a density/resize re-layout and restores it afterwards so the
	* content under the user's eyes stays put (scroll anchoring).
	*/
	findAnchor(scrollTop) {
		this.compute();
		if (this.items.length === 0) return {
			index: 0,
			offset: 0
		};
		let lo = 0;
		let hi = this.itemTops.length - 1;
		let index = 0;
		while (lo <= hi) {
			const mid = lo + hi >> 1;
			if (this.itemTops[mid] <= scrollTop) {
				index = mid;
				lo = mid + 1;
			} else hi = mid - 1;
		}
		return {
			index,
			offset: scrollTop - (this.itemTops[index] ?? 0)
		};
	}
};
//#endregion
//#region src/components/gallery/demo-data.ts
/**
* Demo data for the History gallery.
*
* Everything is generated deterministically (seeded PRNG) so the justified
* layout is stable across renders — which keeps scroll-anchoring exact and makes
* the virtualization behaviour reproducible. The pool mixes real still assets
* (`/presets/*.png`) with the ffmpeg-generated hover-to-play clips
* (`/gallery/*.mp4`) and spans a wide spread of aspect ratios: tall portraits,
* wide landscapes, squares and true panoramas.
*/
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
var STILLS = [
	{
		src: "/presets/cover.png",
		alt: "Renaissance portrait holding a jar of dill pickles",
		prompt: "A renaissance oil-painting portrait of a woman cradling a glowing jar of Picklehaus dill pickles, candlelit chiaroscuro, rich golden fabrics."
	},
	{
		src: "/presets/how-product-works.png",
		alt: "Cinematic product hero shot",
		prompt: "Cinematic product hero shot explaining how the pickling process works, warm studio light, shallow depth of field."
	},
	{
		src: "/presets/explain.png",
		alt: "Candlelit concept explainer scene",
		prompt: "Moody candlelit scene explaining a concept, editorial photography, deep shadows and warm highlights."
	},
	{
		src: "/presets/hyper-motion.png",
		alt: "Caramel popcorn splash in motion",
		prompt: "Hyper-motion macro of caramel popcorn bursting mid-air with sugar crystals, high-speed capture, glossy amber tones."
	}
];
var VIDEOS = [
	{
		videoSrc: "/gallery/motion-landscape.mp4",
		poster: "/presets/hyper-motion.png",
		alt: "Popcorn burst, animated",
		prompt: "Slow push-in on caramel popcorn bursting mid-air, high-speed macro loop, glossy amber tones.",
		width: 854,
		height: 480
	},
	{
		videoSrc: "/gallery/product-portrait.mp4",
		poster: "/presets/how-product-works.png",
		alt: "Product hero, animated",
		prompt: "Vertical hero reveal of the product with a gentle parallax zoom, warm studio light.",
		width: 480,
		height: 854
	},
	{
		videoSrc: "/gallery/explain-square.mp4",
		poster: "/presets/explain.png",
		alt: "Candlelit concept, animated",
		prompt: "Square looping candlelit scene with drifting highlights, editorial mood.",
		width: 600,
		height: 600
	},
	{
		videoSrc: "/gallery/cover-tall.mp4",
		poster: "/presets/cover.png",
		alt: "Renaissance portrait, animated",
		prompt: "Tall portrait with a slow breathing zoom, candlelit chiaroscuro, golden fabrics.",
		width: 512,
		height: 768
	}
];
var ASPECTS = [
	[9, 16],
	[2, 3],
	[3, 4],
	[1, 1],
	[4, 3],
	[3, 2],
	[16, 9],
	[2, 1],
	[21, 9],
	[5, 4]
];
/**
* A dated batch definition: the label plus how many items land in it. Later
* batches are appended lazily by `makeBatch` to simulate infinite history.
*/
var GROUPS = [
	{
		id: "today",
		label: "Today",
		count: 34
	},
	{
		id: "yesterday",
		label: "Yesterday",
		count: 42
	},
	{
		id: "this-week",
		label: "Earlier this week",
		count: 56
	},
	{
		id: "last-week",
		label: "Last week",
		count: 60
	}
];
/** Long side (px) used to synthesize still dimensions from an aspect ratio. */
var LONG_SIDE = 1280;
function makeStill(index, groupId, groupLabel, rand) {
	const base = STILLS[index % STILLS.length];
	const [aw, ah] = ASPECTS[Math.floor(rand() * ASPECTS.length)];
	const landscape = aw >= ah;
	const width = landscape ? LONG_SIDE : Math.round(LONG_SIDE * aw / ah);
	const height = landscape ? Math.round(LONG_SIDE * ah / aw) : LONG_SIDE;
	return {
		id: `${groupId}-img-${index}`,
		kind: "image",
		status: "ready",
		src: base.src,
		width,
		height,
		prompt: base.prompt,
		alt: base.alt,
		groupId,
		groupLabel
	};
}
function makeVideo(index, groupId, groupLabel) {
	const base = VIDEOS[index % VIDEOS.length];
	return {
		id: `${groupId}-vid-${index}`,
		kind: "video",
		status: "ready",
		src: base.poster,
		videoSrc: base.videoSrc,
		width: base.width,
		height: base.height,
		prompt: base.prompt,
		alt: base.alt,
		groupId,
		groupLabel
	};
}
/**
* Build one dated batch of items. Roughly every 5th item is a video so the
* feed reliably shows hover-to-play tiles. When `withGenerating` is set the
* batch leads with a single `generating` placeholder tile (the pulsing card).
*/
function makeBatch(groupId, groupLabel, count, seed, withGenerating = false) {
	const rand = mulberry32(seed);
	const items = [];
	if (withGenerating) items.push({
		id: `${groupId}-generating`,
		kind: "image",
		status: "generating",
		src: "",
		width: 3,
		height: 4,
		prompt: "",
		alt: "",
		groupId,
		groupLabel
	});
	for (let i = 0; i < count; i++) {
		const kind = i % 5 === 2 ? "video" : "image";
		items.push(kind === "video" ? makeVideo(i, groupId, groupLabel) : makeStill(i, groupId, groupLabel, rand));
	}
	return items;
}
/** The initial dataset — the four seeded batches, a generating tile up top. */
function makeInitialItems() {
	return GROUPS.flatMap((group, gi) => makeBatch(group.id, group.label, group.count, 1e3 + gi * 97, gi === 0));
}
/**
* Lazily-appended "older" batch, used by the infinite-scroll loader. Each call
* yields a fresh dated group ("Earlier · N") so appending never reflows the
* batches already on screen above.
*/
function makeOlderBatch(page) {
	return makeBatch(`earlier-${page}`, page === 0 ? "Earlier" : `Earlier · ${page + 1}`, 48, 5e3 + page * 131);
}
//#endregion
//#region src/components/gallery/use-justified-gallery.ts
/**
* Tile-size presets, indexed by the slider step. The slider runs left → right =
* smaller → LARGER tiles, so this array is ASCENDING: step 0 is the smallest /
* densest, the last step the largest / least-dense. The value is the target row
* height in px that the engine packs against. The scale is biased toward larger
* tiles (base default sits above the old minimum) since the small end read too
* cramped.
*/
var DENSITY_ROW_HEIGHTS = [
	220,
	280,
	360,
	460,
	580
];
var GAP = 6;
/** Rows within this many px of the viewport edge are rendered (windowing). */
var OVERSCAN_PX = 400;
/** Load the next batch when the viewport bottom is within this px of the end. */
var INFINITE_MARGIN = 1200;
/** Cap total items so the demo can't grow without bound. */
var MAX_ITEMS = 1400;
function useJustifiedGallery(items, grouped = true, { demo = false, hasMore = false, loadingMore = false, onLoadMore } = {}) {
	const viewportRef = useRef(null);
	const engineRef = useRef(null);
	if (engineRef.current == null) engineRef.current = new JustifiedLayoutEngine();
	const engine = engineRef.current;
	const [width, setWidth] = useState(0);
	const [density, setDensityState] = useState(1);
	const scrollTopRef = useRef(0);
	const [viewportHeight, setViewportHeight] = useState(0);
	const [range, setRange] = useState({
		startRow: 0,
		endRow: 0
	});
	const [olderItems, setOlderItems] = useState([]);
	const [demoLoadingMore, setDemoLoadingMore] = useState(false);
	const pageRef = useRef(0);
	const allItems = useMemo(() => demo && olderItems.length > 0 ? [...items, ...olderItems] : items, [
		demo,
		items,
		olderItems
	]);
	const targetRowHeight = DENSITY_ROW_HEIGHTS[density] ?? DENSITY_ROW_HEIGHTS[1];
	const layout = useMemo(() => {
		engine.setItems(allItems);
		engine.setConfig({
			containerWidth: width,
			targetRowHeight,
			gap: GAP,
			grouped
		});
		return engine.getLayout();
	}, [
		engine,
		allItems,
		width,
		targetRowHeight,
		grouped
	]);
	const anchorRef = useRef({
		index: 0,
		offset: 0
	});
	const readRange = useCallback(() => {
		const el = viewportRef.current;
		if (el == null) return;
		const st = el.scrollTop;
		const vh = el.clientHeight;
		const win = engine.getWindow(st, vh, OVERSCAN_PX);
		scrollTopRef.current = st;
		setViewportHeight(vh);
		setRange((prev) => prev.startRow === win.startRow && prev.endRow === win.endRow ? prev : win);
	}, [engine]);
	useLayoutEffect(() => {
		const el = viewportRef.current;
		if (el == null || typeof ResizeObserver === "undefined") return;
		const ro = new ResizeObserver(() => {
			setWidth(el.clientWidth);
			setViewportHeight(el.clientHeight);
		});
		ro.observe(el);
		setWidth(el.clientWidth);
		setViewportHeight(el.clientHeight);
		return () => ro.disconnect();
	}, []);
	useLayoutEffect(() => {
		const el = viewportRef.current;
		if (el == null) return;
		const anchor = anchorRef.current;
		if (anchor.index > 0) {
			const nextTop = engine.getItemTop(anchor.index) + anchor.offset;
			if (Math.abs(nextTop - el.scrollTop) > .5) el.scrollTop = nextTop;
		}
		readRange();
	}, [
		engine,
		layout,
		readRange
	]);
	const loadingRef = useRef(false);
	const lastAutoLoadKeyRef = useRef(null);
	const countRef = useRef(allItems.length);
	countRef.current = allItems.length;
	const feedEdgeKeyRef = useRef("");
	feedEdgeKeyRef.current = `${allItems.length}:${allItems[0]?.id ?? ""}:${allItems.at(-1)?.id ?? ""}`;
	const triggerLoadMore = useCallback(() => {
		if (loadingRef.current) return;
		if (!demo && (loadingMore || !hasMore || onLoadMore == null)) return;
		if (demo && countRef.current >= MAX_ITEMS) return;
		if (lastAutoLoadKeyRef.current === feedEdgeKeyRef.current) return;
		lastAutoLoadKeyRef.current = feedEdgeKeyRef.current;
		loadingRef.current = true;
		if (demo) {
			setDemoLoadingMore(true);
			window.setTimeout(() => {
				const page = pageRef.current++;
				setOlderItems((prev) => [...prev, ...makeOlderBatch(page)]);
				loadingRef.current = false;
				setDemoLoadingMore(false);
			}, 120);
			return;
		}
		Promise.resolve(onLoadMore?.()).catch(() => void 0).finally(() => {
			loadingRef.current = false;
		});
	}, [
		demo,
		hasMore,
		loadingMore,
		onLoadMore
	]);
	useEffect(() => {
		const el = viewportRef.current;
		if (el != null && width > 0 && el.clientHeight > 0 && el.scrollTop + el.clientHeight >= layout.totalHeight - INFINITE_MARGIN) triggerLoadMore();
	}, [
		layout.totalHeight,
		loadingMore,
		triggerLoadMore,
		width
	]);
	useEffect(() => {
		const el = viewportRef.current;
		if (el == null) return;
		let raf = 0;
		const onScroll = () => {
			if (raf !== 0) return;
			raf = requestAnimationFrame(() => {
				raf = 0;
				const st = el.scrollTop;
				anchorRef.current = engine.findAnchor(st);
				readRange();
				if (st + el.clientHeight >= engine.getLayout().totalHeight - INFINITE_MARGIN) triggerLoadMore();
			});
		};
		el.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			el.removeEventListener("scroll", onScroll);
			if (raf !== 0) cancelAnimationFrame(raf);
		};
	}, [
		engine,
		readRange,
		triggerLoadMore
	]);
	const setDensity = useCallback((level) => {
		const el = viewportRef.current;
		if (el != null) anchorRef.current = engine.findAnchor(el.scrollTop);
		setDensityState(level);
	}, [engine]);
	return {
		viewportRef,
		layout,
		visibleRows: useMemo(() => layout.rows.slice(range.startRow, range.endRow), [
			layout,
			range.startRow,
			range.endRow
		]),
		scrollTop: scrollTopRef.current,
		viewportHeight,
		density,
		setDensity,
		itemCount: allItems.length,
		loadingMore: demo ? demoLoadingMore : loadingMore
	};
}
//#endregion
//#region src/components/gallery/density-control.tsx
function DensityControl({ value, onChange }) {
	const steps = DENSITY_ROW_HEIGHTS.length;
	return /* @__PURE__ */ jsx("div", {
		className: "flex items-center gap-2",
		children: /* @__PURE__ */ jsx(Slider, {
			"aria-label": "Tile density",
			steps,
			value,
			onChange,
			className: "w-32"
		})
	});
}
//#endregion
//#region src/components/gallery/use-reduced-motion.ts
/**
* Tracks the `prefers-reduced-motion` media query. When true, the gallery does
* NOT autoplay videos on hover (posters stay put) and skips fade-in transitions.
*/
function useReducedMotion() {
	const [reduced, setReduced] = useState(false);
	useEffect(() => {
		if (typeof window === "undefined" || window.matchMedia == null) return;
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReduced(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);
	return reduced;
}
//#endregion
//#region src/components/gallery/justified-gallery.tsx
var numberFormat = new Intl.NumberFormat("en-US");
function JustifiedGallery(props) {
	const { grouped = true } = props;
	const initial = useMemo(() => props.demo ? makeInitialItems() : props.items, [props.demo, props.items]);
	const reducedMotion = useReducedMotion();
	const { viewportRef, layout, visibleRows, scrollTop, viewportHeight, density, setDensity, itemCount, loadingMore } = useJustifiedGallery(initial, grouped, {
		demo: props.demo === true,
		hasMore: props.hasMore,
		loadingMore: props.loadingMore,
		onLoadMore: props.onLoadMore
	});
	const viewTop = scrollTop;
	const viewBottom = scrollTop + viewportHeight;
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-0 flex-1 flex-col gap-3",
		children: [/* @__PURE__ */ jsxs("header", {
			className: "flex shrink-0 items-center justify-between gap-4 px-0.5",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ jsx(Typography, {
						as: "h2",
						variant: "body-sm-semi-bold",
						color: "primary",
						children: "Your generations"
					}),
					/* @__PURE__ */ jsxs(Typography, {
						as: "span",
						variant: "caption-sm-regular",
						color: "tertiary",
						children: [numberFormat.format(itemCount), " items"]
					}),
					loadingMore && /* @__PURE__ */ jsxs("span", {
						className: "flex items-center gap-1.5 text-q-text-tertiary",
						children: [/* @__PURE__ */ jsx(Loader, {
							variant: "circle",
							size: "xs",
							color: "neutral",
							"aria-label": "Loading more"
						}), /* @__PURE__ */ jsx(Typography, {
							as: "span",
							variant: "caption-sm-regular",
							color: "tertiary",
							children: "Loading"
						})]
					})
				]
			}), /* @__PURE__ */ jsx(DensityControl, {
				value: density,
				onChange: setDensity
			})]
		}), /* @__PURE__ */ jsx("div", {
			ref: viewportRef,
			className: "qg-viewport relative min-h-0 flex-1 overflow-y-auto",
			children: itemCount === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "flex h-full flex-col items-center justify-center gap-1 px-6 text-center",
				children: [/* @__PURE__ */ jsx(Typography, {
					as: "p",
					variant: "body-md-semi-bold",
					color: "primary",
					children: "No generations yet"
				}), /* @__PURE__ */ jsx(Typography, {
					as: "p",
					variant: "caption-sm-regular",
					color: "secondary",
					children: "Generated results will appear here."
				})]
			}) : /* @__PURE__ */ jsx("div", {
				className: "relative w-full",
				style: { height: layout.totalHeight },
				children: visibleRows.map((row) => {
					if (row.type === "header") return /* @__PURE__ */ jsx("div", {
						className: "absolute inset-x-0 flex items-end px-0.5 pb-2",
						style: {
							top: row.y,
							height: row.height
						},
						children: /* @__PURE__ */ jsx(Typography, {
							as: "h3",
							variant: "caption-sm-medium",
							color: "tertiary",
							children: row.label
						})
					}, row.key);
					const tier = row.y < viewBottom && row.y + row.height > viewTop ? "full" : "near";
					return row.tiles.map((rect) => /* @__PURE__ */ jsx(GalleryTile, {
						item: rect.item,
						rect,
						top: row.y,
						tier,
						reducedMotion
					}, rect.item.id));
				})
			})
		})]
	});
}
//#endregion
//#region src/components/user-generations/user-generations.tsx
function UserGenerations(props) {
	return props.demo ? /* @__PURE__ */ jsx(JustifiedGallery, {
		demo: true,
		grouped: false
	}) : /* @__PURE__ */ jsx(JustifiedGallery, {
		items: props.items,
		grouped: false,
		hasMore: props.hasMore,
		loadingMore: props.loadingMore,
		onLoadMore: props.onLoadMore
	});
}
//#endregion
//#region packages/quanta/src/sidebar.tsx
var cx = (...a) => a.filter(Boolean).join(" ");
/** quanta Sidebar — styled passthrough compound. */
function Root({ className, children, ...rest }) {
	return /* @__PURE__ */ jsx("aside", {
		className: cx("flex w-60 flex-col gap-2 rounded-xl border border-q-border-subtle bg-q-background-secondary p-2", className),
		...rest,
		children
	});
}
var Header = ({ className, children, ...p }) => /* @__PURE__ */ jsx("div", {
	className: cx("flex items-center justify-between gap-2 px-2 py-1", className),
	...p,
	children
});
var Body = ({ className, children, ...p }) => /* @__PURE__ */ jsx("div", {
	className: cx("flex flex-1 flex-col gap-1 overflow-auto", className),
	...p,
	children
});
var Footer = ({ className, children, ...p }) => /* @__PURE__ */ jsx("div", {
	className: cx("mt-auto border-t border-q-border-subtle pt-2", className),
	...p,
	children
});
var Section$1 = ({ className, children, ...p }) => /* @__PURE__ */ jsx("div", {
	className: cx("flex flex-col gap-0.5", className),
	...p,
	children
});
var SectionItems = ({ className, children, ...p }) => /* @__PURE__ */ jsx("div", {
	className: cx("flex flex-col gap-0.5", className),
	...p,
	children
});
var Switcher = ({ className, children, ...p }) => /* @__PURE__ */ jsx("div", {
	className: cx("flex items-center gap-2", className),
	...p,
	children
});
var Logo = ({ className, children, ...p }) => /* @__PURE__ */ jsx("span", {
	className: cx("flex items-center", className),
	...p,
	children
});
var Title = ({ className, children, ...p }) => /* @__PURE__ */ jsx("span", {
	className: cx("text-q-label-md-semi-bold text-q-text-primary", className),
	...p,
	children
});
var Toggle = ({ className, children, ...p }) => /* @__PURE__ */ jsx("button", {
	type: "button",
	className: cx("grid size-8 place-items-center rounded-lg text-q-text-secondary hover:bg-q-transparent-light-05", className),
	...p,
	children
});
var Item = ({ selected, className, children, ...p }) => /* @__PURE__ */ jsx("button", {
	type: "button",
	"aria-current": selected ? "page" : void 0,
	className: cx("flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition", selected ? "bg-q-transparent-light-10 text-q-text-primary" : "text-q-text-secondary hover:bg-q-transparent-light-05 hover:text-q-text-primary", className),
	...p,
	children
});
var Sidebar = {
	Root,
	Header,
	Body,
	Footer,
	Section: Section$1,
	SectionItems,
	Switcher,
	Logo,
	Title,
	Toggle,
	Item
};
//#endregion
//#region src/components/icon-tile/icon-tile.tsx
var ICON_TILE_GRADIENT = {
	blue: "linear-gradient(135deg, rgb(65, 136, 190) 0%, rgb(14, 39, 114) 100%)",
	teal: "linear-gradient(135deg, rgb(81, 226, 224) 3.8675%, rgb(18, 92, 141) 93.451%)",
	purple: "linear-gradient(135deg, rgb(158, 120, 226) 0%, rgb(63, 26, 130) 100%)",
	pink: "linear-gradient(135deg, rgb(226, 110, 178) 0%, rgb(130, 20, 74) 100%)",
	orange: "linear-gradient(135deg, rgb(245, 168, 88) 0%, rgb(168, 66, 18) 100%)",
	green: "linear-gradient(135deg, rgb(104, 205, 128) 0%, rgb(20, 96, 58) 100%)",
	red: "linear-gradient(135deg, rgb(235, 108, 104) 0%, rgb(140, 22, 34) 100%)",
	indigo: "linear-gradient(135deg, rgb(110, 128, 226) 0%, rgb(30, 34, 130) 100%)"
};
function IconTile({ as, gradient, className, style, ...props }) {
	const Glyph = as;
	const isGradient = gradient != null;
	const backgroundImage = isGradient ? ICON_TILE_GRADIENT[gradient] ?? gradient : void 0;
	return /* @__PURE__ */ jsx("span", {
		className: cn("q-icon-tile", isGradient ? "q-icon-tile-gradient" : "q-icon-tile-neutral", className),
		style: isGradient ? {
			backgroundImage,
			...style
		} : style,
		...props,
		children: /* @__PURE__ */ jsx(Glyph, {
			weight: isGradient ? "fill" : "regular",
			"aria-hidden": true,
			className: cn(icon({
				size: "sm",
				color: isGradient ? void 0 : "secondary"
			}), "q-icon-tile-glyph")
		})
	});
}
//#endregion
//#region src/components/custom-ui/custom-ui.tsx
function FilledNavigationIcon({ glyph: Glyph }) {
	return /* @__PURE__ */ jsx(Glyph, {
		weight: "fill",
		"aria-hidden": true,
		className: icon({ size: "sm" })
	});
}
var TOP_GLOW = "radial-gradient(60% 80% at 50% 0%, var(--hf-color-transparent-light-10) 0%, var(--hf-color-transparent-light-05) 42%, transparent 72%)";
var TOP_DOTS = "radial-gradient(var(--hf-color-transparent-light-20) 1px, transparent 1px)";
var TOP_DOTS_MASK = "radial-gradient(55% 70% at 50% 0%, var(--hf-color-transparent-dark-100) 0%, var(--hf-color-transparent-dark-40) 45%, transparent 75%)";
function NavigationSidebar({ brand, navigation, activeId, onNavigate, footer, side }) {
	return /* @__PURE__ */ jsxs(Sidebar.Root, {
		className: "m-2.5 hidden lg:flex",
		style: {
			height: "calc(100% - 20px)",
			["--q-sidebar-radius"]: "12px"
		},
		children: [
			/* @__PURE__ */ jsxs(Sidebar.Header, { children: [/* @__PURE__ */ jsxs(Sidebar.Switcher, { children: [/* @__PURE__ */ jsx(Sidebar.Logo, { children: /* @__PURE__ */ jsx("span", {
				className: "flex size-6 items-center justify-center rounded-q-200 bg-q-brand-primary text-q-icon-inverse",
				children: /* @__PURE__ */ jsx(Icon, {
					as: Blocks,
					size: "sm"
				})
			}) }), /* @__PURE__ */ jsx(Sidebar.Title, { children: brand })] }), /* @__PURE__ */ jsx(Sidebar.Toggle, { children: /* @__PURE__ */ jsx(Icon, {
				as: side === "left" ? PanelLeftClose : PanelRightClose,
				size: "md"
			}) })] }),
			/* @__PURE__ */ jsx(Sidebar.Body, { children: /* @__PURE__ */ jsx(Sidebar.Section, { children: /* @__PURE__ */ jsx(Sidebar.SectionItems, { children: navigation.map((item) => /* @__PURE__ */ jsx(Sidebar.Item, {
				selected: activeId === item.id,
				onClick: () => onNavigate(item.id),
				start: /* @__PURE__ */ jsx(IconTile, {
					as: item.icon,
					gradient: item.gradient ?? "blue"
				}),
				title: item.label
			}, item.id)) }) }) }),
			footer != null ? /* @__PURE__ */ jsx(Sidebar.Footer, { children: /* @__PURE__ */ jsx("div", {
				className: "px-2 py-1",
				children: footer
			}) }) : null
		]
	});
}
/**
* The mandatory custom-template shell. It owns responsive navigation, page
* background, content overflow, spacing, and the maximum readable width.
*/
function CustomAppShell({ brand, navigation, activeId, onNavigate, children, footer, navigationSide = "left", leftRail, rightRail }) {
	const navigationSidebar = navigationSide === "none" ? null : /* @__PURE__ */ jsx(NavigationSidebar, {
		brand,
		navigation,
		activeId,
		onNavigate,
		footer,
		side: navigationSide
	});
	const left = navigationSide === "left" ? navigationSidebar : leftRail;
	const right = navigationSide === "right" ? navigationSidebar : rightRail;
	return /* @__PURE__ */ jsxs("div", {
		className: "flex h-dvh min-h-0 bg-q-background-primary text-q-text-primary",
		children: [
			left,
			/* @__PURE__ */ jsxs("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ jsxs("header", {
					className: "flex shrink-0 items-center gap-2 overflow-x-auto border-b border-q-border-subtle px-3 py-2 lg:hidden",
					children: [/* @__PURE__ */ jsx(Typography, {
						as: "span",
						variant: "label-sm-semi-bold",
						color: "primary",
						className: "mr-2",
						children: brand
					}), navigation.map((item) => /* @__PURE__ */ jsx(Button, {
						variant: activeId === item.id ? "secondary" : "ghost",
						size: "xs",
						"aria-label": item.label,
						start: /* @__PURE__ */ jsx(FilledNavigationIcon, { glyph: item.icon }),
						onClick: () => onNavigate(item.id),
						children: /* @__PURE__ */ jsx("span", {
							className: "hidden sm:inline",
							children: item.label
						})
					}, item.id))]
				}), /* @__PURE__ */ jsxs("main", {
					className: "relative min-h-0 flex-1 overflow-hidden",
					children: [
						/* @__PURE__ */ jsx("div", {
							"aria-hidden": true,
							className: "pointer-events-none absolute inset-x-0 top-0 h-[600px]",
							style: {
								backgroundImage: TOP_DOTS,
								backgroundSize: "14px 14px",
								maskImage: TOP_DOTS_MASK,
								WebkitMaskImage: TOP_DOTS_MASK
							}
						}),
						/* @__PURE__ */ jsx("div", {
							"aria-hidden": true,
							className: "pointer-events-none absolute inset-x-0 top-0 h-[600px]",
							style: { backgroundImage: TOP_GLOW }
						}),
						/* @__PURE__ */ jsx("div", {
							className: "relative h-full min-h-0",
							children
						})
					]
				})]
			}),
			right
		]
	});
}
/**
* Central shell window: scrolling page, fixed custom canvas, or the canonical
* generations feed. Use one mode per view; side rails remain shell siblings.
*/
function WorkspaceContent({ mode = "page", children, className }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("relative h-full min-h-0", mode === "page" && "overflow-y-auto", mode === "canvas" && "overflow-hidden", mode === "generations" && "flex flex-col overflow-hidden p-4", className),
		children
	});
}
function Page({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("mx-auto flex w-full max-w-7xl flex-col gap-10 p-5 md:gap-12 md:p-8 lg:p-10", className),
		...props
	});
}
function PageHeader({ eyebrow, title, description, actions }) {
	return /* @__PURE__ */ jsxs("header", {
		className: "flex flex-col items-center gap-6 py-8 text-center md:py-12",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex max-w-3xl flex-col items-center gap-3",
			children: [
				eyebrow != null ? /* @__PURE__ */ jsx(Typography, {
					as: "span",
					variant: "label-xs-semi-bold",
					color: "brand",
					children: eyebrow
				}) : null,
				/* @__PURE__ */ jsx(Typography, {
					as: "h1",
					variant: "title-lg-semi-bold",
					color: "primary",
					children: title
				}),
				description != null ? /* @__PURE__ */ jsx(Typography, {
					as: "p",
					variant: "body-md-regular",
					color: "secondary",
					children: description
				}) : null
			]
		}), actions != null ? /* @__PURE__ */ jsx("div", {
			className: "flex flex-wrap items-center justify-center gap-2",
			children: actions
		}) : null]
	});
}
function Section({ title, description, actions, children, className }) {
	return /* @__PURE__ */ jsxs("section", {
		className: cn("flex flex-col gap-5", className),
		children: [title != null || actions != null ? /* @__PURE__ */ jsxs("div", {
			className: "flex items-end justify-between gap-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-1",
				children: [title != null ? /* @__PURE__ */ jsx(Typography, {
					as: "h2",
					variant: "title-sm-semi-bold",
					color: "primary",
					children: title
				}) : null, description != null ? /* @__PURE__ */ jsx(Typography, {
					as: "p",
					variant: "body-sm-regular",
					color: "secondary",
					children: description
				}) : null]
			}), actions]
		}) : null, children]
	});
}
function Panel({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("rounded-q-500 border border-q-border-subtle bg-q-transparent-light-05 p-5 shadow-q-raised-sm md:p-6", className),
		...props
	});
}
var VOLUMETRIC_ICON_TILE_SIZE = {
	sm: {
		root: "size-9 rounded-q-300",
		icon: "sm"
	},
	md: {
		root: "size-10 rounded-q-300",
		icon: "sm"
	},
	lg: {
		root: "size-12 rounded-q-300",
		icon: "md"
	}
};
/** Canonical raised icon surface — Figma Left_lg (3617:50814). */
function VolumetricIconTile({ icon, size = "md", className }) {
	const dimensions = VOLUMETRIC_ICON_TILE_SIZE[size];
	return /* @__PURE__ */ jsx("span", {
		className: cn("relative flex shrink-0 items-center justify-center overflow-hidden border border-q-border-subtle bg-gradient-to-b from-q-transparent-light-20 via-q-transparent-dark-10 to-q-transparent-light-05 text-q-icon-primary shadow-q-raised", dimensions.root, className),
		children: /* @__PURE__ */ jsx(Icon, {
			as: icon,
			size: dimensions.icon
		})
	});
}
function MetricCard({ label, value, badge, icon }) {
	return /* @__PURE__ */ jsxs(Panel, {
		className: "relative flex min-w-0 items-center gap-4",
		children: [
			/* @__PURE__ */ jsx(VolumetricIconTile, {
				icon,
				size: "md"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: cn("flex min-w-0 flex-1 flex-col gap-1", badge != null && "pr-12"),
				children: [/* @__PURE__ */ jsx(Typography, {
					as: "strong",
					variant: "title-md-semi-bold",
					color: "primary",
					truncate: true,
					children: value
				}), /* @__PURE__ */ jsx(Typography, {
					as: "span",
					variant: "caption-sm-medium",
					color: "secondary",
					children: label
				})]
			}),
			badge != null ? /* @__PURE__ */ jsx(Typography, {
				as: "span",
				variant: "caption-xs-medium",
				color: "secondary",
				className: "absolute right-4 top-4 rounded-q-200 bg-q-transparent-light-10 px-2 py-1",
				children: badge
			}) : null
		]
	});
}
function EmptyState({ icon, title, description, action }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-64 flex-col items-center justify-center gap-4 text-center",
		children: [
			/* @__PURE__ */ jsx(VolumetricIconTile, {
				icon,
				size: "lg"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex max-w-sm flex-col gap-1.5",
				children: [/* @__PURE__ */ jsx(Typography, {
					as: "h3",
					variant: "label-md-semi-bold",
					color: "primary",
					children: title
				}), /* @__PURE__ */ jsx(Typography, {
					as: "p",
					variant: "body-sm-regular",
					color: "secondary",
					children: description
				})]
			}),
			action
		]
	});
}
//#endregion
//#region src/layouts/custom.tsx
var NAVIGATION = [
	{
		id: "overview",
		label: "Overview",
		icon: SquaresFour,
		gradient: "blue"
	},
	{
		id: "generations",
		label: "Generations",
		icon: Sparkle$1,
		gradient: "green"
	},
	{
		id: "activity",
		label: "Activity",
		icon: Pulse,
		gradient: "purple"
	},
	{
		id: "settings",
		label: "Settings",
		icon: GearSix,
		gradient: "orange"
	}
];
var INITIAL_ACTIVITY = [
	{
		id: "1",
		title: "First workflow completed",
		detail: "A few minutes ago",
		icon: CheckCircle2
	},
	{
		id: "2",
		title: "New item added",
		detail: "Today",
		icon: Plus
	},
	{
		id: "3",
		title: "Workspace updated",
		detail: "Yesterday",
		icon: Sparkles
	}
];
function ActivityList({ items }) {
	if (items.length === 0) return /* @__PURE__ */ jsx(EmptyState, {
		icon: Activity,
		title: "No activity yet",
		description: "Meaningful changes will appear here when work begins."
	});
	return /* @__PURE__ */ jsx("div", {
		className: "divide-y divide-q-border-subtle",
		children: items.map((item) => /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3 py-3 first:pt-0 last:pb-0",
			children: [/* @__PURE__ */ jsx(VolumetricIconTile, {
				icon: item.icon,
				size: "sm"
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex min-w-0 flex-1 flex-col gap-0.5",
				children: [/* @__PURE__ */ jsx(Typography, {
					as: "span",
					variant: "body-sm-medium",
					color: "primary",
					truncate: true,
					children: item.title
				}), /* @__PURE__ */ jsx(Typography, {
					as: "span",
					variant: "caption-sm-regular",
					color: "tertiary",
					children: item.detail
				})]
			})]
		}, item.id))
	});
}
function NewItemModal({ onCreate }) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const trimmedName = name.trim();
	const handleSubmit = (event) => {
		event.preventDefault();
		if (!trimmedName) return;
		onCreate(trimmedName);
		setName("");
		setOpen(false);
	};
	return /* @__PURE__ */ jsxs(Modal.Root, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ jsx(Modal.Trigger, { render: /* @__PURE__ */ jsx(Button, {
			variant: "secondary",
			size: "sm",
			start: /* @__PURE__ */ jsx(Icon, {
				as: Plus,
				size: "sm"
			}),
			children: "New item"
		}) }), /* @__PURE__ */ jsxs(Modal.Content, {
			size: "sm",
			children: [
				/* @__PURE__ */ jsxs(Modal.Header, { children: [/* @__PURE__ */ jsx(Modal.Title, { children: "Create item" }), /* @__PURE__ */ jsx(Modal.CloseButton, {})] }),
				/* @__PURE__ */ jsx(Modal.Body, { children: /* @__PURE__ */ jsx("form", {
					id: "new-item-form",
					onSubmit: handleSubmit,
					children: /* @__PURE__ */ jsx(Input, {
						required: true,
						autoFocus: true,
						label: "Name",
						placeholder: "Give it a clear name",
						value: name,
						onChange: (event) => setName(event.target.value)
					})
				}) }),
				/* @__PURE__ */ jsx(Modal.Footer, { children: /* @__PURE__ */ jsxs(Modal.FooterActions, { children: [/* @__PURE__ */ jsx(Modal.Close, {
					render: /* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						size: "sm"
					}),
					children: "Cancel"
				}), /* @__PURE__ */ jsx(Button, {
					type: "submit",
					form: "new-item-form",
					variant: "secondary",
					size: "sm",
					disabled: !trimmedName,
					children: "Create"
				})] }) })
			]
		})]
	});
}
function Overview({ activity, onCreate, onOpenActivity }) {
	return /* @__PURE__ */ jsxs(Page, { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			eyebrow: "Workspace overview",
			title: "Keep your workspace moving",
			description: "Track progress and move the most important work forward.",
			actions: /* @__PURE__ */ jsx(NewItemModal, { onCreate })
		}),
		/* @__PURE__ */ jsx(Section, {
			title: "At a glance",
			description: "A concise view of current performance.",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
				children: [
					/* @__PURE__ */ jsx(MetricCard, {
						icon: BarChart3,
						label: "Completed",
						value: "128",
						badge: "+12"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						icon: Clock3,
						label: "In progress",
						value: "8",
						badge: "3 due"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						icon: FolderOpen,
						label: "Collections",
						value: "24",
						badge: "Today"
					})
				]
			})
		}),
		/* @__PURE__ */ jsx(Section, {
			title: "Recent activity",
			description: "Only the latest changes appear here.",
			actions: /* @__PURE__ */ jsx(Button, {
				variant: "ghost",
				size: "xs",
				onClick: onOpenActivity,
				children: "View all"
			}),
			children: /* @__PURE__ */ jsx(Panel, { children: /* @__PURE__ */ jsx(ActivityList, { items: activity.slice(0, 3) }) })
		})
	] });
}
function ActivityView({ activity, onCreate }) {
	return /* @__PURE__ */ jsxs(Page, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Activity",
		description: "Review recent changes across your workspace.",
		actions: /* @__PURE__ */ jsx(NewItemModal, { onCreate })
	}), /* @__PURE__ */ jsx(Section, {
		title: "Latest changes",
		children: /* @__PURE__ */ jsx(Panel, { children: /* @__PURE__ */ jsx(ActivityList, { items: activity }) })
	})] });
}
function SettingsFields({ workspaceName, onWorkspaceNameChange }) {
	return /* @__PURE__ */ jsx(Input, {
		label: "Workspace name",
		value: workspaceName,
		onChange: (event) => onWorkspaceNameChange(event.target.value)
	});
}
function SettingsView({ workspaceName, onWorkspaceNameChange, onSave, saved }) {
	return /* @__PURE__ */ jsxs(Page, { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Settings",
		description: "Manage the details that shape this workspace."
	}), /* @__PURE__ */ jsx(Section, {
		title: "Workspace",
		children: /* @__PURE__ */ jsxs(Panel, {
			className: "flex flex-col gap-4",
			children: [/* @__PURE__ */ jsx(SettingsFields, {
				workspaceName,
				onWorkspaceNameChange
			}), /* @__PURE__ */ jsx("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ jsx(Button, {
					variant: "secondary",
					size: "sm",
					disabled: saved,
					onClick: onSave,
					children: "Save changes"
				})
			})]
		})
	})] });
}
function GenerationsWorkspace({ prompt, generating, onPromptChange, onGenerateToggle }) {
	return /* @__PURE__ */ jsxs(WorkspaceContent, {
		mode: "generations",
		className: "pb-36",
		children: [/* @__PURE__ */ jsx(UserGenerations, { demo: true }), /* @__PURE__ */ jsx("div", {
			className: "pointer-events-none absolute inset-x-4 bottom-4 flex justify-center",
			children: /* @__PURE__ */ jsxs(PromptBox.Root, {
				surface: "glass",
				className: "pointer-events-auto w-[900px] max-w-full",
				children: [/* @__PURE__ */ jsx(PromptBox.Body, { children: /* @__PURE__ */ jsx(PromptBox.Field, {
					"aria-label": "Generation prompt",
					placeholder: "Describe what you want to generate...",
					value: prompt,
					onChange: (event) => onPromptChange(event.target.value)
				}) }), /* @__PURE__ */ jsx(PromptBox.Generate, {
					disabled: !generating && prompt.trim().length === 0,
					onClick: onGenerateToggle,
					children: generating ? "Cancel" : "Generate"
				})]
			})
		})]
	});
}
function CustomTemplate({ previewMode = false }) {
	const [activeId, setActiveId] = useState("overview");
	const [activity, setActivity] = useState(INITIAL_ACTIVITY);
	const [prompt, setPrompt] = useState("");
	const [generating, setGenerating] = useState(false);
	const [workspaceName, setWorkspaceName] = useState("Custom workspace");
	const [savedWorkspaceName, setSavedWorkspaceName] = useState(workspaceName);
	const handleCreate = (name) => {
		setActivity((current) => [{
			id: crypto.randomUUID(),
			title: `${name} created`,
			detail: "Just now",
			icon: Plus
		}, ...current]);
	};
	return /* @__PURE__ */ jsx("div", {
		className: "h-dvh",
		"data-app-preview": previewMode ? "true" : void 0,
		inert: previewMode ? true : void 0,
		children: /* @__PURE__ */ jsx(CustomAppShell, {
			brand: "Custom App",
			navigation: NAVIGATION,
			activeId,
			onNavigate: setActiveId,
			children: activeId === "generations" ? /* @__PURE__ */ jsx(GenerationsWorkspace, {
				prompt,
				generating,
				onPromptChange: setPrompt,
				onGenerateToggle: () => setGenerating((current) => !current)
			}) : /* @__PURE__ */ jsx(WorkspaceContent, {
				mode: "page",
				children: activeId === "overview" ? /* @__PURE__ */ jsx(Overview, {
					activity,
					onCreate: handleCreate,
					onOpenActivity: () => setActiveId("activity")
				}) : activeId === "activity" ? /* @__PURE__ */ jsx(ActivityView, {
					activity,
					onCreate: handleCreate
				}) : /* @__PURE__ */ jsx(SettingsView, {
					workspaceName,
					onWorkspaceNameChange: setWorkspaceName,
					onSave: () => setSavedWorkspaceName(workspaceName),
					saved: !workspaceName.trim() || workspaceName === savedWorkspaceName
				})
			})
		})
	});
}
//#endregion
//#region src/routes/app.tsx?tsr-split=component
function AppRoute() {
	const { preview } = Route.useSearch();
	return /* @__PURE__ */ jsx(CustomTemplate, { previewMode: preview });
}
//#endregion
export { AppRoute as component };
