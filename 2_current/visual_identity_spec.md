# Stables Visual Identity Specification
**Version**: 1.0  
**Date**: 2026-01-06  
**Source**: Instagram Carousel V2 (4 slides) + stablescouncil.github.io  
**Status**: **LOCKED** - This is the ONLY approved visual identity

---

## Overview

This document captures the **exact visual elements** used in the approved Instagram carousel and presentation. Any future visual content MUST use these exact specifications - no variations, no interpretations.

**Reference Implementation**: 
- `1_development/instagram_assets/instagram_v2_slide_*.png` (4 carousel slides)
- https://stablescouncil.github.io/

---

## Color Palette (EXACT HEX CODES)

### Required Colors (Use These Only)
```
Background:        #0b0f14   (Dark navy/black)
Text Primary:      #e6edf3   (Light grey - for headlines)
Text Secondary:    #9fb0c0   (Muted grey - for body text)
Accent Cyan:       #67e8f9   (Electric cyan - primary accent)
Accent Purple:     #a78bfa   (Purple - for gradients only)
Accent Amber:      #fbbf24   (Amber/gold - for "Business" sections)
```

### Do NOT Use
- Any other colors
- Pure white (#ffffff) except in gradients
- Pure black (#000000)

---

## Background Formula (EXACT)

Every visual must use this background:

```
Base color: #0b0f14
+ Radial gradient from top: rgba(103, 232, 249, 0.18) fading to transparent
```

**Result**: Dark background with subtle cyan glow from top/center

---

## Typography (EXACT)

### Font
- **Only Font**: Inter (from Google Fonts)
- **If Inter unavailable**: System default (never substitute another web font)

### Text Sizes & Weights Used in Carousel
```
Large Headlines:   52-60px, weight 700-900, color #e6edf3 or gradient
Body Text:         20-22px, weight 400-500, color #9fb0c0
Pill Badges:       11px, weight 600, uppercase, color #67e8f9
Small Text:        13-14px, weight 400-600, color #9fb0c0
```

### Text Effects
**Gradient Text** (for major headlines only):
```
background: linear-gradient(135deg, #ffffff 0%, #67e8f9 50%, #a78bfa 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

**Standard Text**:
- Headlines: #e6edf3 (no gradient)
- Body: #9fb0c0
- Accents: #67e8f9

---

## Glassmorphism Effect (EXACT RECIPE)

Used for cards and badges in the carousel:

```css
background: rgba(15, 23, 42, 0.6) to rgba(15, 23, 42, 0.95);
backdrop-filter: blur(12px) to blur(20px);
border: 1px solid rgba(103, 232, 249, 0.3) to rgba(103, 232, 249, 0.5);
border-radius: 16px to 24px;
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 
            inset 0 1px 1px rgba(255, 255, 255, 0.05);
```

**When to use**:
- Feature cards
- Wallet mockups
- Pill badges
- Any overlay element

---

## Pill Badges (EXACT SPECIFICATION)

As seen on carousel slides:

**"Built on MINIMA"** (cyan):
```
Text: "BUILT ON MINIMA" (uppercase, 11px, weight 600)
Color: #67e8f9
Background: rgba(15, 23, 42, 0.6)
Border: 1px solid rgba(103, 232, 249, 0.5)
Border-radius: 999px (full pill)
Padding: 8px 18px
Backdrop-filter: blur(12px)
Box-shadow: 0 0 20px rgba(103, 232, 249, 0.2)
```

**"FOR YOU"** / **"FOR BUSINESS"** / **"FOR GROWTH"**:
- Same styling as above
- "FOR BUSINESS" uses amber: #fbbf24
- "FOR GROWTH" uses purple: #a78bfa

---

## Glow Effects (EXACT)

### Cyan Glow (primary)
```
box-shadow: 0 0 30px rgba(103, 232, 249, 0.3) to rgba(103, 232, 249, 0.5);
```

### Soft Shadow
```
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) to rgba(0, 0, 0, 0.7);
```

### Combined (for cards)
```
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 
            0 0 40px rgba(103, 232, 249, 0.15);
```

---

## Brand Asset Integration

### Master Assets (MUST USE - NEVER RECREATE)
- **Symbol**: `2_current/assets/brand_masters/master_symbol.png`
  - 3D chrome "S" with cyan inner glow
  - Always on transparent background
  
- **Wordmark**: `2_current/assets/brand_masters/master_wordmark_transparent.png`
  - 3D "STABLES" text in metallic finish
  - Always on transparent background

### Usage Rules
1. Use original PNG files - never regenerate
2. Maintain transparent background
3. Add cyan glow effect in context (via CSS or image effects)
4. Never modify, recolor, or distort

---

## Layout Pattern (FROM CAROUSEL)

### Instagram Square (1080x1080px)
```
┌─────────────────────────────┐
│  [Pill Badge]               │ ← 60px from top
│                             │
│  [Brand Asset/Headline]     │ ← Centered or offset
│                             │
│  [Body Text]                │ ← 20-24px below headline
│                             │
│  [Card/Visual Element]      │ ← Optional, centered
│                             │
│  [CTA/Link]                 │ ← 60px from bottom
└─────────────────────────────┘
```

### Spacing Used
- Edge padding: 60-80px
- Between elements: 20-40px
- Card internal padding: 24-32px
- Card border-radius: 16-24px

---

## Mandatory Elements

### "Built on MINIMA" Badge
**MUST appear on every single communication** (social posts, presentations, graphics)

Specifications:
- Text: "BUILT ON MINIMA" (all caps)
- Style: Cyan pill badge (see specification above)
- Position: Top or bottom of composition
- Always links to https://minima.global (where applicable)

---

## The 4 Reference Slides

### Slide 1: Hero
- Dark #0b0f14 background with radial cyan glow
- "BUILT ON MINIMA" pill badge at top
- Master wordmark centered
- Tagline in #9fb0c0: "Money that is truly yours. Secure, Pseudonymous and Unstoppable."

### Slide 2: For You
- "FOR YOU" cyan pill badge
- Headline: "Pay instantly. Own completely." (#e6edf3)
- Body text in #9fb0c0
- Three glassmorphic cards with cyan accents

### Slide 3: For Business  
- "FOR BUSINESS" amber pill badge (#fbbf24)
- Glassmorphic wallet card with:
  - Balance display in gradient text
  - Currency rows (sUSD, sEUR, sCAD) in cyan
  - Stats with icons
- Headline below card

### Slide 4: CTA
- "BUILT ON MINIMA" pill badge at top
- Master symbol small in corner
- Large headline: "Explore the Vision"
- "Money Platform." in cyan
- Body text
- "🔗 Link in bio" pill at bottom

---

## Image Generation Prompt Template

When creating any new visual content, use this exact prompt structure:

```
[Format specification, e.g., Instagram square 1080x1080px]

Visual identity (EXACT - do not deviate):
- Background: Dark navy #0b0f14 with radial gradient 
  rgba(103, 232, 249, 0.18) from top fading to transparent
- Text: Inter font
  - Headlines: #e6edf3 or gradient (white → #67e8f9 → #a78bfa)
  - Body: #9fb0c0
- Accent: Electric cyan #67e8f9 for borders, highlights, glows
- Badge: "BUILT ON MINIMA" in uppercase, cyan (#67e8f9) pill badge
  with glassmorphic background, 1px border, subtle glow
- Effects: Glassmorphism cards with backdrop-blur, soft cyan glows,
  floating light particles (very subtle)
- Style: Premium fintech, dark mode, minimalist

[Specific content for this image]

Match Instagram carousel visual identity exactly. Reference: stablescouncil.github.io
```

---

## What NOT to Do

❌ Do not use colors outside the approved palette  
❌ Do not use fonts other than Inter  
❌ Do not recreate brand assets (symbol/wordmark)  
❌ Do not skip the "Built on MINIMA" badge  
❌ Do not use flat colors - always use gradients and glows  
❌ Do not use bright/vibrant backgrounds  
❌ Do not use sharp edges - always round corners (16-24px)  

---

## Version Control

- **v1.0** (2026-01-06): Locked specification based on Instagram carousel V2
- Future versions must archive this document to `3_archive/visual_identity/`
- Any changes must be approved and documented

---

## Verification Checklist

Before approving any visual content, verify:
- [ ] Background is #0b0f14 with cyan radial glow
- [ ] Only approved colors are used
- [ ] Inter font is used
- [ ] Glassmorphism effects match specification
- [ ] "Built on MINIMA" badge is present
- [ ] Brand assets (if used) are from `brand_masters/`
- [ ] Matches the aesthetic of Instagram carousel V2

---

**This specification is LOCKED.** Any deviation requires user approval and documentation update.
**Version**: 1.0  
**Date**: 2026-01-06  
**Source**: stablescouncil.github.io  
**Status**: **LOCKED** - Use this for all future visual content

---

## Overview
This document captures the exact visual identity used in the Stables presentation and Instagram carousel. Use these specifications to maintain consistent branding across all platforms.

---

## Color Palette

### Primary Colors
```css
--bg: #0b0f14;                    /* Dark navy/black background */
--panel: #101826;                  /* Panel/card background */
--text: #e6edf3;                   /* Primary text (light grey) */
--muted: #9fb0c0;                  /* Secondary text (muted grey) */
--accent: #67e8f9;                 /* Electric cyan (primary accent) */
--accent-purple: #a78bfa;          /* Purple accent (secondary) */
--accent-pink: #f472b6;            /* Pink accent (tertiary) */
--accent-amber: #fbbf24;           /* Amber/gold (business sections) */
```

### Gradient Recipes
```css
/* Page Background */
background: radial-gradient(circle at top, rgba(103, 232, 249, 0.18), transparent 55%) #0b0f14;

/* Heading Text Gradient */
background: linear-gradient(135deg, #ffffff 0%, #67e8f9 50%, #a78bfa 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;

/* Card Background (Glassmorphism) */
background: linear-gradient(135deg, rgba(103, 232, 249, 0.12), rgba(15, 23, 42, 0.95));

/* Primary Button */
background: linear-gradient(135deg, rgba(103, 232, 249, 0.3), rgba(167, 139, 250, 0.3));
```

---

## Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallback**: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif

### Font Sizes
- **Hero Headline**: 84px (weight: 900)
- **Section Headline**: 52px (weight: 700-900)
- **Body Text**: 20px (weight: 400)
- **Tagline**: 24px (weight: 500)
- **Small Text/Labels**: 11-14px (weight: 600)

### Text Colors
- **Headlines**: White (#ffffff) or gradient (white → cyan → purple)
- **Body**: Muted grey (#9fb0c0)
- **Accents**: Cyan (#67e8f9)
- **Labels/Badges**: Cyan (#67e8f9)

---

## Effects & Styling

### Glassmorphism (Cards)
```css
background: rgba(15, 23, 42, 0.4);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(148, 163, 184, 0.2);
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 
            inset 0 1px 1px rgba(255, 255, 255, 0.05);
border-radius: 24px;
```

### Glow Effects
```css
/* Cyan Glow */
box-shadow: 0 0 30px rgba(103, 232, 249, 0.5);

/* Soft Shadow */
box-shadow: 0 22px 55px rgba(0, 0, 0, 0.7);

/* Combined Glow + Shadow */
box-shadow: 0 20px 70px rgba(0, 0, 0, 0.6), 
            0 0 40px rgba(103, 232, 249, 0.15);
```

### Pill Badges
```css
display: inline-block;
padding: 8px 18px;
border-radius: 999px;
font-size: 11px;
font-weight: 600;
letter-spacing: 0.12em;
text-transform: uppercase;
color: #67e8f9;
border: 1px solid rgba(103, 232, 249, 0.5);
background: rgba(15, 23, 42, 0.6);
backdrop-filter: blur(12px);
box-shadow: 0 0 20px rgba(103, 232, 249, 0.2);
```

---

## Brand Assets

### Required Elements
- **Master Symbol**: `2_current/assets/brand_masters/master_symbol.png`
  - 3D chrome "S" with cyan inner glow
  - Use on transparent background
  
- **Master Wordmark**: `2_current/assets/brand_masters/master_wordmark_transparent.png`
  - 3D "STABLES" text in metallic finish
  - Use on transparent background

### Integration Rules
1. Always use master assets - never recreate
2. Verify transparency against magenta (#ff00ff) background
3. Symbol should have cyan glow in context
4. Wordmark can be used with or without symbol

---

## Layout Patterns

### Instagram Posts (1080x1080px)
```
┌─────────────────────────────┐
│  [Badge: "Built on MINIMA"] │ ← Top, centered or left
│                             │
│     [3D Brand Asset]        │ ← Centered or offset
│                             │
│   [Large Headline]          │ ← Bold, gradient or white
│                             │
│   [Body text in grey]       │ ← Muted color
│                             │
│  [Glassmorphic Card]        │ ← Optional feature showcase
│                             │
│   [CTA or Link]             │ ← Bottom
└─────────────────────────────┘
```

### Spacing
- **Padding**: 40-80px from edges
- **Gap between elements**: 20-40px
- **Card padding**: 32px
- **Card border-radius**: 24px

---

## Mandatory Elements

> [!IMPORTANT]
> **"Built on MINIMA" Badge**  
> Must appear on EVERY piece of communication (social posts, presentations, marketing materials).

**Specifications**:
- Text: "Built on MINIMA" (uppercase)
- Style: Pill badge with cyan border
- Position: Top of composition or bottom
- Link: https://minima.global (where applicable)

---

## Animation Effects (Optional)

### Gradient Shift
```css
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
animation: gradient-shift 8s ease infinite;
background-size: 200% 200%;
```

### Floating Glow
```css
@keyframes float {
  0%, 100% { transform: translate(-50%, 0) scale(1); }
  50% { transform: translate(-50%, 20px) scale(1.1); }
}
animation: float 15s ease-in-out infinite;
```

### Shimmer (for buttons)
```css
@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
/* Apply to ::before pseudo-element */
```

---

## Platform-Specific Adaptations

### Instagram
- Format: 1080x1080px (square) or 1080x1350px (portrait)
- File type: PNG or JPEG
- Max file size: 8MB
- Always include "Built on MINIMA" badge

### X (Twitter)
- Header: 1500x500px
- Profile: 400x400px (use master symbol)
- Posts: 1200x675px (16:9)

### Web/Presentation
- Use CSS variables from this spec
- Implement glassmorphism with backdrop-filter
- Radial gradient background

---

## Quick Reference: Image Generation Prompts

When using AI image generation, use this template:

```
Instagram post, square 1080x1080px.

Visual identity (EXACT):
- Background: Dark navy/black (#0b0f14) with radial gradient 
  of electric cyan glow (rgba(103, 232, 249, 0.18))
- Primary accent: Electric cyan (#67e8f9)
- Typography: Inter font, bold white or gradient (white→cyan)
- Badge: "Built on MINIMA" in uppercase, cyan border pill badge
- Effects: Glassmorphism cards, soft outer glows, floating particles
- Style: Premium fintech, dark mode, minimalist

[Specific content for this image]

Match stablescouncil.github.io aesthetic exactly.
```

---

## Examples in Use

### Instagram Carousel V2
Perfect implementation of this visual identity:
- `1_development/instagram_assets/instagram_v2_slide_1.png`
- `1_development/instagram_assets/instagram_v2_slide_2.png`
- `1_development/instagram_assets/instagram_v2_slide_3.png`
- `1_development/instagram_assets/instagram_v2_slide_4.png`

### Live Presentation
Reference: https://stablescouncil.github.io/

---

## Version History
- **v1.0** (2026-01-06): Initial specification based on stablescouncil.github.io

---

**This specification is locked.** Any future visual content should match these exact specifications to maintain brand consistency.

