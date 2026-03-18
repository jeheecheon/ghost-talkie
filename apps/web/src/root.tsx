import { Layout } from "@/layout";
import ErrorBoundary from "@/error-boundary";
import RootProviders from "@/providers/root-providers";
import RootLayout from "@/components/root-layout";
import "@/globals.css";

export { Layout, ErrorBoundary };

export default function Root() {
  return (
    <RootProviders>
      <RootLayout />
    </RootProviders>
  );
}
