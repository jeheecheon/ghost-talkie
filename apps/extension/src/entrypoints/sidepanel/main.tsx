import ReactDOM from "react-dom/client";
import { ensure } from "@workspace/lib/assert";
import { initProfileBridge } from "@/lib/profile-bridge";
import { useNavigationStore } from "@/stores/navigation";
import App from "@/entrypoints/sidepanel/App";
import "@/globals.css";

initProfileBridge((address) => {
  useNavigationStore.getState().navigateToProfile(address);
});

ReactDOM.createRoot(
  ensure(document.getElementById("root"), "Missing #root element"),
).render(<App />);
