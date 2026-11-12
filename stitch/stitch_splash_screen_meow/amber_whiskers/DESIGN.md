# Design System Document

## 1. Overview & Creative North Star: "The Sun-Drenched Atelier"
This design system rejects the clinical coldness of modern tech in favor of a "Sun-Drenched Atelier" aesthetic. Inspired by the warmth of the orange tabby in the logo, the interface should feel like a high-end editorial lookbook: tactile, breathable, and deeply intentional.

The "Creative North Star" is **Organic Tactility**. We break the "template" look by utilizing a moderately compact spacing (defined by our Spacing Scale), intentional asymmetry in layout, and a rejection of traditional structural lines. Instead of a rigid grid, elements should feel like they have been placed thoughtfully on a fine cream paper, creating an atmosphere that is both friendly and elite. The system operates in `light` mode, enhancing the feeling of a curated, sophisticated environment.

---

## 2. Colors: Tonal Architecture
The palette is built on a foundation of warmth. We avoid the "digital blue" and "stark black" defaults of the industry to maintain a premium, professional softness.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. All boundaries must be established through background color shifts. Use a `surface-container-low` section sitting against a `surface` background to define areas. This creates a soft, sophisticated transition that feels architectural rather than "drawn."

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of heavy-weight paper.
- **Base Layer:** `surface` (#fbf9f1) or `surface-container-lowest` (#ffffff).
- **Secondary Grouping:** Nest elements within `surface-container` (#f0eee6) or `surface-container-high` (#eae8e0) to create focal points. 
- **The "Glass & Gradient" Rule:** To provide "visual soul," use subtle gradients for primary actions, transitioning from `primary` (#944a00) to `primary_container` (#e67e22). For floating overlays, apply a `surface` color with 80% opacity and a 20px backdrop-blur to create a "frosted glass" effect that allows the warm background tones to bleed through.

---

## 3. Typography: Editorial Rhythm
We use **Plus Jakarta Sans** as our sole typeface, relying on its modern geometry and generous spacing to convey elegance.

- **Display & Headlines:** Use `display-lg` and `headline-lg` for impactful, editorial-style headers. These should have generous leading and negative letter-spacing (-0.02em) to feel tightly curated.
- **Body Text:** Use `body-lg` and `body-md` with the `on_surface_variant` (#564337) to ensure readability without the harshness of pure black. 
- **Labels:** Use `label-md` in all-caps with increased letter-spacing (+0.05em) for a high-fashion, premium feel on small metadata.

The hierarchy should emphasize "The Big and The Small"—don't be afraid of high contrast between a massive `display-sm` title and a tiny, perfectly placed `label-sm`.

---

## 4. Elevation & Depth: Tonal Layering
Traditional "drop shadows" are often a sign of lazy design. In this system, depth is achieved through light and layering.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a natural "lift" without a single shadow pixel.
- **Ambient Shadows:** When a floating effect is mandatory (e.g., a Bottom Sheet or FAB), use an extra-diffused shadow.
    - **Color:** A tinted version of `on_surface` at 5% opacity.
    - **Blur:** 24px to 40px.
    - **Y-Offset:** 8px to 12px.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` token at **15% opacity**. High-contrast, 100% opaque borders are strictly forbidden.

---

## 5. Components: Bespoke Primitives

### Buttons
- **Primary:** Rounded `xl` (3rem) or `full`. Use the `primary` to `primary_container` gradient. Text should be `on_primary`.
- **Secondary:** Use `secondary_container` background with `on_secondary_container` text. No border.
- **Tertiary:** Purely typographic using `primary` text, paired with `6` (2rem) horizontal padding for a clear tap target.

### Cards & Lists
- **Rule:** Forbid divider lines. Use vertical spacing (Scale `4` or `5`) to separate items.
- **Shape:** Use `lg` (2rem) or `xl` (3rem) corner radius to mimic the soft, friendly curves of the feline-inspired brand.
- **Interaction:** On hover or press, shift the background from `surface-container` to `surface-container-high`.

### Input Fields
- **Styling:** Use a `surface-container-low` background. Instead of a bottom line, use a subtle `outline_variant` (at 20% opacity) that only appears on focus. Labels should use `label-md` and sit elegantly above the input area.

### Chips
- **Selection:** Use `secondary_fixed` for selected states and `surface-container-highest` for unselected. The roundedness should always be `full`.

---

## 6. Do's and Don'ts

### Do:
- **Embrace Asymmetry:** Place a `headline-lg` on the left and a small `body-sm` description offset to the right to create an editorial layout.
- **Use "White" Space:** Treat the `surface` color as a design element itself. Use moderately compact spacing (`spacing` value of 2) or larger tokens (`12`, `16`) to let content breathe.
- **Warmth over Neutrality:** Always lean toward the `on_surface_variant` (browns) rather than greys.

### Don't:
- **No Pure Black (#000000):** It destroys the "Sun-Drenched" atmosphere. Use `on_surface` (#1b1c17) or `on_background`.
- **No 1px Lines:** Do not use dividers to separate content. Use the Spacing Scale or tonal shifts.
- **No Sharp Corners:** Avoid the `none` and `sm` roundedness tokens for containers. We are a "soft" brand; everything should feel smooth to the touch.
- **No Default Shadows:** Never use a default CSS or Figma drop shadow. Always tint and diffuse them.

---
**Director's Note:** This system is about the *feeling* of the space between the elements. Your job as a designer is to curate that space, not just fill it. Keep it soft, keep it warm, and keep it intentional.