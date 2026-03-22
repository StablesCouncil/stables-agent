/// <reference types="vite/client" />

declare global {
  interface Window {
    /** Wired when Stables agent modal exists in this shell */
    openAgentExplain?: (prompt: string) => void
  }
}

export {}
