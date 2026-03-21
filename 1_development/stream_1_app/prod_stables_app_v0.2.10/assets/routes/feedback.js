function renderFeedback(ctx) {
  const { $, app, setHeaderButtons, showToast } = ctx;

  // ✅ LIBRARY COMPLIANT: No page title/description
  $('pageTitle').textContent = '';
  $('pageDesc').textContent = '';
  setHeaderButtons([]);

  // ✅ LIBRARY COMPLIANT: Main container with gap: 14px (removed .row and .card)
  app.innerHTML = `
    <div style="display:grid; gap:14px;">
      <div style="padding:14px 14px;border-radius:14px;background:rgba(0,0,0,.22);border:1px solid rgba(103,232,249,.12)">
        <div class="xs mu" style="font-size:14px;font-weight:900;color:var(--accent);margin-bottom:6px">Telegram community feedback</div>
        <div class="xs mu" style="margin:0 0 10px;color:var(--muted);line-height:1.45;font-size:13px;font-weight:800;text-align:left">
          Join the Stables community on Telegram and share your feedback with everyone.
        </div>
        <a href="https://t.me/stablescommunity" target="_blank" rel="noopener"
          style="display:block;text-align:center;padding:16px;font-size:16px;font-weight:900;width:100%;border-radius:16px;border:1px solid rgba(103,232,249,.3);background:linear-gradient(135deg, rgba(103,232,249,0.3), rgba(167,139,250,0.3));color:rgba(255,255,255,.95);text-decoration:none;box-shadow:0 0 18px rgba(103,232,249,0.15);margin-bottom:10px">
          t.me/stablescommunity
        </a>
        <div class="xs mu" style="margin:0 0 6px;color:var(--muted);line-height:1.45;font-size:13px;font-weight:800;text-align:left">
          Or reach the core dev team directly:
        </div>
        <a href="https://t.me/stablescouncil" target="_blank" rel="noopener"
          style="display:block;text-align:center;padding:16px;font-size:16px;font-weight:900;width:100%;border-radius:16px;border:1px solid rgba(103,232,249,.3);background:linear-gradient(135deg, rgba(103,232,249,0.3), rgba(167,139,250,0.3));color:rgba(255,255,255,.95);text-decoration:none;box-shadow:0 0 18px rgba(103,232,249,0.15)">
          https://t.me/stablescouncil
        </a>
      </div>

      <!-- Bug Report -->
      <div>
        <label for="bug" style="display: block; color: var(--muted); font-size: 13px; margin-bottom: 6px;">Report Issue</label>
        <!-- ✅ Textarea: standard styling from CSS -->
        <textarea id="bug" placeholder="Describe the issue and steps to reproduce..." style="min-height: 120px;"></textarea>
        <!-- ✅ BTN-001: Primary button -->
        <button class="primary" id="sendBug" style="padding: 16px; font-size: 16px; font-weight: 900; width: 100%; margin-top: 10px;">Submit</button>
      </div>

      <!-- Divider -->
      <div class="hr"></div>

      <!-- Scenario Suggestion -->
      <div>
        <label for="scenario" style="display: block; color: var(--muted); font-size: 13px; margin-bottom: 6px;">Suggest Test Scenario</label>
        <textarea id="scenario" placeholder="Example: deposit, mint near cap, burn, then send mUSD..." style="min-height: 120px;"></textarea>
        <button class="primary" id="sendScenario" style="padding: 16px; font-size: 16px; font-weight: 900; width: 100%; margin-top: 10px;">Submit</button>
      </div>
    </div>
  `;

  $('sendBug').onclick = () => { showToast('Feedback', 'Issue submitted.'); $('bug').value = ''; };
  $('sendScenario').onclick = () => { showToast('Feedback', 'Scenario submitted.'); $('scenario').value = ''; };
}

window.StablesRoutes = window.StablesRoutes || {}; \nwindow.StablesRoutes.renderFeedback = renderFeedback;

// Standalone renderer for this MiniDapp build.
// This project’s `index.html` navigation does not use the `assets/app.js` routing layer,
// so we render directly into `#feedbackApp` when the page is opened.
window.renderFeedbackPage = function renderFeedbackPage() {
  const root = document.getElementById('feedbackApp');
  if (!root) return;

  root.innerHTML = `
    <div style="display:grid; gap:14px;">
      <!-- Telegram community link -->
      <div style="padding:14px 14px;border-radius:14px;background:rgba(0,0,0,.22);border:1px solid rgba(103,232,249,.12)">
        <a href="https://t.me/stablescommunity" target="_blank" rel="noopener"
          style="display:block;text-align:center;padding:16px;font-size:16px;font-weight:900;width:100%;border-radius:16px;border:1px solid rgba(103,232,249,.3);background:linear-gradient(135deg, rgba(103,232,249,0.3), rgba(167,139,250,0.3));color:rgba(255,255,255,.95);text-decoration:none;box-shadow:0 0 18px rgba(103,232,249,0.15)">
          t.me/stablescommunity
        </a>
      </div>

      <!-- Bug Report -->
      <div>
        <label for="bug" style="display: block; color: var(--muted); font-size: 13px; margin-bottom: 6px;">Report Issue</label>
        <textarea id="bug" placeholder="Describe the issue and steps to reproduce..." style="min-height: 120px;"></textarea>
        <button id="sendBug" style="padding: 16px; font-size: 16px; font-weight: 900; width: 100%; margin-top: 10px;" class="primary">Submit</button>
      </div>

      <div class="hr"></div>

      <!-- Scenario Suggestion -->
      <div>
        <label for="scenario" style="display: block; color: var(--muted); font-size: 13px; margin-bottom: 6px;">Suggest Test Scenario</label>
        <textarea id="scenario" placeholder="Example: deposit, mint near cap, burn, then send mUSD..." style="min-height: 120px;"></textarea>
        <button id="sendScenario" style="padding: 16px; font-size: 16px; font-weight: 900; width: 100%; margin-top: 10px;" class="primary">Submit</button>
      </div>
    </div>
  `;

  const showToastLocal = (msg) => {
    if (typeof window.showToast === 'function') window.showToast(msg);
  };

  const bugEl = document.getElementById('bug');
  const scenarioEl = document.getElementById('scenario');
  const sendBug = document.getElementById('sendBug');
  const sendScenario = document.getElementById('sendScenario');

  if (sendBug) {
    sendBug.onclick = () => {
      showToastLocal('Feedback submitted');
      if (bugEl) bugEl.value = '';
    };
  }
  if (sendScenario) {
    sendScenario.onclick = () => {
      showToastLocal('Feedback submitted');
      if (scenarioEl) scenarioEl.value = '';
    };
  }
};




