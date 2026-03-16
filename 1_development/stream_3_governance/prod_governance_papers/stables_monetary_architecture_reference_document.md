# Stables Monetary Architecture Reference Document

## Purpose of this document

This document records, in a detailed and structured form, the main architectural, philosophical, and constitutional elements retained from the present discussion on the Stables system. Its purpose is to serve as a reference for future drafting, internal alignment, and discussion with collaborators. It does not present final constitutional language. At this stage, all elements remain open to debate, refinement, challenge, and formalization.

The function of this text is therefore twofold. First, it preserves the current state of thought with enough precision that the reasoning is not lost later. Second, it provides a working framework from which more formal constitutional articles, technical specifications, and explanatory documents may be drafted.

## General context and framing

The present discussion began from a comparison with the Terra / LUNA / UST structure and from the question of what was missing in that architecture to give it true permanence. That comparison clarified that the central problem was not simply that Terra used one endogenous asset and one stable liability, but that it lacked a sufficiently robust and explicit architecture of risk absorption, recapitalization, and structurally grounded incentives.

The purpose of the Stables discussion was therefore not merely to identify what Terra lacked, but to determine whether Stables might reproduce the same weaknesses under a different form, especially if Minima itself increasingly derives its value from the success of Stables. This led to a deeper clarification of the intended structure of Stables, the role of xMinima, the role of the Coverage Fund, the place of fees, the meaning of transparency, and the constitutional logic of a market-structured monetary system.

## Core philosophical orientation

A key conclusion of the discussion is that Stables should not be framed primarily as a protocol that enforces stability through rigid top-down control, discretionary intervention, or heavy protocol friction. Instead, it should be understood as a monetary structure that relies on transparent information, open arbitrage, and rational capital behavior within a friction-minimized environment.

This means that the architecture is intentionally designed to let economic agents act freely, at almost no cost, in such a way that arbitrage can be near perfect and market signals can function without obstruction. The system is therefore closer in spirit to a market-structured monetary order than to a centrally managed stabilization machine.

The following principles were retained as central:

Stables should rely on transparency.

Stables should rely on arbitrage.

Stables should rely on rational capital behavior.

Stables should rely on a structure without friction, allowing economic agents to act freely at minimal cost so that near-perfect arbitrage is possible.

These principles are not secondary implementation details. They define the monetary philosophy of the project.

## Relationship to Terra and the main lesson retained

One of the central questions discussed was whether Terra / LUNA / UST already contained a risk-bearing layer and, if so, who actually bore the risk.

The retained conclusion is that, in practice, the market risk created by UST issuance was borne by existing LUNA holders, because LUNA functioned as the absorbent asset in the system. When UST demand increased, LUNA holders benefited through reduced supply and price appreciation. When UST demand contracted and redemptions accelerated, LUNA holders bore the downside because new LUNA was minted into the market. In that sense, LUNA holders effectively absorbed systemic risk.

However, they did not do so in a formally structured, contractual, or constitutionally defined way. They were not a distinct junior capital class with a clear reward profile. They had exposure to upside, but not through a cleanly articulated leveraged mechanism with explicit structural compensation. Instead, they were simply holders of the same asset that the system used for growth, collateral confidence, and shock absorption.

The retained lesson is therefore that the problem was not only reflexivity in itself, but reflexivity without a clearly separated and explicitly compensated capital stack.

## Reflexivity and the Stables problem

A major concern raised during the discussion was that Stables may share, at least in part, the same underlying reflexive logic as Terra if the base collateral is Minima and if the long-term value of Minima increasingly depends on the growth and adoption of Stables.

The conclusion retained is that this reflexivity cannot be fully eliminated. If Stables becomes economically central in the Minima ecosystem, then Minima will naturally be perceived both as the collateral base of the system and as an asset whose value is partially derived from Stables adoption. This circularity is real and should not be denied.

