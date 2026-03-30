# Stables Retrocession Program: Let it Rain

## Status
Community Draft: for discussion and contribution

## 1. Objective
Retrocession is Stables’ operational expression of a simple principle: access to money is a universal human right.

The Retrocession Program distributes treasury resources in a way that:
- treats access to basic monetary needs as non-discretionary in spirit,
- preserves pseudonymity as a default,
- remains Sybil-resistant without requiring identity cards,
- and rewards genuine economic interaction, especially through anchored merchant relationships.

## 2. Core Constraints
1. **Universal in intent, not exclusive in mechanism**
   Retrocession is designed so that no one is excluded by geography, personal identity disclosure, or centralized gatekeeping.
2. **Pseudonymous by design**
   The system does not require KYC-style identity disclosure. Participants can remain pseudonymous while still being accountable through cryptographic commitments and verifiable economic activity.
3. **Sybil resistance without personhood**
   Anti-abuse measures must prevent “many accounts, many payouts” without depending on real-world person identity.
4. **Caps and diminishing returns**
   Retrocession is capped to prevent outsized extraction by concentrated behavior, and to ensure that the outcome does not become 100x for the wealthy compared to the poor.
5. **Merchant validation through interaction**
   Merchants can issue interaction validations tied to settlement events. Validation quality is naturally stronger where relationships persist through repeat interaction at anchored local places.

## 3. What Retrocession Is (and what it is not)
Retrocession is a mechanism that distributes treasury resources to participants based on qualified economic participation and anchored validations.

It is not a promise of future returns. It is not a discretionary “benefit lottery” that depends on sentiment. It is a rule-bound distribution aligned with the right to basic money access.

## 4. Program Model (High Level)
### 4.1 Distribution windows
Retrocession distributions occur in defined time windows (epochs). The Council sets budget allocation for Human Rights Retrocession in the treasury, and the program defines eligibility and payout rules per window.

### 4.2 Eligibility Commitment (pseudonymous aggregation)
Participants bind eligible activity under a participant-controlled, pseudonymous **Eligibility Commitment**.

This Commitment aggregates multiple participant-controlled wallets so that entitlement depends on qualified activity, not the number of wallets or seed phrases created.

### 4.3 Qualified receipts (receipt-driven eligibility)
Eligibility and entitlement are computed mainly from qualified spend and usage receipts that correspond to settlement events.

Qualified receipts are designed to be verifiable without revealing personal identity.

### 4.4 Merchant interaction validations (anchored social bonding)
Merchants that accept and settle payments can provide interaction validations tied to settlement events.

Anchorage favors repeat interaction in small and medium shops where continuity is natural. Cold, unpersonal environments cannot be expected to generate the same interaction quality.

## 5. Anti-Abuse Design (Sybil resistance without identity cards)
The Retrocession Program must resist entitlement farming that uses multiple wallets.

It does so with the following layered approach:
1. **Aggregation by Eligibility Commitment**
   Creating multiple wallets does not multiply entitlement unless those wallets are bound under the same participant-controlled Commitment.
2. **Caps per Commitment per window**
   Retrocession entitlement is capped per Eligibility Commitment so that marginal additional activity yields diminishing outcomes.
3. **Diminishing returns**
   Eligibility uses a non-linear reward curve or tiered caps so that a wealthy participant cannot receive 100x solely by scaling spend while the distribution remains meaningful for everyone.
4. **Submission requiring verifiable receipts**
   Claims require submission of qualified receipts. If a submission is unqualified or invalid, it does not count toward entitlement.
5. **Rate limits and anti-spam cost**
   The system should impose submission rate limits and optionally a refundable or slashing bond so that mass speculative submissions are uneconomical.

## 6. Privacy Stance
Retrocession is pseudonymous by default:
- participants do not need to disclose real-world identity,
- entitlement is computed from commitments and qualified receipts,
- and disclosures focus on aggregated and auditable rules rather than personal details.

In this framing, identity is social bonds formed by repeated economic interaction, not an intimacy credential and not an identity card.

## 7. Transparency and Public Reporting
The program provides transparency at the rule and outcome level:
- what eligibility rules apply per window,
- what caps and aggregation rules were enforced,
- how much treasury budget was used,
- and how outcomes were distributed across Eligibility Commitments in aggregate form.

Exact implementation metrics can be published without requiring personal identification.

## 8. Governance and Evolution
The Council allocates the Retrocession budget and may update operational parameters such as:
- window cadence,
- cap levels,
- receipt qualification thresholds,
- and disclosure formats.

The Council must not modify the immutable monetary core. Retrocession remains a rule-based tool for exchange-supporting wealth creation, aligned with the Charter.

## 9. Open Questions for Contributors
- What is the most effective diminishing-returns curve for retrocession fairness?
- Which receipt types best represent qualified economic participation early on?
- How should merchant interaction validations be weighted, especially to reduce collusion risk without undermining local trust?
- What is the optimal anti-spam bonding and rate-limiting strategy to keep the UX simple?

## 10. Summary
Let it Rain is Stables’ rule-bound retrocession mechanism to express the human right to basic money access.

It preserves privacy by design, resists Sybil farming without identity cards, and uses merchant interaction as anchored validation so that trust follows social bonds, not personal disclosure.

Built on MINIMA.

