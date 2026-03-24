import ReactDOM from "react-dom/client";
import { ensure } from "@workspace/lib/assert";
import App from "@/entrypoints/mic-permission/app";
import "@/globals.css";

ReactDOM.createRoot(
  ensure(document.getElementById("root"), "Missing #root element"),
).render(<App />);