However, the important conclusion is that reflexivity itself is not automatically fatal. What matters is whether reflexivity is structured safely. The architecture must therefore ensure that risk is not left unassigned, accidental, or purely speculative, but instead is located in identifiable layers with intelligible economic roles.

The key formulation retained from the discussion is the following:

Whenever systemic stress increases, the protocol becomes more attractive for new capital providers.

This principle was identified as essential. It means that stress should not merely damage the system. It should simultaneously create stronger incentives for new capital to enter.

## Structural separation between monetary layer, yield layer, and equity layer

A major conceptual breakthrough in the discussion was the clarification that Stables should distinguish more cleanly between the monetary layer, the yield-bearing layer, and the leveraged equity layer.

The retained structure is as follows.

USDs is the senior monetary instrument.

USDsy is the yield-bearing instrument associated with the Coverage Fund.

xMinima is the leveraged equity-like instrument associated with upside exposure and risk-taking on the structure.

This separation was considered clearer and more sound than a model in which one token tries to perform all functions at once. It aligns with a broader financial intuition according to which monetary liabilities, yield-bearing claims, and leveraged equity claims should not be conceptually collapsed into the same instrument.

## On the role of USDs

USDs is retained as the name of the stable monetary unit. The notation mUSD should not be used for this current stage of the project. The unit under discussion is USDs.

USDs is intended to serve as the system’s primary monetary instrument. It is the unit to be used in payments, pricing, exchange, and economic coordination. It is the closest equivalent, within the structure, to a senior monetary liability.

A crucial point retained from the discussion is that USDs may trade below one dollar without this, by itself, meaning that the system is broken. The existence of temporary deviations below par is compatible with the design philosophy, because the system relies on arbitrage and merchant game theory rather than on an absolute promise of immediate artificial peg defense at all costs.

The reasoning retained is the following. If USDs trades below par, arbitrageurs can profit from buying it below one dollar. At the same time, merchants have a game-theoretic incentive to continue accepting it at par, because refusing to do so may cause them to lose market share to merchants who continue to accept it normally. This creates a practical environment in which temporary deviations do not necessarily imply structural failure.

Thus, the system should not be designed on the assumption that any movement below one dollar is catastrophic. The relevant question is instead whether arbitrage remains possible, whether redemption remains meaningful, whether market confidence is supported by transparency, and whether capital entry remains attractive under stress.

## On the role of USDsy and the Coverage Fund

A major part of the discussion concerned the Coverage Fund and the correct way to understand it economically.

One useful analogy retained is that the Coverage Fund can be seen, conceptually, as something close to convertible debt. This does not mean it must replicate every legal or financial feature of traditional convertible debt, but the analogy is useful because it captures the intermediate nature of the instrument.

The Coverage Fund is not equivalent to senior money, but it is also not the same as pure leveraged equity. It is a hybrid layer that receives yield and provides stabilization capacity. It stands between the senior monetary layer and the more junior leveraged layer.

The retained idea is that participants in the Coverage Fund would receive a tokenized claim on the fund. That token is currently referred to in the discussion as USDsy.

USDsy should have the following conceptual characteristics:

It should represent a proportional claim on the Coverage Fund.

It should accrue fees continuously.

It should be tradable.

It should have a visible book value.

It may potentially be convertible or redeemable according to the protocol’s rules.

The discussion also examined whether USDsy could be used directly for payments. The retained conclusion is that this is possible in principle and may even be desirable from a user-experience perspective, provided that the application handles pricing and conversion in an almost transparent way.

The model retained for further consideration is the following. The application could present prices in USDs, while offering users the option to pay in USDsy. Conversion would occur automatically based on a reference price. The merchant could then choose to keep USDsy or convert it into USDs.

This would allow USDsy to circulate in a practical way without requiring users or merchants to manually perform the accounting logic at each transaction.

However, this leads to the crucial pricing question.

## On the pricing of USDsy

The discussion made clear that if USDsy is used for payments or displayed in relation to USDs, the question of pricing becomes central.

