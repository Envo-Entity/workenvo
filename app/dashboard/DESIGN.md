# Dashboard Design System: Modern Minimal

## 1. Direction

The active Workenvo dashboard uses the Modern Minimal theme: white canvas, cool neutral ink, bright emerald actions, and hairline borders. The UI should feel crisp, operational, and trustworthy. Keep the current layout patterns and current fonts.

Do not use the old warm paper theme, glass navigation, heavy ambient green shadows, or no-line tonal-only card separation on active dashboard routes.

## 2. Tokens

- **Canvas:** `#FFFFFF`
- **Surface:** `#FFFFFF`
- **Surface subtle:** `#FBFCFD`
- **Surface muted:** `#F2F4F7`
- **Ink:** `#0E1726`
- **Ink soft:** `#515D6C`
- **Ink faint:** `#8A94A2`
- **Ink ghost:** `#C3CAD3`
- **Line:** `rgba(15,23,42,0.10)`
- **Line soft:** `rgba(15,23,42,0.06)`
- **Line strong:** `rgba(15,23,42,0.15)`
- **Primary emerald:** `#10894F`
- **Primary deep:** `#0B6B41`
- **Danger:** `#E24B36`
- **Warning:** `#D38A2C`

These are implemented as `--dash-*` variables in `dashboard.module.css`.

## 3. Surfaces

Use visible hairline borders to separate widgets. Default cards and panels should use a white surface, a `--dash-line` border, and only a very small shadow when lift is needed.

Nested areas use `--dash-surface-subtle` or `--dash-surface-muted`. Avoid warm off-white fills.

## 4. Components

- **Sidebar:** `#FBFCFD` / `--dash-surface-subtle` background, hairline right border, outlined Material Symbols, lighter-weight text, and softly rounded nav buttons rather than full pill shapes.
- **Mobile nav:** white surface, hairline border, no backdrop blur.
- **Primary actions:** `--dash-primary-deep` background with white text.
- **Secondary actions:** white or muted surface with `--dash-line` border and `--dash-ink-soft` text.
- **Labels and chips:** compact, high-contrast, and token-based.
- **Inputs:** white surface, `--dash-line` border, emerald focus state.

## 5. Typography

Keep the existing dashboard fonts:

- Inter for core dashboard UI.
- Instrument Serif only where the current dashboard already uses it.
- Material Symbols for existing dashboard icons.

Do not introduce Bricolage Grotesque, Hanken Grotesk, JetBrains Mono, or any layout from the pasted reference code.

## 6. Rules

- Use tokens rather than hardcoded old colors.
- Keep accent color for selected states, primary actions, and status indicators.
- Use borders before shadows.
- Keep existing routing, layout behavior, and component structure intact.
- Leave `app/dashboard/_backup-removed-insights` unchanged unless explicitly reactivating that backup code.
