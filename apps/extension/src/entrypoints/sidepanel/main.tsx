import ReactDOM from "react-dom/client";
import { ensure } from "@workspace/lib/assert";
import { initProfileBridge } from "@/lib/profile-bridge";
import { interceptMicPermissionError } from "@/lib/mic-permission";
import { useNavigationStore } from "@/stores/navigation";
import App from "@/entrypoints/sidepanel/app";
import "@/globals.css";

initProfileBridge((address) => {
  useNavigationStore.getState().navigateToProfile(address);
});

interceptMicPermissionError();

ReactDOM.createRoot(
  ensure(document.getElementById("root"), "Missing #root element"),
).render(<App />);
