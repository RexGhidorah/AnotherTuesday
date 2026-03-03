## 2026-03-02 - Accessibility patterns for MainTableView
**Learning:** Found frequent use of unlabelled icon-only elements (MoreHorizontal and Plus) as well as interactive `div`s used instead of semantic `button`s in the codebase, significantly impacting keyboard navigation and screen reader accessibility. Also noted missing label definitions for checkboxes.
**Action:** When implementing new UI components or modifying existing ones, prioritize the use of semantic HTML (e.g., using `<button>` instead of `<div onClick={...}>`), add `aria-label` attributes to icon-only buttons and checkboxes, and ensure proper `focus-visible` states are defined for keyboard accessibility.

## 2026-03-03 - Accessible Collapsible Sections
**Learning:** Collapsible sections like "Workspace" and "Favorites" in sidebars are often incorrectly built using `div` with `onClick`, making them completely inaccessible to keyboard users and screen readers.
**Action:** Always use `<button aria-expanded={isOpen}>` for collapsible headers instead of `div`s, and make sure they have full-width click areas, `text-left` alignment, and clear `focus-visible` styles for keyboard navigation.
