---
name: toss-frontend-rules
description: Toss Frontend Design Guidelines - Readability, Predictability, Cohesion, Coupling principles
triggers:
  - toss-frontend-rules
  - toss rules
  - frontend rules
  - frontend guidelines
argument-hint: ""
---

# Toss Frontend Rules Skill

## Purpose

Apply Toss's frontend design guidelines when writing or reviewing frontend code.
Covers four core principles: Readability, Predictability, Cohesion, and Coupling.

## When to Activate

Use when:
- Writing new React components or hooks
- Reviewing existing frontend code
- Refactoring complex conditional logic
- Structuring state management
- Organizing code by feature/domain

---

# Frontend Design Guideline

## Readability

### Naming Magic Numbers
Replace magic numbers with named constants.

```typescript
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
  await postLike(url);
  await delay(ANIMATION_DELAY_MS);
  await refetchPostLike();
}
```

### Abstracting Implementation Details
Abstract complex logic into dedicated components/HOCs.

```tsx
function App() {
  return (
    <AuthGuard>
      <LoginStartPage />
    </AuthGuard>
  );
}

function AuthGuard({ children }) {
  const status = useCheckLoginStatus();
  useEffect(() => {
    if (status === "LOGGED_IN") {
      location.href = "/home";
    }
  }, [status]);
  return status !== "LOGGED_IN" ? children : null;
}
```

### Separating Code Paths for Conditional Rendering
Separate significantly different conditional UI into distinct components.

```tsx
function SubmitButton() {
  const isViewer = useRole() === "viewer";
  return isViewer ? <ViewerSubmitButton /> : <AdminSubmitButton />;
}
```

### Simplifying Complex Ternary Operators
Replace nested ternaries with IIFEs or if/else.

```typescript
const status = (() => {
  if (ACondition && BCondition) return "BOTH";
  if (ACondition) return "A";
  if (BCondition) return "B";
  return "NONE";
})();
```

### Reducing Eye Movement
Colocate simple logic using inline switch or policy objects.

```tsx
function Page() {
  const user = useUser();
  const policy = {
    admin: { canInvite: true, canView: true },
    viewer: { canInvite: false, canView: true },
  }[user.role];

  if (!policy) return null;

  return (
    <div>
      <Button disabled={!policy.canInvite}>Invite</Button>
      <Button disabled={!policy.canView}>View</Button>
    </div>
  );
}
```

### Naming Complex Conditions
Assign complex boolean conditions to named variables.

```typescript
const matchedProducts = products.filter((product) => {
  const isSameCategory = product.categories.some(
    (category) => category.id === targetCategory.id
  );
  const isPriceInRange = product.prices.some(
    (price) => price >= minPrice && price <= maxPrice
  );
  return isSameCategory && isPriceInRange;
});
```

---

## Predictability

### Standardizing Return Types
Use consistent return types for similar functions/hooks.

```typescript
// API hooks always return the Query object
function useUser(): UseQueryResult<UserType, Error> {
  return useQuery({ queryKey: ["user"], queryFn: fetchUser });
}

// Validation functions use Discriminated Union
type ValidationResult = { ok: true } | { ok: false; reason: string };

function checkIsNameValid(name: string): ValidationResult {
  if (name.length === 0) return { ok: false, reason: "Name cannot be empty." };
  if (name.length >= 20) return { ok: false, reason: "Name cannot be longer than 20 characters." };
  return { ok: true };
}
```

### Revealing Hidden Logic (Single Responsibility)
Avoid hidden side effects; functions should only do what their name implies.

```typescript
async function fetchBalance(): Promise<number> {
  const balance = await http.get<number>("...");
  return balance; // Only fetches, no side effects
}

async function handleUpdateClick() {
  const balance = await fetchBalance();
  logging.log("balance_fetched"); // Caller explicitly logs
  await syncBalance(balance);
}
```

### Using Unique and Descriptive Names
Use unique, descriptive names to avoid ambiguity.

```typescript
export const httpService = {
  async getWithAuth(url: string) {
    const token = await fetchToken();
    return httpLibrary.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
```

---

## Cohesion

### Considering Form Cohesion
Choose field-level or form-level cohesion based on requirements.

- **Field-level**: Independent validation, async checks, reusable fields
- **Form-level**: Related fields, wizard forms, interdependent validation (use zod schema)

```tsx
// Form-level with zod
const schema = z.object({
  name: z.string().min(1, "Please enter your name."),
  email: z.string().min(1, "Please enter your email.").email("Invalid email."),
});

export function Form() {
  const { register, formState: { errors }, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  });
  // ...
}
```

### Organizing Code by Feature/Domain

```
src/
├── components/   # Shared components
├── hooks/        # Shared hooks
├── utils/        # Shared utils
├── domains/
│   ├── user/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   ├── product/
│   └── order/
└── App.tsx
```

### Relating Magic Numbers to Logic
Define constants near related logic or name them to clearly show the relationship.

---

## Coupling

### Avoiding Premature Abstraction
Before abstracting duplicates, consider if use cases might diverge.
Allowing duplication can improve decoupling when future needs are uncertain.

### Scoping State Management
Break down broad state into smaller, focused hooks/contexts.

```typescript
export function useCardIdQueryParam() {
  const [cardIdParam, setCardIdParam] = useQueryParam("cardId", NumberParam);
  const setCardId = useCallback(
    (newCardId: number | undefined) => {
      setCardIdParam(newCardId, "replaceIn");
    },
    [setCardIdParam]
  );
  return [cardIdParam ?? undefined, setCardId] as const;
}
```

### Eliminating Props Drilling with Composition
Use Component Composition instead of Props Drilling.

```tsx
function ItemEditModal({ open, items, recommendedItems, onConfirm, onClose }) {
  const [keyword, setKeyword] = useState("");
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <Button onClick={onClose}>Close</Button>
      </div>
      <ItemEditList
        keyword={keyword}
        items={items}
        recommendedItems={recommendedItems}
        onConfirm={onConfirm}
      />
    </Modal>
  );
}
```
