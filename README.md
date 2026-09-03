# Al Wahdah — Precision Printing & Fabrication Solutions

Official flagship digital showroom and web application for **Al Wahdah** (`wahdahae.com`), a high-precision commercial printing press and custom architectural acrylic fabrication house based in the United Arab Emirates.

---

## 💎 Design System & Aesthetic Vision

The digital transformation follows the philosophy of **Quiet Luxury + Industrial Precision + Natural Materials**:

* **Primary Palette**:
  - `--color-primary-black`: `#060e0a` (Midnight Obsidian Emerald)
  - `--color-primary-dark`: `#091712` (Deep Forest Velvet)
  - `--color-surface-dark`: `#0e221b` (Botanical Surface)
  - `--color-cream-bg`: `#f8f6f0` (Warm Alabaster Cream)
  - `--color-brass`: `#c59b67` (Architectural Brushed Champagne Brass)
  - `--color-platinum`: `#8e9f97` (Titanium / Platinum Metallic Accents)
* **Typography Hierarchy**:
  - *Editorial Headlines & Hero Titles*: **Playfair Display** (High-end serif elegance)
  - *Modern Structural Sans*: **Plus Jakarta Sans** (Refined geometric grotesque)
  - *Technical Specifications & Metrics*: **JetBrains Mono** (Industrial accuracy)
  - *Body Copy*: **Inter** (Clean, legible readability)
* **Atmospheric Polish**:
  - Ambient hardware-accelerated film grain overlay (`.ambient-grain`)
  - 1px crisp luxury hairline borders (`var(--color-border-brass)` & `var(--color-border-dark)`)

---

## ⚡ Performance Optimization & Media Pipeline

* **Payload Reduction**: Reduced raw image bloat from **95.67 MB** down to **1.59 MB** (**>98% bandwidth reduction**).
* **Modern Formats**: Fully converted to high-efficiency **WebP** with retina fallback.
* **Master Product Showcase**: 9 bespoke photorealistic luxury product sample renders in `images/products/`.
* **Zero Duplicate Dependencies**: Cleaned duplicate CDN linkages, streamlined CSS & JavaScript.

---

## 🏛️ Site Architecture & Pages

1. **`index.html` — Flagship Digital Showroom**:
   - Cinematic full-screen hero with live UAE time badge (`GST UTC+4`).
   - Live numerical statistics counter (`0.05mm` tolerances, `6` disciplines, `100%` QC).
   - Editorial brand profile with laser craft photography.
   - Interactive 6-discipline showcase with expandable cards.
   - 5-stage systematic production timeline.
   - Featured physical product artifact showcase with modal quick-view.
   - High-impact enduring statement CTA.

2. **`services.html` — 6 Industrial Production Disciplines**:
   - Deep-dive technical breakdowns: Offset Printing, Acrylic Fabrication, UV Flatbed Printing, Flexo Packaging, Screen Printing, Digital Large Format.
   - Precision metrics, machine bed sizes, tolerances, and substrate guides.
   - Direct quote pre-fill links.

3. **`products.html` — Master Portfolio & Lightbox**:
   - Dynamic category filter bar (`All`, `Acrylic`, `UV Printing`, `Commercial Print`, `Custom Enclosures`).
   - 9 master product cards with zoom overlays and complete technical specification metadata.
   - Accessible keyboard-friendly modal lightbox with high-res zoom.

4. **`about.html` — Heritage & Engineering Craft**:
   - Manufacturing profile, optical PMMA material standards, and machine fleet overview.
   - 3-Phase systematic production protocol (Evaluation, Controlled Manufacturing, QC Inspection).

5. **`contact.html` — Executive Consultation & Spec Builder**:
   - Direct coordinates: `info@wahdahae.com`, WhatsApp/Phone `+971 52 928 6262`, UAE Facility.
   - Interactive Project Spec Configurator with discipline selector chips and automatic query parameter integration.
   - One-click direct WhatsApp message generator.

---

## 🚀 Running & Viewing Locally

To view the website locally, run:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080` in any modern browser.

---

## 🛡️ Accessibility & Standards

- Semantic HTML5 landmark structure (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`).
- WCAG 2.1 AA compliant color contrast ratios.
- Keyboard navigation with visible focus indicators and ESC modal dismissal.
- Full `prefers-reduced-motion` support.
- Schema.org JSON-LD Structured Data for `LocalBusiness` and `Organization`.