The retained view is that market pricing should exist for USDsy. The market should be able to trade it. At the same time, the app may present a reference value expressed in USDs. This raises the risk of manipulation if one relies solely on market price, especially in thin markets.

The retained intuition is that, over time, the market price of USDsy should tend to converge toward book value because of arbitrage opportunities. This means that book value remains a highly relevant reference.

Thus, the discussion retained the idea that book value is an important anchor, while also accepting that market pricing provides useful information. The exact mechanism to be used in the app remains open. What matters for now is to preserve the following points:

USDsy should have a market price.

USDsy should also have a calculable book value.

Arbitrage should tend to align market price and book value over time.

The exact choice of execution price for payment logic requires careful thought because market manipulation is a real concern.

This remains a live design question and should be explicitly marked as such.

## On the economic nature of the Coverage Fund

A critical clarification emerged during the discussion: the Coverage Fund cannot simply be assumed to be reliable core capital if it is funded by claims that are themselves liabilities of the structure or by holders who can leave as soon as stress builds.

This means that the Coverage Fund should not be naively treated as guaranteed first-principles loss-absorbing equity. Its usefulness is real, but its structural nature must be described accurately.

The retained position is that the Coverage Fund is best understood as a liquidity and stabilization layer, and possibly as a hybrid instrument analogous to convertible debt. It is not, by itself, sufficient to define permanent solvency. It can strengthen resilience, support liquidity, and accumulate fee-based value, but one must remain aware that participants may still behave as rational economic actors who leave if it becomes advantageous.

This is why the Coverage Fund should be seen as important but not mythologized. Its presence improves the structure, but it does not eliminate the need to think clearly about recapitalization dynamics and incentives under stress.

## On the role of xMinima

xMinima emerged in the discussion as the primary candidate for the Junior Recapitalization Layer.

The retained view is that xMinima should be understood as a leveraged position on the overall structure. It should provide exposure to system growth, to capitalization dynamics, and to the economic upside of Stables without imposing financing cost on the holder. One formulation retained from the discussion is that xMinima should be a leverage position without financing cost, capable of being held for the long term.

This distinguishes xMinima from a margin trade or financed leverage product. It is not intended to be a temporary borrowed exposure. It is intended to be a structurally leveraged asset linked to the growth and resilience of the Stables system.

An important point retained is that xMinima has valuation anchors even if it does not receive direct fee yield. Those anchors include:

its leverage positioning on the Stables structure,

its exposure to the success of the monetary architecture,

and the possibility that Minima may derive value from multiple drivers beyond Stables alone.

Thus, xMinima is not without an intelligible basis for valuation even if it remains distinct from the yield-bearing layer.

## On whether xMinima should receive yield

A key question in the discussion was whether xMinima should receive a direct portion of protocol fees, or whether all fees should be allocated to the Coverage Fund, leaving xMinima as a pure leverage play.

At first, the idea was raised that giving fees to xMinima might help provide a valuation basis for investors, improve recapitalization dynamics under stress, and prevent the token from becoming a purely speculative object driven only by pump-and-crash cycles.

However, the user then clarified a preference for a clearer separation between yield and equity. The retained intuition from the discussion is that this separation is attractive:

USDsy would carry the yield function.

xMinima would carry the equity and leverage function.

This makes the structure more legible. It avoids forcing one instrument to satisfy both the yield-seeking investor and the leveraged growth investor.

At the same time, the discussion acknowledged that if xMinima receives no structural reward at all, there are practical disadvantages. Those disadvantages include weaker capital attraction, greater reliance on pure speculative narratives, more fragile recapitalization, and the possibility that the instrument attracts mainly short-term trading rather than committed long-duration positioning.

The current retained conclusion is therefore not a final resolution, but a clarified design tension. The separation between yield and equity is appealing and probably sound. Yet the implications for xMinima’s attractiveness and recapitalization role must continue to be examined carefully.

This should remain an explicitly open question in future drafting.

