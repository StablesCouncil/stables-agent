import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { WalletPage } from '../features/wallet/WalletPage'
import { DevHomePage } from '../pages/DevHomePage'
import { PlaceholderPage } from '../pages/PlaceholderPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<DevHomePage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="activity" element={<PlaceholderPage title="My transactions" />} />
          <Route path="council" element={<PlaceholderPage title="Council" />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
