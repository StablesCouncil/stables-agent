import { NavLink, Outlet } from 'react-router-dom'
import './AppShell.css'

const nav: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/wallet', label: 'Wallet' },
  { to: '/activity', label: 'Activity' },
  { to: '/council', label: 'Council' },
  { to: '/settings', label: 'Settings' },
]

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <h1 className="app-shell__brand">Stables</h1>
        <nav className="app-shell__nav" aria-label="Main">
          {nav.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-shell__main">
        <Outlet />
      </main>
      <footer className="app-shell__foot">
        SPA scaffold — migrate screens from <code>prod_stables_app_v0.2.x</code> into{' '}
        <code>src/features/</code>
      </footer>
    </div>
  )
}
