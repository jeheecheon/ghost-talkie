import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import { Button } from "@/components/ui/button";
import { env } from "@/configs/env";
import LayoutContainer from "@/components/LayoutContainer";

type ErrorDetails = {
  code: number;
  title: string;
  description: string;
};

export default function RootErrorPage() {
  const error = useRouteError();

  const { code, title, description } = getErrorDetails(error);

  return (
    <LayoutContainer className="flex min-h-dvh flex-col items-center justify-center gap-y-10">
      <section className="text-center">
        <p className="text-muted-foreground/20 text-[10rem] leading-none font-black tracking-tighter">
          {code}
        </p>
        <h1 className="text-foreground -mt-4 text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
        <Link className="mt-4 block" to="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </section>

      {!env.isProduction && error instanceof Error && (
        <pre className="bg-muted text-muted-foreground w-full max-w-lg overflow-auto rounded-lg p-4 text-xs">
          {error.stack}
        </pre>
      )}
    </LayoutContainer>
  );

  function getErrorDetails(error: unknown): ErrorDetails {
    const code = isRouteErrorResponse(error) ? error.status : 500;

    switch (code) {
      case 400:
        return {
          code,
          title: "Bad Request",
          description: "The request was invalid.",
        };
      case 401:
        return {
          code,
          title: "Unauthorized",
          description: "You are not authorized to access this page.",
        };
      case 403:
        return {
          code,
          title: "Forbidden",
          description: "You are not allowed to access this page.",
        };
      case 404:
        return {
          code,
          title: "Oops! Page Not Found",
          description: "The page you are looking for does not exist.",
        };
      case 500:
        return {
          code,
          title: "Internal Server Error",
          description: "An unexpected error occurred on the server.",
        };
      default:
        return {
          code,
          title: "Error",
          description: "An unexpected error occurred.",
        };
    }
  }
}
