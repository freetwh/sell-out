# Design System: Sell Out Guide
**Project ID:** local-next-sell-out

## 1. Visual Theme & Atmosphere
Professional Export Operations Desk. The product should feel like a calm trade-operations cockpit: clear, composed, and built for repeated work. It uses restrained contrast, compact but readable spacing, and structured panels that help users move from strategy to action without feeling buried in a document.

## 2. Color Palette & Roles
- **Ink Black-Green (#14201C):** Primary reading text and strong labels.
- **Deep Maritime Navy (#18324A):** Secondary authority color for AI, navigation, and technical controls.
- **Export Pine (#214E43):** Primary actions and active process states.
- **Quiet Paper (#F7F6F1):** Page background, chosen to reduce glare during long reading.
- **Panel White (#FFFFFF):** Main content panels and input surfaces.
- **Soft Line (#DDE3DE):** Borders, dividers, and subtle table rules.
- **Muted Slate (#65726D):** Secondary copy, metadata, and descriptions.
- **Amber Signal (#B7791F):** Warnings, progress markers, and attention accents.
- **Risk Clay (#A4483E):** Pitfall and risk callouts only.

## 3. Typography Rules
Use a practical Chinese-first sans stack with Avenir Next as the Latin lead and PingFang SC / Microsoft YaHei for Chinese. Headings are confident but not heroic; the interface reserves large type for the first dashboard title only. Body copy uses relaxed line-height for Chinese readability, while labels and metadata stay compact.

## 4. Component Stylings
* **Buttons:** Compact, icon-led controls with 8px corners or circular icon buttons. Primary buttons use Export Pine; AI controls use Deep Maritime Navy. Text-only pills are avoided unless they represent filters.
* **Cards/Containers:** Flat white panels with subtle borders and no shadows. Cards are not nested inside decorative cards; repeated tools can be cards, while major page sections remain structural bands.
* **Inputs/Forms:** White surfaces, 1px Soft Line borders, visible focus rings, and clear labels. API configuration is secondary and hidden behind a key icon.
* **Drawers:** Right-side drawers on desktop and bottom sheets on mobile. They use the same panel language as the workspace and keep context visible where possible.

## 5. Layout Principles
Desktop uses a three-column workspace: process rail, active-stage content, and a contextual assistant rail. Mobile collapses to one reading column with a persistent bottom action bar for chapters, search, and AI. Information is progressively disclosed: summaries and first actions are visible first; long steps, tutorials, and official links open on demand.
