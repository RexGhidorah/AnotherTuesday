## 2024-05-24 - Interactive elements must use semantic tags
**Learning:** Collapsible sections and the user profile in the Sidebar were implemented using `<div>` tags with `onClick` handlers. This prevents keyboard navigation (tabbing) and screen reader support since they lack `role`, `tabIndex`, or `aria-expanded` attributes.
**Action:** Always convert interactive clickable elements to `<button>` with proper `focus-visible` styles and `aria-*` attributes for full accessibility and better UX.
