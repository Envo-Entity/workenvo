# Design System Strategy: The Behavioral Lens

## 1. Overview & Creative North Star

### The Creative North Star: "The Digital Curator"
This design system is built to transform complex behavioral data into an elegant, editorial experience. It moves away from the "cluttered dashboard" trope, instead adopting a philosophy of **The Digital Curator**. Like a high-end art gallery or a premium editorial magazine, every element is given immense breathing room, allowing insights to "surface" naturally.

We achieve this by breaking the standard rigid grid. We utilize **intentional asymmetry**, where content isn't just boxed in, but flows through layered surfaces. Large-scale typography acts as a structural anchor, while generous use of white space (inspired by the expansive, airy feel of pasteapp.io) ensures the user never feels overwhelmed by the "Intelligence" aspect of the platform. The interface should feel human-centric—futuristic yet soft, professional yet approachable.

---

## 2. Colors

The palette is anchored in nature-inspired greens, providing a sense of growth and organic intelligence.

### Palette Tokens
*   **Primary:** `#006841` (Deep Forest) — Authority and depth.
*   **Primary Container:** `#008454` (Vibrant Forest) — Action and brand presence.
*   **Surface:** `#FCF9F8` (Warm Off-White) — The canvas.
*   **Surface Container Lowest:** `#FFFFFF` (Pure White) — Highlighting content.
*   **Secondary:** `#006D3E` (Moss) — Complementary insights.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections or cards. We prohibit the use of structural lines. Instead, boundaries must be defined solely through:
1.  **Background Color Shifts:** Placing a `surface-container-low` element on a `surface` background.
2.  **Tonal Transitions:** Using subtle shifts in the neutral scale to signal the end of one thought and the beginning of another.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper. 
*   **Layer 0 (Base):** `surface` (`#FCF9F8`)
*   **Layer 1 (Subtle Inset):** `surface-container-low` (`#F6F3F2`)
*   **Layer 2 (The Insight Card):** `surface-container-lowest` (`#FFFFFF`)

### The "Glass & Gradient" Rule
To elevate the platform beyond a standard SaaS look, use **Glassmorphism** for floating elements (like navigation bars or hovering tooltips). Use semi-transparent versions of `surface` with a `backdrop-blur` of 20px. 
*   **Signature Texture:** Use a subtle linear gradient (from `primary` to `primary-container`) for Hero CTAs to give them a three-dimensional "soul" that mimics the light-play in the brand logo.

---

## 3. Typography

The typography scale is designed to be authoritative yet readable, using **Inter** as the primary typeface.

*   **Display (lg/md):** 3.5rem / 2.75rem. Bold weight with tight tracking (-0.02em). This is used for "big-picture" behavioral insights.
*   **Headline (lg/md):** 2rem / 1.75rem. Generous leading (1.4). Used for section headers to create an editorial flow.
*   **Body (lg/md):** 1rem / 0.875rem. Used for primary data descriptions and long-form insights.
*   **Label (md/sm):** 0.75rem / 0.6875rem. Medium weight, uppercase for metadata.

**Hierarchy Strategy:** Typography drives the brand. By pairing a massive `display-lg` headline with a very small, uppercase `label-md` category tag, we create a high-contrast, high-end feel that communicates "Insight" over "Data."

---

## 4. Elevation & Depth

We reject drop-shadow defaults. Hierarchy is achieved through **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural "lift" without a single shadow pixel.
*   **Ambient Shadows:** If a card must float (e.g., a modal or active state), use an "Ambient Shadow":
    *   `blur`: 48px
    *   `spread`: -4px
    *   `color`: `on-surface` at 4% opacity. 
    *   *Note: Tint the shadow with a hint of Primary Green to make it feel like light is passing through the brand's atmosphere.*
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use the `outline-variant` token at 15% opacity. Never use 100% opaque lines.

---

## 5. Components

### Cards
*   **Style:** Large rounded corners (32px / `xl`). No borders.
*   **Separation:** Use vertical white space (`spacing-16` or `spacing-20`) instead of dividers.
*   **Internal Padding:** Use `spacing-8` (2.75rem) to maintain the "airiness" of the platform.

### Buttons
*   **Primary:** Solid `primary-container` with white text. 32px corner radius. Subtle gradient overlay for "soul."
*   **Secondary:** Glass-style. Background: `primary` at 8% opacity. Text: `primary`.
*   **Tertiary:** No background. Text: `primary`. Underline on hover only.

### Input Fields
*   **Style:** `surface-container-high` background. No border. 16px corner radius.
*   **Focus State:** A soft 4px glow using `primary` at 20% opacity. No hard color change.

### Selection Chips
*   Pill-shaped (`full`). When unselected, use `surface-container-highest`. When selected, use `primary-container` with `on-primary` text.

### Behavioral Insight Modules (Unique Component)
*   A "Card-within-a-Card" layout. Use `surface-container-lowest` for the main container and `primary-fixed-dim` (light lime green) for specific data-point callouts to highlight human-centric metrics.

---

## 6. Do's and Don'ts

### Do
*   **Do** embrace asymmetry. It’s okay to have a large headline on the left and a small data point on the far right with "empty" space between them.
*   **Do** use the logo's "winding" element as a subtle background watermark or as a motion path for loading states.
*   **Do** ensure all interactive elements have a corner radius of at least 16px (`md`).

### Don't
*   **Don't** use 1px dividers. If you feel the need for a line, use white space instead.
*   **Don't** use "pure black" for text. Always use `on-surface` (`#1C1B1B`) to keep the interface feeling human and soft.
*   **Don't** cram multiple data visualizations into a single view. Give each "Insight" its own card and its own "breath."
*   **Don't** use standard Material shadows. Keep them diffused, light, and ambient.