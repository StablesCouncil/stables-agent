# Stables — X thread (countdown, Mint / Invest / Merchants)

Draft: 2026-03-29 · Folder: `1_development/stream_2_community/task_x_countdown_showcase_x_comms/`

---

## Thread (English)

**Principle:** Screenshots show the UI. Copy states the **one-line job** of that area (no inventory of fields).

**Tweet 1 — hook + mood (no image, or use your Mint shot)**  
*Sized to fit a standard 280-character post (link may count as a short t.co when live).*

```
The countdown is running.

Short nights. We keep shipping with a smile. We believe in this work.

Mint, Invest, Merchants: where Stables is today.

April 1: showcase access. A clear view of the proposition, then we build together.

https://stablescouncil.org

🧵👇
```

**Tweet 2 — Mint**  
*[Mint screenshot]*

```
Mint: lock Minima, receive xMinima. xMinima is leveraged equity in Stables: your claim on the protocol surplus, not the Stables you spend at a shop.

Second path: Minima priced live, Stables minted in the currency you pick.

Test balances, no real value.
```

**Tweet 3 — Invest**  
*[Invest screenshot]*

```
Invest: liquidity and the market read on the same stack. Your xMinima and Stables in one place instead of a black box.

Showcase build.
```

**Tweet 4 — Merchants**  
*[Merchants / Spend screenshot]*

```
Merchants: you spend Stables. Same money rail, pointed at checkout instead of the mint screen.

Showcase on April 1.
```

**Tweet 5 — CTA**

```
April 1st: showcase access.

Clear view of the proposition, then we go forward together.

https://stablescouncil.org
#Stables #Minima #BeYourOwnBank
```

---

## Single-post variant (one carousel)

```
Countdown is on.

Short nights, long commits. We’re still smiling; this is the work we want to be doing.

Mint, Invest, Merchants (swipe).

April 1st: showcase. We want a clear view of the proposition on the table so everyone can help shape what comes next.

https://stablescouncil.org
#Stables #Minima
```

*[Attach your three screenshots: Mint, then Invest, then Merchants]*

---

## Notes

- In the app, **Merchants** is the **Spend** tab.
- **Public copy** in this thread uses **Minima** and **Stables**. Demo UI still shows **Winiwa** / **xWiniwa** / **Wables** on screen.
- **Minting (ground truth):** (1) **xWiniwa:** wallet Winiwa down, xWiniwa up; demo updates `ASSET_XWM_USD` / protocol Winiwa-side state; locked spec: xMinima is levered equity, burn can lock if CR is stressed. (2) **Wables:** Winiwa spent at `SIM_Winiwa_PRICE` for chosen stable; wallet stables up; `LIAB_STABLES_CIRC` up (senior liability). Not one instrument “for” all stables: equity mint vs stable mint are different claims. See `0_handshake/protocol_mechanics_spec.md` §3–4 and `index.html` `executeMintXwm` / `executeMintWables`.
- Optional: to regenerate auto screenshots from the MiniDapp, run `python capture_minidapp_pages.py` in this folder.