## On fee distribution

The discussion considered different approaches to fee distribution.

One possible structure was that all fees go to the Coverage Fund. This would strengthen the yield layer and the liquidity buffer but might leave xMinima without direct structural reward.

Another possible structure was that fees go directly to xMinima. This would support the equity layer but might weaken the stabilization layer.

A hybrid approach such as a fifty-fifty split was mentioned as intuitively reasonable, but the user explicitly stated that this should not be treated lightly and must be thought through thoroughly.

The retained position is therefore that fee distribution remains unresolved and must be explored carefully. The main conceptual point preserved from the discussion is that fee distribution is not merely an accounting detail. It shapes the attractiveness of each layer, the system’s recapitalization capacity, and the overall market structure of incentives.

## On frictionless structure and perfect arbitrage

A particularly important addition made by the user is that the core philosophy should explicitly include a structure without friction, letting economic agents act freely at almost no cost so that perfect arbitrage is possible or approached as closely as possible.

This element should be retained as a first-class design principle, not as a peripheral implementation preference.

The structure is therefore meant to avoid unnecessary restrictions, discretionary obstacles, or artificial friction that would block arbitrageurs and distort the natural balancing behavior of markets.

This principle connects directly with the view that transparency, arbitrage, and rational capital behavior are the central stabilizing forces of the architecture.

## On transparent coverage metrics and stress testing

The discussion concluded that transparent coverage metrics are already part of the Stables architecture and that the system goes further than mere dashboard publication.

A very important retained point is that the application includes a stress-test scenario tester both at the protocol level and at the individual wallet level.

This is significant because it means the architecture is not based merely on passive transparency but on interactive transparency. Users do not only observe the state of the system. They can explore hypothetical states, simulate shocks, and understand their own exposure.

This feature should be highlighted as an important differentiating element of the architecture. It strengthens rational capital behavior by giving participants direct tools to evaluate scenarios rather than forcing them to rely on vague sentiment or external interpretation.

## On the absence of a fixed safety ratio

A central constitutional choice clarified during the discussion is that the Stables system does not impose a fixed safety ratio as an exogenous rigid protocol parameter.

Instead, the retained philosophy is that the structure of the market itself determines the effective coverage ratio.

This is a major design distinction. It means that Stables is not conceived as a system in which the protocol dictates a required collateral threshold that all participants must obey as a hard-coded universal ratio. Rather, the architecture relies on transparent coverage metrics, arbitrage, market pricing, merchant behavior, and rational capital allocation to determine how much risk the system can sustain and how the structure reacts to changing conditions.

This does not mean solvency becomes irrelevant. It means solvency is observed, priced, and acted upon by the market rather than enforced through a single universal safety-ratio rule.

This is one of the clearest examples of the project’s market-structured monetary philosophy.

## On issuance discipline

A related clarification is that issuance of USDs is not intended to be governed by a rigid notion such as “minting is allowed only if a safety ratio remains above a predefined value.”

Instead, issuance discipline is expected to emerge from market structure.

The reasoning retained is the following. If a user mints USDs while USDs is already trading below par on the secondary market, that user is making an economically unsound decision. In other words, the market price itself becomes a disciplining factor.

This means that issuance logic is not understood only as a matter of protocol authorization but also as a matter of economic rationality. The system assumes that actors respond to price signals and therefore that non-viable minting behavior will naturally be discouraged.

This does not remove the need for protocol rules, but it places the central emphasis on market incentives rather than rigid top-down issuance control.

## On redemption

Redemption remains essential to the architecture. The retained position is that redemption must remain meaningful and available according to the protocol’s deterministic structure. The credibility of USDs depends on the existence of redemption paths that allow arbitrage and restore balance.

At the same time, the system is not designed on the premise that every brief deviation must be instantly eliminated by administrative force. A temporary deviation below one dollar is acceptable if redemption logic remains intact and arbitrage remains attractive.

