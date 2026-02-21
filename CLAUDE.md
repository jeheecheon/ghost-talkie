# GhostTalkie

## Git

- Do NOT commit unless the user explicitly requests it

### Commit Messages

Format: `<type>: <content>`

- Types: `feat`, `refactor`, `fix`, `chore`
- Content: short, English only
- NEVER add `Co-Authored-By`, `Co-authored-by`, or any AI/bot attribution
- Author everything as if the user wrote it

## Code Principles

- Follow DRY and SOLID strictly
- Before modifying/extending code, evaluate structural improvements; refactor if beneficial
- Reuse existing abstractions; create new ones only when justified
- Prefer incremental improvement over accumulating tech debt
- Use absolute imports (`@/`) for all internal imports; no relative paths
- Route components: accept `Route.ComponentProps` from generated `+types/` instead of `useParams` generics
- `+types/` imports use relative paths (exception to `@/` rule; framework-generated types)
- Components must have a single `return`; use JSX conditional rendering instead of early returns
- Non-component functions (handlers, utils): use early return to minimize nesting depth
- Wrap single-line code blocks in braces
- Use `Nullable<T>`, `Optional<T>`, `Maybe<T>` from `@/types/misc` instead of inline `null | T`, `undefined | T`, `null | undefined | T`
- Place `handle*` functions after `return` using `function` declaration hoisting; never use arrow function handlers above `return`
- Define component Props with `type`, not `interface`
- All component Props must include `className`; pass it to the outermost element via `cn()`
- JSX attribute order: `className` first, event handlers (`on*`) last
- Use `isLoading` (not `isPending`) for boolean loading-state props
- Use inline `export default function ComponentName` declaration; not separate `export default` at file bottom
- Use `@heroicons/react` for icons; do not use `lucide-react`
- Name functions as verbs; name types/constants as nouns
- Use `assert()` for invariant checks and `ensure()` for unwrapping `Maybe<T>` values; both from `@/utils/assert`
- Eliminate unnecessary `try/catch`; only use at system boundaries (external data, network, user input)
- Review all code changes for clean code violations before presenting to user
- After code modifications, verify `pnpm tsc --noEmit`, `pnpm eslint`, and `pnpm prettier --check .` pass

## Styling

- Tailwind classes: keep concise; use shorthands (`size-10` over `w-10 h-10`)
- Omit utilities that match browser/Tailwind defaults (e.g., `flex-row`, `bg-transparent`, `static`)
- Respect natural document flow (block stacking, inline flow) before adding layout utilities
- Maintain accessibility (semantic HTML, focus states, contrast, ARIA when needed)
- Structure CSS/class lists for readability: layout → sizing → spacing → visual

## CLAUDE.md Editing

- Use precise technical terms; no filler
- Keep entries minimal to reduce token/context waste
