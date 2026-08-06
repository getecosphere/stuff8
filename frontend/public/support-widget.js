/*!
 * support-widget.js — plug-and-play RAG support chat widget.
 *
 * Drop-in for ANY page (Astro, SvelteKit, Next, plain HTML). One file,
 * zero framework dependencies, fully self-contained styles via Shadow DOM.
 *
 * Usage — via script attributes (recommended):
 *   <script src="/support-widget.js"
 *           data-rag-url="/api/rag"
 *           data-site-name="Stuff8"
 *           data-require-login="true"
 *           data-signin-url="/auth/signin/"
 *           data-signup-url="/auth/signup/"
 *           data-session-mode="localStorage"
 *           data-session-key="stuff8_session"
 *           defer></script>
 *
 * Or — via a global config object placed BEFORE the script tag:
 *   window.SupportWidgetConfig = { ragUrl: '/api/rag', siteName: 'Stuff8', ... };
 *   <script src="/support-widget.js" defer></script>
 *
 * Session detection (data-session-mode):
 *   - "localStorage" (default): reads window.localStorage[sessionKey], expects
 *     an object shaped { user: { id, name?, username? } }.
 *   - "windowGlobal": reads window[sessionKey], expects
 *     { id | userId | user: { id }, name? | username? }.
 *   - "none": chat is open to everyone (no login gate).
 *
 * Chat is posted to `${ragUrl}/chat` as JSON
 *   { question, session_id, user_id }
 * and the raw `answer` text is rendered. No source links are shown.
 */
