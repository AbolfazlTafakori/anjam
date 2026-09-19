/* Anjam admin panel — one small SPA: state · api · i18n · views (one function per section) · actions. */
(() => {
  'use strict';

  // ============================================================ i18n
  const I18N = {
    fa: {
      panelTitle: 'پنل مدیریت', panelSub: 'فقط حساب مدیر که هنگام نصب تعیین شده وارد می‌شود.', panelTag: 'مدیریت', password: 'رمز عبور', signIn: 'ورود', signOut: 'خروج', cancel: 'انصراف', copy: 'کپی', copied: 'کپی شد', saved: 'ذخیره شد',
      overview: 'نمای کلی', users: 'کاربران', invites: 'کدهای دعوت', downloads: 'دانلود برنامه', settings: 'تنظیمات', audit: 'رویدادها', account: 'حساب مدیر',
      subOverview: 'وضعیت سرویس در یک نگاه', subUsers: '{n} حساب', subInvites: 'کدهای یک‌بارمصرف برای ثبت‌نام', subDownloads: 'نسخه‌های نصبی برای کاربران این سرور', subSettings: 'ثبت‌نام، ایمیل و مشخصات سرور', subAudit: 'آخرین {n} رویداد', subAccount: 'نام کاربری و رمز مدیر',
      kUsers: 'کاربران', kActive1: 'فعال ۲۴ ساعت', kActive7: 'فعال ۷ روز', kSignups7: 'ثبت‌نام ۷ روز', kTasks: 'کارهای باز', kDone7: 'انجام‌شده ۷ روز',
      signups30: 'ثبت‌نام در ۳۰ روز اخیر', server: 'سرور', health: 'سلامت سرور', version: 'نسخه', node: 'Node', uptime: 'روشن از', host: 'میزبان', memory: 'حافظه', disk: 'دیسک (داده)', db: 'دیتابیس', cert: 'گواهی HTTPS', certNone: 'یافت نشد', daysLeft: '{n} روز مانده', expired: 'منقضی', load: 'بار', latestRelease: 'آخرین نسخه‌ی برنامه', noRelease: 'هنوز نسخه‌ای منتشر نشده', regQuick: 'ثبت‌نام',
      regOpen: 'باز', regInvite: 'فقط با کد دعوت', regClosed: 'بسته', regHelp: { open: 'هر کسی می‌تواند حساب بسازد.', invite: 'ثبت‌نام فقط با کدی که این‌جا می‌سازید.', closed: 'هیچ حساب جدیدی ساخته نمی‌شود.' },
      mail: 'ایمیل', mailOn: 'فعال', mailOff: 'غیرفعال', mailHelp: 'برای ارسال خودکار لینک بازیابی رمز، SMTP_URL را در /etc/anjam/anjam.env تنظیم کنید (anjam env). بدون آن، لینک را از همین پنل می‌سازید.',
      serverInfo: 'مشخصات', publicUrl: 'آدرس عمومی', panelPath: 'مسیر پنل', dataDir: 'مسیر داده', releasesRepo: 'مخزن انتشار',
      search: 'جستجو', user: 'کاربر', status: 'وضعیت', tasks: 'کارها', lists: 'لیست‌ها', lastSync: 'آخرین همگام‌سازی', joined: 'عضویت', active: 'فعال', disabled: 'غیرفعال', admin: 'مدیر', never: 'هرگز', noUsers: 'هنوز کاربری نیست',
      aRename: 'تغییر نام', aDisable: 'غیرفعال‌کردن', aEnable: 'فعال‌کردن', aReset: 'لینک بازیابی رمز', aWipe: 'پاک‌کردن کارها', aDelete: 'حذف حساب',
      confirmDisable: 'حساب {who} غیرفعال شود؟ همه‌ی نشست‌هایش قطع می‌شود.', confirmWipe: 'همه‌ی کارها و لیست‌های {who} روی سرور پاک شود؟ (نسخه‌ی روی دستگاه‌هایش می‌ماند تا همگام‌سازی بعدی)', confirmDelete: 'حساب {who} و همه‌ی داده‌هایش برای همیشه حذف شود؟', confirmInvDel: 'کد {code} حذف شود؟',
      renamePrompt: 'نام جدید', resetTitle: 'لینک بازیابی رمز', resetText: 'این لینک ۲۴ ساعت اعتبار دارد و یک‌بار کار می‌کند. برای کاربر بفرستید:',
      invCreate: 'ساخت کد', invNote: 'یادداشت (مثلاً: خانم)', code: 'کد', note: 'یادداشت', used: 'استفاده‌شده', free: 'آزاد', noInvites: 'کدی ساخته نشده', invLink: 'لینک ثبت‌نام', invHelp: 'کد را بدهید یا لینک را بفرستید؛ لینک، کد را در فرم ثبت‌نام خودکار پر می‌کند.',
      dlIntro: 'کاربران با هر نسخه، به همین سرور وصل می‌شوند: هنگام ورود آدرس سرور را وارد می‌کنند.', dlServer: 'آدرس سرور برای کاربران', dlPublic: 'صفحه‌ی عمومی دانلود', dlWindows: 'ویندوز', dlAndroid: 'اندروید', dlLinux: 'لینوکس', dlWeb: 'وب', dlGet: 'دانلود', dlOpen: 'باز کردن',
      dlAndroidSteps: [], dlPwaAlt: 'بدون نصب هم می‌شود: آدرس سرور را در Chrome باز کنید → ⋮ → Add to Home screen.', dlWebText: 'همیشه آخرین نسخه؛ نیازی به نصب ندارد.', dlAutoUpdate: 'نسخه‌های ویندوز، لینوکس و اندروید خودشان به‌روزرسانی را پیدا می‌کنند و در برنامه اعلام می‌کنند.',
      dlNoRelease: 'هنوز نسخه‌ی نصبی منتشر نشده. با انتشار نسخه در GitHub، این‌جا خودکار ظاهر می‌شود.', size: 'حجم', published: 'انتشار', downloadsN: 'دانلود',
      backup: 'پشتیبان', backupBtn: 'دانلود پشتیبان دیتابیس', backupHelp: 'یک کپی سازگار از SQLite (کاربران، کارها، تنظیمات). روی سرور: anjam backup',
      refresh: 'تازه‌کردن', changePw: 'تغییر رمز', curPw: 'رمز فعلی', newPw: 'رمز جدید', newPw2: 'تکرار رمز جدید', pwHint: 'حداقل ۸ کاراکتر، شامل حرف و عدد. با تغییر رمز، همه‌ی نشست‌ها (پنل و برنامه) بسته می‌شوند.', pwMatch: 'رمزها یکسان نیستند', accountHelp: 'همین ایمیل و رمز، حساب شما در خود برنامه هم هست.',
      actor: 'عامل', action: 'رویداد', target: 'هدف', ip: 'IP', filterAudit: 'فیلتر…',
      errCreds: 'ایمیل یا رمز اشتباه است', errMany: 'تلاش زیاد؛ کمی بعد دوباره امتحان کنید', errNet: 'اتصال به سرور برقرار نشد', errWeak: 'رمز ضعیف است', errIsAdmin: 'این کار روی حساب مدیر ممکن نیست',
      yes: 'بله', months: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
    },
    en: {
      panelTitle: 'Admin panel', panelSub: 'Only the administrator account chosen at install time can sign in.', panelTag: 'Admin', password: 'Password', signIn: 'Sign in', signOut: 'Sign out', cancel: 'Cancel', copy: 'Copy', copied: 'Copied', saved: 'Saved',
      overview: 'Overview', users: 'Users', invites: 'Invite codes', downloads: 'Downloads', settings: 'Settings', audit: 'Events', account: 'Admin account',
      subOverview: 'The service at a glance', subUsers: '{n} accounts', subInvites: 'One-time codes for sign-up', subDownloads: 'Installers for the users of this server', subSettings: 'Registration, e-mail and server facts', subAudit: 'Last {n} events', subAccount: 'Administrator name and password',
      kUsers: 'Users', kActive1: 'Active 24 h', kActive7: 'Active 7 d', kSignups7: 'Sign-ups 7 d', kTasks: 'Open tasks', kDone7: 'Done 7 d',
      signups30: 'Sign-ups, last 30 days', server: 'Server', health: 'Server health', version: 'Version', node: 'Node', uptime: 'Up since', host: 'Host', memory: 'Memory', disk: 'Disk (data)', db: 'Database', cert: 'HTTPS certificate', certNone: 'not found', daysLeft: '{n} days left', expired: 'expired', load: 'Load', latestRelease: 'Latest app release', noRelease: 'No release published yet', regQuick: 'Registration',
      regOpen: 'Open', regInvite: 'Invite only', regClosed: 'Closed', regHelp: { open: 'Anyone can create an account.', invite: 'Sign-up only with a code created here.', closed: 'No new accounts.' },
      mail: 'E-mail', mailOn: 'enabled', mailOff: 'disabled', mailHelp: 'Set SMTP_URL in /etc/anjam/anjam.env (anjam env) to e-mail password-reset links automatically. Without it, create links from this panel.',
      serverInfo: 'Facts', publicUrl: 'Public address', panelPath: 'Panel path', dataDir: 'Data directory', releasesRepo: 'Release repository',
      search: 'Search', user: 'User', status: 'Status', tasks: 'Tasks', lists: 'Lists', lastSync: 'Last sync', joined: 'Joined', active: 'active', disabled: 'disabled', admin: 'admin', never: 'never', noUsers: 'No users yet',
      aRename: 'Rename', aDisable: 'Disable', aEnable: 'Enable', aReset: 'Password-reset link', aWipe: 'Wipe tasks', aDelete: 'Delete account',
      confirmDisable: 'Disable {who}? All their sessions end.', confirmWipe: 'Wipe all tasks and lists of {who} on the server? (Their devices keep a copy until the next sync)', confirmDelete: 'Delete {who} and all their data permanently?', confirmInvDel: 'Delete code {code}?',
      renamePrompt: 'New name', resetTitle: 'Password-reset link', resetText: 'Valid for 24 hours, single use. Send it to the user:',
      invCreate: 'Create code', invNote: 'Note (e.g. wife)', code: 'Code', note: 'Note', used: 'used', free: 'free', noInvites: 'No codes yet', invLink: 'Sign-up link', invHelp: 'Give the code or send the link; the link pre-fills the code in the sign-up form.',
      dlIntro: 'Every build connects to this server: users enter the server address when they sign in.', dlServer: 'Server address for users', dlPublic: 'Public download page', dlWindows: 'Windows', dlAndroid: 'Android', dlLinux: 'Linux', dlWeb: 'Web', dlGet: 'Download', dlOpen: 'Open',
      dlAndroidSteps: [], dlPwaAlt: 'No install needed either: open the server address in Chrome → ⋮ → Add to Home screen.', dlWebText: 'Always the latest version; nothing to install.', dlAutoUpdate: 'Windows, Linux and Android builds find updates themselves and announce them inside the app.',
      dlNoRelease: 'No installer published yet. Publishing a GitHub release makes it appear here automatically.', size: 'Size', published: 'Published', downloadsN: 'downloads',
      backup: 'Backup', backupBtn: 'Download database backup', backupHelp: 'A consistent SQLite copy (users, tasks, settings). On the server: anjam backup',
      refresh: 'Refresh', changePw: 'Change password', curPw: 'Current password', newPw: 'New password', newPw2: 'Repeat new password', pwHint: 'At least 8 characters with letters and digits. Changing it ends every session (panel and app).', pwMatch: 'Passwords do not match', accountHelp: 'This e-mail and password are also your account in the app itself.',
      actor: 'Actor', action: 'Event', target: 'Target', ip: 'IP', filterAudit: 'Filter…',
      errCreds: 'Wrong e-mail or password', errMany: 'Too many attempts; try again later', errNet: 'Could not reach the server', errWeak: 'Weak password', errIsAdmin: 'Not allowed on the administrator account',
      yes: 'Yes', months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
  };

  // ============================================================ state & helpers
  const state = { lang: localStorage.getItem('anjam-admin-lang') || 'fa', token: localStorage.getItem('anjam-admin-token') || '', admin: null, sec: 'overview', data: {}, q: '' };
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const t = (k) => I18N[state.lang][k];
  const fmt = (k, v) => t(k).replace(/\{(\w+)\}/g, (_, x) => v[x]);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const numLocale = () => (state.lang === 'fa' ? 'fa-IR' : 'en-US');
  const num = (n) => Number(n || 0).toLocaleString(numLocale());
  const when = (ts) => (ts ? new Intl.DateTimeFormat(state.lang === 'fa' ? 'fa-IR-u-ca-persian' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ts)) : t('never'));
  const bytes = (b) => (b >= 1e9 ? (b / 1e9).toFixed(1) + ' GB' : b >= 1e6 ? (b / 1e6).toFixed(0) + ' MB' : (b / 1e3).toFixed(0) + ' KB');
  const dur = (s) => { const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60); return state.lang === 'fa' ? `${d ? num(d) + ' روز ' : ''}${num(h)} ساعت ${num(m)} دقیقه` : `${d ? d + 'd ' : ''}${h}h ${m}m`; };
  const icon = (n) => `<svg><use href="#i-${n}"/></svg>`;

  async function api(path, body, method) {
    const r = await fetch('/api' + path, { method: method || (body ? 'POST' : 'GET'), headers: { 'Content-Type': 'application/json', ...(state.token ? { Authorization: 'Bearer ' + state.token } : {}) }, body: body ? JSON.stringify(body) : undefined });
    const j = await r.json().catch(() => ({}));
    if (r.status === 401 && path !== '/admin/login') { signOut(); throw Object.assign(new Error('unauthorized'), { code: 'unauthorized' }); }
    if (!r.ok) throw Object.assign(new Error(j.error || r.status), { code: j.error });
    return j;
  }
  const errText = (e) => t({ bad_credentials: 'errCreds', too_many_requests: 'errMany', weak_password: 'errWeak', is_admin: 'errIsAdmin' }[e.code] || 'errNet');

  let toastTimer = null;
  function toast(text) { $('#toast-text').textContent = text; $('#toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 2200); }
  function copy(text) { navigator.clipboard.writeText(text).then(() => toast(t('copied'))); }
  function confirmDialog(title, text, yesLabel, danger) {
    return new Promise((resolve) => {
      $('#confirm-title').textContent = title; $('#confirm-text').textContent = text; $('#confirm-yes').textContent = yesLabel || t('yes');
      $('#confirm-yes').className = 'btn ' + (danger ? 'ghost danger' : 'primary');
      $('#confirm').hidden = false;
      const done = (v) => { $('#confirm').hidden = true; resolve(v); };
      $('#confirm-yes').onclick = () => done(true); $('#confirm-no').onclick = $('#confirm-x').onclick = () => done(false);
    });
  }
  function resultDialog(title, text, code) {
    $('#result-title').textContent = title; $('#result-text').textContent = text; $('#result-code').textContent = code;
    $('#result-copy').onclick = () => copy(code); $('#result-x').onclick = () => { $('#result').hidden = true; };
    $('#result').hidden = false;
  }

  // ============================================================ language & shell
  function applyLang() {
    document.documentElement.lang = state.lang; document.documentElement.dir = state.lang === 'fa' ? 'rtl' : 'ltr';
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-title]').forEach((el) => { el.title = t(el.dataset.i18nTitle); });
    $('#lang-label').textContent = state.lang === 'fa' ? 'English' : 'فارسی';
  }
  function setSection(sec) { state.sec = sec; state.q = ''; $('#panel').classList.remove('sidebar-open'); $('#scrim').hidden = true; render(); }
  function signOut() { state.token = ''; state.admin = null; localStorage.removeItem('anjam-admin-token'); $('#panel').hidden = true; $('#login').hidden = false; }

  async function render() {
    $$('.nav-item[data-sec]').forEach((b) => b.classList.toggle('active', b.dataset.sec === state.sec));
    const view = VIEWS[state.sec];
    $('#sec-title').textContent = t(state.sec === 'account' ? 'account' : state.sec);
    $('#head-actions').innerHTML = '';
    $('#content').innerHTML = `<div class="hint">…</div>`;
    try { await view(); } catch (e) { $('#content').innerHTML = `<div class="hint">${esc(errText(e))}</div>`; }
  }

  // ============================================================ views
  const VIEWS = {
    async overview() {
      const ov = await api('/admin/overview'); state.data.overview = ov;
      $('#sec-sub').textContent = t('subOverview');
      $('#head-actions').innerHTML = `<button class="btn ghost" id="refresh">${icon('refresh')}<span>${t('refresh')}</span></button>`;
      $('#refresh').onclick = render;
      const s = ov.system; const memUsed = s.memory.total - s.memory.free; const memPct = memUsed / s.memory.total * 100;
      const disk = s.disk; const diskPct = disk ? (1 - disk.free / disk.total) * 100 : 0;
      const certDays = s.certExpiresAt ? Math.round((s.certExpiresAt - Date.now()) / 864e5) : null;
      const max = Math.max(1, ...ov.signupsSeries.map((x) => x.n));
      const bars = ov.signupsSeries.map((x, i) => { const d = new Date(x.d + 'T00:00:00'); const lbl = i % 5 === 0 ? new Intl.DateTimeFormat(state.lang === 'fa' ? 'fa-IR-u-ca-persian' : 'en-GB', { day: 'numeric', month: 'short' }).format(d) : ''; return `<div class="bar${i === 29 ? ' today' : ''}" data-tip="${esc(when(d.getTime()).split(',')[0])}: ${num(x.n)}"><span class="bar-f" style="height:${Math.max(2, x.n / max * 82)}%"></span><span class="bar-l">${lbl}</span></div>`; }).join('');
      const rel = ov.release;
      const meter = (k, v, pct, txt) => `<div class="meter"><span class="meter-k">${k}</span><span class="meter-t"><span class="meter-f${pct > 90 ? ' bad' : pct > 75 ? ' warn' : ''}" style="width:${Math.min(100, pct).toFixed(0)}%"></span></span><span class="meter-v">${txt}</span></div>`;
      $('#content').innerHTML = `
        <div class="ledger">
          ${[['kUsers', ov.users, ''], ['kActive1', ov.active1, ''], ['kActive7', ov.active7, ''], ['kSignups7', ov.signups7, 'gold'], ['kTasks', ov.tasks, ''], ['kDone7', ov.done7, 'ok']].map(([k, v, c]) => `<div class="ledger-row"><span class="ledger-k">${t(k)}</span><span class="ledger-v ${c}">${num(v)}</span></div>`).join('')}
        </div>
        <div class="grid-2">
          <section class="panel"><h2>${t('signups30')}</h2><div class="bars">${bars}</div></section>
          <section class="panel"><h2>${t('regQuick')}<span class="spacer"></span></h2>
            <div class="seg" id="reg">${['open', 'invite', 'closed'].map((m) => `<button data-v="${m}" class="${ov.registration === m ? 'active' : ''}">${t('reg' + m[0].toUpperCase() + m.slice(1))}</button>`).join('')}</div>
            <p class="hint" style="margin-top:10px" id="reg-help">${t('regHelp')[ov.registration]}</p>
            <h2 style="margin-top:18px">${t('latestRelease')}</h2>
            ${rel ? `<dl class="kv"><dt>${t('version')}</dt><dd class="ltr">v${esc(rel.version)}${rel.version === s.version ? ` <span class="pill ok dim">${t('server')} ✓</span>` : ''}</dd><dt>${t('published')}</dt><dd>${when(Date.parse(rel.publishedAt))}</dd><dt>${t('downloads')}</dt><dd>${rel.files.map((f) => f.label).join(' · ') || '—'}</dd></dl>` : `<p class="hint">${t('noRelease')}</p>`}
          </section>
        </div>
        <section class="panel"><h2>${t('health')}</h2>
          <div class="grid-2">
            <dl class="kv">
              <dt>${t('version')}</dt><dd class="ltr">Anjam ${esc(s.version)} · ${esc(s.node)}</dd>
              <dt>${t('host')}</dt><dd class="ltr">${esc(s.hostname)} · ${esc(s.platform)} · ${num(s.cpus)} CPU</dd>
              <dt>${t('uptime')}</dt><dd>${dur(s.uptime)}</dd>
              <dt>${t('load')}</dt><dd class="ltr">${s.load.join(' / ')}</dd>
              <dt>${t('cert')}</dt><dd>${certDays === null ? t('certNone') : certDays < 0 ? `<span class="pill off">${t('expired')}</span>` : `<span class="pill ${certDays < 14 ? 'gold' : 'ok'}">${fmt('daysLeft', { n: num(certDays) })}</span>`}</dd>
              <dt>${t('mail')}</dt><dd><span class="pill ${ov.mail ? 'ok' : 'dim'}">${ov.mail ? t('mailOn') : t('mailOff')}</span></dd>
            </dl>
            <div class="rows-meter">
              ${meter(t('memory'), memUsed, memPct, `${bytes(memUsed)} / ${bytes(s.memory.total)}`)}
              ${disk ? meter(t('disk'), 0, diskPct, `${bytes(disk.total - disk.free)} / ${bytes(disk.total)}`) : ''}
              ${meter(t('db'), 0, Math.min(100, s.dbBytes / 5e8 * 100), bytes(s.dbBytes))}
              ${meter('RSS', 0, s.memory.rss / 512e6 * 100, bytes(s.memory.rss))}
            </div>
          </div>
        </section>`;
      $$('#reg button').forEach((b) => b.onclick = async () => { await api('/admin/settings', { registration: b.dataset.v }); $$('#reg button').forEach((x) => x.classList.toggle('active', x === b)); $('#reg-help').textContent = t('regHelp')[b.dataset.v]; toast(t('saved')); });
    },

    async users() {
      const { users } = await api('/admin/users'); state.data.users = users;
      $('#sec-sub').textContent = fmt('subUsers', { n: num(users.length) });
      $('#n-users').textContent = num(users.length);
      const draw = () => {
        const q = state.q.toLowerCase();
        const rows = users.filter((u) => !q || u.email.includes(q) || u.name.toLowerCase().includes(q));
        $('#users-body').innerHTML = rows.length ? rows.map((u) => `<tr data-id="${u.id}">
          <td><div class="who-name">${esc(u.name)}</div><span class="who-mail">${esc(u.email)}</span></td>
          <td>${u.role === 'admin' ? `<span class="pill gold">${t('admin')}</span>` : u.disabled ? `<span class="pill off">${t('disabled')}</span>` : `<span class="pill ok">${t('active')}</span>`}</td>
          <td class="num">${num(u.tasks)}</td><td class="num">${num(u.lists)}</td><td class="num">${when(u.last_sync_at)}</td><td class="num">${when(u.created_at)}</td>
          <td class="act">${u.role === 'admin' ? '' : `<button class="ibtn" data-menu="${u.id}">${icon('more')}</button>`}</td></tr>`).join('') : `<tr class="empty-row"><td colspan="7">${t('noUsers')}</td></tr>`;
      };
      $('#content').innerHTML = `
        <div class="toolbar"><label class="search">${icon('search')}<input id="u-q" type="search" dir="auto" placeholder="${esc(t('search'))}" /></label></div>
        <div class="table-wrap"><table><thead><tr><th>${t('user')}</th><th>${t('status')}</th><th>${t('tasks')}</th><th>${t('lists')}</th><th>${t('lastSync')}</th><th>${t('joined')}</th><th></th></tr></thead><tbody id="users-body"></tbody></table></div>`;
      draw();
      $('#u-q').oninput = (e) => { state.q = e.target.value.trim(); draw(); };
      $('#users-body').onclick = (e) => { const b = e.target.closest('[data-menu]'); if (b) openUserMenu(b, users.find((u) => u.id === b.dataset.menu)); };
    },

    async invites() {
      const { invites } = await api('/admin/invites');
      $('#sec-sub').textContent = t('subInvites');
      $('#n-invites').textContent = invites.filter((i) => !i.used_by).length ? num(invites.filter((i) => !i.used_by).length) : '';
      const link = (c) => `${location.origin}/?invite=${c}`;
      $('#content').innerHTML = `
        <div class="toolbar"><input id="inv-note" class="field-input" style="width:260px" dir="auto" placeholder="${esc(t('invNote'))}" /><button class="btn primary" id="inv-add">${icon('ticket')}<span>${t('invCreate')}</span></button><span class="spacer"></span><span class="hint">${t('invHelp')}</span></div>
        <div class="table-wrap"><table><thead><tr><th>${t('code')}</th><th>${t('note')}</th><th>${t('status')}</th><th>${t('invLink')}</th><th></th></tr></thead><tbody>
          ${invites.length ? invites.map((i) => `<tr><td><code class="cell-code">${esc(i.code)}</code></td><td dir="auto">${esc(i.note)}</td><td>${i.used_by ? `<span class="pill dim">${t('used')} · ${when(i.used_at)}</span>` : `<span class="pill ok">${t('free')}</span>`}</td>
            <td>${i.used_by ? '' : `<button class="btn ghost" data-copy="${esc(link(i.code))}">${icon('copy')}<span>${t('copy')}</span></button>`}</td>
            <td class="act">${i.used_by ? '' : `<button class="btn ghost" data-copy="${esc(i.code)}">${t('code')}</button> `}<button class="ibtn danger" data-del="${esc(i.code)}">${icon('x')}</button></td></tr>`).join('') : `<tr class="empty-row"><td colspan="5">${t('noInvites')}</td></tr>`}
        </tbody></table></div>`;
      $('#inv-add').onclick = async () => { await api('/admin/invites', { note: $('#inv-note').value }); render(); };
      $('#inv-note').onkeydown = (e) => { if (e.key === 'Enter') $('#inv-add').click(); };
      $('#content').onclick = async (e) => {
        const c = e.target.closest('[data-copy]'); if (c) return copy(c.dataset.copy);
        const d = e.target.closest('[data-del]'); if (d && await confirmDialog(t('invites'), fmt('confirmInvDel', { code: d.dataset.del }), t('aDelete'), true)) { await api(`/admin/invites/${d.dataset.del}/delete`, {}); render(); }
      };
    },

    async downloads() {
      const { release: rel, status } = await api('/admin/releases');
      $('#sec-sub').textContent = t('subDownloads');
      const server = location.origin;
      const file = (id) => rel && rel.files.find((f) => f.platform === id);
      const card = (ic, title, body) => `<div class="dl"><div class="dl-head">${icon(ic)}<span>${title}</span></div>${body}</div>`;
      const fileBody = (f) => f ? `<div class="dl-meta">v${esc(rel.version)} · ${bytes(f.size)} · ${num(f.downloads)} ${t('downloadsN')}</div><a class="btn primary" href="${esc(f.url)}">${icon('download')}<span>${t('dlGet')}</span></a>` : `<p class="hint">${t('dlNoRelease')}</p>`;
      $('#content').innerHTML = `
        <section class="panel"><h2>${t('dlServer')}</h2>
          <div class="copy-line"><code>${esc(server)}</code><button class="ibtn" data-copy="${esc(server)}">${icon('copy')}</button></div>
          <p class="hint" style="margin-top:8px">${t('dlIntro')} ${t('dlPublic')}: <a href="/download" target="_blank" style="color:var(--gold)">${esc(server)}/download</a></p>
        </section>
        <div class="dl-grid">
          ${card('windows', t('dlWindows'), fileBody(file('windows')))}
          ${card('android', t('dlAndroid'), (file('android') ? `<div class="dl-meta">v${esc(rel.version)} · ${bytes(file('android').size)} · APK</div><a class="btn primary" href="${esc(file('android').url)}">${icon('download')}<span>${t('dlGet')}</span></a>` : `<p class="hint">${t('dlNoRelease')}</p>`) + `<p class="hint">${t('dlPwaAlt')}</p>`)}
          ${card('linux', t('dlLinux'), (() => { const a = file('linux-appimage'), d = file('linux-deb'); return a || d ? `<div class="dl-meta">v${esc(rel.version)}</div>${a ? `<a class="btn primary" href="${esc(a.url)}">${icon('download')}<span>AppImage · ${bytes(a.size)}</span></a>` : ''}${d ? `<a class="btn ghost" href="${esc(d.url)}">${icon('download')}<span>.deb · ${bytes(d.size)}</span></a>` : ''}` : `<p class="hint">${t('dlNoRelease')}</p>`; })())}
          ${card('web', t('dlWeb'), `<p class="hint">${t('dlWebText')}</p><a class="btn ghost" href="/" target="_blank">${icon('web')}<span>${t('dlOpen')}</span></a>`)}
        </div>
        <p class="hint">${t('dlAutoUpdate')}${rel ? ` · <a href="${esc(rel.page)}" target="_blank" style="color:var(--gold)">GitHub · v${esc(rel.version)}</a>` : ''}${status.error ? ` · <span style="color:var(--danger)">${esc(status.error)}</span>` : ''}</p>`;
      $('#content').onclick = (e) => { const c = e.target.closest('[data-copy]'); if (c) copy(c.dataset.copy); };
    },

    async settings() {
      const s = await api('/admin/settings');
      $('#sec-sub').textContent = t('subSettings');
      $('#content').innerHTML = `
        <div class="grid-2">
          <section class="panel"><h2>${t('regQuick')}</h2>
            <div class="seg" id="reg">${['open', 'invite', 'closed'].map((m) => `<button data-v="${m}" class="${s.registration === m ? 'active' : ''}">${t('reg' + m[0].toUpperCase() + m.slice(1))}</button>`).join('')}</div>
            <p class="hint" style="margin-top:10px" id="reg-help">${t('regHelp')[s.registration]}</p>
          </section>
          <section class="panel"><h2>${t('mail')} <span class="pill ${s.mail ? 'ok' : 'dim'}">${s.mail ? t('mailOn') : t('mailOff')}</span></h2><p class="hint">${t('mailHelp')}</p></section>
        </div>
        <section class="panel"><h2>${t('serverInfo')}</h2>
          <dl class="kv"><dt>${t('publicUrl')}</dt><dd class="ltr">${esc(s.publicUrl)}</dd><dt>${t('panelPath')}</dt><dd class="ltr">/${esc(s.adminPath)}</dd><dt>${t('releasesRepo')}</dt><dd class="ltr">${esc(s.releasesRepo)}</dd></dl>
        </section>
        <section class="panel"><h2>${t('backup')}</h2><div class="form"><a class="btn primary" id="backup" href="#">${icon('download')}<span>${t('backupBtn')}</span></a><p class="hint">${t('backupHelp')}</p></div></section>`;
      $$('#reg button').forEach((b) => b.onclick = async () => { await api('/admin/settings', { registration: b.dataset.v }); $$('#reg button').forEach((x) => x.classList.toggle('active', x === b)); $('#reg-help').textContent = t('regHelp')[b.dataset.v]; toast(t('saved')); });
      $('#backup').onclick = async (e) => { e.preventDefault(); const r = await fetch('/api/admin/backup', { headers: { Authorization: 'Bearer ' + state.token } }); const b = await r.blob(); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `anjam-backup-${new Date().toISOString().slice(0, 10)}.sqlite`; a.click(); };
    },

    async audit() {
      const { audit } = await api('/admin/audit?limit=300');
      $('#sec-sub').textContent = fmt('subAudit', { n: num(audit.length) });
      const draw = () => { const q = state.q.toLowerCase(); $('#audit-list').innerHTML = audit.filter((a) => !q || a.action.includes(q) || a.target.toLowerCase().includes(q) || a.ip.includes(q)).map((a) => `<div class="audit-row"><span class="ts">${when(a.ts)}</span><span>${esc(a.action)}</span><span class="target">${esc(a.target)}</span><span class="ip">${esc(a.ip)}</span></div>`).join('') || `<div class="hint">—</div>`; };
      $('#content').innerHTML = `<div class="toolbar"><label class="search">${icon('search')}<input id="a-q" type="search" dir="auto" placeholder="${esc(t('filterAudit'))}" /></label></div><div id="audit-list"></div>`;
      draw(); $('#a-q').oninput = (e) => { state.q = e.target.value.trim(); draw(); };
    },

    async account() {
      $('#sec-sub').textContent = t('subAccount');
      $('#content').innerHTML = `
        <section class="panel"><h2>${t('account')}</h2><dl class="kv"><dt>${t('user')}</dt><dd class="ltr">${esc(state.admin.name)} · ${esc(state.admin.email)}</dd></dl><p class="hint" style="margin-top:8px">${t('accountHelp')}</p></section>
        <section class="panel"><h2>${t('changePw')}</h2>
          <form class="form" id="pw-form" novalidate>
            <label class="f"><span>${t('curPw')}</span><input id="pw-cur" type="password" class="field-input" dir="ltr" autocomplete="current-password" /></label>
            <label class="f"><span>${t('newPw')}</span><input id="pw-new" type="password" class="field-input" dir="ltr" autocomplete="new-password" /></label>
            <label class="f"><span>${t('newPw2')}</span><input id="pw-new2" type="password" class="field-input" dir="ltr" autocomplete="new-password" /></label>
            <p class="hint">${t('pwHint')}</p><div class="auth-err" id="pw-err"></div>
            <div class="actions"><button class="btn primary" type="submit">${icon('key')}<span>${t('changePw')}</span></button><button class="btn ghost" type="button" id="signout">${t('signOut')}</button></div>
          </form></section>`;
      $('#signout').onclick = signOut;
      $('#pw-form').onsubmit = async (e) => {
        e.preventDefault(); $('#pw-err').textContent = '';
        if ($('#pw-new').value !== $('#pw-new2').value) { $('#pw-err').textContent = t('pwMatch'); return; }
        try { const r = await api('/admin/password', { currentPassword: $('#pw-cur').value, newPassword: $('#pw-new').value }); state.token = r.token; localStorage.setItem('anjam-admin-token', r.token); $('#pw-form').reset(); toast(t('saved')); }
        catch (err) { $('#pw-err').textContent = errText(err); }
      };
    },
  };

  // ============================================================ user row menu
  let menuEl = null;
  function closeMenu() { if (menuEl) { menuEl.remove(); menuEl = null; } }
  function openUserMenu(anchor, u) {
    closeMenu();
    const who = u.name || u.email;
    const items = [
      ['aRename', 'user', async () => { const name = prompt(t('renamePrompt'), u.name); if (name && name.trim()) { await api(`/admin/users/${u.id}`, { action: 'rename', value: name.trim() }); render(); } }],
      [u.disabled ? 'aEnable' : 'aDisable', 'shield', async () => { if (u.disabled || await confirmDialog(t('aDisable'), fmt('confirmDisable', { who }), t('aDisable'), true)) { await api(`/admin/users/${u.id}`, { action: u.disabled ? 'enable' : 'disable' }); render(); } }],
      ['aReset', 'key', async () => { const r = await api(`/admin/users/${u.id}`, { action: 'reset_link' }); resultDialog(t('resetTitle'), t('resetText'), r.link); }],
      null,
      ['aWipe', 'x', async () => { if (await confirmDialog(t('aWipe'), fmt('confirmWipe', { who }), t('aWipe'), true)) { await api(`/admin/users/${u.id}`, { action: 'wipe_data' }); render(); } }, 'danger'],
      ['aDelete', 'x', async () => { if (await confirmDialog(t('aDelete'), fmt('confirmDelete', { who }), t('aDelete'), true)) { await api(`/admin/users/${u.id}`, { action: 'delete' }); render(); } }, 'danger'],
    ];
    menuEl = document.createElement('div'); menuEl.className = 'menu';
    menuEl.innerHTML = items.map((it) => it ? `<button class="${it[3] || ''}" data-i="${items.indexOf(it)}">${icon(it[1])}<span>${t(it[0])}</span></button>` : '<hr>').join('');
    menuEl.onclick = (e) => { const b = e.target.closest('button'); if (!b) return; closeMenu(); items[+b.dataset.i][2]().catch((err) => toast(errText(err))); };
    document.body.appendChild(menuEl);
    const r = anchor.getBoundingClientRect(); const w = menuEl.offsetWidth;
    let left = document.documentElement.dir === 'rtl' ? r.right - w : r.left; left = Math.max(8, Math.min(left, innerWidth - w - 8));
    let top = r.bottom + 4; if (top + menuEl.offsetHeight > innerHeight - 8) top = r.top - menuEl.offsetHeight - 4;
    menuEl.style.left = left + 'px'; menuEl.style.top = top + 'px';
  }
  document.addEventListener('mousedown', (e) => { if (menuEl && !menuEl.contains(e.target) && !e.target.closest('[data-menu]')) closeMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeMenu(); $('#confirm').hidden = true; $('#result').hidden = true; } });

  // ============================================================ boot
  async function enter() {
    try { const me = await api('/admin/me'); state.admin = me.admin; }
    catch { return signOut(); }
    $('#who').textContent = state.admin.name || state.admin.email;
    $('#login').hidden = true; $('#panel').hidden = false;
    render();
  }
  $('#login-form').onsubmit = async (e) => {
    e.preventDefault(); $('#l-err').textContent = ''; $('#l-go').disabled = true;
    try { const r = await api('/admin/login', { email: $('#l-email').value.trim(), password: $('#l-pass').value }); state.token = r.token; localStorage.setItem('anjam-admin-token', r.token); $('#l-pass').value = ''; enter(); }
    catch (err) { $('#l-err').textContent = errText(err); }
    finally { $('#l-go').disabled = false; }
  };
  $$('.nav-item[data-sec]').forEach((b) => b.onclick = () => setSection(b.dataset.sec));
  $('#lang').onclick = () => { state.lang = state.lang === 'fa' ? 'en' : 'fa'; localStorage.setItem('anjam-admin-lang', state.lang); applyLang(); if (state.admin) render(); };
  $('#menu-btn').onclick = () => { $('#panel').classList.toggle('sidebar-open'); $('#scrim').hidden = !$('#panel').classList.contains('sidebar-open'); };
  $('#scrim').onclick = () => { $('#panel').classList.remove('sidebar-open'); $('#scrim').hidden = true; };
  $$('.overlay').forEach((o) => o.addEventListener('mousedown', (e) => { if (e.target === o) o.hidden = true; }));
  applyLang();
  if (state.token) enter();
})();
