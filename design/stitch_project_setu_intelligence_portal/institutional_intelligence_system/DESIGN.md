---
name: Institutional Intelligence System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#44474d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#75777e'
  outline-variant: '#c5c6ce'
  surface-tint: '#515f7a'
  primary: '#000412'
  on-primary: '#ffffff'
  primary-container: '#0f1e36'
  on-primary-container: '#7886a3'
  inverse-primary: '#b8c7e6'
  secondary: '#4e5e7f'
  on-secondary: '#ffffff'
  secondary-container: '#c7d7fe'
  on-secondary-container: '#4d5d7e'
  tertiary: '#140000'
  on-tertiary: '#ffffff'
  tertiary-container: '#460002'
  on-tertiary-container: '#f93d37'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e3ff'
  primary-fixed-dim: '#b8c7e6'
  on-primary-fixed: '#0c1b33'
  on-primary-fixed-variant: '#394761'
  secondary-fixed: '#d7e2ff'
  secondary-fixed-dim: '#b6c7ec'
  on-secondary-fixed: '#081b38'
  on-secondary-fixed-variant: '#364766'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ab'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#93000b'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  gutter-mobile: 1rem
  gutter-desktop: 1.5rem
  sidebar-width: 17.5rem
---

## Brand & Style

This design system delivers an institutional, high-trust digital environment tailored for cybercrime investigators, intelligence analysts, and bank fraud risk officers. It embodies sovereign authority, procedural clarity, and calm efficiency under crisis conditions. 

The aesthetic is grounded in a refined, minimalist **Corporate / Modern** framework tailored for civic and financial defense infrastructure:
- **Atmosphere:** Sovereign, sober, vigilant, and uncompromisingly clear.
- **Visual Hygiene:** Zero decorative ornamentation, zero visual noise, zero gratuitous glassmorphism or gaming-inspired cyber tropes. Every line, pixel, and badge corresponds to legal or evidentiary weight.
- **Psychological Tone:** Reassuring operational control during high-pressure financial freeze operations and active cyber fraud response drills.

## Colors

The palette operates under rigorous discipline to maintain institutional credibility and protect cognitive bandwidth during critical incident management.

- **Primary (`#0F1E36`) & Secondary (`#1A2B49`):** Deep institutional navy and slate blue. Used for authoritative structural elements, top navigation, primary action buttons, case identifiers, and dominant headings.
- **Neutral Canvas (`#FFFFFF`, `#F8FAFC`):** Pure white for primary card elevation and critical data sheets; cool porcelain grey (`#F8FAFC`) for root page surfaces to reduce ocular fatigue across multi-screen monitoring setups.
- **Structural Lines (`#E2E8F0`, `#CBD5E1`):** Precise, low-contrast cool slate borders providing architectural definition without visual clutter.
- **Text Hierarchies:** Deep slate (`#0F172A`) for primary data points and legal text, muted slate (`#334155`) for standard narrative copy, and supportive slate (`#64748B`) for metadata, timestamps, and statutory citations.
- **Urgency Accent (`#DC2626` / Alert Red & `#D97706` / Controlled Amber):** Restricted exclusively to statutory countdown timers (e.g., golden hour bank account freeze limits), verified threat alerts, and irreversible action triggers. Never used decoratively.

## Typography

The typographic hierarchy prioritizes rapid scanning, legal precision, and unequivocal legibility across evidentiary data:

- **Structural Type (Inter):** Deployed for all operational headings, body copy, form labels, and action directives. Only two weights are permitted: Semibold (`600`) for structural anchor points and Regular (`400`) for reading comprehension. This intentional constraint eliminates visual noise.
- **Evidentiary Monospace (JetBrains Mono):** Reserved strictly for numeric ledgers, transaction hashes, IFSC/routing codes, IP addresses, FIR legal references, and incident timers. Tabular lining ensures columns align seamlessly during forensic inspection.

## Layout & Spacing

The layout is built upon an 8px base rhythm that emphasizes generous spacing and structural breathing room, actively rejecting dense, fatiguing data-dumps in favor of deliberate pacing.

