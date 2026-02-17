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

## CLAUDE.md Editing

- Use precise technical terms; no filler
- Keep entries minimal to reduce token/context waste
