# Stables - X thread (countdown, Mint / Invest / Merchants)

Draft: 2026-03-29 (rework: hook + Mint/Invest/Merchants copy; `protocol_mechanics_spec.md` + `stables_master_reference.md` §14). Folder: `1_development/stream_2_community/task_x_countdown_showcase_x_comms/`

---

## Thread (English)

**Principle:** Screenshots show the UI. Copy states **what each part does**, in plain language, aligned with locked mechanics (Minima, Stables, **cf**, xMinima). **CTA** = the link and closing tweets that tell people **what to do next** (visit the site, save the date, follow the thread).

**Tweet 1 - hook + mood (no image, or use your Mint shot)**  
*Sized for standard 280 (link may shorten as t.co when live). ~256 chars.*

```
The countdown is running.

Short nights. We ship with a smile. We believe in this work.

Mint · Invest · Merchants: where Stables lives today.

April 1: showcase access. Clear view of the proposition, then we build together.

https://stablescouncil.org

🧵👇
```

**Tweet 2 - Mint**  
*[Mint screenshot]*  
*~192 chars.*

```
Mint: Stables from Minima at live price, the day-to-day rail.

Same Mint space: Minima → xMinima when you want leveraged equity in the protocol.

Stables txn fees → Coverage Fund → cf holders.
```

**Tweet 3 - Invest**  
*[Invest screenshot]*

```
Invest: liquidity where it matters. xMinima against Minima, Stables in the same glance. One balance sheet on one screen.
```

**Tweet 4 - Merchants**  
*[Merchants / Spend screenshot]*

```
Merchants: pay and get paid in Stables. Same protocol rail as mint and invest, built for people who already say yes to you.

April 1 showcase.
```

**Tweet 5 - CTA**

```
April 1: showcase access.

A clear read on the proposition. Then we go forward together.

https://stablescouncil.org
#Stables #Minima #BeYourOwnBank #stablecoin
```

---

## Single-post variant (one carousel)

```
Countdown on.

Short nights. We ship with a smile.

Mint · Invest · Merchants (swipe the carousel).

April 1: showcase. Clear proposition, build together.

https://stablescouncil.org
#Stables #Minima #BeYourOwnBank #stablecoin
```

*[Attach your three screenshots: Mint, then Invest, then Merchants]*

---

## Notes

- In the app, **Merchants** is the **Spend** tab.
- **Public copy** uses **Minima** / **Stables** / **xMinima** / **cf** where relevant. Demo UI: **Winiwa** / **Wables** / **xWiniwa**.
- **Ground truth:** `0_handshake/protocol_mechanics_spec.md` wins over narrative. **Equation:** `Minima = Stables + cf + xMinima`. **Fees:** transaction fees → Coverage Fund → **cf** holders. **xMinima** follows equity / surplus mechanics per spec (separate path from fee accrual to cf).
- **Tweet 2** keeps **stable mint**, **xMinima equity**, and **cf fee flow** as three clear, positive lines without conflating them.
- Optional: regenerate auto screenshots with `python capture_minidapp_pages.py` in this folder.
