import { button } from "./button";

/** quanta NotFound boundary. */
export function NotFound(props: any) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-q-title-md-semi-bold text-q-text-primary">Page not found</p>
      <p className="text-q-body-sm-regular text-q-text-secondary">
        {props?.children ?? "The page you’re looking for doesn’t exist."}
      </p>
      <a href="/" className={button({ variant: "primary", size: "md" })}>
        Back home
      </a>
    </div>
  );
}