- **Grid Architecture:** A responsive 12-column grid system with a fixed `sidebar-width` (280px) for situational navigation and jurisdiction switching. Gutters are locked at 24px (`space-lg`) on desktop and 16px (`gutter-mobile`) on viewport sizes under 768px.
- **Max Canvas Width:** Primary case views and intelligence feeds constrain content to a max-width of 1440px to prevent visual detachment across ultra-wide operations room monitors.
- **Section Pacing:** Form controls and data cards maintain consistent `space-lg` (24px) internal padding, with a mandatory `space-xl` (32px) gap separating distinct jurisdictional or procedural blocks.

## Elevation & Depth

Depth is established through subtle, clean tonal layering and featherweight ambient shadows rather than heavy drop-shadows or skeuomorphic bevels:

- **Baseline Level (L0):** Canvas root surface rendered in `#F8FAFC`.
- **Card & Panel Level (L1):** Elevated containers in `#FFFFFF` framed by a 1px solid hairline border (`#E2E8F0`) and an ambient shadow: `0 1px 3px 0 rgba(15, 30, 54, 0.04), 0 1px 2px -1px rgba(15, 30, 54, 0.02)`.
- **Interactive Hover & Flyout Level (L2):** Dropdown menus, contextual popovers, and table hover cards: `0 4px 6px -1px rgba(15, 30, 54, 0.06), 0 2px 4px -2px rgba(15, 30, 54, 0.04)` bordered by `#CBD5E1`.
- **Modal & Critical Intercept Level (L3):** Statutory action sheets and freeze authorization dialogs: `0 20px 25px -5px rgba(15, 30, 54, 0.1), 0 8px 10px -6px rgba(15, 30, 54, 0.04)` layered over a solid 60% opacity navy backdrop (`#0F1E36` with alpha 0.6).

## Shapes

The design uses balanced, modern geometry to project an approachable yet authoritative posture:

- **Standard Elements:** Primary buttons, text input fields, and operational chips utilize `rounded` (8px / 0.5rem) radii for clean alignment with data boundaries.
- **Structural Surfaces:** Case summary cards, institutional audit logs, and detail panels employ `rounded-lg` (16px / 1rem) to visually group modular workflows cleanly.
- **Urgent Modals & High-Level Containers:** Dialog windows utilize `rounded-xl` (24px / 1.5rem) to reinforce modern software standards within an institutional context.
- **Statutory Pills:** Status indicators, timer containers, and protocol tags strictly maintain fully rounded pill profiles (`9999px`) to distinguish them from actionable button geometry.

## Components

### Action Controls (Buttons)
- **Primary Institutional Action:** Solid `#0F1E36` background, `#FFFFFF` text, 8px radius, height 40px, medium horizontal padding (16px). Subtle transition to `#1A2B49` on hover.
- **Critical Freeze / Intercept:** Solid alert red (`#DC2626`) background, `#FFFFFF` text. Restricted exclusively to irreversible actions such as lien placement or account freeze issuance.
- **Secondary Action:** `#FFFFFF` background, 1px border in `#CBD5E1`, text `#334155`. Hover state fills `#F8FAFC`.

### Data Chips & Statutory Indicators
- **Normal Status:** Background `#F1F5F9`, text `#334155`, border 1px `#E2E8F0`.
- **Golden Hour Countdown (High Urgency):** Background `#FEF2F2`, border `#FCA5A5`, text `#DC2626`, paired with tabular JetBrains Mono numerals and an optional calm pulsing dot.
- **Pending Compliance (Warning):** Background `#FFFBEB`, border `#FDE68A`, text `#D97706`.

### Inputs & Search Fields
- Crisp `#FFFFFF` surface with a 1px border in `#CBD5E1`. On focus, transitions cleanly to a 1px border in `#0F1E36` with an ambient 2px slate ring (`#E2E8F0`). Monospaced tracking is automatically applied to input fields expecting account numbers, transaction IDs, or legal case numbers.

### Intelligence Cards & Data Summaries
- Encased in 1px `#E2E8F0` borders with white backgrounds, 16px corner radius, and generous 24px padding. Headers separate operational metadata using an understated bottom divider. Data is surfaced through spacious key-value clusters rather than cramped, edge-to-edge matrices.

### Specialized Component: Freeze Protocol Countdown
- A prominent, dedicated horizontal banner incorporating a mono-spaced countdown timer with micro-statutory labels indicating the remaining window for financial institution response before auto-escalation to state nodal officers.