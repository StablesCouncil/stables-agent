# Multi-Platform Tone & Adaptation Guide

## Platform-Specific Writing Rules

### Instagram (@StablesCouncil)
**Audience**: General public, non-technical, crypto-curious  
**Reading Level**: 8th grade  
**Tone**: Warm, visual, benefit-focused, aspirational

**Rules:**
- ✅ Use simple words: "send money" not "transfer funds"
- ✅ Lead with benefits: "Pay anyone, instantly"
- ✅ Emojis welcome (1-3 per caption)
- ✅ Questions that spark curiosity
- ❌ No jargon: "blockchain", "DeFi", "smart contracts" (unless Phase 4+)
- ❌ No long paragraphs (3-4 lines max per paragraph)

**Example Caption:**
```
What if sending money was as easy as sending a text? 💸

No banks. No delays. No "sorry, weekends don't count."

Just you → them. Done.

Money that is truly yours. Secure, Pseudonymous and Unstoppable.

Built on MINIMA → [link]

#Stables #MoneyFreedom
```

---

### X / Twitter (@StablesCouncil)
**Audience**: Crypto community, developers, tech enthusiasts  
**Reading Level**: College/technical  
**Tone**: Informed, conversational, technical but accessible

**Rules:**
- ✅ Use industry terms: "L1", "on-chain", "self-custody"
- ✅ Threads for complex topics (4-8 tweets)
- ✅ Engage with replies (technical discussions welcome)
- ✅ Link to docs, code, resources
- ❌ Don't oversimplify for this audience
- ❌ Avoid marketing fluff - be substantive

**Example Thread:**
```
1/ Let's talk about instant payments on Stables. 🧵

Most crypto projects promise "fast transactions" but what does that actually mean?

Here's what we're building:

2/ Stables runs on MINIMA's L1 blockchain.

Block time: ~50 seconds
Transaction finality: Sub-second (once included)
No mempool congestion. No gas wars.

Your payment clears faster than a card swipe.

3/ How? MINIMA's unique architecture allows for:
- Parallel transaction processing
- Predictable block times
- No reliance on external validators

You control your keys. The network confirms your tx. Done.

4/ What does this mean for YOU?

✓ Pay someone in London from Lagos - instant
✓ Receive your paycheck on Friday, spend it Friday
✓ No "pending" limbo

This isn't a promise. This is the protocol.

Built on MINIMA → [link]
```

---

### Telegram Channel (@StablesCouncil)
**Audience**: Committed followers, technical enthusiasts, potential testers  
**Reading Level**: Technical/developer-focused  
**Tone**: Detailed, insider, educational, transparent

**Rules:**
- ✅ Long-form content (300-800 words)
- ✅ Technical depth: code snippets, architecture details
- ✅ "Behind the scenes" insights
- ✅ Early access to announcements
- ✅ Link to documentation, GitHub, resources
- ❌ No fluff - every word should add value

**Example Post:**
```
📢 Pillar #1: Pay - Technical Deep Dive

We've been talking about "instant payments" on Instagram and Twitter. 
Today, we're pulling back the curtain for this community.

🔧 HOW IT WORKS

Stables uses MINIMA's TransactionScript to construct payment transactions. Here's the flow:

1. User initiates payment in the MiniDapp UI
2. App constructs a transaction object:
   - Input: User's UTXO(s)
   - Output: Recipient address + amount
   - Script: Standard P2PKH verification
3. Transaction signed with user's private key (all client-side)
4. Broadcast to MINIMA network
5. Block inclusion (~50s avg)
6. Finality achieved (recipient sees balance update)

⚡ SPEED COMPARISON

Traditional bank transfer: 1-3 days
Bitcoin (1 confirmation): ~10 minutes
Ethereum (12 confirmations): ~3 minutes
Stables on MINIMA: <1 minute

🔐 SECURITY

Every transaction is:
- Cryptographically signed (secp256k1)
- Verified by the network (no trusted third party)
- Immutably recorded on-chain
- Pseudonymous (address ≠ identity)

💰 CURRENCIES SUPPORTED

At launch:
- sUSD (1:1 USD peg)
- sEUR (1:1 EUR peg)
- sCAD (1:1 CAD peg)
- sIRT (1:100,000 Iranian Rial peg)

More coming based on demand.

📊 WHY THIS MATTERS

You're not "sending money through Stables."
You're executing a transaction ON MINIMA.

Stables is the interface. MINIMA is the rails.
You own both the app and the outcome.

Next week: Pillar #2 (Receive) - how payments find YOU.

Built on MINIMA: https://minima.global
```

---

### Telegram Group (Stables Community)
**Audience**: Active members, testers, developers, support-seekers  
**Reading Level**: Mixed (technical + semi-technical)  
**Tone**: Collaborative, supportive, open discussion

**Rules:**
- ✅ Prompt discussions: "What do you think?"
- ✅ Respond to questions quickly
- ✅ Encourage peer-to-peer help
- ✅ Share channel posts for feedback
- ✅ Create polls for feature prioritization
- ❌ Don't let it go silent (daily check-ins minimum)

