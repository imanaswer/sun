import * as React$1 from "react";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
//#region packages/quanta/src/button.tsx
var cx = (...a) => a.filter(Boolean).join(" ");
var VARIANT = {
	primary: "bg-q-brand-primary text-q-text-inverse hover:opacity-90",
	secondary: "bg-q-background-secondary text-q-text-primary hover:opacity-90",
	outline: "border border-q-border-default text-q-text-primary hover:bg-q-transparent-light-05",
	ghost: "text-q-text-primary hover:bg-q-transparent-light-05"
};
var SIZE = {
	sm: "h-8 px-3 text-sm",
	md: "h-10 px-4 text-sm",
	lg: "h-12 px-6",
	icon: "h-9 w-9 p-0"
};
/** Class-name helper mirroring quanta's `button({ variant, size })` cva. */
function button(opts = {}, extra = "") {
	const { variant = "primary", size = "md" } = opts;
	return cx("inline-flex items-center justify-center gap-2 rounded-lg font-medium transition select-none disabled:pointer-events-none disabled:opacity-50", VARIANT[variant] ?? VARIANT.primary, SIZE[size] ?? SIZE.md, extra);
}
var Button = React$1.forwardRef(function Button({ variant, size, className, children, ...rest }, ref) {
	return /* @__PURE__ */ jsx("button", {
		ref,
		className: button({
			variant,
			size
		}, className),
		...rest,
		children
	});
});
//#endregion
//#region src/routes/app.tsx
var $$splitComponentImporter = () => import("./app-C2GSGvQK.js");
var Route = createFileRoute("/app")({
	validateSearch: (search) => ({ preview: search.preview === "1" || search.preview === true }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Button as n, button as r, Route as t };
