# Discord Verification Fix - Require Member Verification
**Date:** 2026-01-20  
**Issue:** New members joining without verification step

---

## 🔍 THE PROBLEM

The Onboarding system (customization questions) is **optional** - members can skip it.

You need to enable **required verification** so members MUST complete steps before accessing the server.

---

## ✅ SOLUTION: Enable Required Verification

### **Step 1: Set Verification Level**

1. **Server Settings** → **Safety Setup**
2. Scroll to **"Verification Level"**
3. Set to **"Medium"** or **"High"**:
   - **Low:** Unrestricted
   - **Medium:** Must have verified email (5 minutes wait)
   - **High:** Must have verified email + be on Discord for 10 minutes
   - **Highest:** Must have verified phone number

**Recommended:** **Medium** (verified email required)

---

### **Step 2: Make Onboarding Required**

1. **Server Settings** → **Onboarding**
2. Look for **"Require Onboarding"** toggle
3. Turn it **ON**

If you don't see this option, it means Onboarding is optional by default.

---

### **Step 3: Use Channel Permissions (Manual Verification)**

If Discord doesn't force Onboarding, use this method:

**Create a "Member" role:**
1. **Server Settings** → **Roles**
2. Create new role: **"Member"**
3. Give it basic permissions (Send Messages, Read Messages, etc.)

**Restrict all channels:**
1. For **every channel** except #welcome and #rules:
   - Right-click → **Edit Channel** → **Permissions**
   - **@everyone:** Set "View Channel" to ❌ (red X)
   - **Member role:** Set "View Channel" to ✅ (green check)

**Manual verification:**
- New members can only see #welcome and #rules
- They read the rules
- You (or moderators) manually give them the "Member" role
- They can then see all channels

---

## 🤖 ALTERNATIVE: Use a Simple Bot

Since Discord's native verification is limited, use **Wick Bot** (lightweight, safe):

**Why Wick?**
- ✅ Minimal permissions needed
- ✅ Simple verification system
- ✅ Free
- ✅ Trusted by large servers

**Setup:**
1. Add Wick: https://wickbot.com/
2. Set up verification in #rules
3. New members must click button to verify
4. Auto-assigns "Member" role

---

## 🎯 RECOMMENDED SETUP

**Best approach for Stables:**

1. **Set Verification Level to Medium** (verified email required)
2. **Use channel permissions** to restrict access
3. **Create #verify channel** with simple instructions:
   ```
   Welcome to Stables!
   
   To gain access, please:
   1. Read the rules in #rules
   2. React with ✅ below to confirm you've read them
   
   A moderator will verify you shortly.
   ```
4. **Manually give "Member" role** to verified users

---

## 📝 TESTING VERIFICATION

**To test properly:**
1. Create a **new Discord account** (not an alt on same device)
2. Use **incognito browser** or **different device**
3. Join with your invite link
4. See what new members actually experience

**Note:** As server owner, you bypass ALL verification!

---

## ⚠️ WHY ONBOARDING DIDN'T WORK

Discord's Onboarding (customization questions) is:
- ❌ **Optional** - members can skip it
- ❌ **Not verification** - just channel customization
- ❌ **Doesn't restrict access** - members see everything

It's designed for **channel discovery**, not **verification**.

---

## ✅ FINAL RECOMMENDATION

**For Stables Discord:**

**Use this simple setup:**

1. **Verification Level:** Medium (verified email)
2. **Channel Permissions:**
   - #welcome: Everyone can see (read-only)
   - #rules: Everyone can see (read-only)
   - All other channels: Only "Member" role can see
3. **Manual verification:** Give "Member" role after they read rules

**This is:**
- ✅ Simple
- ✅ No bots needed
- ✅ Full control
- ✅ Professional

---

**Next Steps:**
1. Set verification level to Medium
2. Create "Member" role
3. Restrict all channels except #welcome and #rules
4. Test with a new account

---

**Built on MINIMA: https://minima.global**
