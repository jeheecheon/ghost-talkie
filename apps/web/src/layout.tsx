import type { PropsWithChildren } from "react";
import { Links, Meta, Scripts, ScrollRestoration } from "react-router";

export function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" type="image/svg+xml" href="/ghost.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>GhostTalkie</title>
        <script src="/redirect.js"></script>
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
