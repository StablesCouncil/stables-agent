function renderFeedback(ctx) {
  const { $, app, setHeaderButtons, showToast } = ctx;

  // ✅ LIBRARY COMPLIANT: No page title/description
  $('pageTitle').textContent = '';
  $('pageDesc').textContent = '';
  setHeaderButtons([]);

  // ✅ LIBRARY COMPLIANT: Main container with gap: 14px (removed .row and .card)
  app.innerHTML = `
    <div style="display:grid; gap:14px;">
      <!-- Bug Report -->
      <div>
        <label for="bug" style="display: block; color: var(--muted); font-size: 12px; margin-bottom: 6px;">Report Issue</label>
        <!-- ✅ Textarea: standard styling from CSS -->
        <textarea id="bug" placeholder="Describe the issue and steps to reproduce..." style="min-height: 120px;"></textarea>
        <!-- ✅ BTN-001: Primary button -->
        <button class="primary" id="sendBug" style="padding: 16px; font-size: 16px; font-weight: 900; width: 100%; margin-top: 10px;">Submit</button>
      </div>

      <!-- Divider -->
      <div class="hr"></div>

      <!-- Scenario Suggestion -->
      <div>
        <label for="scenario" style="display: block; color: var(--muted); font-size: 12px; margin-bottom: 6px;">Suggest Test Scenario</label>
        <textarea id="scenario" placeholder="Example: deposit, mint near cap, burn, then send mUSD..." style="min-height: 120px;"></textarea>
        <button class="primary" id="sendScenario" style="padding: 16px; font-size: 16px; font-weight: 900; width: 100%; margin-top: 10px;">Submit</button>
      </div>
    </div>
  `;

  $('sendBug').onclick = () => { showToast('Feedback', 'Issue submitted.'); $('bug').value = ''; };
  $('sendScenario').onclick = () => { showToast('Feedback', 'Scenario submitted.'); $('scenario').value = ''; };
}

window.StablesRoutes = window.StablesRoutes || {}; \nwindow.StablesRoutes.renderFeedback = renderFeedback;