(function () {
  'use strict';

  if (window.__SUPPORT_WIDGET_LOADED__) return;
  window.__SUPPORT_WIDGET_LOADED__ = true;

  function readScriptConfig() {
    var script = document.currentScript || (function () {
      var s = document.querySelectorAll('script[data-rag-url]');
      return s[s.length - 1] || null;
    })();
    var attr = function (name) { return script && script.getAttribute(name); };
    var global = window.SupportWidgetConfig || {};

    return {
      ragUrl: attr('data-rag-url') || global.ragUrl || '/api/rag',
      siteName: attr('data-site-name') || global.siteName || 'Kami',
      requireLogin: attr('data-require-login') !== null
        ? String(attr('data-require-login')).toLowerCase() !== 'false'
        : global.requireLogin !== false,
      signInUrl: attr('data-signin-url') || global.signInUrl || '/auth/signin/',
      signUpUrl: attr('data-signup-url') || global.signUpUrl || '/auth/signup/',
      sessionMode: attr('data-session-mode') || global.sessionMode || 'localStorage',
      sessionKey: attr('data-session-key') || global.sessionKey || 'stuff8_session'
    };
  }

  function readSession(config) {
    if (config.sessionMode === 'none') return null;
    try {
      if (config.sessionMode === 'windowGlobal') {
        var value = window[config.sessionKey];
        if (!value) return null;
        var obj = typeof value === 'string' ? JSON.parse(value) : value;
        var user = obj.user || obj;
        var id = obj.userId || obj.user && obj.user.id || user.id;
        if (!id) return null;
        return {
          id: String(id),
          name: user.name || user.username || obj.username || obj.name || ''
        };
      }
      // default: localStorage
      var raw = window.localStorage.getItem(config.sessionKey);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      var logged = parsed && parsed.user && parsed.user.id;
      if (!logged) return null;
      return {
        id: String(parsed.user.id),
        name: parsed.user.name || parsed.user.username || ''
      };
    } catch (_err) {
      return null;
    }
  }

  function getSessionId() {
    try {
      var id = window.localStorage.getItem('rag_session_id');
      if (!id) {
        id = (window.crypto && window.crypto.randomUUID)
          ? window.crypto.randomUUID()
          : String(Date.now() + Math.random());
        window.localStorage.setItem('rag_session_id', id);
      }
      return id;
    } catch (_err) {
      return String(Date.now() + Math.random());
    }
  }

  var TEMPLATE = '\
<div class="sw-root">\
  <button type="button" class="sw-toggle" aria-expanded="false" aria-controls="sw-panel" aria-label="Buka pusat bantuan">\
    <span class="sw-toggle-icon">? </span><span class="sw-toggle-label" part="toggle-label">Bantuan</span>\
  </button>\
  <div id="sw-panel" class="sw-panel" role="dialog" aria-label="Pusat bantuan">\
    <div class="sw-header">\
      <div class="sw-header-title">\
        <span class="sw-header-icon">?</span>\
        <span><strong class="sw-site">Pusat Bantuan</strong><span class="sw-sub">Balasan otomatis dari dokumentasi</span></span>\
      </div>\
      <button type="button" class="sw-close" aria-label="Tutup">&#10005;</button>\
    </div>\
    <div class="sw-body">\
      <div class="sw-login" hidden>\
        <span class="sw-login-icon">?</span>\
        <p class="sw-login-title">Halo!</p>\
        <p class="sw-login-text">Punya pertanyaan? Masuk dulu untuk mulai ngobrol dengan asisten bantuan kami.</p>\
        <a class="sw-btn sw-btn-primary" href="#SIGNUP_URL#">Daftar sekarang</a>\
        <a class="sw-btn sw-btn-outline" href="#SIGNIN_URL#">Saya sudah punya akun</a>\
      </div>\
      <div class="sw-chat" hidden>\
        <div class="sw-messages"></div>\
        <form class="sw-form">\
          <input class="sw-input" type="text" autocomplete="off" placeholder="Tanya apa saja…" maxlength="500" />\
          <button type="submit" class="sw-send" aria-label="Kirim">&#10148;</button>\
        </form>\
      </div>\
    </div>\
  </div>\
</div>';

  var STYLES = '\
:host { all: initial; }\
.sw-root { position: fixed; bottom: 1rem; right: 1rem; z-index: 2147483000; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }\
.sw-toggle { display: inline-flex; align-items: center; gap: 0.5rem; height: 3.5rem; padding: 0 1.25rem; border-radius: 9999px; border: 0; cursor: pointer; background: #0f1e3d; color: #fff; font-size: 0.875rem; font-weight: 700; box-shadow: 0 10px 24px -8px rgba(15, 30, 61, 0.5); transition: background 0.15s ease, transform 0.15s ease; }\
.sw-toggle:hover { background: #2563eb; transform: translateY(-1px); }\
.sw-toggle:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; }\
.sw-toggle-icon { display: inline-flex; align-items: center; justify-content: center; width: 1.5rem; height: 1.5rem; border-radius: 9999px; background: rgba(255,255,255,0.14); font-size: 0.85rem; }\
.sw-panel { display: none; margin-top: 0.75rem; width: min(23rem, calc(100vw - 2rem)); border: 1px solid #e6eaf2; border-radius: 1rem; background: #fff; box-shadow: 0 24px 48px -16px rgba(15, 30, 61, 0.3); overflow: hidden; flex-direction: column; }\
.sw-panel.sw-open { display: flex; }\
.sw-header { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.75rem 1rem; background: #0f1e3d; color: #fff; }\
.sw-header-title { display: flex; align-items: center; gap: 0.6rem; min-width: 0; }\
.sw-header-icon { display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; border-radius: 9999px; background: rgba(255,255,255,0.1); font-weight: 700; }\
.sw-site { display: block; font-size: 0.875rem; line-height: 1.2; }\
.sw-sub { display: block; font-size: 0.6875rem; color: #dbe3f0; }\
.sw-close { width: 2rem; height: 2rem; border: 0; border-radius: 9999px; background: transparent; color: #dbe3f0; font-size: 1rem; cursor: pointer; }\
.sw-close:hover { background: rgba(255,255,255,0.1); color: #fff; }\
.sw-body { min-height: 22rem; }\
.sw-login { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 2.5rem 1.5rem; text-align: center; }\
.sw-login-icon { display: inline-flex; align-items: center; justify-content: center; width: 3.5rem; height: 3.5rem; border-radius: 1rem; background: #eff6ff; color: #2563eb; font-size: 1.5rem; font-weight: 800; }\
.sw-login-title { margin: 0; font-size: 1rem; font-weight: 800; color: #0f1e3d; }\
.sw-login-text { margin: 0; font-size: 0.8125rem; line-height: 1.5; color: #475569; }\
.sw-btn { width: 100%; padding: 0.75rem 1rem; border-radius: 0.75rem; font-size: 0.8125rem; font-weight: 700; text-align: center; text-decoration: none; box-sizing: border-box; }\
.sw-btn-primary { background: #2563eb; color: #fff; }\
.sw-btn-primary:hover { background: #1d4ed8; }\
.sw-btn-outline { border: 1px solid #e6eaf2; color: #0f1e3d; }\
.sw-btn-outline:hover { background: #f8fafc; }\
.sw-chat { display: flex; flex-direction: column; height: 28rem; }\
.sw-messages { flex: 1; overflow-y: auto; padding: 1rem; background: #f8fafc; display: flex; flex-direction: column; gap: 0.75rem; }\
.sw-msg { max-width: 85%; padding: 0.625rem 0.875rem; border-radius: 1rem; font-size: 0.8125rem; line-height: 1.45; white-space: pre-wrap; word-break: break-word; }\
.sw-msg-user { align-self: flex-end; background: #2563eb; color: #fff; border-bottom-right-radius: 0.25rem; }\
.sw-msg-bot { align-self: flex-start; background: #fff; border: 1px solid #e6eaf2; color: #0f1e3d; border-bottom-left-radius: 0.25rem; }\
.sw-typing { display: inline-flex; align-items: center; gap: 0.25rem; align-self: flex-start; padding: 0.75rem 1rem; border-radius: 1rem; border-bottom-left-radius: 0.25rem; border: 1px solid #e6eaf2; background: #fff; }\
.sw-typing span { width: 0.375rem; height: 0.375rem; border-radius: 9999px; background: #94a3b8; animation: sw-bounce 1.2s infinite; }\
.sw-typing span:nth-child(2) { animation-delay: 0.15s; }\
.sw-typing span:nth-child(3) { animation-delay: 0.3s; }\
@keyframes sw-bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-4px); } }\
.sw-form { display: flex; gap: 0.5rem; padding: 0.75rem; border-top: 1px solid #e6eaf2; }\
.sw-input { flex: 1; min-width: 0; height: 2.75rem; padding: 0 0.875rem; border: 1px solid #e6eaf2; border-radius: 0.75rem; font-size: 0.8125rem; color: #0f1e3d; outline: none; box-sizing: border-box; }\
.sw-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }\
.sw-send { display: inline-flex; align-items: center; justify-content: center; width: 2.75rem; height: 2.75rem; border: 0; border-radius: 0.75rem; background: #2563eb; color: #fff; cursor: pointer; font-size: 1rem; }\
.sw-send:disabled { opacity: 0.5; cursor: default; }';

  function init() {
    var config = readScriptConfig();
    var host = document.createElement('div');
    document.body.appendChild(host);
    var root = host.attachShadow({ mode: 'open' });

    var style = document.createElement('style');
    style.textContent = STYLES;
    root.appendChild(style);

    var wrap = document.createElement('div');
    wrap.innerHTML = TEMPLATE.replace('#SIGNUP_URL#', config.signUpUrl).replace('#SIGNIN_URL#', config.signInUrl);
    var el = wrap.firstElementChild;
    root.appendChild(el);

    var panel = root.getElementById('sw-panel');
    var toggle = root.querySelector('.sw-toggle');
    var label = root.querySelector('.sw-toggle-label');
    var closeBtn = root.querySelector('.sw-close');
    var loginView = root.querySelector('.sw-login');
    var chatView = root.querySelector('.sw-chat');
    var messages = root.querySelector('.sw-messages');
    var form = root.querySelector('.sw-form');
    var input = root.querySelector('.sw-input');
    var sendBtn = root.querySelector('.sw-send');

    function scrollToBottom() { messages.scrollTop = messages.scrollHeight; }

    function setOpen(open) {
      panel.classList.toggle('sw-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      label.textContent = open ? 'Tutup' : 'Bantuan';
      if (open) syncAuth();
    }

    function addBubble(role, text) {
      var bubble = document.createElement('div');
      bubble.className = 'sw-msg sw-msg-' + role;
      bubble.textContent = text;
      messages.appendChild(bubble);
      scrollToBottom();
    }

    function addTyping() {
      var typing = document.createElement('div');
      typing.className = 'sw-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      messages.appendChild(typing);
      scrollToBottom();
      return typing;
    }

    function syncAuth() {
      var user = readSession(config);
      var loggedIn = Boolean(user);
      loginView.hidden = loggedIn;
      chatView.hidden = !loggedIn;
      if (loggedIn && !messages.querySelector('[data-welcome]')) {
        var marker = document.createElement('div');
        marker.dataset.welcome = '1';
        messages.appendChild(marker);
        addBubble('bot', 'Halo, ' + (user.name || '') + '! 👋 Tanya apa saja seputar ' + config.siteName + '.');
      }
    }

    toggle.addEventListener('click', function () { setOpen(!panel.classList.contains('sw-open')); });
    closeBtn.addEventListener('click', function () { setOpen(false); });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var question = (input.value || '').trim();
      if (!question) return;
      var user = readSession(config);
      if (config.requireLogin && !user) {
        window.location.assign(config.signInUrl);
        return;
      }
      input.value = '';
      addBubble('user', question);
      sendBtn.disabled = true;
      var typing = addTyping();
      fetch(config.ragUrl + '/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          question: question,
          session_id: getSessionId(),
          user_id: user ? user.id : undefined
        })
      })
        .then(function (res) { return res.json().catch(function () { return {}; }).then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (result) {
          typing.remove();
          addBubble('bot', result.ok ? (result.data.answer || '') : (result.data.error || 'Maaf, terjadi kendala. Coba lagi sebentar lagi.'));
        })
        .catch(function () {
          typing.remove();
          addBubble('bot', 'Maaf, asisten sedang tidak dapat dihubungi. Coba lagi nanti.');
        })
        .finally(function () {
          sendBtn.disabled = false;
          input.focus();
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
