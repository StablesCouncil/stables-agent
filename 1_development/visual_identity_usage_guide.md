# How to Ensure Visual Identity Consistency Across Sessions

## The System

Your visual identity is now **locked into the Stablesworks Handshake Protocol** - the same system that ensures I always know your branding rules, directory structure, and messaging guidelines.

---

## What Happens At Every Session Start

When you (or I) run `/stablesworks` at the beginning of a conversation, I now **mandatory** go through these steps:

1. ✅ Read `stables_master_reference.md`
2. ✅ Verify understanding of directory rules, branding, messaging
3. ✅ Index brand master assets
4. ✅ **Read `2_current/visual_identity_spec.md`** 🆕
5. ✅ Confirm I understand the exact colors, effects, layouts
6. ✅ Report status

---

## The Files That Lock It In

### 1. **Visual Identity Spec** (The Source of Truth)
**Location**: `C:\Users\Charles\.gemini\antigravity\scratch\Stables\2_current\visual_identity_spec.md`

This document contains:
- Exact HEX color codes (#0b0f14, #67e8f9, etc.)
- CSS recipes for glassmorphism
- Typography specifications (Inter font, sizes, weights)
- Gradient formulas
- Layout patterns
- Image generation prompts
- **Mandatory "Built on MINIMA" requirement**

### 2. **Updated Handshake Workflow**
**Location**: `.agent\workflows\stablesworks.md`

Now includes **Step 4: Visual Identity Lock**
- Mandatory reading of visual_identity_spec.md
- Confirmation of color palette understanding
- Confirmation of effects understanding
- Commitment to use ONLY this spec for visual content

### 3. **Master Reference** (Updated)
**Location**: `stables_master_reference.md`

Section 6 now points to `visual_identity_spec.md` as the source of truth for all visual identity.

---

## How to Use It

### At the Start of Every Session:
```
@/stablesworks
```

I will automatically:
1. Read the visual identity spec
2. Confirm I understand the exact colors and effects
3. Lock in the visual style

### When Requesting Visual Content:
Just ask normally! Examples:
- "Create an X header image"
- "Make an Instagram story graphic"
- "Design a new slide for the presentation"

I'll **automatically use the locked visual identity** because I've read the spec at session start.

---

## What's Protected

✅ **Colors**: Dark background (#0b0f14), cyan accent (#67e8f9), all variants  
✅ **Effects**: Glassmorphism, gradients, glows  
✅ **Typography**: Inter font, specific sizes and weights  
✅ **Brand Assets**: Master symbol and wordmark integration  
✅ **Layouts**: Spacing, card designs, pill badges  
✅ **Mandatory Elements**: "Built on MINIMA" on everything  

---

## Verification

To verify I've loaded the visual identity correctly, you can ask:
- "What colors should I use for Stables branding?"
- "Show me the glassmorphism CSS"
- "What's the mandatory attribution?"

I'll reference the exact specs from `visual_identity_spec.md`.

---

## Future-Proofing

### If Visual Identity Ever Evolves:
1. Update `2_current/visual_identity_spec.md` with new specs
2. Archive old version to `3_archive/`
3. Run `/stablesworks` in next session
4. I'll automatically use the updated identity

### For Other Team Members:
If you work with other AI assistants or designers:
- Share `visual_identity_spec.md` with them
- It's a complete, standalone reference
- No need to explain repeatedly

---

## The Magic Sentence

At the start of every session, just say:
> **@/stablesworks**

And I'll be locked and loaded with:
- Your directory rules
- Your branding guidelines
- Your messaging rules
- Your brand master assets
- **Your exact visual identity** 🎨

---

**That's it!** The visual identity is now as protected as your branding rules. Every session, every time. 🔒
