(function () {
  const CFG = window.STABLES_CONFIG || {};
  const ACTIVITY_PAGE_SIZE = CFG.ACTIVITY_PAGE_SIZE || 25;
  const CONTACT_NOTES_KEY = CFG.CONTACT_NOTES_KEY || 'stables_contact_notes_v1';
  const SUSPICIOUS_TX_KEY = CFG.SUSPICIOUS_TX_KEY || 'stables_suspicious_tx_ids_v1';
  const HIDDEN_TX_KEY = CFG.HIDDEN_TX_KEY || 'stables_hidden_tx_ids_v1';
  const SOFT_HIDDEN_TX_KEY = CFG.SOFT_HIDDEN_TX_KEY || 'stables_soft_hidden_tx_ids_v1';
  const HIDDEN_SHOPS_KEY = CFG.HIDDEN_SHOPS_KEY || 'stables_hidden_shop_names_v1';
  const TX_NOTES_KEY = CFG.TX_NOTES_KEY || 'stables_tx_notes_v1';
  const BACKUP_STORAGE_KEY = CFG.BACKUP_STORAGE_KEY || 'stables_last_config_backup_ts';
  const BACKUP_REMINDER_HOURS = CFG.BACKUP_REMINDER_HOURS || 48;
  const BACKUP_FIRST_SEEN_KEY = CFG.BACKUP_FIRST_SEEN_KEY || 'stables_backup_first_seen_ts';

  const DEMO_CONTACTS = [
    { name: 'Alex', category: 'Friend', address: 'MxA1...9f21', city: 'Amsterdam, NL' },
    { name: 'Maria', category: 'Friend', address: 'MxB2...3ca8', city: 'Lisbon, PT' },
    { name: 'Sam', category: 'Friend', address: 'MxC3...88de', city: 'Berlin, DE' },
    { name: 'Ground Coffee Roasters', category: 'Coffee', address: 'MxD4...2be1', city: 'London, UK' },
    { name: 'Open Pages Bookshop', category: 'Books', address: 'MxE5...6cd4', city: 'London, UK' },
    { name: 'City Transit', category: 'Transport', address: 'MxF6...7ef2', city: 'Amsterdam, NL' },
    { name: 'Green Basket Market', category: 'Groceries', address: 'MxG7...55ab', city: 'Utrecht, NL' },
    { name: 'Northwind Gym', category: 'Wellness', address: 'MxH8...a9f0', city: 'Rotterdam, NL' },
    { name: 'RentVault', category: 'Housing', address: 'MxI9...11aa', city: 'Amsterdam, NL' },
    { name: 'Nimbus Subscriptions', category: 'Subscription', address: 'MxJ0...84cc', city: 'Remote' }
  ];

  const SHOP_PROFILES = {
    'Ground Coffee Roasters': {
      icon: '☕', name: 'Ground Coffee Roasters', category: 'Cafe', city: 'Berlin, DE', status: 'Open',
      accepts: ['USDw', 'EURw'], avgTicket: '4.50 USDw', openHours: 'Mon-Sat · 07:00-19:00',
      promos: ['10% off espresso before 10:00', 'Buy 5 coffees, get 1 free', 'Free oat milk upgrade this week']
    },
    'The Bread Collective': {
      icon: '🥖', name: 'The Bread Collective', category: 'Bakery', city: 'Amsterdam, NL', status: 'Open',
      accepts: ['USDw', 'EURw', 'GBPw'], avgTicket: '7.80 USDw', openHours: 'Tue-Sun · 06:30-18:30',
      promos: ['Morning combo: coffee + croissant 5.90 USDw', '15% discount on sourdough after 17:00']
    },
    'Open Pages Bookshop': {
      icon: '📚', name: 'Open Pages Bookshop', category: 'Books', city: 'London, UK', status: 'New',
      accepts: ['USDw', 'GBPw'], avgTicket: '12.20 USDw', openHours: 'Daily · 10:00-20:00',
      promos: ['12% off first purchase', '2-for-1 selected paperbacks', 'Weekend author-signing voucher']
    }
  };

  const ICON_BY_CATEGORY = { Friend: '↙', Coffee: '🏪', Books: '📚', Transport: '🚇', Groceries: '🛒', Wellness: '💪', Housing: '🏠', Subscription: '💳' };
  const CCY_ROTATION = ['USDw', 'EURw', 'GBPw'];
  const BASE_DATE = new Date('2026-03-19T14:32:00');
  const DEMO_ACTIVITY = [];
  for (let i = 0; i < 75; i++) {
    const cp = DEMO_CONTACTS[i % DEMO_CONTACTS.length];
    const dir = i % 3 === 0 ? 'in' : 'out';
    const ccy = CCY_ROTATION[i % CCY_ROTATION.length];
    const magnitude = ((i * 17) % 260) + (dir === 'in' ? 25 : 6.5);
    const amt = Number((dir === 'in' ? magnitude : -magnitude).toFixed(2));
    const dt = new Date(BASE_DATE.getTime() - (i * 7.25 * 60 * 60 * 1000));
    const dateText = dt.toLocaleString('en-GB', { month: 'short', day: '2-digit' }) + ' · ' + dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    DEMO_ACTIVITY.push({
      id: `TX-${String(100001 + i)}`, dir, icon: ICON_BY_CATEGORY[cp.category] || (dir === 'in' ? '↙' : '↗'),
      counterparty: cp.name, category: cp.category, title: `${dir === 'in' ? 'Received from' : 'Paid'} ${cp.name}`,
      date: dateText, amt, ccy, address: cp.address, fee: Number((Math.max(0.02, Math.abs(amt) * 0.0001)).toFixed(2)),
      status: i % 19 === 0 ? 'Pending' : 'Confirmed', note: i % 5 === 0 ? 'Monthly recurring flow' : 'Demo payment',
      directionLabel: dir === 'in' ? 'Incoming' : 'Outgoing'
    });
  }

  let activityFilter = 'all';
  let activityCcyFilter = 'all';
  let activitySearch = '';
  let activitySort = 'date_desc';
  let activityPage = 0;
  let selectedTxId = null;
  let selectedContactName = '';
  let chatContactName = '';
  const CONTACTS_BOOK = new Map(DEMO_CONTACTS.map(c => [c.name, { ...c, saved: false }]));
  const suspiciousTx = new Set(JSON.parse(localStorage.getItem(SUSPICIOUS_TX_KEY) || '[]'));
  const deletedTx = new Set(JSON.parse(localStorage.getItem(HIDDEN_TX_KEY) || '[]'));
  const hiddenTx = new Set(JSON.parse(localStorage.getItem(SOFT_HIDDEN_TX_KEY) || '[]'));
  const hiddenShops = new Set(JSON.parse(localStorage.getItem(HIDDEN_SHOPS_KEY) || '[]'));
  const contactNotes = JSON.parse(localStorage.getItem(CONTACT_NOTES_KEY) || '{}');
  const txNotes = JSON.parse(localStorage.getItem(TX_NOTES_KEY) || '{}');

  function persistSuspicious() { localStorage.setItem(SUSPICIOUS_TX_KEY, JSON.stringify(Array.from(suspiciousTx))); }
  function persistHiddenTx() { localStorage.setItem(HIDDEN_TX_KEY, JSON.stringify(Array.from(deletedTx))); }
  function persistSoftHidden() { localStorage.setItem(SOFT_HIDDEN_TX_KEY, JSON.stringify(Array.from(hiddenTx))); }
  function persistHiddenShops() { localStorage.setItem(HIDDEN_SHOPS_KEY, JSON.stringify(Array.from(hiddenShops))); }
  function persistNotes() { localStorage.setItem(CONTACT_NOTES_KEY, JSON.stringify(contactNotes)); }
  function persistTxNotes() { localStorage.setItem(TX_NOTES_KEY, JSON.stringify(txNotes)); }
  function getTxById(id) { return DEMO_ACTIVITY.find(x => x.id === id); }
  function getTxNote(tx) {
    if (!tx || !tx.id) return '';
    const saved = String(txNotes[tx.id] || '').trim();
    if (saved) return saved;
    return String(tx.note || '').trim();
  }
  function activityMatchesDir(x) {
    if (activityFilter === 'all' || activityFilter === 'hidden') return true;
    return x.dir === activityFilter;
  }

  function getFilteredActivity() {
    const q = (activitySearch || '').toLowerCase().trim();
    const hiddenOnly = activityFilter === 'hidden';
    return DEMO_ACTIVITY.filter(x => {
      if (deletedTx.has(x.id)) return false;
      if (hiddenOnly) {
        if (!hiddenTx.has(x.id)) return false;
      } else {
        if (hiddenTx.has(x.id)) return false;
        if (hiddenShops.has(x.counterparty)) return false;
      }
      if (!activityMatchesDir(x)) return false;
      if (activityCcyFilter !== 'all' && x.ccy !== activityCcyFilter) return false;
      const note = getTxNote(x).toLowerCase();
      if (q && !x.counterparty.toLowerCase().includes(q) && !x.category.toLowerCase().includes(q) && !note.includes(q)) return false;
      return true;
    });
  }
  function latestContactTx(name, dir) {
    return DEMO_ACTIVITY.find(x => !deletedTx.has(x.id) && x.counterparty === name && x.dir === dir) || null;
  }

  function txsForShop(shopName) {
    return DEMO_ACTIVITY.filter(x => x.counterparty === shopName);
  }

  window.setActivityFilter = function (f) {
    activityFilter = f;
    ['actFilterAll', 'actFilterIn', 'actFilterOut', 'actFilterHidden'].forEach(id => document.getElementById(id)?.classList.remove('on'));
    if (f === 'in') document.getElementById('actFilterIn')?.classList.add('on');
    if (f === 'out') document.getElementById('actFilterOut')?.classList.add('on');
    if (f === 'hidden') document.getElementById('actFilterHidden')?.classList.add('on');
    if (f === 'all') document.getElementById('actFilterAll')?.classList.add('on');
    activityPage = 0;
    window.renderActivity();
  };

  window.setActivityCcyFilter = function (f) {
    activityCcyFilter = f;
    ['actCcyFilterUSDw', 'actCcyFilterEURw'].forEach(id => document.getElementById(id)?.classList.remove('on'));
    if (f === 'USDw') document.getElementById('actCcyFilterUSDw')?.classList.add('on');
    if (f === 'EURw') document.getElementById('actCcyFilterEURw')?.classList.add('on');
    activityPage = 0;
    window.renderActivity();
  };

  window.resetActivityFilters = function () {
    activityFilter = 'all';
    activityCcyFilter = 'all';
    ['actFilterAll', 'actFilterIn', 'actFilterOut', 'actFilterHidden', 'actCcyFilterUSDw', 'actCcyFilterEURw'].forEach(id => document.getElementById(id)?.classList.remove('on'));
    document.getElementById('actFilterAll')?.classList.add('on');
    activityPage = 0;
    window.renderActivity();
  };

  window.setActivitySort = function (mode) {
    activitySort = mode === 'amount_desc' ? 'amount_desc' : 'date_desc';
    document.getElementById('actSortDate')?.classList.remove('on');
    document.getElementById('actSortAmount')?.classList.remove('on');
    if (activitySort === 'date_desc') document.getElementById('actSortDate')?.classList.add('on');
    if (activitySort === 'amount_desc') document.getElementById('actSortAmount')?.classList.add('on');
    activityPage = 0;
    window.renderActivity();
  };

  window.setActivitySearch = function (value) { activitySearch = String(value || ''); activityPage = 0; window.renderActivity(); };
  window.showNextActivityPage = function () { const items = getFilteredActivity(); const maxPage = Math.max(0, Math.ceil(items.length / ACTIVITY_PAGE_SIZE) - 1); activityPage = Math.min(maxPage, activityPage + 1); window.renderActivity(); };
  window.showPrevActivityPage = function () { activityPage = Math.max(0, activityPage - 1); window.renderActivity(); };

  window.renderActivity = function () {
    const list = document.getElementById('activityList'); if (!list) return;
    const nextBtn = document.getElementById('activityMoreBtn');
    const prevBtn = document.getElementById('activityPrevBtn');
    const items = getFilteredActivity();
    if (activitySort === 'amount_desc') {
      items.sort((a, b) => Math.abs(b.amt) - Math.abs(a.amt));
    }
    const start = activityPage * ACTIVITY_PAGE_SIZE;
    const end = Math.min(items.length, start + ACTIVITY_PAGE_SIZE);
    list.innerHTML = '';
    items.slice(start, end).forEach(x => {
      const row = document.createElement('div');
      row.className = 'tx-row';
      if (suspiciousTx.has(x.id)) row.style.borderColor = 'rgba(248,113,113,.45)';
      const note = getTxNote(x);
      row.innerHTML = `<div class="tx-ic ${x.dir === 'in' ? 'in-ic' : 'out-ic'}">${x.icon}</div><div class="tx-info"><div class="tx-t">${x.title}</div><div class="tx-d">${x.date} · ${x.category}${suspiciousTx.has(x.id) ? ' · Suspicious' : ''}${note ? ' · Note' : ''}</div></div><div class="tx-amt ${x.amt >= 0 ? 'pos' : 'neg'} bal-amount">${x.amt >= 0 ? '+' : '−'}${Math.abs(x.amt).toFixed(2)} ${x.ccy}</div>`;
      row.addEventListener('click', () => window.openActivityDetail(x.id));
      list.appendChild(row);
    });
    const hasPrev = activityPage > 0;
    const hasNext = end < items.length;
    if (prevBtn) prevBtn.style.display = hasPrev ? '' : 'none';
    if (nextBtn) { nextBtn.style.display = hasNext ? '' : 'none'; if (hasNext) nextBtn.textContent = `See next ${Math.min(25, items.length - end)} ▸`; }
  };

  window.renderWalletRecentActivity = function () {
    const list = document.getElementById('walletRecentList');
    if (!list) return;
    const items = DEMO_ACTIVITY.filter(x => !deletedTx.has(x.id) && !hiddenTx.has(x.id) && !hiddenShops.has(x.counterparty)).slice(0, 10);
    list.innerHTML = '';
    items.forEach(x => {
      const row = document.createElement('div');
      row.className = 'tx-row';
      if (suspiciousTx.has(x.id)) row.style.borderColor = 'rgba(248,113,113,.45)';
      const note = getTxNote(x);
      row.innerHTML = `<div class="tx-ic ${x.dir === 'in' ? 'in-ic' : 'out-ic'}">${x.icon}</div><div class="tx-info"><div class="tx-t">${x.title}</div><div class="tx-d">${x.date} · ${x.category}${suspiciousTx.has(x.id) ? ' · Suspicious' : ''}${note ? ' · Note' : ''}</div></div><div class="tx-amt ${x.amt >= 0 ? 'pos' : 'neg'} bal-amount">${x.amt >= 0 ? '+' : '−'}${Math.abs(x.amt).toFixed(2)} ${x.ccy}</div>`;
      row.addEventListener('click', () => window.openActivityDetail(x.id));
      list.appendChild(row);
    });
  };

  window.openActivityDetail = function (id) {
    const tx = getTxById(id); if (!tx) return;
    selectedTxId = id;
    const suspicious = suspiciousTx.has(tx.id);
    const txNote = getTxNote(tx);
    const statusColor = tx.status === 'Confirmed' ? 'var(--gr)' : 'var(--am)';
    const body = `<div style="margin-bottom:8px;display:flex;align-items:center;gap:8px"><span style="width:8px;height:8px;border-radius:50%;background:${statusColor};display:inline-block"></span><span class="xs mu">${tx.status}</span></div>
      <div style="padding:12px;border-radius:12px;background:rgba(16,24,38,.55);border:1px solid rgba(103,232,249,.16);margin-bottom:10px">
        <div class="fbet"><div><button class="btn" style="width:auto;padding:0;border:none;background:none;font-size:16px;font-weight:900;color:var(--t)" onclick="openTxCounterpartyContact()">${tx.counterparty}</button><div class="xs mu">${tx.category} · ${tx.directionLabel}</div></div><div style="text-align:right"><div class="tx-amt ${tx.amt >= 0 ? 'pos' : 'neg'} bal-amount">${tx.amt >= 0 ? '+' : '−'}${Math.abs(tx.amt).toFixed(2)} ${tx.ccy}</div><div class="xs mu">Fee ${tx.fee.toFixed(2)} ${tx.ccy}</div></div></div>
      </div>
      <div class="flex gap8" style="margin-bottom:10px;flex-wrap:wrap;justify-content:center">
        <button class="btn" onclick="repeatTransactionFromDetail()">Repeat</button>
      </div>
      <details>
        <summary style="cursor:pointer;font-size:13px;font-weight:800;color:var(--m);margin-bottom:8px">Details</summary>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
          <div style="padding:10px;border-radius:10px;background:rgba(11,15,20,.35);border:1px solid rgba(103,232,249,.1)"><div class="xs mu">Transaction ID</div><div style="font-size:12px;font-weight:800;margin-top:4px;word-break:break-all">${tx.id}</div></div>
          <div style="padding:10px;border-radius:10px;background:rgba(11,15,20,.35);border:1px solid rgba(103,232,249,.1)"><div class="xs mu">Date</div><div style="font-size:12px;font-weight:800;margin-top:4px">${tx.date}</div></div>
          <div style="padding:10px;border-radius:10px;background:rgba(11,15,20,.35);border:1px solid rgba(103,232,249,.1);grid-column:1 / -1"><div class="xs mu">Counterparty Address</div><div style="font-size:12px;font-weight:800;margin-top:4px;word-break:break-all">${tx.address}</div></div>
        </div>
        <div class="flex gap8" style="margin-bottom:8px;justify-content:center"><button class="btn" onclick="saveTxCounterpartyToContacts()">Add to contacts</button><button class="btn" onclick="toggleSuspiciousTx()">${suspicious ? 'Unflag suspicious' : 'Flag suspicious'}</button></div>
        <div class="flex gap8" style="margin-top:10px;margin-bottom:8px;flex-wrap:wrap;justify-content:center">
          ${hiddenTx.has(tx.id)
    ? `<button class="btn" onclick="unhideTransactionFromHistory()">Show in main lists</button>`
    : `<button class="btn" onclick="hideTransactionFromHistory()">Hide transaction</button>`}
          <button class="btn" onclick="deleteTransactionFromHistory()">Delete transaction</button>
        </div>
        <div style="margin-top:10px">
          <label class="flabel" style="margin-bottom:6px">Transaction note</label>
          <textarea class="finput" id="txDetailNoteInput" rows="2" placeholder="Add a note for this transaction..." style="resize:vertical;margin-bottom:8px">${txNote}</textarea>
          <div class="flex gap8" style="justify-content:center"><button class="btn btn-w btn-g" onclick="saveTransactionNote()">Save note</button></div>
        </div>
        <div class="xs mu">Use the <strong>Hidden</strong> filter on All Transactions to review soft-hidden payments. Deleted items stay gone unless you reset local config. Hiding a shop removes it from the Shops tab and drops its payments from the main activity list until you show the shop again from its profile.</div>
      </details>`;
    document.getElementById('agentActionTitle').textContent = 'Transaction details';
    const titleRight = document.getElementById('agentActionTitleRight');
    if (titleRight) titleRight.innerHTML = '<button class="btn" title="Ask StablesAgent" style="width:auto;padding:6px 10px;font-size:12px" onclick="openAgentExplain(\'Transaction details\')"><img src="agent.png" alt="Agent" style="width:14px;height:14px;border-radius:4px;vertical-align:-2px"></button>';
    document.getElementById('agentActionContent').innerHTML = body;
    document.getElementById('agentActionModal').classList.add('open');
  };

  window.closeAgentActionModal = function () {
    const modal = document.getElementById('agentActionModal');
    if (!modal) return;
    modal.classList.remove('open');
  };
  window.toggleSuspiciousTx = function () { if (!selectedTxId) return; if (suspiciousTx.has(selectedTxId)) suspiciousTx.delete(selectedTxId); else suspiciousTx.add(selectedTxId); persistSuspicious(); window.openActivityDetail(selectedTxId); window.renderActivity(); window.renderWalletRecentActivity(); };
  window.hideTransactionFromHistory = function () {
    if (!selectedTxId) return;
    hiddenTx.add(selectedTxId);
    persistSoftHidden();
    window.closeAgentActionModal();
    window.renderActivity();
    window.renderWalletRecentActivity();
    if (typeof window.showToast === 'function') window.showToast('Transaction soft-hidden. Use Hidden filter to review');
  };
  window.unhideTransactionFromHistory = function () {
    if (!selectedTxId) return;
    hiddenTx.delete(selectedTxId);
    persistSoftHidden();
    window.openActivityDetail(selectedTxId);
    window.renderActivity();
    window.renderWalletRecentActivity();
    if (typeof window.showToast === 'function') window.showToast('Transaction back in main lists');
  };
  window.deleteTransactionFromHistory = function () {
    if (!selectedTxId) return;
    deletedTx.add(selectedTxId);
    hiddenTx.delete(selectedTxId);
    persistHiddenTx();
    persistSoftHidden();
    window.closeAgentActionModal();
    window.renderActivity();
    window.renderWalletRecentActivity();
    if (typeof window.showToast === 'function') window.showToast('Transaction removed from local view');
  };
  window.repeatTransactionFromDetail = function () {
    const tx = getTxById(selectedTxId); if (!tx) return;
    const draft = { party: `${tx.counterparty} · ${tx.address}`, amount: String(Math.abs(tx.amt).toFixed(2)), ccy: tx.ccy };
    window.closeAgentActionModal();
    if (tx.dir === 'in') window.openModalWithDraft('recvModal', draft);
    else window.openModalWithDraft('sendModal', draft);
  };
  window.saveTransactionNote = function () {
    if (!selectedTxId) return;
    const input = document.getElementById('txDetailNoteInput');
    const value = String(input?.value || '').trim();
    if (value) txNotes[selectedTxId] = value;
    else delete txNotes[selectedTxId];
    persistTxNotes();
    if (typeof window.showToast === 'function') window.showToast('Transaction note saved');
    window.renderActivity();
    window.renderWalletRecentActivity();
    window.openActivityDetail(selectedTxId);
  };
  window.saveTxCounterpartyToContacts = function () {
    const tx = getTxById(selectedTxId); if (!tx) return;
    const existing = CONTACTS_BOOK.get(tx.counterparty) || { name: tx.counterparty, category: tx.category, address: tx.address, city: 'Unknown', saved: false };
    existing.saved = true; CONTACTS_BOOK.set(tx.counterparty, existing); selectedContactName = tx.counterparty;
    window.closeAgentActionModal();
    if (typeof window.navigate === 'function') window.navigate('contacts');
    window.renderContactsPage();
  };
  window.openTxCounterpartyContact = function () { const tx = getTxById(selectedTxId); if (!tx) return; selectedContactName = tx.counterparty; window.closeAgentActionModal(); if (typeof window.navigate === 'function') window.navigate('contacts'); window.renderContactsPage(); };

  window.renderContactsPage = function () {
    const list = document.getElementById('contactsList'); if (!list) return;
    const search = String(document.getElementById('contactsSearchInput')?.value || '').toLowerCase().trim();
    const contacts = Array.from(CONTACTS_BOOK.values()).filter(c => !search || c.name.toLowerCase().includes(search) || c.category.toLowerCase().includes(search));
    list.innerHTML = '';
    contacts.forEach(c => {
      const txCount = DEMO_ACTIVITY.filter(x => !deletedTx.has(x.id) && x.counterparty === c.name).length;
      const shopHidden = hiddenShops.has(c.name);
      const row = document.createElement('div');
      row.className = 'tx-row';
      row.innerHTML = `<div class="tx-ic in-ic">👤</div><div class="tx-info"><div class="tx-t">${c.name}</div><div class="tx-d">${c.category} · ${txCount} transactions${shopHidden ? ' · Shop hidden from Spend' : ''}</div></div><div class="badge ${c.saved ? 'b-gr' : 'b-cy'}">${c.saved ? 'Saved' : 'Demo'}</div>`;
      row.addEventListener('click', () => { selectedContactName = c.name; window.renderSelectedContact(); });
      list.appendChild(row);
    });
    window.renderSelectedContact();
  };

  window.renderSelectedContact = function () {
    const card = document.getElementById('contactDetailCard'); if (!card) return;
    if (!selectedContactName || !CONTACTS_BOOK.has(selectedContactName)) { card.style.display = 'none'; return; }
    const c = CONTACTS_BOOK.get(selectedContactName);
    const txCount = DEMO_ACTIVITY.filter(x => !deletedTx.has(x.id) && x.counterparty === c.name).length;
    const latestOut = latestContactTx(c.name, 'out');
    const latestIn = latestContactTx(c.name, 'in');
    document.getElementById('contactDetailName').textContent = c.name;
    const shopHid = hiddenShops.has(c.name);
    document.getElementById('contactDetailMeta').textContent = `${c.category} · ${txCount} tx · ${c.city}${shopHid ? ' · Shop hidden on Spend' : ''}`;
    document.getElementById('contactDetailAddress').textContent = c.address;
    const latestSentEl = document.getElementById('contactLatestSent');
    const latestRecvEl = document.getElementById('contactLatestReceived');
    if (latestSentEl) latestSentEl.textContent = latestOut ? `${Math.abs(latestOut.amt).toFixed(2)} ${latestOut.ccy} · ${latestOut.date}` : 'No sent transaction yet';
    if (latestRecvEl) latestRecvEl.textContent = latestIn ? `${Math.abs(latestIn.amt).toFixed(2)} ${latestIn.ccy} · ${latestIn.date}` : 'No received transaction yet';
    const notes = document.getElementById('contactNotes');
    if (notes) notes.value = contactNotes[c.name] || '';
    const shopBtn = document.getElementById('contactShopBtn');
    if (shopBtn) shopBtn.style.display = SHOP_PROFILES[c.name] ? '' : 'none';
    card.style.display = '';
  };

  window.saveContactNotes = function () {
    if (!selectedContactName) return;
    const notes = document.getElementById('contactNotes');
    contactNotes[selectedContactName] = String(notes?.value || '').trim();
    persistNotes();
    if (typeof window.showToast === 'function') window.showToast('Contact notes saved');
  };

  window.openContactTransactions = function () {
    if (!selectedContactName) return;
    activitySearch = selectedContactName;
    const input = document.getElementById('activitySearchInput');
    if (input) input.value = activitySearch;
    activityPage = 0;
    if (typeof window.navigate === 'function') window.navigate('activity');
    window.renderActivity();
  };
  window.openContactConversation = function () { if (!selectedContactName) return; chatContactName = selectedContactName; if (typeof window.navigate === 'function') window.navigate('chat'); window.renderChatContext(); };
  window.renderChatContext = function () { const label = document.getElementById('chatContactLabel'); if (!label) return; if (!chatContactName) { label.style.display = 'none'; return; } label.style.display = ''; label.textContent = `Conversation with ${chatContactName}`; };

  function escCouncilHtml(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escAttr(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;');
  }

  function compareSemverLike(a, b) {
    const pa = String(a || '0').split('.').map((n) => parseInt(n, 10) || 0);
    const pb = String(b || '0').split('.').map((n) => parseInt(n, 10) || 0);
    const len = Math.max(pa.length, pb.length, 3);
    for (let i = 0; i < len; i++) {
      const da = pa[i] || 0;
      const db = pb[i] || 0;
      if (da < db) return -1;
      if (da > db) return 1;
    }
    return 0;
  }

  function criticalityPresentation(level) {
    const x = String(level || 'medium').toLowerCase();
    const map = {
      low: { label: 'Low', border: 'rgba(103,232,249,.38)', bg: 'rgba(103,232,249,.08)' },
      medium: { label: 'Medium', border: 'rgba(251,191,36,.45)', bg: 'rgba(251,191,36,.1)' },
      high: { label: 'High', border: 'rgba(249,115,22,.5)', bg: 'rgba(249,115,22,.12)' },
      critical: { label: 'Critical', border: 'rgba(248,113,113,.55)', bg: 'rgba(248,113,113,.14)' }
    };
    return map[x] || map.medium;
  }

  function buildAppVersionBannerHtml() {
    const cfg = window.STABLES_CONFIG || {};
    const current = String(cfg.APP_BUILD_VERSION || '0.0.0').trim();
    const pol = cfg.APP_UPDATE_POLICY && typeof cfg.APP_UPDATE_POLICY === 'object' ? cfg.APP_UPDATE_POLICY : {};
    const latest = String(pol.latestPublishedVersion || current).trim();
    const cmp = compareSemverLike(current, latest);
    const needsUpdate = cmp < 0;
    const zipUrl = typeof cfg.MDS_ZIP_URL === 'string' ? cfg.MDS_ZIP_URL.trim() : '';

    if (!needsUpdate) {
      return `<div class="card" style="padding:14px;margin-bottom:12px;border:1px solid rgba(103,232,249,.28);background:rgba(103,232,249,.06)">
        <div style="display:flex;align-items:flex-start;gap:10px">
          <span style="font-size:22px;line-height:1;flex-shrink:0" aria-hidden="true">✅</span>
          <div style="min-width:0">
            <div style="font-size:14px;font-weight:900;color:var(--t);margin-bottom:6px">App version</div>
            <div style="font-size:14px;line-height:1.55;font-weight:800;color:var(--muted)">You are using the latest app version (${escCouncilHtml(current)}).</div>
          </div>
        </div>
      </div>`;
    }

    const wu = pol.whenUpdateNeeded && typeof pol.whenUpdateNeeded === 'object' ? pol.whenUpdateNeeded : {};
    const crit = criticalityPresentation(wu.criticality);
    const what = escCouncilHtml(wu.whatChanged || 'See council release notes for this version.').replace(/\n/g, '<br>');
    const detRaw = typeof wu.details === 'string' ? wu.details.trim() : '';
    const det = detRaw ? escCouncilHtml(detRaw).replace(/\n/g, '<br>') : '';
    const zipBtn = zipUrl
      ? `<a class="btn btn-w" style="display:block;text-align:center;margin-top:14px;text-decoration:none;box-sizing:border-box;font-size:14px;font-weight:900;padding:14px 16px" href="${escAttr(zipUrl)}" target="_blank" rel="noopener">Download Stables.mds.zip</a>`
      : '';

    return `<div class="card" style="padding:14px;margin-bottom:12px;border:1px solid ${crit.border};background:${crit.bg}">
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px">
        <span style="font-size:22px;line-height:1;flex-shrink:0" aria-hidden="true">⚠️</span>
        <div style="min-width:0">
          <div style="font-size:14px;font-weight:900;color:var(--t);margin-bottom:4px">App update available</div>
          <div style="font-size:14px;line-height:1.55;font-weight:800;color:var(--muted)">Your build is <strong style="color:var(--t)">${escCouncilHtml(current)}</strong>. Latest published: <strong style="color:var(--t)">${escCouncilHtml(latest)}</strong>.</div>
        </div>
      </div>
      <div style="display:inline-block;padding:6px 12px;border-radius:999px;font-size:13px;font-weight:900;letter-spacing:.04em;text-transform:uppercase;border:1px solid ${crit.border};color:var(--t);margin-bottom:10px">Criticality: ${escCouncilHtml(crit.label)}</div>
      <div style="font-size:14px;font-weight:900;color:var(--t);margin-bottom:6px">What is updated</div>
      <div style="font-size:14px;line-height:1.55;font-weight:800;color:var(--muted)">${what}</div>
      ${det ? `<div style="margin-top:10px;font-size:14px;line-height:1.55;font-weight:700;color:var(--muted)">${det}</div>` : ''}
      ${zipBtn}
    </div>`;
  }

  function buildCouncilCommunicationsHtml() {
    const raw = (window.STABLES_CONFIG || {}).COUNCIL_COMMUNICATIONS;
    const block = raw && typeof raw === 'object' ? raw : {};
    const items = Array.isArray(block.items) ? block.items : [];
    const intro = typeof block.intro === 'string' && block.intro.trim()
      ? block.intro.trim()
      : 'This channel is for Stables Council only: security incidents, required updates, and other critical communication. It is not for casual chat.';
    let itemsHtml = '';
    if (!items.length) {
      itemsHtml = '<div class="xs mu" style="margin-top:8px;opacity:.9;font-weight:800;line-height:1.45">No council bulletins in this build.</div>';
    } else {
      itemsHtml = items.map((it) => {
        const title = escCouncilHtml(it.title || 'Notice');
        const date = it.date ? escCouncilHtml(it.date) : '';
        const body = escCouncilHtml(it.body || '').replace(/\n/g, '<br>');
        return `<div style="margin-top:10px;padding:10px 12px;border-radius:12px;background:rgba(0,0,0,.22);border:1px solid rgba(103,232,249,.12)">
          <div style="font-size:13px;font-weight:900;color:var(--t)">${title}</div>
          ${date ? `<div class="xs mu" style="margin-top:2px;font-weight:700">${date}</div>` : ''}
          <div class="xs mu" style="margin-top:6px;line-height:1.5;font-weight:700;color:var(--muted)">${body}</div>
        </div>`;
      }).join('');
    }
    return `<div class="card" style="padding:14px;margin-bottom:12px;border:1px solid rgba(167,139,250,.22);background:linear-gradient(135deg,rgba(103,232,249,.05),rgba(167,139,250,.06))">
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px">
        <span style="font-size:22px;line-height:1;flex-shrink:0" aria-hidden="true">🏛️</span>
        <div style="min-width:0;font-size:14px;line-height:1.55;font-weight:800;color:var(--muted)">${escCouncilHtml(intro)}</div>
      </div>
      ${itemsHtml}
    </div>`;
  }

  window.renderCouncilCommunicationPanels = function () {
    const html = buildAppVersionBannerHtml() + buildCouncilCommunicationsHtml();
    const el = document.getElementById('councilCommsPageMount');
    if (el) el.innerHTML = html;
  };

  window.openSelectedContactShop = function () { if (!selectedContactName) return; window.openShopProfile(selectedContactName); };

  window.refreshSpendShopCards = function () {
    document.querySelectorAll('[data-stables-shop]').forEach(el => {
      const n = el.getAttribute('data-stables-shop');
      el.style.display = n && hiddenShops.has(n) ? 'none' : '';
    });
  };

  window.shopHideAllTransactions = function (shopName) {
    const n = String(shopName || '').trim();
    if (!n) return;
    txsForShop(n).forEach(x => hiddenTx.add(x.id));
    persistSoftHidden();
    window.closeAgentActionModal();
    window.renderActivity();
    window.renderWalletRecentActivity();
    if (typeof window.showToast === 'function') window.showToast('All payments with this shop are soft-hidden');
  };

  window.shopDeleteAllTransactions = function (shopName) {
    const n = String(shopName || '').trim();
    if (!n) return;
    const msg = `Remove every transaction with ${n} from your local history? This stays on device only; use backup if you export settings.`;
    if (typeof window.confirm === 'function' && !window.confirm(msg)) return;
    txsForShop(n).forEach(x => { deletedTx.add(x.id); hiddenTx.delete(x.id); });
    persistHiddenTx();
    persistSoftHidden();
    window.closeAgentActionModal();
    window.renderActivity();
    window.renderWalletRecentActivity();
    if (typeof window.renderContactsPage === 'function') window.renderContactsPage();
    if (typeof window.showToast === 'function') window.showToast('Transactions removed from local view');
  };

  window.shopHideFromSpend = function (shopName) {
    const n = String(shopName || '').trim();
    if (!n) return;
    hiddenShops.add(n);
    persistHiddenShops();
    window.refreshSpendShopCards();
    window.closeAgentActionModal();
    window.renderActivity();
    window.renderWalletRecentActivity();
    if (typeof window.renderContactsPage === 'function') window.renderContactsPage();
    if (typeof window.showToast === 'function') window.showToast('Shop hidden from Shops tab');
  };

  window.shopUnhideFromSpend = function (shopName) {
    const n = String(shopName || '').trim();
    if (!n) return;
    hiddenShops.delete(n);
    persistHiddenShops();
    window.refreshSpendShopCards();
    window.renderActivity();
    window.renderWalletRecentActivity();
    if (typeof window.renderContactsPage === 'function') window.renderContactsPage();
    window.openShopProfile(n);
    if (typeof window.showToast === 'function') window.showToast('Shop visible on Shops again');
  };

  window.openShopProfile = function (name) {
    const shop = SHOP_PROFILES[name];
    if (!shop) { if (typeof window.showToast === 'function') window.showToast('No shop profile available yet'); return; }
    const promos = (shop.promos || []).map(p => `<li style="margin:0 0 6px 0">${p}</li>`).join('');
    const sn = JSON.stringify(shop.name);
    const shopHidden = hiddenShops.has(shop.name);
    const body = `<div class="mcard" style="margin-bottom:10px;cursor:default"><div class="mic">${shop.icon}</div><div class="minfo"><div class="mn">${shop.name}</div><div class="mt2">${shop.category} · ${shop.city}</div></div><div class="badge ${shop.status === 'Open' ? 'b-gr' : 'b-cy'}">${shop.status}</div></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px"><div style="padding:10px;border-radius:10px;background:rgba(11,15,20,.35);border:1px solid rgba(103,232,249,.1)"><div class="xs mu">Open Hours</div><div style="font-size:12px;font-weight:800;margin-top:4px">${shop.openHours}</div></div><div style="padding:10px;border-radius:10px;background:rgba(11,15,20,.35);border:1px solid rgba(103,232,249,.1)"><div class="xs mu">Average Ticket</div><div style="font-size:12px;font-weight:800;margin-top:4px">${shop.avgTicket}</div></div></div>
      <div style="padding:10px;border-radius:10px;background:rgba(11,15,20,.35);border:1px solid rgba(103,232,249,.1);margin-bottom:10px"><div class="xs mu">Accepted Currencies</div><div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">${shop.accepts.map(c => `<span class="ccy-pill on" style="cursor:default">${c}</span>`).join('')}</div></div>
      <div style="padding:10px;border-radius:10px;background:rgba(16,24,38,.55);border:1px solid rgba(103,232,249,.16);margin-bottom:10px"><div style="font-size:13px;font-weight:800;margin-bottom:6px">Current promotions</div><ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.4">${promos}</ul></div>
      <div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(103,232,249,.12)">
        <div style="font-size:10px;font-weight:800;color:var(--m);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">History &amp; list</div>
        <div class="xs mu" style="margin-bottom:10px">Local demo only. Soft-hidden items use the <strong>Hidden</strong> filter; deleted items stay removed until you reset local data.</div>
        <div class="flex gap8" style="flex-wrap:wrap;justify-content:center">
          <button class="btn" onclick="shopHideAllTransactions(${sn})">Hide all transactions</button>
          <button class="btn" onclick="shopDeleteAllTransactions(${sn})">Delete all (local)</button>
          ${shopHidden
    ? `<button class="btn btn-w btn-g" onclick="shopUnhideFromSpend(${sn})">Show shop on Shops</button>`
    : `<button class="btn" onclick="shopHideFromSpend(${sn})">Hide shop from Shops</button>`}
        </div>
      </div>`;
    document.getElementById('agentActionTitle').textContent = 'Shop profile';
    const titleRight = document.getElementById('agentActionTitleRight');
    if (titleRight) titleRight.innerHTML = '';
    document.getElementById('agentActionContent').innerHTML = body;
    document.getElementById('agentActionModal').classList.add('open');
  };

  window.runConfigBackupNow = function () {
    const snapshot = {
      ts: new Date().toISOString(),
      notes: contactNotes,
      suspicious: Array.from(suspiciousTx),
      txNotes,
      softHiddenTx: Array.from(hiddenTx),
      deletedTx: Array.from(deletedTx),
      hiddenShops: Array.from(hiddenShops),
      info: 'Local settings backup (not seed-recoverable)'
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `stables-local-config-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    localStorage.setItem(BACKUP_STORAGE_KEY, String(Date.now()));
    if (typeof window.showToast === 'function') window.showToast('Local config backup exported');
    window.updateBackupStatus();
  };

  window.updateBackupStatus = function () {
    const ts = Number(localStorage.getItem(BACKUP_STORAGE_KEY) || 0);
    const el = document.getElementById('backupStatusLabel');
    if (!el) return;
    if (!ts) { el.textContent = 'Last backup: never'; return; }
    const agoH = Math.max(0, Math.floor((Date.now() - ts) / 3600000));
    el.textContent = `Last backup: ${agoH}h ago`;
  };

  window.openBackupSettings = function () {
    if (typeof window.navigate === 'function') window.navigate('settings');
    const el = document.getElementById('backupStatusLabel');
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    const modal = document.getElementById('agentActionModal');
    if (modal) modal.classList.remove('open');
  };

  window.checkBackupReminder = function () {
    const now = Date.now();
    const ts = Number(localStorage.getItem(BACKUP_STORAGE_KEY) || 0);
    let firstSeen = Number(localStorage.getItem(BACKUP_FIRST_SEEN_KEY) || 0);
    if (!firstSeen) {
      firstSeen = now;
      localStorage.setItem(BACKUP_FIRST_SEEN_KEY, String(firstSeen));
    }

    const ageMs = now - (ts || firstSeen);
    const overdue = ageMs > (BACKUP_REMINDER_HOURS * 3600000);
    const welcomeOpen = document.getElementById('welcomeSetupModal')?.classList.contains('open');
    if (welcomeOpen) {
      window.updateBackupStatus();
      return;
    }
    if (overdue) {
      const titleEl = document.getElementById('agentActionTitle');
      const bodyEl = document.getElementById('agentActionContent');
      const modal = document.getElementById('agentActionModal');
      if (titleEl && bodyEl && modal) {
        titleEl.textContent = 'Backup your local config';
        const titleRight = document.getElementById('agentActionTitleRight');
        if (titleRight) titleRight.innerHTML = '';
        bodyEl.innerHTML =
          '<div class="xs mu" style="margin-bottom:10px">Your personal settings and notes are stored locally. They are not recovered from your seed phrase.</div>'
          + '<div class="xs mu" style="margin-bottom:14px">Export a backup file now so you can restore your setup later.</div>'
          + '<div class="flex gap8"><button class="btn btn-w btn-g" style="flex:1" onclick="runConfigBackupNow()">Export backup file</button>'
          + '<button class="btn" style="flex:1" onclick="openBackupSettings()">Open backup settings</button></div>';
        modal.classList.add('open');
      }
    }
    window.updateBackupStatus();
  };

  window.showStorageScopeInfo = function () {
    const onchain = (CFG.ONCHAIN_RECOVERED || []).map(x => `<li>${x}</li>`).join('');
    const local = (CFG.LOCAL_CONFIG_ONLY || []).map(x => `<li>${x}</li>`).join('');
    const body = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div style="padding:10px;border-radius:10px;background:rgba(16,24,38,.55);border:1px solid rgba(52,211,153,.22)"><div style="font-size:12px;font-weight:800;color:var(--gr);margin-bottom:6px">Recovered from seed phrase / onchain</div><ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.4">${onchain}</ul></div>
      <div style="padding:10px;border-radius:10px;background:rgba(16,24,38,.55);border:1px solid rgba(103,232,249,.22)"><div style="font-size:12px;font-weight:800;color:var(--c);margin-bottom:6px">Local config file only</div><ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.4">${local}</ul></div>
    </div>`;
    document.getElementById('agentActionTitle').textContent = 'Storage scope';
    const titleRight = document.getElementById('agentActionTitleRight');
    if (titleRight) titleRight.innerHTML = '';
    document.getElementById('agentActionContent').innerHTML = body;
    document.getElementById('agentActionModal').classList.add('open');
  };

  // --- Send modal quick contacts ---
  window.renderSendContactChips = function () {
    const wrap = document.getElementById('sendContactChips');
    if (!wrap) return;
    wrap.innerHTML = '';
    // Send modal: show *all* contacts so the user has full access.
    const contacts = Array.from(CONTACTS_BOOK.values());
    contacts.forEach(c => {
      const chip = document.createElement('button');
      chip.className = 'ccy-pill';
      chip.style.cursor = 'pointer';
      chip.textContent = c.name;
      chip.addEventListener('click', () => window.setSendRecipient(c.name, c.address));
      wrap.appendChild(chip);
    });
  };

  window.setSendRecipient = function (name, address) {
    const input = document.getElementById('sendToInput');
    if (!input) return;
    input.value = `${name} · ${address}`;
  };

  // --- First install setup ---
  window.toggleWelcomeCcy = function (el) {
    if (!el) return;
    el.classList.toggle('on');
    const code = String(el.dataset?.ccy || '').trim();
    const label = String(el.dataset?.label || code).trim();
    const isOn = el.classList.contains('on');
    el.textContent = isOn ? `${label} ✓` : label;
    window.updateWelcomePrimaryOptions();
  };

  window.updateWelcomePrimaryOptions = function () {
    const sel = document.getElementById('welcomePrimary');
    if (!sel) return;
    const prev = String(sel.value || '');
    const selected = Array.from(document.querySelectorAll('#welcomeCurrencies .ccy-pill.on'))
      .map(x => String(x.dataset?.ccy || '').trim())
      .filter(Boolean);
    const options = (selected.length ? selected : ['USDw']).slice().sort((a, b) => {
      const la = a === 'MINIMA' ? 'Winiwa' : a;
      const lb = b === 'MINIMA' ? 'Winiwa' : b;
      return la.localeCompare(lb);
    });
    sel.innerHTML = '';
    options.forEach(code => {
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = code === 'MINIMA' ? 'Winiwa' : code;
      sel.appendChild(opt);
    });
    const next = options.includes(prev) ? prev : options[0];
    sel.value = next;
  };

  window.closeWelcomeSetup = function () {
    const modal = document.getElementById('welcomeSetupModal');
    if (modal) modal.classList.remove('open');

    // Reset steps when closing.
    const stepLang = document.getElementById('welcomeStepLang');
    const stepCurrencies = document.getElementById('welcomeStepCurrencies');
    const stepTourChoice = document.getElementById('welcomeStepTourChoice');
    const stepNerdTrack = document.getElementById('welcomeStepNerdTrack');
    const stepShowcaseMsg = document.getElementById('welcomeStepShowcaseMsg');
    const stepTourUseCase = document.getElementById('welcomeStepTourUseCase');
    if (stepLang) stepLang.style.display = '';
    if (stepCurrencies) stepCurrencies.style.display = 'none';
    if (stepTourChoice) stepTourChoice.style.display = 'none';
    if (stepNerdTrack) stepNerdTrack.style.display = 'none';
    if (stepShowcaseMsg) stepShowcaseMsg.style.display = 'none';
    if (stepTourUseCase) stepTourUseCase.style.display = 'none';
  };

  function showWelcomeStep(step) {
    const stepLang = document.getElementById('welcomeStepLang');
    const stepCurrencies = document.getElementById('welcomeStepCurrencies');
    const stepTourChoice = document.getElementById('welcomeStepTourChoice');
    const stepNerdTrack = document.getElementById('welcomeStepNerdTrack');
    const stepShowcaseMsg = document.getElementById('welcomeStepShowcaseMsg');
    const stepTourUseCase = document.getElementById('welcomeStepTourUseCase');
    if (stepLang) stepLang.style.display = step === 'lang' ? '' : 'none';
    if (stepCurrencies) stepCurrencies.style.display = step === 'currencies' ? '' : 'none';
    if (stepTourChoice) stepTourChoice.style.display = step === 'tourChoice' ? '' : 'none';
    if (stepNerdTrack) stepNerdTrack.style.display = step === 'nerdTrack' ? '' : 'none';
    if (stepShowcaseMsg) stepShowcaseMsg.style.display = step === 'showcaseMsg' ? '' : 'none';
    if (stepTourUseCase) stepTourUseCase.style.display = step === 'tourUseCase' ? '' : 'none';
  }

  window.goWelcomeToCurrencies = function () {
    // In this demo flow, we show guided tour choice first.
    showWelcomeStep('tourChoice');
  };

  window.applyWelcomeSetup = function () {
    const lang = document.getElementById('welcomeLang')?.value || 'en';
    const selected = Array.from(document.querySelectorAll('#welcomeCurrencies .ccy-pill.on'))
      .map(x => x.dataset?.ccy).filter(Boolean);
    const primary = document.getElementById('welcomePrimary')?.value || selected[0] || 'USDw';

    localStorage.setItem('stables_welcome_done_v1', '1');
    localStorage.setItem('stables_lang_pref', lang);

    // Apply selected currencies to the Settings pills.
    const pills = Array.from(document.querySelectorAll('#ccyDisplayPills .ccy-pill'));
    pills.forEach(p => {
      const code = p.dataset?.ccy;
      const shouldOn = selected.includes(code);
      if (!code) return;
      if (shouldOn && !p.classList.contains('on') && typeof window.toggleCcyPill === 'function') window.toggleCcyPill(p);
      if (!shouldOn && p.classList.contains('on') && typeof window.toggleCcyPill === 'function') window.toggleCcyPill(p);
    });

    if (typeof window.setPrimary === 'function') window.setPrimary(primary, true);

    // Continue inside the same modal to show the showcase disclaimer.
    showWelcomeStep('showcaseMsg');
  };

  window.updateWelcomeLanguage = function () {
    const lang = document.getElementById('welcomeLang')?.value || 'en';
    const stepLangWrap = document.getElementById('welcomeStepLang');
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (stepLangWrap) stepLangWrap.setAttribute('dir', dir);

    const elTitle = document.getElementById('welcomeTitle');
    const elIntro = document.getElementById('welcomeIntroCopy');
    const elShowcase = document.getElementById('welcomeShowcaseCopy');
    const elTourBody = document.getElementById('welcomeTourBody');
    const elTourMerchantBtn = document.getElementById('welcomeTourMerchantBtn');
    const elTourPersonBtn = document.getElementById('welcomeTourPersonBtn');
    const elTourNerdBtn = document.getElementById('welcomeTourNerdBtn');
    const elExploreBtn = document.getElementById('welcomeExploreBtn');
    const elUseTitle = document.getElementById('welcomeUseTitle');
    const elUsePrompt = document.getElementById('welcomeUsePrompt');
    const elPersonalBtn = document.getElementById('welcomePersonalBtn');
    const elMerchantBtn = document.getElementById('welcomeMerchantBtn');
    const elShowcaseHereBtn = document.getElementById('welcomeShowcaseHereBtn');
    const elShowcaseNodeBtn = document.getElementById('welcomeShowcaseNodeBtn');
    // This element may not exist after copy/layout updates.
    const elShowcaseFinalMsg = document.getElementById('welcomeShowcaseFinalMsg');

    const elNerdTrackTitle = document.getElementById('welcomeNerdTrackTitle');
    const elNerdTrackBody = document.getElementById('welcomeNerdTrackBody');
    const elNerdTrackTechBtn = document.getElementById('welcomeNerdTrackTechBtn');
    const elNerdTrackFinanceBtn = document.getElementById('welcomeNerdTrackFinanceBtn');

    if (!elTitle || !elIntro) return;

    const copy = {
      en: {
        title: 'We’re really happy you’re here.',
        intro:
          'Congratulations on becoming your own bank. This gives you great possibilities, and with it, real responsibilities. Don’t worry, we’re a community that supports each other. Look around now, and we’ll help you secure your setup properly.',
        showcase:
          'Showcase prototype.\n\nRelease objective (community first):\nTransparency with the Stables community.\nShow what the core dev team is working on.\nMost importantly, get your feedback.\n\nHave a look, then reach out to us on Telegram:\nOpen More, then Help, Feedback to access the Telegram link.\n\nPrototype note:\nGuided tours will be added in a following prototype version.\nFor now, everything in the app is plain English.\nYou can of course talk with the StablesAgent in the language of your choice.\nYou can also add this app to your node by downloading the MDS zip from GitHub.\n\nRelease notes and the MDS zip: in Settings, use the Settings and updates section at the top.',
        tourBody: 'Choose how you want the StablesAgent to guide you in this demo.',
        tourMerchantBtn: 'I\'m a merchant. I want to know how this will streamline my business process.',
        tourPersonBtn: 'I\'m a person. I want to understand what I\'ll be able to do with my own bank.',
        tourNerdBtn: 'I\'m a nerd. I want to understand how this holds together.',
        nerdTrackTitle: 'Pick your nerd deep dive',
        nerdTrackBody: 'Choose what you want to inspect first in this demo.',
        nerdTrackTechBtn: 'Tech + blockchain',
        nerdTrackFinanceBtn: 'Financial side: how Stables is structured and ensures the peg',
        exploreBtn: 'I\'m a viewer. I want to look around.',
        showcaseHereBtn: 'Continue the visit here',
        showcaseNodeBtn: 'I can\'t wait to see it in my node',
        showcaseFinalMsg: 'See you back in your node.',
        useTitle: 'How will you mainly use the app?',
        usePrompt: 'Personal or merchant?',
        personalBtn: 'Personal',
        merchantBtn: 'Merchant'
      },
      'en-edgy': {
        title: 'You made it. We’re seriously stoked you’re here.',
        intro:
          'Congratulations on becoming your own bank. You get real possibilities, and yes, real responsibilities too. No worries, we’ve got your back. Look around, then we’ll help you secure your setup properly.',
        showcase:
          'Showcase prototype.\n\nRelease objective (no fluff):\nBe transparent with the Stables community.\nShow what the core dev team is working on.\nMost importantly, get your feedback.\n\nHave a look, then reach out to us on Telegram:\nOpen More, then Help, Feedback to access the Telegram link.\n\nPrototype note:\nGuided tours will be added in a following prototype version.\nFor now, everything in the app is plain English.\nYou can of course talk with the StablesAgent in the language of your choice.\nYou can also add this app to your node by downloading the MDS zip from GitHub.\n\nRelease notes and the MDS zip: in Settings, use the Settings and updates section at the top.',
        tourBody: 'Choose how you want the StablesAgent to guide you in this demo.',
        tourMerchantBtn: 'I\'m a merchant. I want to know how this shit will streamline my business process.',
        tourPersonBtn: 'I\'m a person. I want to understand what I\'ll be able to do with my own bank.',
        tourNerdBtn: 'I\'m a nerd. I want to know how this shit holds.',
        nerdTrackTitle: 'Pick your nerd deep dive',
        nerdTrackBody: 'Choose what you want to inspect first in this demo.',
        nerdTrackTechBtn: 'Tech + blockchain',
        nerdTrackFinanceBtn: 'Financial side: how Stables is structured and ensures the peg',
        exploreBtn: 'I\'m a viewer. I want to look around.',
        showcaseHereBtn: 'Continue the visit here',
        showcaseNodeBtn: 'I can\'t wait to see it in my node',
        showcaseFinalMsg: 'See you back in your node.',
        useTitle: 'How will you mainly use the app?',
        usePrompt: 'Personal or merchant?',
        personalBtn: 'Personal',
        merchantBtn: 'Merchant'
      },
      fr: {
        title: 'On est vraiment heureux que vous soyez là.',
        intro:
          'Félicitations, vous devenez votre propre banque. Cela vous ouvre de grandes possibilités, avec de vraies responsabilités. Ne vous inquiétez pas: nous sommes une communauté qui se soutient. Jetez un coup d’œil, puis nous vous aiderons à sécuriser votre configuration correctement.',
        showcase:
          'Prototype vitrine. Pour l’instant, il n’y a pas de vraie fonctionnalité (c’est juste une démo). Ce n’est pas branché à la blockchain. Imaginez une voiture prototype au salon auto: vous pouvez regarder à travers les vitres et poser des questions, mais les portes ne s’ouvrent pas et il n’y a pas de moteur sous le capot. Par contre, StablesAgent est là… et il peut répondre à une bonne partie des questions. Les visites guidées seront ajoutées dans une prochaine version du prototype. Pour le moment, toute l’interface de l’app est en anglais simple. Tu peux bien sur parler avec le StablesAgent dans la langue de ton choix. Tu peux aussi ajouter cette app à ton node en téléchargeant le zip MDS depuis GitHub.',
        tourBody: 'Choisissez comment vous voulez être guidé par le StablesAgent dans cette démo.',
        tourMerchantBtn: "Je suis un commerçant. Je veux savoir comment ça va révolutionner mes processus d’affaires.",
        tourPersonBtn: "Je suis une personne. Je veux connaître la meilleure façon de faire tourner ma propre banque.",
        tourNerdBtn: "Je suis un nerd. Je veux comprendre comment tout ça tient.",
        nerdTrackTitle: 'Choisis ton deep dive de nerd',
        nerdTrackBody: 'Qu’est-ce que tu veux inspecter en premier dans cette démo ?',
        nerdTrackTechBtn: 'Tech + blockchain',
        nerdTrackFinanceBtn: 'Côté financier: comment Stables est structuré et garde le peg',
        exploreBtn: "Je suis juste un spectateur. Je veux regarder.",
        showcaseHereBtn: 'Continuer la visite ici',
        showcaseNodeBtn: "Je suis trop impatient de le voir dans mon node",
        showcaseFinalMsg: 'A bientot dans ton node.',
        useTitle: "Comment allez-vous surtout utiliser l’app?",
        usePrompt: 'Personnel ou commerce?',
        personalBtn: 'Personnel',
        merchantBtn: 'Commerce'
      },
      'fr-CA': {
        title: 'On est vraiment contents que tu sois là.',
        intro:
          'Félicitations d’être devenu ta propre banque. Ça te donne de grandes possibilités, et avec ça, des responsabilités bien réelles. Pas de stress: on est une communauté qui s’entraide. Jette un coup d’œil maintenant, puis on t’aide à sécuriser ton setup correctement.',
        showcase:
          'Prototype vitrine. Pour l’instant, il n’y a pas de vraie fonctionnalité (c’est juste une démo). Ce n’est pas branché à la blockchain. Imagine une voiture prototype au salon auto: tu peux regarder à travers les vitres et poser des questions, mais les portes ne s’ouvrent pas et y’a pas de moteur sous le capot. Par contre, StablesAgent est là… et il peut répondre à une bonne partie des questions. Les visites guidées seront ajoutées dans une prochaine version du prototype. Pour le moment, toute l’interface de l’app est en anglais simple. Tu peux bien sur parler avec le StablesAgent dans la langue de ton choix. Tu peux aussi ajouter cette app à ton node en téléchargeant le zip MDS depuis GitHub.',
        tourBody: 'Choisis comment tu veux être guidé par le StablesAgent dans cette démo.',
        tourMerchantBtn: "Je suis un commerçant. Je veux savoir comment ça va révolutionner mes processus d’affaires.",
        tourPersonBtn: "Je suis une personne. Je veux connaître la meilleure façon de faire tourner ta propre banque.",
        tourNerdBtn: "Je suis un nerd. Je veux comprendre comment tout ça tient.",
        nerdTrackTitle: 'Choisis ton deep dive de nerd',
        nerdTrackBody: 'Qu’est-ce que tu veux inspecter en premier dans cette démo ?',
        nerdTrackTechBtn: 'Tech + blockchain',
        nerdTrackFinanceBtn: 'Côté financier: comment Stables est structuré et garde le peg',
        exploreBtn: "Je suis juste un spectateur. Je veux regarder.",
        showcaseHereBtn: 'Continuer la visite ici',
        showcaseNodeBtn: "Je suis trop impatient de le voir dans mon node",
        showcaseFinalMsg: 'A bientot dans ton node.',
        useTitle: "Comment tu vas surtout utiliser l’app?",
        usePrompt: 'Plutôt personnel ou commerçant?',
        personalBtn: 'Personnel',
        merchantBtn: 'Commerçant'
      },
      es: {
        title: 'Nos encanta que estés aquí.',
        intro:
          'Felicidades por convertirte en tu propia banca. Esto te da grandes posibilidades, y con ello, responsabilidades reales. No te preocupes: somos una comunidad que se apoya. Mira alrededor ahora y te ayudaremos a asegurar tu configuración correctamente.',
        showcase:
          'Prototipo de vitrina. Por ahora no hay funcionalidad real (solo es para demostración). No está conectada a la blockchain. Imagina un auto prototipo en una expo: puedes mirar por las ventanas y hacer preguntas, pero no hay motor bajo el capó y las puertas no se abren. El StablesAgent sí funciona y puede responder muchas preguntas sobre Stables. Las visitas guiadas se añadirán en una próxima versión de este prototipo. Por ahora, toda la interfaz de la app esta en inglés simple. Puedes por supuesto hablar con el StablesAgent en el idioma que elijas. También puedes agregar esta app a tu nodo descargando el zip MDS desde GitHub.',
        tourBody: 'Elige cómo quieres que el StablesAgent te guíe en esta demo.',
        tourMerchantBtn: 'Soy un comerciante. Quiero saber cómo esto va a revolucionar mi proceso de negocio.',
        tourPersonBtn: 'Soy una persona. Quiero saber la mejor manera de dirigir mi propia banca.',
        tourNerdBtn: 'Soy un nerd. Quiero entender cómo todo se mantiene unido.',
        nerdTrackTitle: 'Tu deep dive de nerd',
        nerdTrackBody: 'Elige qué quieres inspeccionar primero en esta demo.',
        nerdTrackTechBtn: 'Tech + blockchain',
        nerdTrackFinanceBtn: 'Lado financiero: cómo Stables está estructurado y mantiene el peg',
        exploreBtn: 'Soy solo un espectador. Quiero mirar.',
        showcaseHereBtn: 'Continuar la visita aquí',
        showcaseNodeBtn: 'No puedo esperar para verlo en mi nodo',
        showcaseFinalMsg: 'Nos vemos de vuelta en tu nodo.',
        useTitle: '¿Cómo usarás principalmente la app?',
        usePrompt: '¿Personal o comercio?',
        personalBtn: 'Personal',
        merchantBtn: 'Comercio'
      },
      ar: {
        title: 'يسعدنا أنك هنا.',
        intro:
          'مبروك على أن أصبحت بنكك الخاص. هذا يفتح أمامك إمكانيات كبيرة, ومعها مسؤوليات حقيقية. لا تقلق: نحن مجتمع يدعم بعضه. تفقّد كل شيء الآن وسنساعدك على تأمين حسابك بالشكل الصحيح.',
        showcase:
          'نسخة تجريبية للعرض فقط. لا توجد وظائف حقيقية حالياً (إنها مجرد عرض). وهذه النسخة غير متصلة بسلسلة البلوكشين. تخيّل سيارة نموذجية في معرض سيارات: يمكنك النظر من خلال النوافذ وطرح الأسئلة، لكن الأبواب لا تُفتح ولا يوجد محرك تحت الغطاء. لكن StablesAgent يعمل, ويمكنه الإجابة على مجموعة كبيرة من أسئلة Stables. ستتم إضافة الجولات الإرشادية في نسخة بروتوتايب قادمة. في الوقت الحالي، كل واجهة التطبيق باللغة الإنجليزية فقط. يمكنك بالطبع التحدث مع StablesAgent باللغة التي تختارها. يمكنك كذلك إضافة هذا التطبيق إلى عقدتك عن طريق تنزيل ملف MDS zip من GitHub.',
        tourBody: 'اختر كيف تريد أن يوجهك StablesAgent في هذه التجربة.',
        tourMerchantBtn: 'أنا صاحب متجر. أريد أن أعرف كيف سيثور هذا سير عملي.',
        tourPersonBtn: 'أنا شخص. أريد أن أعرف أفضل طريقة لإدارة بنكي الخاص.',
        tourNerdBtn: 'أنا شخص فضولي. أريد أن أفهم كيف يتماسك كل هذا.',
        nerdTrackTitle: 'اختر غوصة نيرد',
        nerdTrackBody: 'اختر ماذا تريد فحصه أولاً في هذه التجربة.',
        nerdTrackTechBtn: 'التقنية + البلوكشين',
        nerdTrackFinanceBtn: 'الجانب المالي: كيف يتم هيكلة Stables وكيف يحافظ على peg',
        exploreBtn: 'أنا مجرد متفرج. أريد فقط أن ألقي نظرة.',
        showcaseHereBtn: 'كمّل الزيارة هنا',
        showcaseNodeBtn: 'لا أطيق الانتظار لرؤيته في عقدتي',
        showcaseFinalMsg: 'أراك مرة أخرى في عقدتك.',
        useTitle: 'كيف ستستخدم التطبيق غالباً؟',
        usePrompt: 'شخصي أم متجر؟',
        personalBtn: 'شخصي',
        merchantBtn: 'متجر'
      },
      hi: {
        title: 'आप आ गए. Stables में आपका स्वागत है!',
        intro:
          'बधाई हो, अब आप अपने खुद के बैंक बन गए हैं। इससे आपको शानदार संभावनाएँ मिलती हैं, और साथ में बड़ी जिम्मेदारियाँ भी। चिंता न करें, हम एक सपोर्टिंग कम्युनिटी हैं। इधर-उधर देखें, फिर हम आपकी सेटअप को सही तरीके से सुरक्षित करने में मदद करेंगे।',
        showcase:
          'यह एक शोकेस प्रोटोटाइप है। अभी वास्तविक कार्यक्षमता नहीं है (यह सिर्फ डेमो है)। यह ब्लॉकचेन से कनेक्टेड नहीं। कार शो में रखी एक प्रोटोटाइप कार जैसी कल्पना करें: आप खिड़कियों से देख सकते हैं और सवाल पूछ सकते हैं, लेकिन दरवाज़े नहीं खुलते और हुड के नीचे इंजन नहीं है। फिर भी StablesAgent काम करता है और Stables पर बहुत सारे सवालों के जवाब दे सकता है। अगले प्रोटोटाइप वर्जन में गाइडेड टूर जोड़े जाएंगे। अभी के लिए, ऐप की पूरी UI सिर्फ साधारण English में है। आप जरूर StablesAgent से अपनी पसंद की भाषा में बात कर सकते हैं। आप GitHub से MDS zip डाउनलोड करके इस ऐप को अपने नोड में भी जोड़ सकते हैं।',
        tourBody: 'इस डेमो में आप चाहते हैं कि StablesAgent आपको कैसे गाइड करे, वो चुनें।',
        tourMerchantBtn: 'मैं एक मर्चेंट हूं. मैं जानना चाहता हूं कि यह मेरे बिजनेस प्रोसेस को कैसे बदल देगा.',
        tourPersonBtn: 'मैं एक इंसान हूं. मैं जानना चाहता हूं कि अपना खुद का बैंक चलाने का सबसे अच्छा तरीका क्या है.',
        tourNerdBtn: 'मैं एक nerd हूं. मैं समझना चाहता हूं कि यह सब कैसे टिकता है.',
        nerdTrackTitle: 'नर्ड वाला डीप डाइव चुनें',
        nerdTrackBody: 'इस डेमो में आप पहले क्या समझना चाहते हैं?',
        nerdTrackTechBtn: 'टेक + ब्लॉकचेन',
        nerdTrackFinanceBtn: 'वित्तीय पक्ष: Stables कैसे structured है और peg कैसे सुनिश्चित करता है',
        exploreBtn: 'मैं बस एक दर्शक हूं. मैं बस देखना चाहता हूं.',
        showcaseHereBtn: 'यहीं विजिट जारी रखें',
        showcaseNodeBtn: 'इंतजार नहीं कर सकता, इसे अपने नोड में देखना है',
        showcaseFinalMsg: 'फिर मिलते हैं, अपने नोड में.',
        useTitle: 'आप ऐप का मुख्य रूप से कैसे उपयोग करेंगे?',
        usePrompt: 'पर्सनल या मर्चेंट?',
        personalBtn: 'पर्सनल',
        merchantBtn: 'मर्चेंट'
      },
      zh: {
        title: '很高兴你来到 Stables。',
        intro:
          '恭喜你成为自己的银行。你将拥有很大的可能性，同时也要承担真实的责任。别担心，我们是一个互相支持的社区。现在先四处看看，我们会帮你把设置安全地完成好。',
        showcase:
          '展示用原型。当前没有真实功能（仅用于演示），并未连接到区块链。把它想象成车展上的原型车：你可以透过车窗看进去、提出问题，但车门不会打开，机舱下面也没有发动机。不过 StablesAgent 是可以用的，而且能回答一大批 Stables 相关问题。后续原型版本会加入导览功能。就目前而言，应用界面全部是简单英文。你当然可以选择你想用的语言来和 StablesAgent 交流。你也可以通过从 GitHub 下载 MDS zip 来把这个应用加入到你的节点。',
        tourBody: '在这个演示里，选择你想让 StablesAgent 怎么带你看。',
        tourMerchantBtn: '我是商户。我想知道这会如何改变我的业务流程。',
        tourPersonBtn: '我是个人。我想知道运营自己的银行的最佳方式。',
        tourNerdBtn: '我是技术宅。我想弄明白这一切是怎么“撑住”的。',
        nerdTrackTitle: '选择你的技术宅深度',
        nerdTrackBody: '在这个演示里，你想先看什么？',
        nerdTrackTechBtn: '技术 + 区块链',
        nerdTrackFinanceBtn: '金融侧: Stables 的结构以及它如何确保 peg',
        exploreBtn: '我是个观众。我想看看。',
        showcaseHereBtn: '继续在这里参观',
        showcaseNodeBtn: '迫不及待想在我的节点里看到它',
        showcaseFinalMsg: '回到你的节点，我们再见。',
        useTitle: '你主要会怎么使用这个应用？',
        usePrompt: '个人还是商户？',
        personalBtn: '个人',
        merchantBtn: '商户'
      }
    };

    const c = copy[lang] || copy.en;
    elTitle.textContent = c.title;
    elIntro.textContent = c.intro;
    if (elShowcase) elShowcase.textContent = c.showcase;
    if (elTourBody) elTourBody.textContent = c.tourBody;
    if (elExploreBtn) elExploreBtn.textContent = c.exploreBtn;
    if (elTourMerchantBtn) elTourMerchantBtn.textContent = c.tourMerchantBtn;
    if (elTourPersonBtn) elTourPersonBtn.textContent = c.tourPersonBtn;
    if (elTourNerdBtn) elTourNerdBtn.textContent = c.tourNerdBtn;
    if (elUseTitle) elUseTitle.textContent = c.useTitle;
    if (elUsePrompt) elUsePrompt.textContent = c.usePrompt;
    if (elPersonalBtn) elPersonalBtn.textContent = c.personalBtn;
    if (elMerchantBtn) elMerchantBtn.textContent = c.merchantBtn;
    if (elShowcaseHereBtn) elShowcaseHereBtn.textContent = c.showcaseHereBtn;
    if (elShowcaseNodeBtn) elShowcaseNodeBtn.textContent = c.showcaseNodeBtn;
    if (elShowcaseFinalMsg) elShowcaseFinalMsg.textContent = c.showcaseFinalMsg;

    if (elNerdTrackTitle) elNerdTrackTitle.textContent = c.nerdTrackTitle;
    if (elNerdTrackBody) elNerdTrackBody.textContent = c.nerdTrackBody;
    if (elNerdTrackTechBtn) elNerdTrackTechBtn.textContent = c.nerdTrackTechBtn;
    if (elNerdTrackFinanceBtn) elNerdTrackFinanceBtn.textContent = c.nerdTrackFinanceBtn;
  };

  window.setWelcomeTourChoice = function (choice) {
    const c = String(choice || '').trim();
    localStorage.setItem('stables_welcome_tour_choice_v1', c);
    if (c === 'nerd') {
      showWelcomeStep('nerdTrack');
      return;
    }

    // Merchant, person, explore: go straight to the currency setup.
    showWelcomeStep('currencies');
  };

  window.setWelcomeNerdTrack = function (track) {
    const t = String(track || '').trim();
    localStorage.setItem('stables_welcome_nerd_track_v1', t);
    showWelcomeStep('currencies');
  };

  window.openStablesMdsZipFromWelcome = function () {
    // Remember that the user took the fast path so the next real-node run can show a special message.
    try {
      localStorage.setItem('stables_showcase_install_intent_v1', '1');
    } catch (_) {}

    if (typeof window.closeWelcomeSetup === 'function') window.closeWelcomeSetup();

    const url = window.STABLES_CONFIG?.MDS_ZIP_URL;
    if (!url) {
      if (typeof window.showToast === 'function') window.showToast('Download link not set', 'Ask Charles to set MDS_ZIP_URL in runtime-config.js.');
      return;
    }
    window.open(url, '_blank');
  };

  window.setWelcomeUseCase = function (useCase) {
    const u = String(useCase || '').trim();
    localStorage.setItem('stables_welcome_use_case_v1', u);
    window.closeWelcomeSetup();
    if (typeof window.showToast === 'function') window.showToast('Setup saved');
  };

  setTimeout(() => {
    if (typeof window.renderCouncilCommunicationPanels === 'function') window.renderCouncilCommunicationPanels();
  }, 50);

  // Initialize reminders once.
  setTimeout(() => window.checkBackupReminder(), 1600);
  setTimeout(() => window.renderWalletRecentActivity(), 650);
  setTimeout(() => { if (typeof window.refreshSpendShopCards === 'function') window.refreshSpendShopCards(); }, 400);
  setTimeout(() => {
    window.updateWelcomePrimaryOptions();
    const modal = document.getElementById('welcomeSetupModal');
    if (modal) modal.classList.add('open');
    showWelcomeStep('lang');
    if (typeof window.updateWelcomeLanguage === 'function') window.updateWelcomeLanguage();
  }, 700);
})();

