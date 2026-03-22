import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionWithCaption } from '../../components/sections/SectionWithCaption'
import {
  DEMO_RECENT_TX,
  DEMO_TOTAL_USD,
  PRIMARY_CCY,
  SECONDARY_CCYS,
} from './demoData'
import './wallet.css'

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function WalletPage() {
  const [hideBalances, setHideBalances] = useState(false)
  const [editCcy, setEditCcy] = useState(false)
  const [ccyExpanded, setCcyExpanded] = useState(false)

  const hiddenClass = hideBalances ? 'bal-hidden' : ''
  const hasHiddenCcys = SECONDARY_CCYS.some((c) => c.defaultHidden)

  return (
    <div
      className={`wallet-page${ccyExpanded ? ' wallet-page--ccy-expanded' : ''}${editCcy ? ' wallet-page--edit' : ''}`}
    >
      <SectionWithCaption
        title="Balance & actions"
        agentExplain="Wallet: balance, send and receive"
        cardClassName=""
      >
        <div className="w-hero">
          <div className="fbet" style={{ alignItems: 'center', justifyContent: 'flex-end', marginBottom: 2 }}>
            <button
              type="button"
              className="bal-hide-btn"
              title="Hide amounts"
              onClick={() => setHideBalances((v) => !v)}
            >
              <EyeIcon />
            </button>
          </div>
          <div className={`w-total ${hiddenClass}`}>{DEMO_TOTAL_USD}</div>
          <div className="w-ccy">USDw equivalent</div>
          <div className="act-row">
            <button
              type="button"
              className="act-btn"
              onClick={() => {
                if (typeof window.showToast === 'function') {
                  window.showToast('Send — wire modals in a later step')
                }
              }}
            >
              <span className="act-icon" style={{ fontSize: 26, lineHeight: 1 }}>
                ↑
              </span>
              <span className="act-lbl">Send</span>
            </button>
            <button
              type="button"
              className="act-btn"
              onClick={() => {
                if (typeof window.showToast === 'function') {
                  window.showToast('Receive — wire modals in a later step')
                }
              }}
            >
              <span className="act-icon" style={{ fontSize: 26, lineHeight: 1 }}>
                ↓
              </span>
              <span className="act-lbl">Receive</span>
            </button>
          </div>
        </div>
      </SectionWithCaption>

      <SectionWithCaption
        title="Currencies"
        agentExplain="Wallet: currencies and ordering"
        cardClassName=""
      >
        <div className="wallet-cb">
          <div className="wallet-ccy-tools">
            <button
              type="button"
              className={`ccy-edit-pen${editCcy ? ' on' : ''}`}
              title="Edit currency order"
              onClick={() => setEditCcy((v) => !v)}
            >
              ✎
            </button>
          </div>
          <div className="ccy-primary" data-ccy={PRIMARY_CCY.code}>
            <div className="ccy-pri-flex">
              <div>
                <div className="ccy-pri-name">
                  {PRIMARY_CCY.emoji} {PRIMARY_CCY.code} &nbsp;·&nbsp; {PRIMARY_CCY.name}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className={`ccy-pri-bal bal-amount ${hiddenClass}`}>{PRIMARY_CCY.balance}</div>
              </div>
            </div>
          </div>
          <div className="ccy-sec-list">
            {SECONDARY_CCYS.map((row) => (
              <div
                key={row.code + row.name}
                className="ccy-sec-row"
                data-ccy={row.code}
                data-ccy-default-hidden={row.defaultHidden ? '1' : undefined}
              >
                <div>
                  <div className="ccy-sec-tag">{row.code === 'MINIMA' ? 'Winiwa' : row.code}</div>
                  <div className="ccy-sec-name">{row.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={`ccy-sec-amt bal-amount ${hiddenClass}`}>{row.amount}</div>
                  <div
                    className={`ccy-sec-usd bal-amount ${hiddenClass}${row.usdLine === '-' || row.usdLine === '—' ? ' ccy-sec-usd--neg' : ''}`}
                  >
                    {row.usdLine}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {hasHiddenCcys ? (
            <button
              type="button"
              className="show-more-btn"
              onClick={() => setCcyExpanded((e) => !e)}
            >
              {ccyExpanded ? 'Show fewer currencies ▴' : 'Show more currencies ▾'}
            </button>
          ) : null}
        </div>
      </SectionWithCaption>

      <SectionWithCaption
        title="Recent activity"
        agentExplain="Wallet: recent activity"
        cardClassName="wallet-activity-card"
      >
        <div className="tx-list">
          {DEMO_RECENT_TX.map((x) => (
            <div
              key={x.id}
              className="tx-row"
              role="button"
              tabIndex={0}
              onClick={() => {
                if (typeof window.showToast === 'function') {
                  window.showToast(`Transaction ${x.id} — detail modal later`)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  if (typeof window.showToast === 'function') {
                    window.showToast(`Transaction ${x.id} — detail modal later`)
                  }
                }
              }}
            >
              <div className={`tx-ic ${x.dir === 'in' ? 'in-ic' : 'out-ic'}`}>{x.icon}</div>
              <div className="tx-info">
                <div className="tx-t">{x.title}</div>
                <div className="tx-d">
                  {x.date} · {x.category}
                </div>
              </div>
              <div className={`tx-amt ${x.amt >= 0 ? 'pos' : 'neg'} bal-amount ${hiddenClass}`}>
                {x.amt >= 0 ? '+' : '−'}
                {Math.abs(x.amt).toFixed(2)} {x.ccy}
              </div>
            </div>
          ))}
        </div>
        <Link to="/activity" className="show-more-btn">
          View all activity ▸
        </Link>
      </SectionWithCaption>
    </div>
  )
}
