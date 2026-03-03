# X (Twitter) to Discord Integration Guide
## Auto-Post X Tweets to Discord #twitter-feed Channel

---

## 🎯 What This Does

Automatically posts your X/Twitter tweets to your Discord `#twitter-feed` channel in real-time.

**Benefits:**
- ✅ Keep Discord community updated with X posts
- ✅ Centralize content in one place
- ✅ No manual cross-posting needed
- ✅ Real-time updates

---

## 📋 Setup Methods

### **Method 1: IFTTT (Recommended - Free & Easy)**

#### Step 1: Create Discord Webhook
1. Go to Discord Server Settings → Integrations → Webhooks
2. Click **"New Webhook"**
3. **Name**: `X Feed Bot` (or any name you like)
4. **Channel**: Select `#twitter-feed`
5. **Avatar**: Upload Stables logo (optional)
6. Click **"Copy Webhook URL"** - Save this for later
7. Click **"Save Changes"**

#### Step 2: Set Up IFTTT
1. Go to https://ifttt.com and create a free account
2. Click **"Create"** to make a new applet
3. Click **"If This"**:
   - Search for **"Twitter"** (or "X")
   - Select **"New tweet by you"**
   - Connect your @StablesCouncil account
4. Click **"Then That"**:
   - Search for **"Webhooks"**
   - Select **"Make a web request"**
   - Configure:
     - **URL**: Paste your Discord webhook URL
     - **Method**: `POST`
     - **Content Type**: `application/json`
     - **Body**:
```json
{
  "content": "**New post on X:**\n{{Text}}\n\n{{LinkToTweet}}"
}
```
5. Click **"Continue"** → **"Finish"**

#### Step 3: Test
1. Post a test tweet on X
2. Wait 1-2 minutes (IFTTT checks every few minutes)
3. Check Discord `#twitter-feed` channel
4. Your tweet should appear!

---

### **Method 2: Zapier (More Features, Paid)**

#### Step 1: Create Discord Webhook
(Same as Method 1, Step 1)

#### Step 2: Set Up Zapier
1. Go to https://zapier.com and create account
2. Click **"Create Zap"**
3. **Trigger**:
   - App: **Twitter** (or "X")
   - Event: **New Tweet by You**
   - Connect @StablesCouncil account
4. **Action**:
   - App: **Webhooks by Zapier**
   - Event: **POST**
   - URL: Your Discord webhook URL
   - Payload Type: `json`
   - Data:
```json
{
  "content": "**New post on X:**\n{{tweet_text}}\n\n{{tweet_url}}"
}
```
5. Test and activate

---

### **Method 3: Make.com (Advanced Automation)**

Similar to Zapier but with more customization options.

1. Create scenario with Twitter trigger
2. Add Discord webhook action
3. Map tweet data to Discord message format

---

## 🎨 Customize Discord Message Format

### Basic Format:
```json
{
  "content": "**New post on X:**\n{{Text}}\n\n{{LinkToTweet}}"
}
```

### Rich Embed Format (Prettier):
```json
{
  "embeds": [{
    "title": "New Post on X",
    "description": "{{Text}}",
    "url": "{{LinkToTweet}}",
    "color": 103232,
    "author": {
      "name": "@StablesCouncil",
      "url": "https://x.com/StablesCouncil"
    },
    "footer": {
      "text": "Posted on X"
    },
    "timestamp": "{{CreatedAt}}"
  }]
}
```

### With Thumbnail (Stables Logo):
```json
{
  "embeds": [{
    "title": "New Post on X",
    "description": "{{Text}}",
    "url": "{{LinkToTweet}}",
    "color": 6808313,
    "thumbnail": {
      "url": "https://stablescouncil.github.io/assets/logo.png"
    },
    "author": {
      "name": "@StablesCouncil",
      "icon_url": "https://stablescouncil.github.io/assets/logo.png"
    },
    "footer": {
      "text": "Built on MINIMA"
    }
  }]
}
```

---

## 🔧 Discord Webhook Setup (Detailed)

### Creating the Webhook:

