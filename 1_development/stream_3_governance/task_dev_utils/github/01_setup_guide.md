# GitHub Setup Guide: Stables Council

> **Step-by-step instructions** for creating the `stables-council` GitHub organization and repositories.

---

## Overview

We're creating a **two-tier GitHub structure**:

| Organization | Visibility | Purpose |
| :--- | :--- | :--- |
| **`Stables`** | 🔒 Private | Development, internal tools |
| **`stables-council`** | 🌐 Public | Community-facing, open-source |

---

## Phase 1: Create the Organization

### Step 1: Create `stables-council` Organization

1. Go to [github.com/organizations/new](https://github.com/organizations/new)
2. **Organization name**: `stables-council`
3. **Contact email**: Your email
4. **Organization type**: Select "Free" (you can upgrade later)
5. Click **"Create organization"**

### Step 2: Configure Organization Settings

1. Go to `https://github.com/stables-council`
2. Click **"Settings"** (top right)
3. **Profile**:
   - **Name**: Stables
   - **Description**: "Decentralized money platform built on Minima"
   - **X**: `@StablesCouncil`
4. **Profile Picture**: Upload `1_symbol_social.png` from `2_current/assets/`
5. Click **"Update profile"**

---

## Phase 2: Create `presentation` Repository

### Step 1: Create the Repository

1. Go to `https://github.com/stables-council`
2. Click **"New repository"**
3. **Repository name**: `presentation`
4. **Description**: "Official Stables presentation"
5. **Visibility**: ✅ **Public**
6. **Initialize**:
   - ✅ Add a README file
   - ✅ Add .gitignore (select "None" for now)
   - ✅ Choose a license: **MIT License**
7. Click **"Create repository"**

### Step 2: Upload Presentation Files

**Option A: Via Web Interface (Easiest)**

1. Go to `https://github.com/stables-council/presentation`
2. Click **"Add file"** → **"Upload files"**
3. Upload these files from your local machine:
   - `Stables _ the money platform.html` (rename to `index.html`)
   - Any associated assets (images, CSS, JS if separate)
4. **Commit message**: "Initial presentation upload"
5. Click **"Commit changes"**

**Option B: Via Git Command Line**

```bash
# Navigate to your Stables directory
cd "h:\My Drive\Stables\2_current\assets"

# Create a temporary directory for the repo
mkdir temp_presentation
cd temp_presentation

# Initialize git
git init

# Add remote
git remote add origin https://github.com/stables-council/presentation.git

# Copy the HTML file and rename it
cp "../Stables _ the money platform.html" index.html

# Add and commit
git add index.html
git commit -m "Initial presentation upload"

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Replace README.md

1. Go to `https://github.com/stables-council/presentation`
2. Click on `README.md`
3. Click the **pencil icon** (Edit)
4. **Replace content** with the content from:
   - `h:\My Drive\Stables\1_development\github\presentation_readme.md`
5. **Commit message**: "Update README with project details"
6. Click **"Commit changes"**

### Step 4: Enable GitHub Pages

1. Go to `https://github.com/stables-council/presentation`
2. Click **"Settings"** (repository settings, not organization)
3. Scroll down to **"Pages"** (left sidebar)
4. **Source**: Select **"Deploy from a branch"**
5. **Branch**: Select **"main"** and **"/ (root)"**
6. Click **"Save"**
7. **Wait 1-2 minutes** for deployment
8. **Your URL**: `https://stables-council.github.io/presentation`

### Step 5: Verify Deployment

1. Open `https://stables-council.github.io/presentation` in your browser
2. Verify the presentation loads correctly
3. Test all slides and interactions

---

## Phase 3: Prepare `console` Repository (For Week 2)

### Step 1: Create the Repository

1. Go to `https://github.com/stables-council`
2. Click **"New repository"**
3. **Repository name**: `console`
4. **Description**: "User interface for Stables"
5. **Visibility**: 🔒 **Private** (for now, will make public in Week 2)
6. **Initialize**:
   - ✅ Add a README file
   - ✅ Add .gitignore: Select **"Node"** (if using npm) or **"None"**
   - ✅ Choose a license: **MIT License**
7. Click **"Create repository"**

### Step 2: Update README (When Ready to Open-Source)

1. Replace README.md with content from:
   - `h:\My Drive\Stables\1_development\github\console_readme.md`
2. Add security warning banner
3. Upload your console code

### Step 3: Make Public (Week 2)

1. Go to `https://github.com/stables-council/console`
2. Click **"Settings"**
3. Scroll to **"Danger Zone"**
4. Click **"Change visibility"** → **"Make public"**
5. Confirm by typing the repository name

---

## Phase 4: Update Launch Materials

### Update Launch Tweet

Replace the placeholder URL with the actual GitHub Pages URL:

**Before:**
```
https://stables-council.github.io/presentation
```

**After (verify this is the actual URL):**
```
https://stables-council.github.io/presentation
```

### Test All Links

- [ ] GitHub Pages URL loads
- [ ] README links work
- [ ] Organization profile is complete
- [ ] Profile picture displays correctly

---

## Checklist: Pre-Launch

**Organization Setup:**
- [ ] `stables-council` organization created
- [ ] Organization profile updated (name, description, website, X)
- [ ] Organization profile picture uploaded

**Presentation Repository:**
- [ ] `presentation` repo created (public)
- [ ] HTML file uploaded as `index.html`
- [ ] README.md updated
- [ ] GitHub Pages enabled
- [ ] Deployment verified (URL works)

**Console Repository:**
- [ ] `console` repo created (private for now)
- [ ] README.md prepared for Week 2 open-source

**Launch Content:**
- [ ] Launch tweet updated with correct GitHub Pages URL
- [ ] X thread references correct links
- [ ] All documentation links verified

---

## Troubleshooting

### GitHub Pages Not Loading

**Issue**: 404 error on `stables-council.github.io/presentation`

**Solutions:**
1. Check that the file is named `index.html` (not `Stables _ the money platform.html`)
2. Verify GitHub Pages is enabled in Settings → Pages
3. Wait 2-5 minutes for initial deployment
4. Check the "Actions" tab for deployment status

### HTML File Too Large

**Issue**: GitHub rejects file upload (>100 MB)

**Solution:**
1. Check file size: `Get-Item "Stables _ the money platform.html" | Select-Object Length`
2. If >100 MB, use Git LFS (Large File Storage)
3. Or optimize the HTML (compress images, remove unused assets)

### Images Not Loading

**Issue**: Presentation loads but images are broken

**Solution:**
1. Check if images are embedded (base64) or external files
2. If external, upload all image files to the repo
3. Update HTML paths to be relative (e.g., `./images/logo.png`)

---

## Next Steps

1. ✅ Complete Phase 1 & 2 (Organization + Presentation)
2. ✅ Test the GitHub Pages URL
3. ✅ Update launch tweet with verified URL
4. ⏳ Prepare console code for Week 2 open-source
5. ⏳ Monitor GitHub Stars/Forks after launch

---

**Ready to execute!** Follow these steps in order, and you'll have a professional GitHub presence for launch.




