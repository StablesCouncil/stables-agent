# Facebook Cover Photo - Creation Instructions

## Specifications
- **Dimensions**: 820x312px (Facebook cover photo standard)
- **Format**: PNG or JPEG
- **File size**: Under 100KB recommended

## Visual Identity (EXACT)

### Background
- Base color: #0b0f14 (dark navy/black)
- Radial gradient: rgba(103, 232, 249, 0.18) from top-center, fading to transparent

### Main Elements

**1. STABLES Wordmark** (Center-left)
- Asset: Use `2_current/assets/brand_masters/master_wordmark_transparent.png`
- Position: Center-left, approximately 180px from left edge
- Size: Scale to fit within cover height (approx 200px wide)
- Effect: Subtle cyan glow around wordmark

**2. "BUILT ON MINIMA" Badge** (Top-right)
- Text: "BUILT ON MINIMA" (uppercase, 11px, weight 600)
- Color: #67e8f9 (electric cyan)
- Background: rgba(15, 23, 42, 0.6) with backdrop-filter: blur(12px)
- Border: 1px solid rgba(103, 232, 249, 0.5)
- Border-radius: 999px (full pill)
- Padding: 8px 18px
- Position: Top-right corner, 40px from right, 30px from top
- Box-shadow: 0 0 20px rgba(103, 232, 249, 0.2)

**3. Tagline** (Bottom-center)
- Text: "Money that is truly yours. Secure, Pseudonymous and Unstoppable."
- Font: Inter, 16px, weight 400
- Color: #9fb0c0 (muted grey)
- Position: Bottom-center, 30px from bottom
- Alignment: Center

### Effects
- Glassmorphism on badge
- Soft cyan glows (subtle)
- Floating light particles (very subtle, optional)
- Premium fintech aesthetic

## Image Generation Prompt

```
Facebook cover photo, 820x312px horizontal banner.

Visual identity (EXACT):
- Background: Dark navy/black (#0b0f14) with radial gradient 
  of electric cyan glow (rgba(103, 232, 249, 0.18)) from top-center
- Center-left: 3D metallic chrome "STABLES" wordmark with cyan inner glow
- Top-right: "BUILT ON MINIMA" pill badge - cyan (#67e8f9) text, 
  glassmorphic background, 1px cyan border, subtle glow
- Bottom-center: "Money that is truly yours. Secure, Pseudonymous and Unstoppable." 
  in muted grey (#9fb0c0), Inter font
- Effects: Glassmorphism, soft cyan glows, premium fintech aesthetic
- Style: Dark mode, minimalist, professional, matches stablescouncil.github.io

No device frames. No people. Clean, modern, premium.
```

## Alternative: Manual Creation

If using design software (Figma, Photoshop, Canva):

1. Create 820x312px canvas
2. Fill with #0b0f14
3. Add radial gradient overlay (cyan glow from top)
4. Import `master_wordmark_transparent.png` and position center-left
5. Create pill badge with specifications above
6. Add tagline text at bottom
7. Export as PNG

## Verification

Before uploading to Facebook:
- [ ] Dimensions are exactly 820x312px
- [ ] Background matches #0b0f14 with cyan glow
- [ ] Wordmark is clearly visible and properly positioned
- [ ] "BUILT ON MINIMA" badge is present and readable
- [ ] Tagline is centered and readable
- [ ] Colors match visual identity spec
- [ ] File size is under 100KB (recommended)

## Notes

- Facebook will display this at 820x312px on desktop
- On mobile, it may be cropped to 640x360px (center-focused)
- Ensure critical elements (wordmark, badge) are in the safe zone
- Test on both desktop and mobile before finalizing

---

**Status**: Ready for creation  
**Priority**: Medium (can use temporary cover until created)  
**Location**: Save to `1_development/facebook_assets/` when created
