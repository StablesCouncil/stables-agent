// Runtime configuration for UI behavior and local persistence.
window.STABLES_CONFIG = {
  /** Shipped build (keep in sync with dapp.conf "version" when you release). */
  APP_BUILD_VERSION: '0.2.10',
  /**
   * Council-side view of the newest MiniDapp. If latestPublishedVersion sorts above APP_BUILD_VERSION,
   * the Council communications page shows criticality + what changed + zip link.
   * To preview the update banner locally, temporarily set APP_BUILD_VERSION lower than latestPublishedVersion.
   */
  APP_UPDATE_POLICY: {
    latestPublishedVersion: '0.2.10',
    whenUpdateNeeded: {
      criticality: 'high',
      whatChanged:
        'Example when an update ships: security fixes, mandatory protocol UI changes, or critical Minima MDS fixes.',
      details:
        'Install the new Stables.mds.zip on my node from the link below, or use Settings and updates.'
    }
  },
  ACTIVITY_PAGE_SIZE: 25,
  BACKUP_REMINDER_HOURS: 48,
  BACKUP_STORAGE_KEY: 'stables_last_config_backup_ts',
  BACKUP_FIRST_SEEN_KEY: 'stables_backup_first_seen_ts',
  /** User confirmed Vault key is safely stored. Stops the first-run Vault key prompt. */
  SEED_PHRASE_SAVED_CONFIRMED_KEY: 'stables_seedphrase_saved_confirmed_v1',
  /** After confirming, user chose whether to allow occasional soft reminders: 'yes' | 'no'. */
  VAULT_PERIODIC_REMINDER_PREF_KEY: 'stables_vault_periodic_reminder_pref_v1',
  /** Last time we showed a soft Vault reminder (when pref is yes). */
  VAULT_SOFT_REMINDER_LAST_KEY: 'stables_vault_soft_reminder_last_ts_v1',
  /** Days between soft reminders when user opted in. */
  VAULT_SOFT_REMINDER_INTERVAL_DAYS: 60,
  /** Public demo: MinimaOS install package (MDS zip) link */
  MDS_ZIP_URL: 'https://github.com/StablesCouncil/StablesCouncil.github.io/releases/latest/download/Stables.mds.zip',
  /**
   * Telegram: dedicated security / Vault key support (supergroup or channel invite).
   * Publish the real invite here when the channel is live; used from Vault modal “I need help”.
   */
  SECURITY_SUPPORT_TELEGRAM_URL: 'https://t.me/StablesSecuritySupport',
  /**
   * Official council notices on the Council communications page (security, mandatory updates, critical comms).
   * Replace `items` on each release; keep copy factual and short.
   */
  COUNCIL_COMMUNICATIONS: {
    intro:
      'This channel is for Stables Council only: security incidents, required updates, and other critical communication. It is not for casual chat.',
    items: [
      {
        title: 'Prototype build',
        date: '2026-03-19',
        body:
          'No live signed council feed is wired in this prototype. In production, verified council messages will appear on the Council communications page (More, Community).'
      }
    ]
  },
  CONTACT_NOTES_KEY: 'stables_contact_notes_v1',
  SUSPICIOUS_TX_KEY: 'stables_suspicious_tx_ids_v1',
  HIDDEN_TX_KEY: 'stables_hidden_tx_ids_v1',
  /** Wallet / activity “soft hide” (recoverable; shown when Hidden filter is on) */
  SOFT_HIDDEN_TX_KEY: 'stables_soft_hidden_tx_ids_v1',
  HIDDEN_SHOPS_KEY: 'stables_hidden_shop_names_v1',
  TX_NOTES_KEY: 'stables_tx_notes_v1',
  COUNCIL_MEMBER_PROFILE_KEY: 'stables_council_member_profile_v1',
  ONCHAIN_RECOVERED: [
    'Wallet addresses and UTXO state tied to the seed phrase',
    'On-chain transaction history and confirmations',
    'Token balances and protocol positions'
  ],
  LOCAL_CONFIG_ONLY: [
    'UI preferences and display filters',
    'Contact notes and local contact tags',
    'Suspicious transaction flags',
    'Transaction notes',
    'Hidden/deleted transaction visibility flags',
    'Soft-hidden transactions and hidden shops (local demo)',
    'Activity search state and demo-only metadata'
  ]
};

