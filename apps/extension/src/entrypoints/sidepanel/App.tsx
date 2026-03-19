import RootProviders from "@/providers/root-providers";
import RootLayout from "@/components/root-layout";

export default function App() {
  return (
    <RootProviders>
      <RootLayout />
    </RootProviders>
  );
}
