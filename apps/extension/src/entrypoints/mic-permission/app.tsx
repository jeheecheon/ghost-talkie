import { useEffect, useState } from "react";
import useCounter from "react-use/lib/useCounter";
import useInterval from "react-use/lib/useInterval";
import { CheckCircle, Mic, XCircle } from "lucide-react";
import { cn } from "@workspace/lib/cn";
import { A_SECOND } from "@workspace/lib/time";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/primitives/dialog";

const AUTO_CLOSE_SECONDS = 5;

type Status = "idle" | "granted" | "denied" | "error";

export default function App() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, { dec }] = useCounter(AUTO_CLOSE_SECONDS);

  useInterval(dec, status === "granted" && countdown > 0 ? A_SECOND : null);

  useEffect(() => {
    if (status !== "granted" || countdown > 0) {
      return;
    }

    window.close();
  }, [status, countdown]);

  useEffect(() => {
    async function checkMicPermission() {
      try {
        const result = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });
        if (result.state !== "denied") {
          return;
        }

        setStatus("denied");
      } catch {
        // NOTE: falls through to getUserMedia if permissions.query is unsupported
      }
    }
    void checkMicPermission();
  }, []);

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Microphone Permission</DialogTitle>
          <DialogDescription>
            {status === "idle" &&
              "Chrome requires microphone permission to be granted from a full page. Click below, then return to the sidepanel."}
            {status === "granted" &&
              "Microphone access granted! You can close this tab and return to the sidepanel."}
            {status === "denied" &&
              "Permission was denied. Reset it in Chrome microphone settings, then try again."}
            {status === "error" && errorMessage}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className={cn(
              "mx-auto flex size-14 items-center justify-center rounded-full",
              {
                "bg-primary/10 text-primary": status === "idle",
                "bg-green-500/10 text-green-500": status === "granted",
                "bg-red-500/10 text-red-500":
                  status === "denied" || status === "error",
              },
            )}
          >
            {status === "idle" && <Mic className="size-7" />}
            {status === "granted" && <CheckCircle className="size-7" />}
            {(status === "denied" || status === "error") && (
              <XCircle className="size-7" />
            )}
          </div>

          {status === "idle" && (
            <button
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
              type="button"
              onClick={handleGrant}
            >
              Grant Microphone Access
            </button>
          )}

          {status === "denied" && (
            <button
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
              type="button"
              onClick={handleOpenMicSettings}
            >
              Open Microphone Settings
            </button>
          )}

          {status === "granted" && (
            <button
              className="bg-muted text-muted-foreground hover:bg-muted/80 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
              type="button"
              onClick={handleClose}
            >
              Closing in {countdown}s...
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  async function handleGrant() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setStatus("granted");
    } catch (err: unknown) {
      const isDenied =
        err instanceof DOMException && err.name === "NotAllowedError";

      setStatus(isDenied ? "denied" : "error");

      if (!isDenied) {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while requesting microphone access.",
        );
      }
    }
  }

  function handleOpenChange(open: boolean) {
    if (open) {
      return;
    }

    handleClose();
  }

  function handleOpenMicSettings() {
    chrome.tabs.create({ url: "chrome://settings/content/microphone" });
  }

  function handleClose() {
    window.close();
  }
}
