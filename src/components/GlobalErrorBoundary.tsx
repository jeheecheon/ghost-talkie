import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { env } from "@/configs/env";

export default function GlobalErrorBoundary() {
  const error = useRouteError();

  const title = isRouteErrorResponse(error) ? `${error.status}` : "Error";

  const message = isRouteErrorResponse(error)
    ? error.statusText
    : "Something went wrong";

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      <ExclamationTriangleIcon className="text-destructive size-16" />
      <p className="text-destructive text-4xl font-bold">{title}</p>
      <p className="text-muted-foreground text-lg font-semibold">{message}</p>
      {!env.isProduction && error instanceof Error && (
        <pre className="bg-muted text-muted-foreground max-w-lg overflow-auto rounded p-4 text-xs">
          {error.stack}
        </pre>
      )}
      <Link to="/">
        <Button variant="outline">Go Home</Button>
      </Link>
    </div>
  );
}