1. **Open Discord** → Your Stables server
2. **Right-click** on `#twitter-feed` channel
3. Click **"Edit Channel"**
4. Go to **"Integrations"** tab
5. Click **"Webhooks"** → **"New Webhook"**
6. Configure:
   - **Name**: `X Feed Bot`
   - **Channel**: `#twitter-feed`
   - **Avatar**: Upload Stables logo (optional)
7. Click **"Copy Webhook URL"**
8. **IMPORTANT**: Save this URL securely - anyone with it can post to your channel
9. Click **"Save Changes"**

### Webhook URL Format:
```
https://discord.com/api/webhooks/[WEBHOOK_ID]/[WEBHOOK_TOKEN]
```

---

## ⚙️ IFTTT Setup (Step-by-Step)

### 1. Create IFTTT Account
- Go to https://ifttt.com
- Sign up (free)
- Verify email

### 2. Connect Twitter/X
- Go to "My Services"
- Search for "Twitter"
- Click "Connect"
- Authorize @StablesCouncil account

### 3. Create Applet
1. Click **"Create"**
2. Click **"If This"**
3. Search **"Twitter"**
4. Select **"New tweet by you"**
5. Click **"Create trigger"**

### 4. Configure Action
1. Click **"Then That"**
2. Search **"Webhooks"**
3. Select **"Make a web request"**
4. Fill in:
   - **URL**: Your Discord webhook URL
   - **Method**: `POST`
   - **Content Type**: `application/json`
   - **Body**: (Use one of the formats above)
5. Click **"Create action"**

### 5. Finalize
1. Review applet
2. Click **"Continue"**
3. Give it a name: "X to Discord"
4. Click **"Finish"**

---

## ✅ Testing

### Test Your Setup:
1. Post a test tweet: "Testing Discord integration! 🚀"
2. Wait 1-5 minutes (IFTTT checks periodically)
3. Check Discord `#twitter-feed` channel
4. Verify the post appears correctly

### Troubleshooting:
- **No posts appearing?** Check IFTTT activity log
- **Formatting wrong?** Review webhook body JSON
- **Webhook error?** Verify webhook URL is correct
- **Delayed posts?** IFTTT free tier has ~15min delay

---

## 📊 What Gets Posted

**Included:**
- ✅ Tweet text
- ✅ Link to tweet
- ✅ Timestamp (if using embeds)

**Not Included (IFTTT limitations):**
- ❌ Images/media (requires paid plan or custom bot)
- ❌ Retweets (only your original tweets)
- ❌ Replies (only main tweets)

**To include media:** Use Zapier or custom bot

---

## 🎯 Recommended Setup

**For Stables:**

1. **Use IFTTT** (free, simple)
2. **Basic format** (clean, minimal)
3. **Filter**: Only post main tweets (not replies)
4. **Channel**: `#twitter-feed` (dedicated channel)

**Message Format:**
```json
{
  "content": "**New post on X:**\n{{Text}}\n\n{{LinkToTweet}}"
}
```

---

## 🔒 Security

**Webhook URL Security:**
- ⚠️ Never share webhook URL publicly
- ⚠️ Don't commit to GitHub
- ⚠️ Regenerate if compromised
- ✅ Only use in trusted automation services

**To Regenerate Webhook:**
1. Discord → Server Settings → Integrations
2. Find webhook
3. Click "Delete Webhook"
4. Create new one

---

## 📝 Next Steps

1. ✅ Create Discord webhook
2. ✅ Set up IFTTT applet
3. ✅ Test with a tweet
4. ✅ Verify in Discord
5. ✅ Customize message format (optional)

---

## 🎨 Advanced: Custom Bot (Optional)

For more control (images, embeds, filters), create a custom bot:

**Technologies:**
- Node.js + Twitter API
- Discord.js
- Host on Heroku/Railway (free)

**Features:**
- Include images/videos
- Rich embeds
- Filter by hashtags
- Custom formatting

**Let me know if you want help building this!**

---

## 📋 Webhook URL (Save This)

```
[PASTE YOUR WEBHOOK URL HERE AFTER CREATING IT]
```

---

Ready to set this up? Start with **Step 1: Create Discord Webhook**!
