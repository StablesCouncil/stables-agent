# Stables MiniDapp, Payment protection

*For StablesAgent: Quick pay, Standard pay, Protected pay, payment code, biometrics, and contact tiers. Carried into the test channel from the demo line. The tiers and the payment code work the same way; the assets a tester can send are Winiwa and xWiniwa only.*

## What it is

Payment protection adds three send speeds on top of normal wallet security.

| Tier | When it applies | What the user sees |
|------|-----------------|-------------------|
| **Quick pay** | QR scan includes address and amount, total under quick-pay limit | Send can complete immediately (optional 2-second undo in Settings, Security) |
| **Standard pay** | Default for manual sends within normal limits | Review, then **Confirm send** |
| **Protected pay** | Significant amount, multi-recipient send, or contact set to Protected pay | 4-digit **payment code** required before send |

## Where to configure

**Settings → Security → Payment protection**

- Quick pay limit
- Significant amount threshold
- Daily quick-pay cap
- **Set payment code** (always visible on the card; inline setup on first use)

Limits use the **wallet primary currency** (starred currency on Wallet, for example Minima).

## Contact payment tier

On each contact detail card: **Inherit**, **Quick pay**, **Standard pay**, or **Protected pay**. Favourite send chips show tier hints.

## Payment code storage

The payment code is hashed on device only. It is not sent to Stables servers. Council cannot recover it. If the user forgets it, they set a new code in Settings, Security.

## Android biometrics (standalone app only)

On the signed Android APK, when the device supports strong biometrics, protected pay can confirm with fingerprint or face instead of typing the code. Payment code remains the fallback. Web and MinimaOS hub use payment code only.

## StablesAgent help

The ⓢ icon on the Payment protection section opens contextual FAQ (payment code, storage, biometrics, Minima primary limits). After a contextual answer, **Back to main menu** returns to the main agent paths.

## Multi-recipient and protected pay

Any send to more than one recipient requires Protected pay (payment code or biometric on Android).