**Example Prompts:**
```
Morning everyone! ☕

We just dropped a deep dive on Pillar #1 in the channel. 

For those who've read it: What payment use case are you most excited about?

For me, it's cross-border payments. My cousin in Spain always complains about transfer fees. Can't wait to show her Stables.

What about you? 👇
```

```
Quick poll! 📊

When you think "instant payment," what's the max acceptable wait time?

⚡ <10 seconds
⏱️ <30 seconds  
⏳ <1 minute
🤷 As long as it's same-day

Vote with emojis!
```

---

### Discord (Future - Mirrors Telegram)
**Audience**: Same as Telegram (scaled community)  
**Tone**: Same as Telegram Group  
**Structure**: Multiple channels for different topics

**Planned Channels:**
- `#announcements` (read-only, mirrors Telegram Channel)
- `#general` (open chat, mirrors Telegram Group)
- `#technical` (dev discussions)
- `#support` (troubleshooting)
- `#feature-requests` (community input)
- `#testing` (beta tester coordination)

---

## Cross-Platform Content Calendar Example

### Week 1, Post 1: "Introduction to Stables"

**Monday**

**Instagram** (2pm UTC):
> Image: Master wordmark on dark slate background  
> Caption: "Introducing Stables. Money that is truly yours. 🌐 Secure. Pseudonymous. Unstoppable. Built on MINIMA → [link]"

**X** (2:30pm UTC):
> Thread:  
> 1/ Today we're introducing Stables - a new way to think about money.  
> 2/ Not a bank. Not a payment processor. Not a middleman.  
> 3/ A MiniDapp that puts YOU in control of your money. On @Minima_Global's L1 blockchain.  
> 4/ Secure. Pseudonymous. Unstoppable. Learn more: [link]

**Telegram Channel** (7pm UTC):
> Long-form post (500 words):  
> "Welcome to Stables - A Technical Introduction"  
> [Detailed explanation of project goals, MINIMA integration, roadmap overview]

**Telegram Group** (7:15pm UTC):
> "Hey everyone! We just posted our first official announcement in the channel. Welcome to Stables! 🎉 What brought you here? Drop a message and introduce yourself!"

---

## Tone Adaptation Checklist

Before posting, ask:

**For Instagram:**
- [ ] Would my non-technical friend understand this?
- [ ] Is the benefit clear in 3 seconds?
- [ ] Is it visually engaging?

**For X:**
- [ ] Would a crypto developer find this interesting?
- [ ] Does it invite discussion/replies?
- [ ] Is it substantive (not just marketing)?

**For Telegram Channel:**
- [ ] Does this teach something NEW?
- [ ] Is there enough depth for the technical audience?
- [ ] Have I linked to resources/docs?

**For Telegram Group:**
- [ ] Does this prompt discussion?
- [ ] Am I asking for feedback/input?
- [ ] Is it conversational (not corporate)?

---

## Mandatory Elements (All Platforms)

Every piece of content MUST include:

1. **"Built on MINIMA" attribution** (text or badge)
2. **Link to https://minima.global** (where applicable)
3. **Brand consistency**: Dark slate, neon cyan, Inter font (visual platforms)
4. **Alignment with current phase** (Phase 1-5 progression)

---

## Emergency Communication Protocol

If you need to post outside the plan (urgent news, bug fixes, critical updates):

**Priority Order:**
1. Telegram Group (immediate, for active users)
2. Telegram Channel (within 1 hour, formal announcement)
3. X (within 2 hours, public-facing)
4. Instagram (within 24 hours, if relevant to general audience)

**Example Scenario: Bug in Test Build**

- **Telegram Group**: "⚠️ Quick heads-up testers: We've identified a bug in v0.2.3. Do NOT use the 'Grow' feature until we push the fix (ETA 2 hours). We'll update you here first."
- **Telegram Channel**: [After fix] "Update: v0.2.4 is live. Fixed critical bug in yield calculation. All testers please update immediately."
- **X**: "Shipped a critical fix today (v0.2.4). Thanks to our testing community for the fast catch. This is why we build in public. 🛠️"
- **Instagram**: [Only if major] Carousel explaining what happened + how we fixed it (transparency story)

---

## Platform-Specific Hashtag Strategy

**Instagram:**
- #Stables (always)
- #MoneyFreedom #BuildInPublic (Phase 1-3)
- #BetaTesting #CryptoTesting (Phase 4-5)
- Max 5 hashtags total (avoid spam)

**X:**
- #Stables #MINIMA (always)
- Technical tags: #Blockchain #DeFi #Web3 #Crypto (allowed as discovery tags)
- Trend-jacking: Only if genuinely relevant

**Telegram/Discord:**
- No hashtags (use channels/categories for organization)

---

This guide ensures coordinated messaging while respecting each platform's unique audience and culture.

