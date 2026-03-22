const FEEDBACK_TELEGRAM_BLOCK = `
    <div style="padding:14px 14px;border-radius:14px;background:rgba(0,0,0,.22);border:1px solid rgba(103,232,249,.12)">
      <div style="font-size:14px;font-weight:900;color:var(--accent);margin-bottom:12px">Telegram</div>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;font-weight:800;color:var(--muted)">
        There are two ways to reach us, both on Telegram. Use the button below to open the Stables community: share feedback there with everyone and join the discussion. To contact the core dev team in private, open Telegram and start a chat with <strong style="color:var(--t)">@stablescouncil</strong>.
      </p>
      <a href="https://t.me/stablescommunity" id="feedbackTelegramMain" target="_blank" rel="noopener"
        class="btn btn-w"
        style="display:block;width:100%;text-align:center;text-decoration:none;box-sizing:border-box;padding:16px 18px;font-size:15px;font-weight:900;border-radius:16px;border:1px solid rgba(103,232,249,.3);background:linear-gradient(135deg, rgba(103,232,249,0.35), rgba(167,139,250,0.35));color:rgba(255,255,255,.96);box-shadow:0 0 20px rgba(103,232,249,0.18)">
        Open Stables on Telegram: t.me/stablescommunity
      </a>
    </div>
  `;

function renderFeedback(ctx) {
  const { $, app, setHeaderButtons } = ctx;

  $('pageTitle').textContent = '';
  $('pageDesc').textContent = '';
  setHeaderButtons([]);

  app.innerHTML = `<div style="display:grid; gap:14px;">${FEEDBACK_TELEGRAM_BLOCK}</div>`;
}

window.StablesRoutes = window.StablesRoutes || {};
window.StablesRoutes.renderFeedback = renderFeedback;

window.renderFeedbackPage = function renderFeedbackPage() {
  const root = document.getElementById('feedbackApp');
  if (!root) return;
  root.innerHTML = FEEDBACK_TELEGRAM_BLOCK;
};
