/**
 * Chrome sidepanels cannot show the getUserMedia permission prompt.
 * This listener catches the resulting NotAllowedError and redirects
 * to a full-page mic-permission entrypoint where the prompt works.
 */
export function interceptMicPermissionError(): void {
  window.addEventListener("unhandledrejection", (event) => {
    if (
      event.reason instanceof DOMException &&
      event.reason.name === "NotAllowedError"
    ) {
      event.preventDefault();
      chrome.tabs.create({
        url: chrome.runtime.getURL("/mic-permission.html"),
      });
    }
  });
}
