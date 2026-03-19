// Runtime configuration for UI behavior and local persistence.
window.STABLES_CONFIG = {
  ACTIVITY_PAGE_SIZE: 25,
  BACKUP_REMINDER_HOURS: 48,
  BACKUP_STORAGE_KEY: 'stables_last_config_backup_ts',
  BACKUP_FIRST_SEEN_KEY: 'stables_backup_first_seen_ts',
  CONTACT_NOTES_KEY: 'stables_contact_notes_v1',
  SUSPICIOUS_TX_KEY: 'stables_suspicious_tx_ids_v1',
  HIDDEN_TX_KEY: 'stables_hidden_tx_ids_v1',
  ONCHAIN_RECOVERED: [
    'Wallet addresses and UTXO state tied to the seed phrase',
    'On-chain transaction history and confirmations',
    'Token balances and protocol positions'
  ],
  LOCAL_CONFIG_ONLY: [
    'UI preferences and display filters',
    'Contact notes and local contact tags',
    'Suspicious transaction flags',
    'Hidden/deleted transaction visibility flags',
    'Activity search state and demo-only metadata'
  ]
};