Thus, redemption should be considered a key structural element of the monetary system, not because it guarantees a cosmetically perfect chart at every moment, but because it anchors market expectations and supports convergence.

## On recapitalization

The discussion produced an important clarification regarding recapitalization. The user explicitly rejected the idea that the protocol itself has dynamic levers to manipulate incentives under stress. There is no intention, at this stage, to equip the protocol with discretionary or automatic parameter changes that intensify yield or alter terms as stress increases.

Instead, recapitalization is to come from rational economic actors already present in the structure or attracted by the changed market conditions.

In practical terms, the retained recapitalization sources are:

xMinima holders and buyers,

Coverage Fund participants and buyers,

treasuries acting as rational economic agents,

the Council if and when it acts with the objective of maximizing gain and protecting the structure.

The key retained principle is not that the protocol actively plays with knobs. It is that the architecture remains open to voluntary capital formation and that stress should create conditions that attract such capital.

This is again summarized by the already retained core formulation:

Whenever systemic stress increases, the protocol becomes more attractive for new capital providers.

## On the role of the Council and treasuries

The discussion made clear that the Council and related treasuries may act to protect the structure, but they must be understood as rational economic actors, not as supernatural guarantors or morally compelled rescuers.

This is an important distinction. One should not base constitutional permanence on the assumption that the Council will always sacrifice assets, nor on the expectation of heroic discretionary defense.

The retained view is that the Council’s role belongs primarily in stewardship, governance restraints, and rational treasury action when economically justified. It may support the structure, but it should not be mythologized as the fundamental source of solvency.

The same applies to treasuries. They may deploy capital because it is rational and aligned with system protection, but the architecture should not rest on blind reliance upon their intervention.

## On the named constitutional layers

A key output of the discussion was the decision to frame the architecture constitutionally through named layers. The names retained for this stage are the following:

Senior Monetary Layer,

Base Collateral Layer,

Junior Recapitalization Layer,

Stewardship Layer.

At the same time, the discussion also made clear that there is effectively a distinct liquidity or stabilization layer centered on the Coverage Fund. Although it was not included in the shortest naming set requested at one point, it remains conceptually indispensable and should likely be integrated explicitly in the fuller architectural description.

The retained understanding of the layers is as follows.

The Senior Monetary Layer is USDs.

The Base Collateral Layer is Minima.

The Junior Recapitalization Layer is xMinima.

The liquidity and stabilization function is carried by the Coverage Fund and USDsy.

The Stewardship Layer is the Council.

This layered framing should be preserved for future constitutional drafting.

## On the need for a charter section explaining the design choices

A very important conclusion of the discussion is that the Constitutional Charter should contain a section explaining exactly the choices being made, and why they are being made, with the explicit acknowledgment that at this draft stage everything remains debatable.

This means the Charter should not immediately jump into rigid article language without first documenting the reasoning behind the architecture. The design philosophy, trade-offs, uncertainties, and consciously chosen structural principles should all be explained clearly.

That explanatory section should include at least the following themes:

why the system relies on transparency instead of opaque discretionary control,

why arbitrage is central,

why rational capital behavior is assumed,

why friction is minimized,

why temporary deviations below par are compatible with the design,

why the structure separates money, yield, and equity,

why recapitalization is expected to emerge from open incentives rather than emergency command.

## Full lifecycle of a stress event in Stables

The discussion also retained the need for a precise description of the full lifecycle of a stress event in the Stables system. The following narrative summarizes the retained conceptual sequence.

Under normal conditions, USDs trades close to par, arbitrage is active, the Coverage Fund accumulates value through fees, xMinima reflects leveraged confidence in system growth, and users can monitor transparent metrics and run stress simulations.

A stress event may begin because Minima declines, because redemptions rise, because market confidence weakens, or because external market conditions deteriorate. USDs may then begin trading below one dollar.

This deviation does not automatically imply failure. Arbitrageurs can buy USDs below par. Merchants continue to have an incentive to accept USDs at par because refusing to do so may cost them market share to competitors. The market therefore begins to work on the imbalance.

