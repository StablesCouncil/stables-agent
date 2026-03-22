/** Demo balances — replace with Minima / vault state later */

export const DEMO_TOTAL_USD = '3,450.75'

export type SecondaryCcy = {
  code: string
  name: string
  amount: string
  usdLine: string
  defaultHidden?: boolean
}

export const PRIMARY_CCY = {
  code: 'USDw',
  emoji: '💵',
  name: 'US Dollar',
  balance: '2,150.50',
} as const

export const SECONDARY_CCYS: SecondaryCcy[] = [
  { code: 'USDw', name: 'US Dollar', amount: '2150.50', usdLine: '$2150.50', defaultHidden: true },
  { code: 'MINIMA', name: 'Winiwa', amount: '0.00', usdLine: '-', defaultHidden: true },
  { code: 'EURw', name: 'Euro', amount: '800.00', usdLine: '$864.00' },
  { code: 'GBPw', name: 'British Pound', amount: '346.23', usdLine: '$436.25' },
  { code: 'JPYw', name: 'Japanese Yen', amount: '0.00', usdLine: '-', defaultHidden: true },
  { code: 'CADw', name: 'Canadian Dollar', amount: '0.00', usdLine: '—', defaultHidden: true },
  { code: 'AUDw', name: 'Australian Dollar', amount: '0.00', usdLine: '-', defaultHidden: true },
  { code: 'CHFw', name: 'Swiss Franc', amount: '0.00', usdLine: '-', defaultHidden: true },
  { code: 'CNYw', name: 'Chinese Yuan', amount: '0.00', usdLine: '-', defaultHidden: true },
]

export type DemoTx = {
  id: string
  dir: 'in' | 'out'
  icon: string
  title: string
  date: string
  category: string
  amt: number
  ccy: string
}

export const DEMO_RECENT_TX: DemoTx[] = [
  {
    id: 'demo-1',
    dir: 'out',
    icon: '↑',
    title: 'Sent to Alex',
    date: 'Feb 22',
    category: 'Transfer',
    amt: -50,
    ccy: 'USDw',
  },
  {
    id: 'demo-2',
    dir: 'in',
    icon: '↓',
    title: 'Received · Coffee shop',
    date: 'Feb 21',
    category: 'Payment',
    amt: 12.5,
    ccy: 'USDw',
  },
  {
    id: 'demo-3',
    dir: 'out',
    icon: '⇄',
    title: 'Exchange USDw → EURw',
    date: 'Feb 20',
    category: 'Exchange',
    amt: -200,
    ccy: 'USDw',
  },
]
