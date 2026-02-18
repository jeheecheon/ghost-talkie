import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

function GlobalErrorBoundary() {
  const error = useRouteError();

  const title = isRouteErrorResponse(error) ? `${error.status}` : "Error";

  const message = isRouteErrorResponse(error)
    ? error.statusText
    : "Something went wrong";

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      <ExclamationTriangleIcon className="size-16 text-destructive" />
      <p className="text-4xl font-bold text-destructive">{title}</p>
      <p className="text-lg font-semibold text-muted-foreground">{message}</p>
      {import.meta.env.DEV && error instanceof Error && (
        <pre className="max-w-lg overflow-auto rounded bg-muted p-4 text-xs text-muted-foreground">
          {error.stack}
        </pre>
      )}
      <Link to="/">
        <Button variant="outline">Go Home</Button>
      </Link>
    </div>
  );
}

export default GlobalErrorBoundary;
