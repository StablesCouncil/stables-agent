export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div>
      <h2 style={{ margin: '0 0 12px', fontSize: '1.25rem', fontWeight: 900 }}>{title}</h2>
      <p style={{ margin: 0, color: 'var(--muted)', fontWeight: 600, lineHeight: 1.5 }}>
        Route reserved — implement under <code>src/features/{title.toLowerCase()}</code> and mount here.
      </p>
    </div>
  )
}
