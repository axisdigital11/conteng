/* ─── CONTENG · תוסף נגישות ─── */
(function () {
  var KEY = 'conteng-a11y';
  var root = document.documentElement;
  var state = { fs: 0 };
  try { state = JSON.parse(localStorage.getItem(KEY)) || { fs: 0 }; } catch (e) {}

  // מפתח, תווית, סמל. מצבי צבע הם בלעדיים (אחד בכל פעם)
  var COLOR_MODES = ['contrast', 'invert', 'gray'];
  var OPTIONS = [
    ['contrast', 'ניגודיות גבוהה', '◐'],
    ['invert', 'ניגודיות הפוכה', '◑'],
    ['gray', 'גווני אפור', '▒'],
    ['links', 'הדגשת קישורים', '↗'],
    ['headings', 'הדגשת כותרות', 'H'],
    ['font', 'גופן קריא', 'Aa'],
    ['spacing', 'ריווח טקסט', '↕'],
    ['noanim', 'עצירת אנימציות', '❚❚'],
    ['cursor', 'סמן עכבר גדול', '➚']
  ];
  var FS_LABELS = ['100%', '112%', '125%', '140%'];

  var cursorSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'%3E%3Cpath d='M4 2l30 26-13 2 8 14-6 3-8-14-11 9z' fill='%23000' stroke='%23fff' stroke-width='2.5' stroke-linejoin='round'/%3E%3C/svg%3E";
  var EXCL = 'body>:not(.a11y-root):not(script)';

  var css = [
    '.a11y-root{position:fixed;left:28px;bottom:24px;z-index:9999;direction:rtl;font-family:Assistant,Arial,sans-serif}',
    '.a11y-btn{width:52px;height:52px;border-radius:50%;background:#1D4ED8;border:2px solid #fff;box-shadow:0 8px 22px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;transition:transform .15s}',
    '.a11y-btn:hover{transform:scale(1.08)}',
    '.a11y-btn svg{width:30px;height:30px;fill:#fff}',
    '.a11y-btn:focus-visible{outline:3px solid #FFD400;outline-offset:3px}',
    '.a11y-panel{position:fixed;left:24px;bottom:88px;width:350px;max-width:calc(100vw - 32px);max-height:calc(100vh - 110px);overflow:auto;background:#fff;color:#111827;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.45);padding:18px;text-align:right}',
    '.a11y-panel[hidden]{display:none}',
    '.a11y-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}',
    '.a11y-head h2{font-size:19px;line-height:1.3;margin:0;color:#111827;font-weight:800;font-family:Assistant,Arial,sans-serif}',
    '.a11y-close{width:40px;height:40px;border-radius:10px;border:2px solid #9CA3AF;background:#fff;color:#111827;font-size:22px;line-height:1;cursor:pointer}',
    '.a11y-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;padding:0;list-style:none}',
    '.a11y-opt{width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:10px 6px;border:2px solid #D1D5DB;border-radius:12px;background:#F9FAFB;color:#111827;font:600 14.5px/1.25 Assistant,Arial,sans-serif;cursor:pointer;min-height:70px;text-align:center}',
    '.a11y-opt:hover{border-color:#6B7280}',
    '.a11y-opt[aria-pressed="true"]{border-color:#1D4ED8;background:#E0E7FF;color:#1E3A8A}',
    '.a11y-opt .ic{font-size:19px;line-height:1;font-weight:800}',
    '.a11y-fs{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:8px;border:2px solid #D1D5DB;border-radius:12px;padding:8px 12px;background:#F9FAFB}',
    '.a11y-fs .t{font-weight:700;font-size:15px}',
    '.a11y-fs .v{font-weight:700;font-size:14px;min-width:46px;text-align:center}',
    '.a11y-fs button{width:44px;height:40px;border-radius:10px;border:2px solid #6B7280;background:#fff;font:800 17px Assistant,Arial,sans-serif;cursor:pointer;color:#111827}',
    '.a11y-fs button:disabled{opacity:.45;cursor:default}',
    '.a11y-foot{display:flex;justify-content:space-between;align-items:center;margin-top:14px;gap:10px;flex-wrap:wrap}',
    '.a11y-reset{border:2px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:8px 16px;font:700 14.5px Assistant,Arial,sans-serif;cursor:pointer}',
    '.a11y-foot a{color:#1D4ED8;text-decoration:underline;font-weight:700;font-size:14.5px}',
    '.a11y-root :focus-visible{outline:3px solid #1D4ED8;outline-offset:2px}',
    '.a11y-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}',
    '@media (max-width:640px){.a11y-root{left:19px;bottom:16px}.a11y-btn{width:46px;height:46px}.a11y-btn svg{width:26px;height:26px}.a11y-panel{left:8px;right:8px;bottom:8px;width:auto;max-width:none;max-height:calc(100vh - 16px)}}',
    /* מצבים */
    /* הגדלת טקסט: רק תוכן וזרימה רגילה - אלמנטים קבועים (הדר, כפתורים צפים) נשארים במקום */
    'html.a11y-fs1 :is(body>main,body>footer){zoom:1.12}html.a11y-fs1 header .nav-links{font-size:18px}',
    'html.a11y-fs2 :is(body>main,body>footer){zoom:1.25}html.a11y-fs2 header .nav-links{font-size:20px}',
    'html.a11y-fs3 :is(body>main,body>footer){zoom:1.4}html.a11y-fs3 header .nav-links{font-size:22px}',
    '@media (max-width:420px){html.a11y-fs1 :is(body>main,body>footer){zoom:1.06}html.a11y-fs2 :is(body>main,body>footer){zoom:1.12}html.a11y-fs3 :is(body>main,body>footer){zoom:1.18}}',
    'html.a11y-gray ' + EXCL + '{filter:grayscale(1)}',
    'html.a11y-invert ' + EXCL + '{filter:invert(1) hue-rotate(180deg)}',
    'html.a11y-invert ' + EXCL + ' img,html.a11y-invert ' + EXCL + ' iframe{filter:invert(1) hue-rotate(180deg)}',
    'html.a11y-contrast ' + EXCL + ',html.a11y-contrast ' + EXCL + ' *:not(img){background-color:#000!important;background-image:none!important;color:#fff!important;border-color:#fff!important;box-shadow:none!important;text-shadow:none!important}',
    'html.a11y-contrast ' + EXCL + ' a,html.a11y-contrast ' + EXCL + ' a *,html.a11y-contrast ' + EXCL + ' button,html.a11y-contrast ' + EXCL + ' summary,html.a11y-contrast ' + EXCL + ' .accent{color:#FFEB3B!important}',
    'html.a11y-contrast .hero-bg,html.a11y-contrast .grid-bg::before,html.a11y-contrast .hero-bg::after{display:none!important}',
    'html.a11y-contrast ' + EXCL + ' input{border:2px solid #fff!important}',
    'html.a11y-links ' + EXCL + ' a{background:#FFEB3B!important;color:#000!important;text-decoration:underline!important;text-underline-offset:3px;outline:2px solid #000!important}',
    'html.a11y-links ' + EXCL + ' a *{color:#000!important}',
    'html.a11y-headings ' + EXCL + ' :is(h1,h2,h3){outline:3px solid #1D4ED8!important;outline-offset:5px;border-radius:2px}',
    'html.a11y-font ' + EXCL + ',html.a11y-font ' + EXCL + ' *{font-family:Arial,Helvetica,sans-serif!important;letter-spacing:normal!important}',
    'html.a11y-spacing ' + EXCL + ' *:not(svg):not(svg *){line-height:1.8!important;letter-spacing:.06em!important;word-spacing:.16em!important}',
    'html.a11y-spacing ' + EXCL + ' p{margin-bottom:1.2em}',
    'html.a11y-noanim *,html.a11y-noanim *::before,html.a11y-noanim *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}',
    'html.a11y-noanim .rev{opacity:1!important;transform:none!important}',
    'html.a11y-cursor,html.a11y-cursor *{cursor:url("' + cursorSvg + '") 4 2,auto!important}'
  ].join('\n');

  var style = document.createElement('style');
  style.id = 'a11y-style';
  style.textContent = css;
  document.head.appendChild(style);

  function apply() {
    OPTIONS.forEach(function (o) { root.classList.toggle('a11y-' + o[0], !!state[o[0]]); });
    for (var i = 1; i <= 3; i++) root.classList.toggle('a11y-fs' + i, state.fs === i);
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    if (panel) {
      OPTIONS.forEach(function (o) {
        var b = panel.querySelector('[data-k="' + o[0] + '"]');
        if (b) b.setAttribute('aria-pressed', state[o[0]] ? 'true' : 'false');
      });
      fsVal.textContent = FS_LABELS[state.fs];
      fsDown.disabled = state.fs === 0;
      fsUp.disabled = state.fs === 3;
    }
    try { document.dispatchEvent(new CustomEvent('a11ychange', { detail: state })); } catch (e) {}
  }

  var panel, fsVal, fsUp, fsDown, btn;
  apply();

  function build() {
    var wrap = document.createElement('aside');
    wrap.setAttribute('aria-label', 'נגישות');
    wrap.className = 'a11y-root';
    var opts = OPTIONS.map(function (o) {
      return '<li><button type="button" class="a11y-opt" data-k="' + o[0] + '" aria-pressed="false"><span class="ic" aria-hidden="true">' + o[2] + '</span>' + o[1] + '</button></li>';
    }).join('');
    wrap.innerHTML =
      '<button type="button" class="a11y-btn" aria-expanded="false" aria-controls="a11y-panel" aria-label="פתיחת תפריט נגישות">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="4" r="2.2"/><path d="M20.5 7.6c-2.6.7-5.6 1.1-8.5 1.1s-5.9-.4-8.5-1.1l-.5 1.9c2 .5 4.2.9 6.4 1v3.2L7.6 21l1.9.7 2.5-6.3 2.5 6.3 1.9-.7-1.8-7.3v-3.2c2.2-.1 4.4-.5 6.4-1z"/></svg>' +
      '</button>' +
      '<div class="a11y-panel" id="a11y-panel" role="dialog" aria-modal="false" aria-labelledby="a11y-title" hidden>' +
        '<div class="a11y-head"><h2 id="a11y-title" tabindex="-1">תפריט נגישות</h2>' +
          '<button type="button" class="a11y-close" aria-label="סגירת תפריט הנגישות">✕</button></div>' +
        '<ul class="a11y-grid">' +
          '<li class="a11y-fs"><span class="t" id="a11y-fs-t">גודל טקסט</span>' +
            '<span style="display:flex;align-items:center;gap:6px">' +
              '<button type="button" data-fs="-1" aria-label="הקטנת טקסט">א-</button>' +
              '<span class="v" aria-live="polite"><span class="a11y-sr">גודל טקסט: </span><span class="fsv"></span></span>' +
              '<button type="button" data-fs="1" aria-label="הגדלת טקסט">א+</button>' +
            '</span></li>' +
          opts +
        '</ul>' +
        '<div class="a11y-foot"><button type="button" class="a11y-reset">איפוס הגדרות</button>' +
          '<a href="accessibility.html">הצהרת נגישות</a></div>' +
      '</div>';
    document.body.appendChild(wrap);

    btn = wrap.querySelector('.a11y-btn');
    panel = wrap.querySelector('.a11y-panel');
    fsVal = panel.querySelector('.fsv');
    fsDown = panel.querySelector('[data-fs="-1"]');
    fsUp = panel.querySelector('[data-fs="1"]');

    function open() {
      panel.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      panel.querySelector('#a11y-title').focus();
    }
    function close(returnFocus) {
      panel.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      if (returnFocus) btn.focus();
    }
    btn.addEventListener('click', function () { panel.hidden ? open() : close(false); });
    panel.querySelector('.a11y-close').addEventListener('click', function () { close(true); });
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { e.preventDefault(); close(true); }
    });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !wrap.contains(e.target)) close(false);
    });

    panel.addEventListener('click', function (e) {
      var o = e.target.closest('.a11y-opt');
      if (o) {
        var k = o.getAttribute('data-k');
        var on = !state[k];
        if (on && COLOR_MODES.indexOf(k) > -1) COLOR_MODES.forEach(function (m) { state[m] = false; });
        state[k] = on;
        apply();
        return;
      }
      var f = e.target.closest('[data-fs]');
      if (f) {
        state.fs = Math.max(0, Math.min(3, (state.fs || 0) + parseInt(f.getAttribute('data-fs'), 10)));
        apply();
        return;
      }
      if (e.target.closest('.a11y-reset')) {
        state = { fs: 0 };
        apply();
      }
    });
    apply();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
