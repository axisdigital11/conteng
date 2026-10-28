/* ─── CONTENG · הודעת עוגיות ─── */
(function () {
  var KEY = 'conteng-consent';
  var root = document.documentElement;
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}

  // מצב ההסכמה זמין לסקריפטים עתידיים (פיקסל, אנליטיקס): 'all' / 'necessary' / null
  window.contengConsent = saved ? saved.v : null;

  var css = [
    '.cb{position:fixed;z-index:9000;bottom:24px;right:24px;width:min(560px,calc(100vw - 48px));background:#131B2C;color:#F3F1EC;border:1px solid rgba(243,241,236,.18);border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.45);padding:20px 22px;direction:rtl;text-align:right;font-family:Assistant,"Segoe UI",Arial,sans-serif}',
    '.cb[hidden]{display:none}',
    '.cb h2{font-size:17px;font-weight:800;margin:0 0 6px;color:#F3F1EC;line-height:1.3}',
    '.cb p{font-size:15px;line-height:1.55;margin:0;color:#C9D0DB}',
    '.cb a{color:#F3F1EC;text-decoration:underline;text-underline-offset:3px}',
    '.cb-btns{display:flex;gap:10px;margin-top:14px;flex-wrap:wrap}',
    '.cb-btns button{flex:1;min-width:120px;min-height:44px;border-radius:10px;font:700 15.5px Assistant,"Segoe UI",Arial,sans-serif;cursor:pointer;padding:10px 18px}',
    '.cb-ok{background:#E8833A;color:#17110A;border:2px solid #E8833A}',
    '.cb-ok:hover{background:#F09349;border-color:#F09349}',
    '.cb-no{background:transparent;color:#F3F1EC;border:2px solid #8A93A3}',
    '.cb-no:hover{border-color:#F3F1EC}',
    '.cb :focus-visible{outline:3px solid #FFD400;outline-offset:2px}',
    '.cb-open-btn{background:none;border:none;padding:0;font:inherit;color:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer}',
    /* בטלפון ובטאבלט ההודעה רוחב מלא, מעל כפתור הנגישות; הכפתורים הצפים האחרים מוסתרים עד שבוחרים */
    '@media (max-width:820px){.cb{right:8px;left:8px;width:auto;bottom:84px;padding:16px 16px}html.cb-open .floats{display:none}}'
  ].join('\n');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var box;
  function save(v) {
    window.contengConsent = v;
    try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: new Date().toISOString() })); } catch (e) {}
    try { document.dispatchEvent(new CustomEvent('consentchange', { detail: v })); } catch (e) {}
    close();
  }
  function open() {
    box.hidden = false;
    root.classList.add('cb-open');
  }
  function close() {
    box.hidden = true;
    root.classList.remove('cb-open');
  }

  function build() {
    box = document.createElement('div');
    box.className = 'cb';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-labelledby', 'cb-title');
    box.hidden = true;
    box.innerHTML =
      '<h2 id="cb-title">האתר משתמש בעוגיות</h2>' +
      '<p>אנחנו משתמשים בעוגיות ובטכנולוגיות דומות כדי שהאתר יעבוד כמו שצריך ולשיפור חוויית הגלישה. אפשר לאשר או לדחות עוגיות שאינן הכרחיות. פרטים נוספים ב<a href="privacy.html">מדיניות הפרטיות</a>.</p>' +
      '<div class="cb-btns"><button type="button" class="cb-ok">אישור</button><button type="button" class="cb-no">דחייה</button></div>';
    // מוקדם בסדר הטאב - מיד אחרי קישור הדילוג
    var skip = document.querySelector('.skip');
    if (skip && skip.nextSibling) document.body.insertBefore(box, skip.nextSibling);
    else document.body.insertBefore(box, document.body.firstChild);

    box.querySelector('.cb-ok').addEventListener('click', function () { save('all'); });
    box.querySelector('.cb-no').addEventListener('click', function () { save('necessary'); });

    // קישורי "הגדרות עוגיות" בפוטר פותחים מחדש את ההודעה
    document.querySelectorAll('[data-open-consent]').forEach(function (b) {
      b.addEventListener('click', function () { open(); box.querySelector('.cb-ok').focus(); });
    });

    if (!saved) open();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