At the same time, xMinima may decline in price, making leveraged exposure to the structure more attractive for buyers who believe in recovery. USDsy and the Coverage Fund may also become more attractive depending on yield, pricing, and perceived opportunity. Treasuries and the Council may decide that defending or reinforcing the structure is economically rational.

Throughout this process, transparent metrics and stress-testing tools allow participants to evaluate the situation rather than act blindly.

As arbitrage and capital re-entry proceed, the imbalance may reduce, USDs may move back toward par, and the structure may emerge more strongly capitalized than before.

This lifecycle remains conceptual and should be refined further, but it is a key retained element of the architecture.

## Retained concerns and unresolved questions

This discussion did not close all questions. Several important issues remain open and should be preserved explicitly as unresolved.

The exact distribution of protocol fees remains unresolved.

The exact role of xMinima in relation to fee income remains unresolved.

The exact payment pricing logic for USDsy remains unresolved.

The exact accounting, book value, and conversion rules for USDsy remain unresolved.

The exact way to formalize the Coverage Fund as a hybrid or convertible-like instrument remains unresolved.

The extent to which the liquidity stabilization layer should be formally named as a constitutional layer remains unresolved.

The exact balance between market structure and protocol rule structure remains unresolved, even if the current direction clearly favors a market-structured approach.

These open questions should not be hidden. They should be preserved as active areas of design work.

## Working constitutional invariants retained from the discussion

Although the discussion later rejected rigid interpretations of some of them, four invariant categories were retained as useful conceptual headings for further drafting.

The solvency invariant remains a valid heading, but in the Stables philosophy it should likely refer less to a hard protocol-imposed ratio and more to the continuous visibility and market pricing of overall system coverage.

The issuance invariant remains a valid heading, but it should likely emphasize transparent, deterministic issuance structures while recognizing that market price discipline plays a central role in discouraging uneconomic minting.

The redemption invariant remains a valid heading, because meaningful redemption and deterministic arbitrage paths are essential to confidence and convergence.

The recapitalization invariant remains a valid heading, with the core idea that the protocol must remain permanently open to voluntary capital formation and that stress should make the structure more attractive to new capital providers.

These four headings should be retained for future constitutional work even though their exact formalization remains to be refined.

## Summary of the most important retained formulations

The following formulations should be preserved because they capture the spirit of the discussion with unusual precision.

Stables is a market-structured monetary system rather than a top-down stabilization machine.

Stables relies on transparency, arbitrage, rational capital behavior, and a structure without friction allowing economic agents to act freely at almost no cost so that near-perfect arbitrage is possible.

USDs may trade below one dollar without this, by itself, breaking the system.

Merchant game theory supports continued acceptance at par because refusal may imply loss of market share.

The architecture should clearly separate money, yield, and equity.

USDs is the monetary layer.

USDsy is the yield-bearing Coverage Fund instrument.

xMinima is the leveraged equity-like instrument.

The Coverage Fund can be understood, in part, through the analogy of convertible debt.

The system does not rely on a fixed protocol-imposed safety ratio. The market structure determines the effective coverage ratio.

Issuance discipline is partly economic rather than purely rule-based. Minting into a below-par market is irrational.

The protocol does not rely on dynamic emergency knobs. Recapitalization comes from rational economic actors and open capital formation.

Transparent coverage metrics and interactive stress-testing tools are essential parts of the design.

Whenever systemic stress increases, the protocol becomes more attractive for new capital providers.

## Final note

This document captures the elements retained from the discussion at the present drafting stage. It should be used as a working internal reference, as a basis for future constitutional drafting, and as a shareable explanation for collaborators who need a detailed understanding of the present conceptual architecture.

It is important to repeat that, at this stage, everything remains debatable. The function of this text is not to freeze the design prematurely. Its function is to preserve the structure of thought clearly enough that future work can proceed without losing the reasoning already developed.

