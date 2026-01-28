# React 19 - Knowledge Reference

## Overview

React 19 introduces significant improvements focused on simplifying data mutations, enhancing concurrency, and improving SEO/metadata management. It fully supports Server Components and provides new hooks to handle asynchronous state and form interactions.

**Version**: 19.2.x  
**Key Focus**: Actions, Optimistic Updates, Form Status, and Unified Metadata.

---

## Core Features & Hooks

### 1. Actions

Actions simplify handling asynchronous transitions. Instead of manually managing `isPending` states, React 19 tracks the transition for you.

```tsx
// Using useTransition for Actions
const [isPending, startTransition] = useTransition();

const handleSubmit = () => {
  startTransition(async () => {
    await updateProfile(data);
  });
};
```

### 2. Form Actions

React 19 extends the `action` prop of `<form>` to accept functions, which automatically receive form data.

```tsx
function Search() {
  async function search(formData: FormData) {
    const query = formData.get("query");
    // Action logic here
  }

  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

### 3. `useActionState` (formerly `useFormState`)

Handles the state of a form action, including the returned data and pending state.

```tsx
import { useActionState } from 'react';

function ProfileEditor({ updateAction }) {
  const [state, formAction, isPending] = useActionState(updateAction, { error: null });

  return (
    <form action={formAction}>
      <input name="name" />
      <button disabled={isPending}>Save</button>
      {state.error && <p>{state.error}</p>}
    </form>
  );
}
```

### 4. `useFormStatus`

A specialized hook to access the status of the parent form from a child component.

```tsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Submit</button>;
}
```

### 5. `useOptimistic`

Enables showing an "optimistic" state while an async operation is in progress.

```tsx
import { useOptimistic } from 'react';

function Chat({ messages }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, { text: newMessage, sending: true }]
  );

  async function sendMessage(formData: FormData) {
    const text = formData.get("text");
    addOptimisticMessage(text);
    await api.send(text);
  }
}
```

### 6. The `use` Hook

A new hook to read resources like Promises or Context.

```tsx
import { use } from 'react';

function Message({ messagePromise }) {
  const message = use(messagePromise); // Unwraps the promise
  return <p>{message.text}</p>;
}
```

---

## Enhancements & Performance

### 1. Unified Metadata

React 19 natively handles `<title>`, `<meta>`, and `<link>` tags anywhere in your component tree, hoisting them to the head automatically.

### 2. Ref Improvements

`forwardRef` is no longer required in most cases; `ref` can now be passed as a regular prop.

### 3. Cleanup in Styles/Scripts

Better support for loading and cleaning up stylesheets and scripts with precedence control.

---

## Best Practices for dev-kit

1. **Prefer Server Actions**: Use Form Actions for mutations to reduce client-side boilerplate.
2. **Leverage `useFormStatus`**: Create generic UI components like `Button` that automatically disable themselves during form submission.
3. **Optimistic UI**: Use `useOptimistic` for high-frequency interactions like likes, comments, or status updates to make the app feel instant.
4. **ErrorBoundary / Suspense**: Nest components in `Suspense` when using the `use` hook for data fetching.

---

## Resources

- [React 19 Blog Post](https://react.dev/blog/2024/12/05/react-19)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

---

## Status

✅ **Implemented in dev-kit**  
📚 **Version**: 19.2.3  
🔄 **Last Updated**: 2026-01-22
