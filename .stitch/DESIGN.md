# Design System: FruitVerse Nutrition

## 1. Visual Theme & Atmosphere
**Atmosphere: "Industrial Precision Laboratory"**
A minimalist, high-fidelity interface that feels like a professional analytical tool. It combines the raw, structural aesthetics of an industrial workshop with the sterile precision of a laboratory. The design is heavy on negative space, using asymmetric grids and weighted spring-physics motion. It feels clinical yet premium—raw materials (zinc, steel) meeting high-end optics.

## 2. Color Palette & Roles
- **Foundry Black** (#09090B) — Deep base canvas
- **Machined Steel** (#18181B) — Primary surface containers
- **Brushed Zinc** (#27272A) — Secondary surfaces and card bases
- **Cold Concrete** (#A1A1AA) — Muted metadata and descriptive text
- **Optical White** (#FAFAFA) — Primary typography and sharp focus points
- **Safety Orange** (#F97316) — Single high-agency accent for CTAs and critical data callouts (Max 1 accent)

## 3. Typography Rules
- **Display:** **Outfit** — Track-tight (-2%), heavy weights for headers.
- **Body:** **Outfit** — Semi-bold for emphasis, regular for content. 1.6 line-height.
- **Mono:** **Geist Mono** — For all nutritional metrics, calorie counts, and technical data.
- **Banned:** Inter, generic system fonts, any serif fonts.

## 4. Component Stylings
* **Buttons:** Sharp corners (Roundness: NONE). Flat design. Safety Orange fill for primary, ghost/outline with 1px border for secondary. Tactile -1px downward shift on active.
* **Cards:** No rounding (sharp edges). Use `Machined Steel` with a 1px `Brushed Zinc` border. No shadows—depth is communicated through tonal stacking.
* **Inputs:** Minimalist underline or full-box with no border except on focus. Label in `Cold Concrete` Geist Mono above the field.
* **Loaders:** Segmented progress bars or pulsing monochromatic orbs. No standard spinners.
* **Analysis State:** "Scanning" effect using a horizontal laser line (Safety Orange) moving across a blurred container.

## 5. Layout Principles
- **Asymmetric Grid:** Headers offset to the left, content sections staggered.
- **Spatial Separation:** Wide gutters (48px+) and deep vertical margins (120px+).
- **Industrial Framing:** Use structural "I-beam" style lines or technical markers (coordinates, version numbers) in corners to ground the design.
- **Responsive:** Strict single-column collapse at 768px. All metrics must remain monochromatic and readable.

## 6. Motion & Interaction
- **Weighted Springs:** `stiffness: 120, damping: 24`. Elements carry momentum.
- **Micro-looping:** Functional data points (like analysis confidence %) should have a subtle number-scramble animation.
- **Hardware Acceleration:** Only animate `transform: translate3d` and `opacity`.

## 7. Anti-Patterns (Banned)
- No emojis.
- No rounded corners (Strictly sharp).
- No pure black (#000000).
- No neon/outer glows.
- No 3-column equal card layouts.
- No AI copywriting clichés ("Elevate", "Unleash").
- No broken Unsplash links—use real fruit macro shots.

## 8. Design System Notes for Stitch Generation
When generating screens, use the following directives:
- **Atmosphere:** Industrial, Minimalist, Precision, Raw, Laboratory.
- **Contrast:** Use high contrast between #FAFAFA text and #09090B background.
- **Shape:** All elements must have 0px border-radius.
- **Accents:** Use #F97316 strictly for the most important interaction.
- **Metric Formatting:** All numbers must be in a Monospace font.
