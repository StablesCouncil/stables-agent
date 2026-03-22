/// <reference types="vite/client" />

declare global {
  interface Window {
    /** Wired when Stables agent modal exists in this shell */
    openAgentExplain?: (prompt: string) => void
    /** Optional toast bridge (legacy app); dev builds may omit */
    showToast?: (message: string) => void
  }
}

export {}
