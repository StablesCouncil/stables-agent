import { SectionWithCaption } from '../components/sections/SectionWithCaption'

export function DevHomePage() {
  return (
    <>
      <p style={{ color: 'var(--muted)', fontWeight: 700, margin: '0 0 20px', lineHeight: 1.5 }}>
        This is the <strong style={{ color: 'var(--text-primary)' }}>Vite + React + TypeScript</strong>{' '}
        shell. New work lives in components and features; the legacy MiniDapp stays the shipping app until
        parity is reached.
      </p>

      <SectionWithCaption
        className="app-section--caption-bottom--mt20"
        title="Example section"
        agentExplain="Example: this block uses the shared SectionWithCaption component."
        cardClassName="cb-pad"
      >
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontWeight: 600, lineHeight: 1.55 }}>
          Content goes inside the card. The title row and StablesAgent control render below (caption pattern).
        </p>
      </SectionWithCaption>
    </>
  )
}
