import type { ReactNode } from 'react'
import './SectionWithCaption.css'

export type SectionWithCaptionProps = {
  title: string
  /** Passed to StablesAgent / openAgentExplain when wired */
  agentExplain: string
  /** Extra class on the outer section (e.g. first block spacing) */
  className?: string
  cardClassName?: string
  children: ReactNode
}

function triggerAgent(explain: string) {
  if (typeof window !== 'undefined' && typeof window.openAgentExplain === 'function') {
    window.openAgentExplain(explain)
    return
  }
  // Dev fallback until agent bridge exists in SPA
  console.info('[StablesAgent]', explain)
}

export function SectionWithCaption({
  title,
  agentExplain,
  className = '',
  cardClassName = '',
  children,
}: SectionWithCaptionProps) {
  return (
    <section className={`app-section app-section--caption-bottom ${className}`.trim()}>
      <div className="stitle-row">
        <div className="stitle">{title}</div>
        <button
          type="button"
          className="agent-mini-btn"
          title="StablesAgent"
          onClick={() => triggerAgent(agentExplain)}
        >
          <img src="/agent.png" alt="StablesAgent" width={36} height={36} />
        </button>
      </div>
      <div className={`app-section-card ${cardClassName}`.trim()}>{children}</div>
    </section>
  )
}
