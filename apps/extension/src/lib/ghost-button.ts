import { ProfileMessage } from "@/lib/profile-bridge";

const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

const GHOST_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <radialGradient id="gt-bg" cx="42%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#dde4ec"/>
    </radialGradient>
  </defs>
  <path d="
    M32 7 C18.7 7 9 17.5 9 30 L9 48.5
    C9 49.8 10.6 50.5 11.6 49.6 L15 46.5 L18.8 49.9
    C19.7 50.7 21.1 50.6 21.9 49.7 L25 46.2 L28.2 49.7
    C29.1 50.7 30.5 50.7 31.4 49.7 L32 49 L32.6 49.7
    C33.5 50.7 34.9 50.7 35.8 49.7 L39 46.2 L42.1 49.7
    C42.9 50.6 44.3 50.7 45.2 49.9 L49 46.5 L52.4 49.6
    C53.4 50.5 55 49.8 55 48.5 L55 30
    C55 17.5 45.3 7 32 7 Z
  " fill="url(#gt-bg)" stroke="#c8d4e0" stroke-width="0.8" stroke-linejoin="round"/>
  <ellipse cx="25" cy="29" rx="5" ry="5.5" fill="#1a1f2e"/>
  <circle cx="23.2" cy="27.2" r="1.5" fill="white" opacity="0.9"/>
  <ellipse cx="39" cy="29.5" rx="4.2" ry="4.6" fill="#1a1f2e"/>
  <circle cx="37.4" cy="27.8" r="1.2" fill="white" opacity="0.9"/>
  <ellipse cx="32" cy="38.5" rx="4.5" ry="3.5" fill="#1a1f2e"/>
  <ellipse cx="32" cy="40.5" rx="3" ry="2" fill="#f06a7a"/>
  <ellipse cx="31" cy="40" rx="1" ry="0.7" fill="#f7a0aa" opacity="0.7"/>
</svg>`;

const BUTTON_STYLES = `
  :host {
    display: inline-flex;
    vertical-align: middle;
    padding: 6px;
  }

  .ghost-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px 4px 6px;
    border-radius: 20px;
    border: 1px solid #2d3748;
    background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #f3f4f6;
    line-height: 1;
    white-space: nowrap;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    outline: none;
  }

  .ghost-btn:hover {
    border-color: #4b5563;
    background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transform: translateY(-1px);
  }

  .ghost-btn:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .ghost-btn:focus-visible {
    outline: 2px solid #6b8aab;
    outline-offset: 2px;
  }

  .ghost-btn svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  .ghost-btn span {
    letter-spacing: -0.01em;
  }
`;

export function createGhostButton(address: string): HTMLElement {
  const host = document.createElement("span");
  host.setAttribute("data-ghost-talkie", "");

  const shadow = host.attachShadow({ mode: "closed" });

  shadow.innerHTML = `
    <style>${BUTTON_STYLES}</style>
    <button class="ghost-btn" title="Chat on Ghost Talkie">
      ${GHOST_SVG}
      <span>Ghost Talkie</span>
    </button>
  `;

  const button = shadow.querySelector("button")!;

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!ETH_ADDRESS_REGEX.test(address)) {
      return;
    }

    chrome.runtime.sendMessage({
      type: ProfileMessage.Open,
      address,
    });
  });

  return host;
}
