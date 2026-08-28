# Visual thesis: a field report in wet ink

## Direction and fit

Accessible Page Capture uses a **risograph tactile collage**. A barrier report is assembled from partial signals: a page, a focus trail, a spoken label, and a human note. Layered paper scraps make that assembly visible. Slight ink offsets suggest evidence captured from a real interaction, while firm rules and numbered stamps keep the product dependable.

This is a light-first, explicitly single-mode interface. Warm paper reduces glare; high-contrast ink keeps text clear. Dark mode is not included in v1 because the tactile paper thesis depends on a stable paper ground. Browser and OS contrast settings remain respected.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#F4EBD9` | page background |
| `--paper-light` | `#FFF9EC` | form surfaces |
| `--ink` | `#1D1C1A` | text and borders |
| `--ink-soft` | `#575149` | secondary text |
| `--vermilion` | `#C43722` | primary action and record state |
| `--cobalt` | `#174A8B` | links, focus, information |
| `--mustard` | `#D89E18` | paper stamps and warnings |
| `--green` | `#176344` | success |
| `--danger` | `#A5271B` | errors |

All normal text combinations target at least 4.5:1. Color never carries state alone; every state also has words or a symbol.

## Type

- Display: Georgia, an editorial serif already present on supported operating systems. Its blunt shapes suit printed headings.
- Body and controls: Arial/Helvetica/system sans. It stays legible in dense event traces.
- No network fonts. The site has no font request and no layout shift from font loading.
- Scale: 16, 18, 24, 36, and `clamp(42px, 7vw, 76px)`. Body leading is 1.55.

## Spacing and shapes

- Base unit: 8px. Main steps: 8, 16, 24, 32, 48, 64, 96.
- Reading measure: 68 characters.
- Borders are 2px ink rules. Corners stay between 0 and 12px.
- Buttons resemble solid ink stamps. Panels resemble offset paper slips rather than generic floating cards.
- Touch targets are at least 44px.

## Interaction grammar

- Recording is the only vermilion-filled control. While recording, a clear timer and “Recording” word appear together.
- Focus events enter as numbered paper strips. The preview is a bound report sheet.
- Destructive actions name the thing they remove and require a second confirmation when recovery is impossible.
- Route changes focus the page heading and announce it politely.

## Motion

- Signature motion: a new trace strip settles from a 6px offset over 180ms, like a sheet aligned on a press.
- Buttons depress by 2px over 120ms.
- Nothing loops. Under `prefers-reduced-motion: reduce`, translations and smooth scrolling are removed and state changes are immediate.

## Asset plan and provenance

- Hero: an original generated still-life collage showing a browser window, a magnifier, numbered focus marks, and a compact report sheet. It contains no readable text, people, logos, or product claims.
- The hero is generated with `/opt/fleet/lib/gen-image.sh`, then reviewed and converted to responsive WebP/AVIF files under the performance budget.
- Small marks and texture masks are hand-authored CSS/SVG and contain no third-party material.

### Prompt sheet

Subject: an accessible interaction being transformed into a compact evidence packet. World: tabletop print studio. Materials: torn warm paper, coarse halftone ink, registration marks, paper clips, flat browser frame, magnifying lens, numbered focus tabs. Light: even overhead daylight. Lens: straight editorial still life. Palette words: warm oat paper, near-black charcoal, vermilion, cobalt, mustard. Negative list: no readable words, no logos, no brands, no people, no hands, no photorealistic computer, no gradient, no glassmorphism, no watermark.

Generation: Azure OpenAI image generation through the factory script, model deployment `factory-image`, 2026-08-28. Generated imagery is original to this product.
