import type { PropsWithChildren } from "react";
import { Links, Meta, Scripts, ScrollRestoration } from "react-router";

export function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link
          rel="icon"
          href={`${import.meta.env.BASE_URL}favicon.ico`}
          sizes="48x48"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href={`${import.meta.env.BASE_URL}ghost.svg`}
        />
        <link
          rel="apple-touch-icon"
          href={`${import.meta.env.BASE_URL}apple-touch-icon.png`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>GhostTalkie</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
