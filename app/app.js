/* Anjam — renderer */
(() => {
  'use strict';

  // ============================================================
  // i18n
  // ============================================================
  const I18N = {
    fa: {
      appName: 'انجام', inbox: 'صندوق', today: 'امروز', upcoming: 'پیش‌رو', all: 'همه', completed: 'انجام‌شده', report: 'گزارش',
      lists: 'لیست‌ها', tags: 'برچسب‌ها', settings: 'تنظیمات', more: 'بیشتر', collapse: 'جمع‌کردن', expand: 'باز کردن',
      search: 'جستجو', quickAdd: 'کار جدید…  فردا !2 #کار', add: 'افزودن',
      emptyInbox: 'صندوق خالی است', emptyToday: 'امروز کاری نمانده', emptyUpcoming: 'کاری برای روزهای آینده ثبت نشده', emptyAll: 'هنوز کاری ثبت نشده',
      emptyDone: 'هنوز کاری انجام نشده', emptySearch: 'چیزی پیدا نشد', emptyList: 'این لیست خالی است', emptyTag: 'کاری با این برچسب نیست',
      emptyHint: 'با Ctrl+N یک کار بنویس؛ «فردا»، «!3» و «#برچسب» را همان‌جا می‌فهمد.',
      clearCompleted: 'پاک‌کردن انجام‌شده‌ها', delete: 'حذف', titlePh: 'عنوان کار', notesPh: 'یادداشت…',
      signInUp: 'ورود / ثبت‌نام', server: 'سرور', yourNameL: 'نام', passwordAgain: 'تکرار رمز', inviteCode: 'کد دعوت', forgot: 'رمز را فراموش کرده‌ام', skipAccount: 'فعلاً بدون حساب', ok: 'باشه',
      terms: 'داده‌های شما فقط روی سرور خودتان ذخیره می‌شود و با کسی به اشتراک گذاشته نمی‌شود.',
      tSignin: 'خوش برگشتی', sSignin: 'با حساب خود وارد شوید تا کارها روی همه‌ی دستگاه‌ها همگام شوند.', tSignup: 'ساخت حساب', sSignup: 'یک بار بسازید، همه‌جا استفاده کنید.',
      tForgot: 'بازیابی رمز', sForgot: 'ایمیل حساب را بنویسید. اگر سرور ایمیل داشته باشد، لینک بازیابی می‌رسد؛ وگرنه از مدیر سرور لینک بگیرید.', tReset: 'رمز جدید', sReset: 'یک رمز جدید انتخاب کنید.',
      bSignin: 'ورود', bSignup: 'ساخت حساب', bForgot: 'ارسال لینک', bReset: 'ذخیره رمز',
      vRequired: 'این فیلد لازم است', vEmail: 'ایمیل معتبر نیست', vPass: 'حداقل ۸ کاراکتر، شامل حرف و عدد', vMatch: 'رمزها یکسان نیستند', vServer: 'آدرس با http:// یا https:// شروع شود', vInvite: 'کد دعوت لازم است',
      doneForgotMail: 'اگر این ایمیل ثبت شده باشد، لینک بازیابی برایش فرستاده شد.', doneForgotNoMail: 'این سرور ایمیل نمی‌فرستد. از مدیر سرور بخواهید از پنل مدیریت برایتان «لینک بازیابی رمز» بسازد.', doneReset: 'رمز عوض شد و وارد شدید.', doneSignup: 'حساب ساخته شد. کارهای این دستگاه هم به حساب منتقل شدند.',
      errDisabled: 'این حساب غیرفعال شده', errInvite: 'کد دعوت نامعتبر است', errName: 'نام را وارد کنید', errToken: 'لینک بازیابی نامعتبر یا منقضی است', errLastAdmin: 'تنها مدیر را نمی‌توان حذف کرد',
      editProfile: 'ویرایش حساب', currentPassword: 'رمز فعلی', newPassword: 'رمز جدید (اختیاری)', deleteAccount: 'حذف حساب', confirmDeleteAccount: 'حساب و همه‌ی داده‌های آن روی سرور حذف شود؟ (داده‌های این دستگاه می‌ماند)', profileSaved: 'حساب به‌روز شد', adminPanel: 'پنل مدیریت',
      updates: 'به‌روزرسانی', checkUpdate: 'بررسی', restartUpdate: 'راه‌اندازی مجدد و نصب', upToDate: 'آخرین نسخه را دارید', upChecking: 'در حال بررسی…', upAvailable: 'نسخه {v} پیدا شد', upDownloading: 'دانلود نسخه {v}… {p}٪', upReady: 'نسخه {v} آماده است', upError: 'بررسی ناموفق', upWeb: 'نسخه‌ی وب همیشه آخرین نسخه است',
      account: 'حساب و همگام‌سازی', password: 'رمز عبور', yourName: 'نام (برای ثبت‌نام)', signIn: 'ورود', signUp: 'ثبت‌نام', signOut: 'خروج', syncNow: 'همگام‌سازی',
      accountHint: 'بدون حساب هم همه‌چیز روی همین دستگاه ذخیره می‌شود. با حساب، کارها بین ویندوز، وب و اندروید همگام می‌شوند.',
      lastSync: 'آخرین همگام‌سازی', never: 'هنوز', syncing: 'در حال همگام‌سازی…', synced: 'همگام', syncErr: 'خطا در همگام‌سازی', offline: 'آفلاین',
      errServer: 'آدرس سرور را وارد کنید', errCreds: 'ایمیل یا رمز اشتباه است', errEmail: 'ایمیل معتبر نیست', errWeak: 'رمز باید حداقل ۸ کاراکتر باشد', errTaken: 'این ایمیل قبلاً ثبت شده', errClosed: 'ثبت‌نام در این سرور بسته است', errNet: 'اتصال به سرور برقرار نشد', errMany: 'تلاش زیاد؛ کمی بعد دوباره امتحان کنید',
      subtasks: 'زیرکارها', subtaskPh: 'زیرکار جدید…', close: 'بستن', listDeleted: 'لیست حذف شد؛ کارها به صندوق رفتند', restored: 'پشتیبان جایگزین شد', due: 'سررسید', time: 'ساعت', reminder: 'یادآور', repeat: 'تکرار',
      rNone: 'بدون تکرار', rDaily: 'هر روز', rWeekdays: 'روزهای کاری', rWeekly: 'هر هفته', rMonthly: 'هر ماه', rYearly: 'هر سال',
      priority: 'اولویت', none: 'هیچ', low: 'کم', medium: 'متوسط', high: 'زیاد', list: 'لیست', tagsPh: 'کار خانه',
      tomorrow: 'فردا', nextWeek: 'هفته بعد', yesterday: 'دیروز', overdue: 'عقب‌افتاده', thisWeek: 'این هفته', later: 'بعداً', noDate: 'بدون تاریخ',
      created: 'ایجاد', completedAt: 'انجام', undo: 'بازگردانی', deleted: 'کار حذف شد', cleared: 'کار انجام‌شده پاک شد',
      nextCreated: 'نوبت بعدی ساخته شد', saved: 'ذخیره شد: ',
      subToday: '{n} کار برای امروز', subUpcoming: '{n} کار پیش‌رو', subAll: '{n} کار باز', subDone: '{n} کار انجام‌شده', subInbox: '{n} کار بدون لیست',
      subReport: 'خلاصه‌ی وضعیت کارها', subSearch: 'نتایج «{q}»', subList: '{n} کار باز', subTag: '{n} کار با این برچسب',
      confirmClear: 'همه کارهای انجام‌شده پاک شوند؟', confirmImport: 'داده‌های فعلی با فایل پشتیبان جایگزین شود؟',
      confirmDeleteList: 'لیست حذف شود؟ کارهایش به صندوق منتقل می‌شوند.',
      importOk: 'پشتیبان بازیابی شد', importBad: 'فایل پشتیبان معتبر نیست', reportTitle: 'گزارش کارها', generatedOn: 'تهیه‌شده در',
      stTotal: 'کل کارها', stDone: 'انجام‌شده', stRate: 'نرخ تکمیل', stOverdue: 'عقب‌افتاده', last7: 'انجام‌شده در ۷ روز اخیر',
      byList: 'کارهای باز بر اساس لیست', byPriority: 'کارهای باز بر اساس اولویت', byTag: 'کارهای باز بر اساس برچسب',
      exportTitle: 'خروجی و پشتیبان', expPdf: 'گزارش PDF', expJson: 'پشتیبان JSON', impJson: 'بازیابی',
      language: 'زبان', calendar: 'تقویم', jalali: 'شمسی', gregorian: 'میلادی', notifications: 'اعلان‌ها', notifyDesc: 'یادآور کارها با اعلان ویندوز',
      shortcuts: 'میانبرها', scPalette: 'فرمان‌ها', scAdd: 'کار جدید', scSearch: 'جستجو', scNav: 'حرکت بین کارها', scToggle: 'انجام / برگشت', scOpen: 'باز کردن',
      newList: 'لیست جدید', editList: 'ویرایش لیست', listNamePh: 'نام لیست', save: 'ذخیره', deleteList: 'حذف لیست',
      palettePh: 'کار یا دستور…', pTasks: 'کارها', pActions: 'دستورها', pViews: 'نماها', pLists: 'لیست‌ها', pNoResults: 'چیزی پیدا نشد',
      aNewTask: 'کار جدید', aNewList: 'لیست جدید', aToggleLang: 'تغییر زبان به English', aCalendar: 'تغییر تقویم', aExportPdf: 'خروجی PDF', aBackup: 'پشتیبان JSON', aSettings: 'تنظیمات', aCollapse: 'جمع/باز کردن نوار',
      pickDate: 'انتخاب تاریخ', open: 'باز', done: 'انجام‌شده', notDone: 'باز', reminderTitle: 'یادآور',
      prio: ['—', 'کم', 'متوسط', 'زیاد'], week: ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'],
      jMonths: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
      gMonths: ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'],
      wdSat: ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'], wdSun: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
      csvHead: ['عنوان', 'لیست', 'وضعیت', 'سررسید', 'ساعت', 'اولویت', 'تکرار', 'برچسب‌ها', 'زیرکارها', 'یادداشت', 'ایجاد', 'انجام'],
      repeatShort: { daily: 'روزانه', weekdays: 'روزهای کاری', weekly: 'هفتگی', monthly: 'ماهانه', yearly: 'سالانه' },
    },
    en: {
      appName: 'Anjam', inbox: 'Inbox', today: 'Today', upcoming: 'Upcoming', all: 'All', completed: 'Completed', report: 'Report',
      lists: 'Lists', tags: 'Tags', settings: 'Settings', more: 'More', collapse: 'Collapse', expand: 'Expand',
      search: 'Search', quickAdd: 'New task…  tomorrow !2 #work', add: 'Add',
      emptyInbox: 'Inbox is empty', emptyToday: 'Nothing left for today', emptyUpcoming: 'Nothing scheduled ahead', emptyAll: 'No tasks yet',
      emptyDone: 'Nothing completed yet', emptySearch: 'No matches', emptyList: 'This list is empty', emptyTag: 'No tasks with this tag',
      emptyHint: 'Press Ctrl+N and type; "tomorrow", "!3" and "#tag" are understood inline.',
      clearCompleted: 'Clear completed', delete: 'Delete', titlePh: 'Task title', notesPh: 'Notes…',
      signInUp: 'Sign in / Sign up', server: 'Server', yourNameL: 'Name', passwordAgain: 'Repeat password', inviteCode: 'Invite code', forgot: 'Forgot password', skipAccount: 'Continue without account', ok: 'OK',
      terms: 'Your data is stored only on your own server and is never shared.',
      tSignin: 'Welcome back', sSignin: 'Sign in to keep tasks in sync on every device.', tSignup: 'Create account', sSignup: 'Create once, use everywhere.',
      tForgot: 'Reset password', sForgot: 'Enter your account e-mail. If the server can send mail you will get a link; otherwise ask the server admin for one.', tReset: 'New password', sReset: 'Choose a new password.',
      bSignin: 'Sign in', bSignup: 'Create account', bForgot: 'Send link', bReset: 'Save password',
      vRequired: 'Required', vEmail: 'Invalid e-mail', vPass: 'At least 8 characters with letters and numbers', vMatch: 'Passwords do not match', vServer: 'Must start with http:// or https://', vInvite: 'Invite code required',
      doneForgotMail: 'If that e-mail is registered, a reset link has been sent.', doneForgotNoMail: 'This server does not send e-mail. Ask the server admin to create a reset link from the admin panel.', doneReset: 'Password changed; you are signed in.', doneSignup: 'Account created. Tasks on this device were moved into it.',
      errDisabled: 'This account is disabled', errInvite: 'Invalid invite code', errName: 'Enter your name', errToken: 'Reset link is invalid or expired', errLastAdmin: 'The last admin cannot be deleted',
      editProfile: 'Edit account', currentPassword: 'Current password', newPassword: 'New password (optional)', deleteAccount: 'Delete account', confirmDeleteAccount: 'Delete the account and all its data on the server? (This device keeps its copy)', profileSaved: 'Account updated', adminPanel: 'Admin panel',
      updates: 'Updates', checkUpdate: 'Check', restartUpdate: 'Restart to update', upToDate: 'You have the latest version', upChecking: 'Checking…', upAvailable: 'Version {v} found', upDownloading: 'Downloading {v}… {p}%', upReady: 'Version {v} is ready', upError: 'Check failed', upWeb: 'The web version is always current',
      account: 'Account & sync', password: 'Password', yourName: 'Name (for sign-up)', signIn: 'Sign in', signUp: 'Sign up', signOut: 'Sign out', syncNow: 'Sync now',
      accountHint: 'Without an account everything stays on this device. With one, tasks sync across Windows, web and Android.',
      lastSync: 'Last sync', never: 'never', syncing: 'Syncing…', synced: 'Synced', syncErr: 'Sync failed', offline: 'Offline',
      errServer: 'Enter the server address', errCreds: 'Wrong email or password', errEmail: 'Invalid email', errWeak: 'Password must be at least 8 characters', errTaken: 'This email is already registered', errClosed: 'Sign-ups are closed on this server', errNet: 'Could not reach the server', errMany: 'Too many attempts; try again later',
      subtasks: 'Subtasks', subtaskPh: 'New subtask…', close: 'Close', listDeleted: 'List deleted; tasks moved to Inbox', restored: 'Backup restored', due: 'Due', time: 'Time', reminder: 'Remind', repeat: 'Repeat',
      rNone: 'Never', rDaily: 'Daily', rWeekdays: 'Weekdays', rWeekly: 'Weekly', rMonthly: 'Monthly', rYearly: 'Yearly',
      priority: 'Priority', none: 'None', low: 'Low', medium: 'Medium', high: 'High', list: 'List', tagsPh: 'work home',
      tomorrow: 'Tomorrow', nextWeek: 'Next week', yesterday: 'Yesterday', overdue: 'Overdue', thisWeek: 'This week', later: 'Later', noDate: 'No date',
      created: 'Created', completedAt: 'Completed', undo: 'Undo', deleted: 'Task deleted', cleared: 'completed task(s) cleared',
      nextCreated: 'Next occurrence created', saved: 'Saved: ',
      subToday: '{n} for today', subUpcoming: '{n} upcoming', subAll: '{n} open', subDone: '{n} completed', subInbox: '{n} without a list',
      subReport: 'Overview of your tasks', subSearch: 'Results for "{q}"', subList: '{n} open', subTag: '{n} tagged',
      confirmClear: 'Clear all completed tasks?', confirmImport: 'Replace current data with the backup?',
      confirmDeleteList: 'Delete this list? Its tasks move to Inbox.',
      importOk: 'Backup restored', importBad: 'Invalid backup file', reportTitle: 'Task report', generatedOn: 'Generated on',
      stTotal: 'Total', stDone: 'Completed', stRate: 'Completion', stOverdue: 'Overdue', last7: 'Completed in the last 7 days',
      byList: 'Open tasks by list', byPriority: 'Open tasks by priority', byTag: 'Open tasks by tag',
      exportTitle: 'Export & backup', expPdf: 'PDF report', expJson: 'JSON backup', impJson: 'Restore',
      language: 'Language', calendar: 'Calendar', jalali: 'Jalali', gregorian: 'Gregorian', notifications: 'Notifications', notifyDesc: 'Task reminders as Windows notifications',
      shortcuts: 'Shortcuts', scPalette: 'Commands', scAdd: 'New task', scSearch: 'Search', scNav: 'Move between tasks', scToggle: 'Complete / reopen', scOpen: 'Open',
      newList: 'New list', editList: 'Edit list', listNamePh: 'List name', save: 'Save', deleteList: 'Delete list',
      palettePh: 'Task or command…', pTasks: 'Tasks', pActions: 'Actions', pViews: 'Views', pLists: 'Lists', pNoResults: 'No results',
      aNewTask: 'New task', aNewList: 'New list', aToggleLang: 'تغییر زبان به فارسی', aCalendar: 'Switch calendar', aExportPdf: 'Export PDF', aBackup: 'JSON backup', aSettings: 'Settings', aCollapse: 'Toggle sidebar',
      pickDate: 'Pick a date', open: 'Open', done: 'Done', notDone: 'Open', reminderTitle: 'Reminder',
      prio: ['—', 'Low', 'Medium', 'High'], week: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      jMonths: ['Farvardin', 'Ordibehesht', 'Khordad', 'Tir', 'Mordad', 'Shahrivar', 'Mehr', 'Aban', 'Azar', 'Dey', 'Bahman', 'Esfand'],
      gMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      wdSat: ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'], wdSun: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      csvHead: ['Title', 'List', 'Status', 'Due', 'Time', 'Priority', 'Repeat', 'Tags', 'Subtasks', 'Notes', 'Created', 'Completed'],
      repeatShort: { daily: 'Daily', weekdays: 'Weekdays', weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly' },
    },
  };
  const LIST_COLORS = ['#e2b45a', '#dc1f2e', '#e8743b', '#58c58f', '#4fb3c9', '#7ea4d6', '#a98be0', '#e07ab5', '#b8a48c', '#8e9aa6'];

  // ============================================================
  // State
  // ============================================================
  const state = {
    data: null,
    view: 'today', listId: null, tag: null, query: '',
    selectedId: null, focusId: null, undo: null,
  };
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const t = (k) => I18N[state.data.settings.lang][k];
  const fmt = (k, v) => t(k).replace(/\{(\w+)\}/g, (_, x) => v[x]);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const icon = (n, cls = '') => `<svg class="${cls}"><use href="#i-${n}"/></svg>`;

  // ============================================================
  // Dates
  // ============================================================
  const pad = (n) => String(n).padStart(2, '0');
  const isoLocal = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayIso = () => isoLocal(new Date());
  const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return isoLocal(d); };
  const cal = () => state.data.settings.calendar;
  const lang = () => state.data.settings.lang;
  const locale = () => `${lang() === 'fa' ? 'fa-IR' : 'en-US'}-u-ca-${cal() === 'jalali' ? 'persian' : 'gregory'}`;
  const altLocale = () => `${lang() === 'fa' ? 'fa-IR' : 'en-US'}-u-ca-${cal() === 'jalali' ? 'gregory' : 'persian'}`;
  const numLocale = () => (lang() === 'fa' ? 'fa-IR' : 'en-US');
  const num = (n) => Number(n).toLocaleString(numLocale());
  const toAscii = (s) => s.replace(/[۰-۹]/g, (c) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(c)).replace(/[٠-٩]/g, (c) => '٠١٢٣٤٥٦٧٨٩'.indexOf(c));
  const stripEra = (s) => s.replace(/\s?AP/, '');
  const fmtDate = (iso, o) => iso ? stripEra(new Intl.DateTimeFormat(locale(), o || { weekday: 'short', day: 'numeric', month: 'long' }).format(new Date(iso + 'T00:00:00'))) : '';
  const fmtDateAlt = (iso) => iso ? stripEra(new Intl.DateTimeFormat(altLocale(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso + 'T00:00:00'))) : '';
  const fmtDateTime = (ts) => stripEra(new Intl.DateTimeFormat(locale(), { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ts)));
  const fmtTime = (hm) => hm ? new Intl.DateTimeFormat(numLocale(), { hour: '2-digit', minute: '2-digit' }).format(new Date(`2000-01-01T${hm}:00`)) : '';
  function relDue(iso) {
    const today = todayIso();
    if (iso === today) return { cls: 'today', text: t('today') };
    if (iso === addDays(today, 1)) return { cls: '', text: t('tomorrow') };
    if (iso === addDays(today, -1)) return { cls: 'overdue', text: t('yesterday') };
    if (iso < today) return { cls: 'overdue', text: fmtDate(iso) };
    return { cls: '', text: fmtDate(iso) };
  }

  // ============================================================
  // Quick-add parser
  // ============================================================
  const WEEKDAYS = {
    sun: 0, sunday: 0, mon: 1, monday: 1, tue: 2, tuesday: 2, wed: 3, wednesday: 3, thu: 4, thursday: 4, fri: 5, friday: 5, sat: 6, saturday: 6,
    'یکشنبه': 0, 'یک‌شنبه': 0, 'دوشنبه': 1, 'سه‌شنبه': 2, 'سهشنبه': 2, 'چهارشنبه': 3, 'پنجشنبه': 4, 'پنج‌شنبه': 4, 'جمعه': 5, 'شنبه': 6,
  };
  const PRIO_WORDS = { high: 3, med: 2, medium: 2, low: 1, 'زیاد': 3, 'مهم': 3, 'متوسط': 2, 'کم': 1 };
  function parseQuick(raw) {
    const out = { title: '', due: '', time: '', priority: 0, tags: [], listId: null };
    const kept = [];
    const today = todayIso();
    for (const tok of raw.trim().split(/\s+/)) {
      const low = tok.toLowerCase();
      let m;
      if ((m = /^#([^\s#]+)$/.exec(tok))) { out.tags.push(m[1]); continue; }
      if ((m = /^!([123])$/.exec(tok))) { out.priority = +m[1]; continue; }
      if (low.startsWith('!') && PRIO_WORDS[low.slice(1)]) { out.priority = PRIO_WORDS[low.slice(1)]; continue; }
      if ((m = /^@(.+)$/.exec(tok))) { const l = state.data.lists.find((x) => x.name.toLowerCase() === m[1].toLowerCase()); if (l) { out.listId = l.id; continue; } }
      if (/^(today|امروز)$/.test(low)) { out.due = today; continue; }
      if (/^(tomorrow|فردا)$/.test(low)) { out.due = addDays(today, 1); continue; }
      if (/^(پس‌فردا|پسفردا)$/.test(low)) { out.due = addDays(today, 2); continue; }
      if ((m = /^(\d{1,2}):(\d{2})$/.exec(toAscii(low))) && +m[1] < 24 && +m[2] < 60) { out.time = `${pad(m[1])}:${m[2]}`; continue; }
      if ((m = /^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/.exec(toAscii(low)))) {
        const y = +m[1], mo = +m[2], d = +m[3];
        if (y < 1700) { if (mo >= 1 && mo <= 12 && d >= 1 && d <= Jalali.jalaliMonthLength(y, mo)) { const g = Jalali.toGregorian(y, mo, d); out.due = `${g.gy}-${pad(g.gm)}-${pad(g.gd)}`; continue; } }
        else { const iso = `${y}-${pad(mo)}-${pad(d)}`; if (!isNaN(Date.parse(iso))) { out.due = iso; continue; } }
      }
      if (WEEKDAYS[low] !== undefined) { const diff = (WEEKDAYS[low] - new Date().getDay() + 7) % 7 || 7; out.due = addDays(today, diff); continue; }
      kept.push(tok);
    }
    let joined = kept.join(' ');
    if (/\bnext week\b/i.test(joined) || /هفته (بعد|آینده)/.test(joined)) { out.due = addDays(today, 7); joined = joined.replace(/\bnext week\b/i, '').replace(/هفته (بعد|آینده)/, ''); }
    out.title = joined.replace(/\s{2,}/g, ' ').trim();
    return out;
  }

  // ============================================================
  // Persistence & model
  // ============================================================
  let saveTimer = null;
  const seen = new Map(); // id -> serialized item (without updatedAt), to detect local changes
  const dirty = new Set();
  const serial = (x) => JSON.stringify({ ...x, updatedAt: 0, notifiedAt: 0 });
  function stampChanges() {
    const now = Date.now(); const present = new Set();
    for (const kind of ['tasks', 'lists']) for (const x of state.data[kind]) {
      present.add(x.id);
      const s = serial(x);
      if (seen.get(x.id) !== s) { if (seen.has(x.id) || !x.updatedAt) x.updatedAt = now; seen.set(x.id, s); dirty.add(x.id); }
    }
    for (const id of [...seen.keys()]) if (!present.has(id)) { seen.delete(id); state.data.tombstones[id] = now; dirty.add(id); }
  }
  function snapshotSeen() { seen.clear(); for (const kind of ['tasks', 'lists']) for (const x of state.data[kind]) seen.set(x.id, serial(x)); }
  function save(now) {
    clearTimeout(saveTimer);
    stampChanges();
    if (now) { window.anjam.save(state.data); scheduleSync(0); return; }
    saveTimer = setTimeout(() => window.anjam.save(state.data), 250);
    scheduleSync(2000);
  }
  const REPEATS = ['none', 'daily', 'weekdays', 'weekly', 'monthly', 'yearly'];
  function normalize(data) {
    const d = { version: 3, settings: { lang: 'fa', calendar: 'jalali', notify: true, railCollapsed: false, settingsUpdatedAt: 0 }, lists: [], tasks: [], tombstones: {}, sync: { server: '', token: '', email: '', name: '', cursor: 0, lastSync: 0 } };
    if (data && typeof data === 'object') {
      const s = data.settings || {};
      if (s.lang === 'en' || s.lang === 'fa') d.settings.lang = s.lang;
      d.settings.calendar = s.calendar === 'gregorian' || s.calendar === 'jalali' ? s.calendar : (d.settings.lang === 'fa' ? 'jalali' : 'gregorian');
      if (typeof s.notify === 'boolean') d.settings.notify = s.notify;
      if (typeof s.railCollapsed === 'boolean') d.settings.railCollapsed = s.railCollapsed;
      d.settings.settingsUpdatedAt = Number(s.settingsUpdatedAt) || 0;
      if (data.tombstones && typeof data.tombstones === 'object') d.tombstones = { ...data.tombstones };
      if (data.sync && typeof data.sync === 'object') d.sync = { ...d.sync, ...data.sync };
      if (Array.isArray(data.lists)) d.lists = data.lists.filter((l) => l && typeof l.name === 'string' && l.name.trim()).map((l, i) => ({ id: String(l.id || uid()), name: l.name.trim(), color: /^#[0-9a-f]{6}$/i.test(l.color || '') ? l.color : LIST_COLORS[i % LIST_COLORS.length], order: Number.isFinite(l.order) ? l.order : i, updatedAt: Number(l.updatedAt) || 0 }));
      const listIds = new Set(d.lists.map((l) => l.id));
      if (Array.isArray(data.tasks)) d.tasks = data.tasks.filter((x) => x && typeof x.title === 'string').map((x, i) => ({
        id: String(x.id || uid()), title: x.title, notes: typeof x.notes === 'string' ? x.notes : '',
        listId: listIds.has(x.listId) ? x.listId : null,
        due: /^\d{4}-\d{2}-\d{2}$/.test(x.due || '') ? x.due : '',
        time: /^\d{2}:\d{2}$/.test(x.time || '') ? x.time : '',
        reminder: !!x.reminder, notifiedAt: x.notifiedAt || null,
        repeat: REPEATS.includes(x.repeat) ? x.repeat : 'none',
        priority: [0, 1, 2, 3].includes(+x.priority) ? +x.priority : 0,
        tags: Array.isArray(x.tags) ? [...new Set(x.tags.map(String).filter(Boolean))] : [],
        subtasks: Array.isArray(x.subtasks) ? x.subtasks.filter((s) => s && typeof s.title === 'string').map((s) => ({ id: String(s.id || uid()), title: s.title, done: !!s.done })) : [],
        done: !!x.done, createdAt: Number(x.createdAt) || Date.now(), completedAt: x.done ? Number(x.completedAt) || Date.now() : null,
        order: Number.isFinite(x.order) ? x.order : i, updatedAt: Number(x.updatedAt) || 0,
      }));
    }
    return d;
  }
  const getTask = (id) => state.data.tasks.find((x) => x.id === id);
  const getList = (id) => state.data.lists.find((x) => x.id === id);
  const sortedLists = () => state.data.lists.slice().sort((a, b) => a.order - b.order);

  // ============================================================
  // Task operations
  // ============================================================
  function addTask(raw) {
    const p = parseQuick(raw);
    if (!p.title) return false;
    const minOrder = state.data.tasks.reduce((m, x) => Math.min(m, x.order), 0);
    const task = {
      id: uid(), title: p.title, notes: '', listId: p.listId || (state.view === 'list' ? state.listId : null),
      due: p.due || (state.view === 'today' ? todayIso() : ''), time: p.time, reminder: !!p.time, notifiedAt: null, repeat: 'none',
      priority: p.priority, tags: p.tags.slice(), subtasks: [], done: false, createdAt: Date.now(), completedAt: null, order: minOrder - 1,
    };
    if (state.view === 'tag' && state.tag && !task.tags.includes(state.tag)) task.tags.push(state.tag);
    state.data.tasks.unshift(task);
    save(); render();
    return true;
  }
  function nextDue(iso, repeat) {
    const d = new Date(iso + 'T00:00:00');
    switch (repeat) {
      case 'daily': d.setDate(d.getDate() + 1); break;
      case 'weekdays': do { d.setDate(d.getDate() + 1); } while (d.getDay() === 5 || d.getDay() === 6); break; // skip Fri/Sat (Iran weekend)
      case 'weekly': d.setDate(d.getDate() + 7); break;
      case 'monthly': d.setMonth(d.getMonth() + 1); break;
      case 'yearly': d.setFullYear(d.getFullYear() + 1); break;
    }
    return isoLocal(d);
  }
  function toggleDone(id, done, el) {
    const task = getTask(id); if (!task) return;
    const finish = () => {
      task.done = done; task.completedAt = done ? Date.now() : null;
      if (done && task.repeat !== 'none') {
        const base = task.due || todayIso();
        let due = nextDue(base, task.repeat);
        while (due < todayIso()) due = nextDue(due, task.repeat);
        state.data.tasks.unshift({ ...task, id: uid(), due, done: false, completedAt: null, notifiedAt: null, createdAt: Date.now(), subtasks: task.subtasks.map((s) => ({ ...s, id: uid(), done: false })), order: task.order - 0.5 });
        task.repeat = 'none';
        showToast(t('nextCreated'));
      }
      save(); render();
    };
    // The one authored moment: the row settles, then leaves the sheet.
    const leaves = el && ((done && state.view !== 'done' && state.view !== 'all') || (!done && state.view === 'done'));
    if (leaves) {
      el.classList.add('settling');
      setTimeout(() => { el.style.height = el.offsetHeight + 'px'; el.offsetHeight; el.classList.add('leaving'); setTimeout(finish, 230); }, 180);
    } else finish();
  }
  function deleteTask(id) {
    const idx = state.data.tasks.findIndex((x) => x.id === id); if (idx < 0) return;
    const [removed] = state.data.tasks.splice(idx, 1);
    state.undo = { tasks: [removed], idx };
    if (state.selectedId === id) state.selectedId = null;
    save(); render(); showToast(t('deleted'), true);
  }
  function clearCompleted() {
    const done = state.data.tasks.filter((x) => x.done); if (!done.length) return;
    state.data.tasks = state.data.tasks.filter((x) => !x.done);
    state.undo = { tasks: done, idx: 0 };
    if (done.some((x) => x.id === state.selectedId)) state.selectedId = null;
    save(); render(); showToast(`${num(done.length)} ${t('cleared')}`, true);
  }
  function undo() {
    if (!state.undo) return;
    if (state.undo.restore) state.undo.restore();
    else state.data.tasks.splice(state.undo.idx, 0, ...state.undo.tasks);
    state.undo = null; hideToast(); applyLang(); save(); render();
  }

  // ============================================================
  // Filtering / sorting / grouping
  // ============================================================
  function visibleTasks() {
    const today = todayIso(); const q = state.query.trim().toLowerCase();
    let list = state.data.tasks.slice();
    if (q) list = list.filter((x) => x.title.toLowerCase().includes(q) || x.notes.toLowerCase().includes(q) || x.tags.some((g) => g.toLowerCase().includes(q)) || x.subtasks.some((s) => s.title.toLowerCase().includes(q)));
    else switch (state.view) {
      case 'inbox': list = list.filter((x) => !x.done && !x.listId); break;
      case 'today': list = list.filter((x) => !x.done && x.due && x.due <= today); break;
      case 'upcoming': list = list.filter((x) => !x.done && x.due && x.due > today); break;
      case 'all': list = list.filter((x) => !x.done); break;
      case 'done': list = list.filter((x) => x.done); break;
      case 'list': list = list.filter((x) => !x.done && x.listId === state.listId); break;
      case 'tag': list = list.filter((x) => !x.done && x.tags.includes(state.tag)); break;
    }
    return sortTasks(list);
  }
  function sortTasks(list) {
    return list.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      if (a.done) return (b.completedAt || 0) - (a.completedAt || 0);
      if (!!a.due !== !!b.due) return a.due ? -1 : 1;
      if (a.due !== b.due) return a.due < b.due ? -1 : 1;
      if (a.time !== b.time) return (a.time || '99') < (b.time || '99') ? -1 : 1;
      return a.order - b.order;
    });
  }
  function groupKey(task) {
    const today = todayIso();
    if (task.done) return null;
    if (!task.due) return 'noDate';
    if (task.due < today) return 'overdue';
    if (task.due === today) return 'today';
    if (task.due === addDays(today, 1)) return 'tomorrow';
    if (task.due <= addDays(today, 7)) return 'thisWeek';
    return 'later';
  }

  // ============================================================
  // Rendering
  // ============================================================
  function applyLang() {
    const l = lang();
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'fa' ? 'rtl' : 'ltr';
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $$('[data-i18n-title]').forEach((el) => { el.title = t(el.dataset.i18nTitle); });
    document.title = l === 'fa' ? 'انجام · Anjam' : 'Anjam · انجام';
    $$('#set-lang button').forEach((b) => b.classList.toggle('active', b.dataset.v === l));
    $$('#set-cal button').forEach((b) => b.classList.toggle('active', b.dataset.v === cal()));
    $('#set-notify').checked = state.data.settings.notify;
    $('#cal-preview').textContent = fmtDate(todayIso(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + '  ·  ' + fmtDateAlt(todayIso());
    $('#rail-toggle').title = t(state.data.settings.railCollapsed ? 'expand' : 'collapse');
    $('#d-time').lang = l === 'fa' ? 'fa-IR' : 'en-GB';
  }

  function render() {
    $('#app').classList.toggle('rail-collapsed', state.data.settings.railCollapsed);
    renderRail();
    renderHead();
    const isReport = state.view === 'report' && !state.query;
    $('#report').hidden = !isReport;
    $('#sheet').hidden = isReport;
    $('#capture').hidden = isReport || state.view === 'done';
    if (isReport) renderReport(); else renderRows();
    renderDetail();
    updateScrim();
  }

  function renderRail() {
    const today = todayIso();
    const open = state.data.tasks.filter((x) => !x.done);
    const set = (id, n) => { $(id).textContent = n ? num(n) : ''; };
    set('#count-inbox', open.filter((x) => !x.listId).length);
    set('#count-today', open.filter((x) => x.due && x.due <= today).length);
    set('#count-upcoming', open.filter((x) => x.due && x.due > today).length);
    set('#count-all', open.length);
    set('#count-done', state.data.tasks.length - open.length);
    const activeView = state.query ? null : state.view;
    $$('.nav-item[data-view], .tabbar button[data-view]').forEach((b) => b.classList.toggle('active', b.dataset.view === activeView));
    $('#tab-lists').classList.toggle('active', activeView === 'list' || activeView === 'inbox');

    // lists
    const lw = $('#list-items'); lw.innerHTML = '';
    const lists = sortedLists();
    if (!lists.length) lw.innerHTML = `<div class="rail-empty">${t('newList')} →</div>`;
    lists.forEach((l) => {
      const n = open.filter((x) => x.listId === l.id).length;
      const b = document.createElement('button');
      b.className = 'rail-item' + (activeView === 'list' && state.listId === l.id ? ' active' : '');
      b.title = l.name;
      b.innerHTML = `<span class="dot" style="background:${l.color}"></span><span class="nav-label">${esc(l.name)}</span><span class="count">${n ? num(n) : ''}</span><span class="ibtn sm rail-edit" title="${esc(t('editList'))}">${icon('more')}</span>`;
      b.onclick = (e) => { if (e.target.closest('.rail-edit')) return openListDialog(l.id); setView('list', { listId: l.id }); };
      lw.appendChild(b);
    });
    // tags
    const counts = {};
    open.forEach((x) => x.tags.forEach((g) => { counts[g] = (counts[g] || 0) + 1; }));
    const tw = $('#tag-items'); tw.innerHTML = '';
    const names = Object.keys(counts).sort((a, b) => a.localeCompare(b, numLocale()));
    if (!names.length) tw.innerHTML = `<div class="rail-empty">#…</div>`;
    names.forEach((name) => {
      const b = document.createElement('button');
      b.className = 'rail-item' + (activeView === 'tag' && state.tag === name ? ' active' : '');
      b.title = '#' + name;
      b.innerHTML = `<span class="dot tag"></span><span class="nav-label">${esc(name)}</span><span class="count">${num(counts[name])}</span>`;
      b.onclick = () => setView('tag', { tag: name });
      tw.appendChild(b);
    });
  }

  function renderHead() {
    const today = todayIso();
    const open = state.data.tasks.filter((x) => !x.done);
    let title, sub;
    if (state.query) { title = t('search'); sub = fmt('subSearch', { q: state.query }); }
    else switch (state.view) {
      case 'inbox': title = t('inbox'); sub = fmt('subInbox', { n: num(open.filter((x) => !x.listId).length) }); break;
      case 'today': title = t('today'); sub = `${fmtDate(today, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${fmt('subToday', { n: num(open.filter((x) => x.due && x.due <= today).length) })}`; break;
      case 'upcoming': title = t('upcoming'); sub = fmt('subUpcoming', { n: num(open.filter((x) => x.due && x.due > today).length) }); break;
      case 'all': title = t('all'); sub = fmt('subAll', { n: num(open.length) }); break;
      case 'done': title = t('completed'); sub = fmt('subDone', { n: num(state.data.tasks.length - open.length) }); break;
      case 'report': title = t('report'); sub = t('subReport'); break;
      case 'list': { const l = getList(state.listId); title = l ? l.name : ''; sub = fmt('subList', { n: num(open.filter((x) => x.listId === state.listId).length) }); break; }
      case 'tag': title = '#' + state.tag; sub = fmt('subTag', { n: num(open.filter((x) => x.tags.includes(state.tag)).length) }); break;
    }
    $('#view-title').textContent = title; $('#view-sub').textContent = sub;
  }

  function renderRows() {
    const list = visibleTasks();
    const wrap = $('#task-list'); wrap.innerHTML = '';
    $('#empty').hidden = list.length > 0;
    if (!list.length) {
      const key = state.query ? 'emptySearch' : ({ inbox: 'emptyInbox', today: 'emptyToday', upcoming: 'emptyUpcoming', all: 'emptyAll', done: 'emptyDone', list: 'emptyList', tag: 'emptyTag' })[state.view];
      $('#empty .empty-text').textContent = t(key);
      $('#empty .empty-hint').hidden = state.view === 'done' || !!state.query;
    }
    $('#list-actions').hidden = !(state.view === 'done' && list.length && !state.query);
    const grouped = !state.query && ['today', 'all', 'upcoming', 'list', 'tag', 'inbox'].includes(state.view);
    let last = null, groupCounts = {};
    if (grouped) list.forEach((x) => { const g = groupKey(x); groupCounts[g] = (groupCounts[g] || 0) + 1; });
    list.forEach((task) => {
      if (grouped) {
        const g = groupKey(task);
        if (g && g !== last) {
          const h = document.createElement('div');
          h.className = 'group ' + g;
          h.innerHTML = `<span>${esc(t(g))}</span><span class="n">${num(groupCounts[g])}</span>`;
          wrap.appendChild(h); last = g;
        }
      }
      wrap.appendChild(rowEl(task));
    });
    if (state.focusId && !list.some((x) => x.id === state.focusId)) state.focusId = null;
  }

  function rowEl(task) {
    const el = document.createElement('div');
    el.className = `row${task.done ? ' done' : ''}${task.id === state.selectedId ? ' selected' : ''}`;
    el.dataset.id = task.id; el.setAttribute('role', 'listitem'); el.tabIndex = task.id === (state.focusId || state.selectedId) ? 0 : -1;
    el.draggable = !task.done && !state.query;
    const meta = [];
    if (task.due) { const r = relDue(task.due); meta.push(`<span class="due ${task.done ? '' : r.cls}">${icon('calendar')}${esc(r.text)}${task.time ? ' · ' + esc(fmtTime(task.time)) : ''}</span>`); }
    else if (task.time) meta.push(`<span>${icon('clock')}${esc(fmtTime(task.time))}</span>`);
    if (task.repeat !== 'none') meta.push(`<span>${icon('repeat')}${esc(t('repeatShort')[task.repeat])}</span>`);
    if (task.subtasks.length) { const d = task.subtasks.filter((s) => s.done).length; meta.push(`<span class="sub${d === task.subtasks.length ? ' full' : ''}">${icon('subtask')}${num(d)}/${num(task.subtasks.length)}</span>`); }
    const l = task.listId && getList(task.listId);
    if (l && state.view !== 'list') meta.push(`<span class="list"><i style="background:${l.color}"></i><span dir="auto">${esc(l.name)}</span></span>`);
    task.tags.forEach((g) => meta.push(`<span class="tag" dir="auto">#${esc(g)}</span>`));
    if (task.notes.trim()) meta.push(`<span>${icon('notes')}</span>`);
    if (task.done && task.completedAt) meta.push(`<span>${icon('check')}${esc(fmtDateTime(task.completedAt))}</span>`);
    el.innerHTML = `
      <span class="row-grip">${icon('grip')}</span>
      <label class="tick"><input type="checkbox" ${task.done ? 'checked' : ''} tabindex="-1"><span class="tick-box">${icon('check')}</span></label>
      <div class="row-main"><div class="row-title">${esc(task.title)}</div>${meta.length ? `<div class="row-meta">${meta.join('')}</div>` : ''}</div>
      ${task.priority ? `<span class="row-flag p${task.priority}" title="${esc(t('prio')[task.priority])}">${icon('flag')}</span>` : ''}
      <button class="ibtn sm danger row-del" tabindex="-1" title="${esc(t('delete'))}">${icon('trash')}</button>`;
    el.querySelector('input').addEventListener('change', (e) => toggleDone(task.id, e.target.checked, el));
    el.querySelector('.row-main').addEventListener('click', () => openDetail(task.id));
    el.querySelector('.row-del').addEventListener('click', (e) => { e.stopPropagation(); deleteTask(task.id); });
    el.addEventListener('focus', () => { state.focusId = task.id; });
    // drag reorder (same group only)
    el.addEventListener('dragstart', (e) => { drag.id = task.id; el.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    el.addEventListener('dragend', () => { drag.id = null; $$('.row').forEach((r) => r.classList.remove('dragging', 'drop-before', 'drop-after')); });
    el.addEventListener('dragover', (e) => {
      if (!drag.id || drag.id === task.id) return;
      const src = getTask(drag.id); if (!src || groupKey(src) !== groupKey(task)) return;
      e.preventDefault();
      const r = el.getBoundingClientRect(); const before = e.clientY < r.top + r.height / 2;
      el.classList.toggle('drop-before', before); el.classList.toggle('drop-after', !before);
    });
    el.addEventListener('dragleave', () => el.classList.remove('drop-before', 'drop-after'));
    el.addEventListener('drop', (e) => {
      e.preventDefault(); const before = el.classList.contains('drop-before');
      el.classList.remove('drop-before', 'drop-after');
      const src = getTask(drag.id); if (!src || src.id === task.id) return;
      // Give the dragged task the same due/time as the target (same group), then place it by order.
      src.due = task.due;
      const siblings = visibleTasks().filter((x) => x.id !== src.id && groupKey(x) === groupKey(task));
      const idx = siblings.findIndex((x) => x.id === task.id);
      siblings.splice(before ? idx : idx + 1, 0, src);
      siblings.forEach((x, i) => { x.order = i; });
      save(); render();
    });
    return el;
  }
  const drag = { id: null };

  // ---------- Detail ----------
  function openDetail(id) { state.selectedId = id; state.focusId = id; render(); }
  function closeDetail() { state.selectedId = null; render(); const r = state.focusId && document.querySelector(`.row[data-id="${state.focusId}"]`); if (r) r.focus(); }
  function autoGrow(ta) { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; }
  function renderDetail() {
    const task = getTask(state.selectedId);
    $('#detail').hidden = !task;
    if (!task) return;
    const ae = document.activeElement;
    $('#d-done').checked = task.done;
    if (ae !== $('#d-title')) { $('#d-title').value = task.title; autoGrow($('#d-title')); }
    if (ae !== $('#d-notes')) { $('#d-notes').value = task.notes; autoGrow($('#d-notes')); }
    const l = task.listId && getList(task.listId);
    $('#d-list-name').innerHTML = l ? `<i style="background:${l.color}"></i>${esc(l.name)}` : `${icon('inbox')}${esc(t('inbox'))}`;
    $('#d-due-text').textContent = task.due ? fmtDate(task.due, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : t('pickDate');
    $('#d-due-text').classList.toggle('placeholder', !task.due);
    $('#d-due-alt').textContent = task.due ? fmtDateAlt(task.due) : '';
    $('#d-time').value = task.time; $('#d-reminder').checked = task.reminder; $('#d-reminder-wrap').style.opacity = task.time ? 1 : .45;
    $('#d-repeat').value = task.repeat;
    $$('#d-prio button').forEach((b) => b.classList.toggle('active', +b.dataset.p === task.priority));
    const sel = $('#d-listsel');
    sel.innerHTML = `<option value="">${esc(t('inbox'))}</option>` + sortedLists().map((x) => `<option value="${x.id}">${esc(x.name)}</option>`).join('');
    sel.value = task.listId || '';
    if (ae !== $('#d-tags')) $('#d-tags').value = task.tags.join(' ');
    // subtasks
    const done = task.subtasks.filter((s) => s.done).length;
    $('#d-sub-progress').textContent = task.subtasks.length ? `${num(done)} / ${num(task.subtasks.length)}` : '';
    const sw = $('#d-subtasks'); sw.innerHTML = '';
    task.subtasks.forEach((s) => {
      const row = document.createElement('div'); row.className = 'subtask' + (s.done ? ' done' : '');
      row.innerHTML = `<label class="tick sm"><input type="checkbox" ${s.done ? 'checked' : ''}><span class="tick-box">${icon('check')}</span></label><input type="text" dir="auto" value="${esc(s.title)}"><button class="ibtn sm danger">${icon('x')}</button>`;
      row.querySelector('input[type=checkbox]').onchange = (e) => { s.done = e.target.checked; save(); render(); };
      const ti = row.querySelector('input[type=text]');
      ti.oninput = (e) => { s.title = e.target.value; save(); };
      ti.onblur = () => { if (!s.title.trim()) { task.subtasks = task.subtasks.filter((x) => x !== s); save(); render(); } };
      ti.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); $('#d-sub-input').focus(); } };
      row.querySelector('button').onclick = () => { task.subtasks = task.subtasks.filter((x) => x !== s); save(); render(); };
      sw.appendChild(row);
    });
    $('#d-meta').innerHTML = `${esc(t('created'))}: ${esc(fmtDateTime(task.createdAt))}` + (task.completedAt ? `<br>${esc(t('completedAt'))}: ${esc(fmtDateTime(task.completedAt))}` : '');
  }
  function bindDetail() {
    const cur = () => getTask(state.selectedId);
    $('#detail-close').onclick = closeDetail;
    $('#detail-delete').onclick = () => deleteTask(state.selectedId);
    $('#d-done').onchange = (e) => toggleDone(state.selectedId, e.target.checked);
    $('#d-title').oninput = (e) => { const x = cur(); if (!x) return; x.title = e.target.value.replace(/\n/g, ' '); autoGrow(e.target); save(); const r = document.querySelector(`.row[data-id="${x.id}"] .row-title`); if (r) r.textContent = x.title; };
    $('#d-title').onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); $('#d-notes').focus(); } };
    $('#d-title').onblur = () => { const x = cur(); if (x && !x.title.trim()) { x.title = '…'; save(); render(); } };
    $('#d-notes').oninput = (e) => { const x = cur(); if (x) { x.notes = e.target.value; autoGrow(e.target); save(); } };
    $('#d-due').onclick = (e) => { const x = cur(); if (x) openPicker(e.currentTarget, x.due, (iso) => { x.due = iso; save(); render(); }); };
    $$('.chip[data-due]').forEach((b) => b.onclick = () => { const x = cur(); if (!x) return; const td = todayIso(); x.due = ({ today: td, tomorrow: addDays(td, 1), nextweek: addDays(td, 7), '': '' })[b.dataset.due]; save(); render(); });
    $('#d-time').onchange = (e) => { const x = cur(); if (!x) return; x.time = e.target.value || ''; if (!x.time) x.reminder = false; else if (!x.reminder) x.reminder = true; x.notifiedAt = null; save(); render(); };
    $('#d-reminder').onchange = (e) => { const x = cur(); if (!x) return; x.reminder = e.target.checked; x.notifiedAt = null; save(); };
    $('#d-repeat').onchange = (e) => { const x = cur(); if (!x) return; x.repeat = e.target.value; if (x.repeat !== 'none' && !x.due) x.due = todayIso(); save(); render(); };
    $$('#d-prio button').forEach((b) => b.onclick = () => { const x = cur(); if (x) { x.priority = +b.dataset.p; save(); render(); } });
    $('#d-listsel').onchange = (e) => { const x = cur(); if (x) { x.listId = e.target.value || null; save(); render(); } };
    $('#d-tags').onchange = (e) => { const x = cur(); if (!x) return; x.tags = [...new Set(e.target.value.split(/[\s,،]+/).map((s) => s.replace(/^#/, '').trim()).filter(Boolean))]; save(); render(); };
    $('#d-sub-input').onkeydown = (e) => {
      if (e.key !== 'Enter') return; e.preventDefault();
      const x = cur(); const v = e.target.value.trim(); if (!x || !v) return;
      x.subtasks.push({ id: uid(), title: v, done: false }); e.target.value = ''; save(); render(); $('#d-sub-input').focus();
    };
  }

  // ---------- Lists ----------
  const listDlg = { id: null, color: LIST_COLORS[0] };
  function openListDialog(id) {
    listDlg.id = id || null;
    const l = id && getList(id);
    listDlg.color = l ? l.color : LIST_COLORS[state.data.lists.length % LIST_COLORS.length];
    $('#list-dialog-title').textContent = t(l ? 'editList' : 'newList');
    $('#list-name').value = l ? l.name : '';
    $('#list-delete').hidden = !l;
    renderSwatches();
    $('#list-dialog').hidden = false;
    setTimeout(() => $('#list-name').focus(), 30);
  }
  function renderSwatches() {
    $('#list-colors').innerHTML = LIST_COLORS.map((c) => `<button class="swatch${c === listDlg.color ? ' active' : ''}" style="background:${c}" data-c="${c}"></button>`).join('');
    $$('#list-colors .swatch').forEach((b) => b.onclick = () => { listDlg.color = b.dataset.c; renderSwatches(); });
  }
  function saveList() {
    const name = $('#list-name').value.trim(); if (!name) { $('#list-name').focus(); return; }
    if (listDlg.id) { const l = getList(listDlg.id); l.name = name; l.color = listDlg.color; }
    else { const id = uid(); state.data.lists.push({ id, name, color: listDlg.color, order: state.data.lists.length }); state.view = 'list'; state.listId = id; }
    $('#list-dialog').hidden = true; save(); render();
  }
  function deleteList() {
    if (!listDlg.id) return;
    const id = listDlg.id; const list = getList(id); const moved = state.data.tasks.filter((x) => x.listId === id).map((x) => x.id);
    moved.forEach((tid) => { getTask(tid).listId = null; });
    state.data.lists = state.data.lists.filter((l) => l.id !== id);
    if (state.view === 'list' && state.listId === id) { state.view = 'inbox'; state.listId = null; }
    state.undo = { restore: () => { state.data.lists.push(list); moved.forEach((tid) => { const x = getTask(tid); if (x) x.listId = id; }); } };
    $('#list-dialog').hidden = true; save(); render(); showToast(t('listDeleted'), true);
  }

  // ---------- Report ----------
  function computeStats() {
    const today = todayIso(); const tasks = state.data.tasks;
    const done = tasks.filter((x) => x.done), open = tasks.filter((x) => !x.done);
    const overdue = open.filter((x) => x.due && x.due < today);
    const week = [];
    for (let i = 6; i >= 0; i--) { const iso = addDays(today, -i); week.push({ iso, count: done.filter((x) => x.completedAt && isoLocal(new Date(x.completedAt)) === iso).length, wd: new Date(iso + 'T00:00:00').getDay(), today: iso === today }); }
    const byPrio = [3, 2, 1, 0].map((p) => ({ p, n: open.filter((x) => x.priority === p).length }));
    const tagCounts = {}; open.forEach((x) => x.tags.forEach((g) => { tagCounts[g] = (tagCounts[g] || 0) + 1; }));
    const byTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const byList = [{ name: t('inbox'), color: null, n: open.filter((x) => !x.listId).length }, ...sortedLists().map((l) => ({ name: l.name, color: l.color, n: open.filter((x) => x.listId === l.id).length }))].filter((x) => x.n);
    return { total: tasks.length, done: done.length, open: open.length, overdue: overdue.length, rate: tasks.length ? Math.round(done.length / tasks.length * 100) : 0, week, byPrio, byTag, byList, overdueList: overdue };
  }
  const meter = (k, n, max, color) => `<div class="meter"><span class="meter-k" dir="auto">${color ? `<i style="background:${color}"></i>` : ''}${esc(k)}</span><span class="meter-t"><span class="meter-f" style="width:${(n / max) * 100}%"></span></span><span class="meter-v">${num(n)}</span></div>`;
  function renderReport() {
    const s = computeStats();
    $('#st-total').textContent = num(s.total); $('#st-done').textContent = num(s.done);
    $('#st-rate').textContent = num(s.rate) + (lang() === 'fa' ? '٪' : '%'); $('#st-overdue').textContent = num(s.overdue);
    const max = Math.max(1, ...s.week.map((w) => w.count));
    $('#bars-week').innerHTML = s.week.map((w) => `<div class="bar${w.today ? ' today' : ''}"><span class="bar-v">${num(w.count)}</span><span class="bar-f" style="height:${Math.max(2, (w.count / max) * 78)}%"></span><span class="bar-l">${t('week')[w.wd]}</span></div>`).join('');
    const pm = Math.max(1, ...s.byPrio.map((x) => x.n));
    $('#rows-priority').innerHTML = s.byPrio.map((x) => meter(t('prio')[x.p], x.n, pm)).join('');
    const tm = Math.max(1, ...s.byTag.map((x) => x[1]));
    $('#rows-tags').innerHTML = s.byTag.length ? s.byTag.map((x) => meter('#' + x[0], x[1], tm)).join('') : `<div class="rail-empty">—</div>`;
    const lm = Math.max(1, ...s.byList.map((x) => x.n));
    $('#rows-list').innerHTML = s.byList.length ? s.byList.map((x) => meter(x.name, x.n, lm, x.color)).join('') : `<div class="rail-empty">—</div>`;
  }

  // ---------- Export ----------
  const stamp = () => todayIso();
  const csvCell = (v) => { const s = String(v ?? ''); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const listName = (x) => { const l = x.listId && getList(x.listId); return l ? l.name : t('inbox'); };
  async function doExport(name, filters, content) {
    const r = await window.anjam.exportFile({ defaultName: name, filters, content });
    if (r.ok) showToast(t('saved') + r.filePath.split(/[\\/]/).pop());
  }
  function exportCsv() {
    const rows = [t('csvHead')];
    sortTasks(state.data.tasks.slice()).forEach((x) => rows.push([x.title, listName(x), x.done ? t('done') : t('notDone'), x.due, x.time, t('prio')[x.priority], x.repeat === 'none' ? '' : t('repeatShort')[x.repeat], x.tags.join(' '), x.subtasks.map((s) => `[${s.done ? 'x' : ' '}] ${s.title}`).join(' | '), x.notes, new Date(x.createdAt).toISOString(), x.completedAt ? new Date(x.completedAt).toISOString() : '']));
    return doExport(`anjam-${stamp()}.csv`, [{ name: 'CSV', extensions: ['csv'] }], rows.map((r) => r.map(csvCell).join(',')).join('\r\n'));
  }
  function exportMd() {
    const s = computeStats();
    const L = [`# ${t('reportTitle')} — ${t('appName')}`, '', `${t('generatedOn')}: ${fmtDateTime(Date.now())}`, '', `- ${t('stTotal')}: ${num(s.total)}`, `- ${t('stDone')}: ${num(s.done)}`, `- ${t('stRate')}: ${num(s.rate)}%`, `- ${t('stOverdue')}: ${num(s.overdue)}`, ''];
    const section = (title, list) => { if (!list.length) return; L.push(`## ${title}`, ''); list.forEach((x) => { L.push(`- [${x.done ? 'x' : ' '}] ${x.title}${x.due ? ` (${x.due}${x.time ? ' ' + x.time : ''})` : ''}${x.priority ? ` !${x.priority}` : ''}${x.tags.map((g) => ` #${g}`).join('')} — ${listName(x)}`); x.subtasks.forEach((st) => L.push(`  - [${st.done ? 'x' : ' '}] ${st.title}`)); if (x.notes) L.push(`  ${x.notes.replace(/\n/g, '\n  ')}`); }); L.push(''); };
    const sorted = sortTasks(state.data.tasks.slice());
    section(t('overdue'), s.overdueList); section(t('open'), sorted.filter((x) => !x.done && !(x.due && x.due < todayIso()))); section(t('completed'), sorted.filter((x) => x.done));
    return doExport(`anjam-${stamp()}.md`, [{ name: 'Markdown', extensions: ['md'] }], L.join('\n'));
  }
  const exportJson = () => doExport(`anjam-backup-${stamp()}.json`, [{ name: 'JSON', extensions: ['json'] }], JSON.stringify(state.data, null, 2));
  async function exportPdf() {
    const s = computeStats(); const l = lang(); const sorted = sortTasks(state.data.tasks.slice()); const today = todayIso();
    const li = (x) => `<li class="${x.done ? 'done' : ''}"><span class="box">${x.done ? '✓' : ''}</span><span class="tt">${esc(x.title)}</span><span class="m">${x.due ? esc(fmtDate(x.due, { day: 'numeric', month: 'short', year: 'numeric' })) : ''}${x.time ? ' ' + esc(fmtTime(x.time)) : ''} ${x.priority ? '!'.repeat(x.priority) : ''} ${x.tags.map((g) => '#' + esc(g)).join(' ')} <em>${esc(listName(x))}</em></span>${x.subtasks.length ? `<ul class="s">${x.subtasks.map((st) => `<li>${st.done ? '☑' : '☐'} ${esc(st.title)}</li>`).join('')}</ul>` : ''}${x.notes ? `<div class="n">${esc(x.notes).replace(/\n/g, '<br>')}</div>` : ''}</li>`;
    const sec = (title, list, cls = '') => list.length ? `<h2 class="${cls}">${esc(title)} <small>${num(list.length)}</small></h2><ul>${list.map(li).join('')}</ul>` : '';
    const wmax = Math.max(1, ...s.week.map((q) => q.count));
    const html = `<!DOCTYPE html><html lang="${l}" dir="${l === 'fa' ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>
body{font-family:'Vazirmatn','Segoe UI',Tahoma,sans-serif;color:#1a1a1a;margin:0;padding:8px 4px;font-size:12px}
h1{font-size:22px;margin:0 0 2px;color:#8a0f19}.sub{color:#777;margin-bottom:16px}
.stats{display:flex;border-top:2px solid #8a0f19;border-bottom:1px solid #ddd;margin-bottom:18px}.st{flex:1;padding:10px 8px;border-inline-end:1px solid #ddd}.st:last-child{border:0}
.st b{display:block;font-size:20px;color:#8a0f19}.st span{color:#777;font-size:11px}
h2{font-size:14px;border-bottom:1.5px solid #8a0f19;padding-bottom:3px;margin:16px 0 8px}h2.ov{border-color:#d33}h2 small{color:#999;font-weight:400}
ul{list-style:none;padding:0;margin:0}li{padding:5px 0;border-bottom:1px dotted #ddd;page-break-inside:avoid}ul.s{margin:3px 0 0 24px}ul.s li{border:0;padding:1px 0;color:#555;font-size:11px}
.box{display:inline-block;width:13px;height:13px;border:1.5px solid #8a0f19;border-radius:3px;text-align:center;line-height:12px;font-size:10px;margin-inline-end:8px;vertical-align:middle;color:#8a0f19}
.done .tt{text-decoration:line-through;color:#888}.m{color:#8a0f19;font-size:10.5px;margin-inline-start:8px}.m em{color:#999;font-style:normal}.n{color:#666;font-size:11px;margin:3px 0 0 24px;white-space:pre-wrap}
.week{display:flex;gap:6px;align-items:flex-end;height:70px;margin:6px 0 14px}.week div{flex:1;text-align:center;font-size:10px;color:#777}.week i{display:block;background:#b3121f;border-radius:3px 3px 0 0;margin:0 auto 3px;width:70%}
</style></head><body><h1>${esc(t('reportTitle'))} — ${esc(t('appName'))}</h1><div class="sub">${esc(t('generatedOn'))}: ${esc(fmtDateTime(Date.now()))}</div>
<div class="stats"><div class="st"><b>${num(s.total)}</b><span>${esc(t('stTotal'))}</span></div><div class="st"><b>${num(s.done)}</b><span>${esc(t('stDone'))}</span></div><div class="st"><b>${num(s.rate)}%</b><span>${esc(t('stRate'))}</span></div><div class="st"><b style="color:#d33">${num(s.overdue)}</b><span>${esc(t('stOverdue'))}</span></div></div>
<h2>${esc(t('last7'))}</h2><div class="week">${s.week.map((w) => `<div><i style="height:${Math.max(2, (w.count / wmax) * 48)}px"></i>${num(w.count)}<br>${t('week')[w.wd]}</div>`).join('')}</div>
${sec(t('overdue'), s.overdueList, 'ov')}${sec(t('open'), sorted.filter((x) => !x.done && !(x.due && x.due < today)))}${sec(t('completed'), sorted.filter((x) => x.done))}</body></html>`;
    const r = await window.anjam.exportPdf({ defaultName: `anjam-report-${stamp()}.pdf`, html });
    if (r.ok) showToast(t('saved') + r.filePath.split(/[\\/]/).pop());
  }
  async function importJson() {
    const r = await window.anjam.importFile();
    if (!r.ok) { if (r.error) showToast(t('importBad')); return; }
    if (!r.data || !Array.isArray(r.data.tasks)) { showToast(t('importBad')); return; }
    const previous = state.data;
    const keepSync = state.data.sync;
    state.data = normalize(r.data); state.data.sync = keepSync; state.selectedId = null;
    for (const x of state.data.tasks) dirty.add(x.id); for (const x of state.data.lists) dirty.add(x.id);
    state.undo = { restore: () => { state.data = previous; snapshotSeen(); } };
    applyLang(); save(true); render(); showToast(t('restored'), true);
  }

  // ---------- Toast ----------
  let toastTimer = null;
  function showToast(text, withUndo) {
    $('#toast-text').textContent = text; $('#toast-undo').hidden = !withUndo; $('#toast').hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(hideToast, withUndo ? 6000 : 2500);
  }
  function hideToast() { $('#toast').hidden = true; if (!$('#toast-undo').hidden) state.undo = null; }

  // ---------- Date picker ----------
  const picker = { y: 0, m: 0, value: '', onPick: null };
  const isoToParts = (iso) => { const [gy, gm, gd] = iso.split('-').map(Number); if (cal() === 'jalali') { const j = Jalali.toJalali(gy, gm, gd); return { y: j.jy, m: j.jm, d: j.jd }; } return { y: gy, m: gm, d: gd }; };
  const partsToIso = (y, m, d) => { if (cal() === 'jalali') { const g = Jalali.toGregorian(y, m, d); return `${g.gy}-${pad(g.gm)}-${pad(g.gd)}`; } return `${y}-${pad(m)}-${pad(d)}`; };
  const monthLen = (y, m) => (cal() === 'jalali' ? Jalali.jalaliMonthLength(y, m) : new Date(y, m, 0).getDate());
  function openPicker(anchor, value, onPick) {
    picker.value = value || ''; picker.onPick = onPick;
    const p = isoToParts(value || todayIso()); picker.y = p.y; picker.m = p.m;
    const el = $('#datepicker'); el.hidden = false; renderPicker();
    const r = anchor.getBoundingClientRect(); const w = el.offsetWidth, h = el.offsetHeight;
    let left = document.documentElement.dir === 'rtl' ? r.right - w : r.left; left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    let top = r.bottom + 6; if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 6);
    el.style.left = left + 'px'; el.style.top = top + 'px';
  }
  function closePicker() { $('#datepicker').hidden = true; picker.onPick = null; }
  function renderPicker() {
    const jal = cal() === 'jalali'; const months = jal ? t('jMonths') : t('gMonths');
    $('#dp-title').textContent = `${months[picker.m - 1]} ${num(picker.y).replace(/[,٬]/g, '')}`;
    const firstDow = jal ? 6 : 0; const wd = jal ? t('wdSat') : t('wdSun');
    const len = monthLen(picker.y, picker.m); const startDow = new Date(partsToIso(picker.y, picker.m, 1) + 'T00:00:00').getDay();
    const offset = (startDow - firstDow + 7) % 7; const today = todayIso();
    let html = wd.map((w) => `<div class="dp-wd">${w}</div>`).join('');
    for (let i = 0; i < offset; i++) html += '<div></div>';
    for (let d = 1; d <= len; d++) { const iso = partsToIso(picker.y, picker.m, d); const dow = (offset + d - 1) % 7; const holiday = jal ? dow === 6 : dow === 0; html += `<button class="dp-day${iso === today ? ' today' : ''}${iso === picker.value ? ' selected' : ''}${holiday ? ' holiday' : ''}" data-iso="${iso}">${num(d)}</button>`; }
    $('#dp-grid').innerHTML = html;
  }
  function bindPicker() {
    $('#dp-prev').onclick = () => { picker.m -= 1; if (picker.m < 1) { picker.m = 12; picker.y -= 1; } renderPicker(); };
    $('#dp-next').onclick = () => { picker.m += 1; if (picker.m > 12) { picker.m = 1; picker.y += 1; } renderPicker(); };
    $('#dp-grid').onclick = (e) => { const b = e.target.closest('.dp-day'); if (!b) return; picker.onPick && picker.onPick(b.dataset.iso); closePicker(); };
    $('#dp-today').onclick = () => { picker.onPick && picker.onPick(todayIso()); closePicker(); };
    $('#dp-clear').onclick = () => { picker.onPick && picker.onPick(''); closePicker(); };
    document.addEventListener('mousedown', (e) => { if (!$('#datepicker').hidden && !e.target.closest('#datepicker') && !e.target.closest('#d-due')) closePicker(); });
  }

  // ---------- Command palette ----------
  const pal = { items: [], index: 0 };
  function openPalette() { $('#palette').hidden = false; $('#palette-q').value = ''; renderPalette(); setTimeout(() => $('#palette-q').focus(), 20); }
  function closePalette() { $('#palette').hidden = true; }
  function paletteItems(q) {
    const items = [];
    const views = [['inbox', 'inbox'], ['today', 'sun'], ['upcoming', 'calendar'], ['all', 'layers'], ['done', 'check-circle'], ['report', 'chart']];
    const actions = [
      { label: t('aNewTask'), icon: 'plus', hint: 'Ctrl N', run: () => { $('#qa-input').focus(); } },
      { label: t('aNewList'), icon: 'list', run: () => openListDialog() },
      { label: t('aToggleLang'), icon: 'lang', hint: 'Ctrl Shift L', run: toggleLang },
      { label: t('aCalendar'), icon: 'calendar', run: () => { state.data.settings.calendar = cal() === 'jalali' ? 'gregorian' : 'jalali'; applyLang(); save(); render(); } },
      { label: t('aCollapse'), icon: 'panel', run: toggleRail },
      { label: t('aExportPdf'), icon: 'file', run: exportPdf },
      { label: t('aBackup'), icon: 'download', run: exportJson },
      { label: t('aSettings'), icon: 'settings', run: () => { $('#settings').hidden = false; } },
    ];
    const match = (s) => !q || s.toLowerCase().includes(q);
    if (q) state.data.tasks.filter((x) => !x.done && match(x.title)).slice(0, 8).forEach((x) => items.push({ group: 'pTasks', label: x.title, icon: 'check-circle', hint: x.due ? relDue(x.due).text : '', run: () => { setView('all'); openDetail(x.id); } }));
    views.filter(([k]) => match(t(k === 'done' ? 'completed' : k))).forEach(([k, ic]) => items.push({ group: 'pViews', label: t(k === 'done' ? 'completed' : k), icon: ic, run: () => setView(k) }));
    sortedLists().filter((l) => match(l.name)).forEach((l) => items.push({ group: 'pLists', label: l.name, icon: 'list', color: l.color, run: () => setView('list', { listId: l.id }) }));
    actions.filter((a) => match(a.label)).forEach((a) => items.push({ group: 'pActions', ...a }));
    return items;
  }
  function renderPalette() {
    const q = $('#palette-q').value.trim().toLowerCase();
    pal.items = paletteItems(q); pal.index = Math.min(pal.index, Math.max(0, pal.items.length - 1));
    const wrap = $('#palette-list'); let html = '', lastGroup = null;
    pal.items.forEach((it, i) => {
      if (it.group !== lastGroup) { html += `<div class="palette-group">${esc(t(it.group))}</div>`; lastGroup = it.group; }
      html += `<button class="palette-item${i === pal.index ? ' active' : ''}" data-i="${i}">${it.color ? `<i class="dot" style="width:9px;height:9px;border-radius:3px;background:${it.color}"></i>` : icon(it.icon)}<span class="pi-text">${esc(it.label)}</span>${it.hint ? `<span class="pi-hint">${esc(it.hint)}</span>` : ''}</button>`;
    });
    wrap.innerHTML = html || `<div class="palette-empty">${esc(t('pNoResults'))}</div>`;
    $$('.palette-item').forEach((b) => { b.onclick = () => runPalette(+b.dataset.i); b.onmousemove = () => { if (pal.index !== +b.dataset.i) { pal.index = +b.dataset.i; $$('.palette-item').forEach((x) => x.classList.toggle('active', +x.dataset.i === pal.index)); } }; });
    const act = wrap.querySelector('.palette-item.active'); if (act) act.scrollIntoView({ block: 'nearest' });
  }
  function runPalette(i) { const it = pal.items[i]; if (!it) return; closePalette(); it.run(); }

  // ---------- Sync ----------
  const syncUI = { status: 'idle', error: '' };
  let syncTimer = null, syncing = false;
  const signedIn = () => !!(state.data.sync.server && state.data.sync.token);
  function scheduleSync(ms) { if (!signedIn()) return; clearTimeout(syncTimer); syncTimer = setTimeout(() => syncNow().catch(() => {}), ms); }
  async function api(server, pathname, body, token) {
    const r = await fetch(server.replace(/\/+$/, '') + pathname, { method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: body ? JSON.stringify(body) : undefined });
    let json = null; try { json = await r.json(); } catch {}
    if (!r.ok) { const e = new Error((json && json.error) || 'http_' + r.status); e.code = (json && json.error) || 'http_' + r.status; throw e; }
    return json;
  }
  function setSyncStatus(status, error) { syncUI.status = status; syncUI.error = error || ''; renderAccount(); }
  async function syncNow() {
    if (!signedIn() || syncing) return;
    syncing = true; setSyncStatus('busy');
    try {
      stampChanges();
      const changes = [];
      for (const id of dirty) {
        if (id === 'settings') { const s = state.data.settings; changes.push({ id: 'settings', type: 'settings', data: { lang: s.lang, calendar: s.calendar, notify: s.notify }, updatedAt: s.settingsUpdatedAt || Date.now() }); continue; }
        const task = getTask(id); const list = getList(id);
        if (task) changes.push({ id, type: 'task', data: task, updatedAt: task.updatedAt });
        else if (list) changes.push({ id, type: 'list', data: list, updatedAt: list.updatedAt });
        else if (state.data.tombstones[id]) changes.push({ id, type: 'task', data: null, updatedAt: state.data.tombstones[id], deleted: true });
      }
      const res = await api(state.data.sync.server, '/api/sync', { since: state.data.sync.cursor || 0, changes }, state.data.sync.token);
      dirty.clear();
      for (const c of changes) if (c.deleted) delete state.data.tombstones[c.id];
      let changed = false;
      for (const c of res.changes) {
        if (c.type === 'settings') {
          if (c.data && (c.updatedAt > (state.data.settings.settingsUpdatedAt || 0))) { Object.assign(state.data.settings, { lang: c.data.lang, calendar: c.data.calendar, notify: c.data.notify, settingsUpdatedAt: c.updatedAt }); changed = true; }
          continue;
        }
        const kind = c.type === 'list' ? 'lists' : 'tasks';
        const arr = state.data[kind]; const i = arr.findIndex((x) => x.id === c.id); const local = i >= 0 ? arr[i] : null;
        if (c.deleted) {
          if (local && local.updatedAt <= c.updatedAt) { arr.splice(i, 1); seen.delete(c.id); changed = true; }
          else if (!local) { const j2 = (kind === 'tasks' ? state.data.lists : state.data.tasks).findIndex((x) => x.id === c.id); if (j2 >= 0 && (kind === 'tasks' ? state.data.lists : state.data.tasks)[j2].updatedAt <= c.updatedAt) { (kind === 'tasks' ? state.data.lists : state.data.tasks).splice(j2, 1); seen.delete(c.id); changed = true; } }
          continue;
        }
        if (!c.data) continue;
        if (!local || local.updatedAt < c.updatedAt) {
          const item = { ...c.data, id: c.id, updatedAt: c.updatedAt };
          if (i >= 0) arr[i] = item; else arr.push(item);
          seen.set(c.id, serial(item)); changed = true;
        }
      }
      state.data.sync.cursor = res.cursor; state.data.sync.lastSync = Date.now();
      if (changed) { state.data = normalize(state.data); snapshotSeen(); applyLang(); }
      window.anjam.save(state.data);
      if (changed) render();
      setSyncStatus('ok');
    } catch (e) {
      if (e.code === 'unauthorized') { state.data.sync.token = ''; window.anjam.save(state.data); setSyncStatus('err', t('errCreds')); }
      else if (e.code === 'account_disabled') { state.data.sync.token = ''; window.anjam.save(state.data); setSyncStatus('err', t('errDisabled')); }
      else setSyncStatus('err', e.code && !e.code.startsWith('http') && !/fetch/i.test(e.message) ? e.code : t('errNet'));
    } finally { syncing = false; }
  }
  const ERR = { bad_credentials: 'errCreds', invalid_email: 'errEmail', weak_password: 'errWeak', email_taken: 'errTaken', registration_closed: 'errClosed', too_many_requests: 'errMany', account_disabled: 'errDisabled', invite_required: 'errInvite', name_required: 'errName', bad_token: 'errToken', last_admin: 'errLastAdmin' };
  const errText = (e) => t(ERR[e.code] || 'errNet');

  // ---------- Auth screen ----------
  const au = { mode: 'signin', resetToken: '', serverInfo: null };
  const serverUrl = () => ($('#au-server').value || state.data.sync.server || window.anjam.defaultServer || '').trim().replace(/\/+$/, '');
  function openAuth(mode, opts = {}) {
    au.mode = mode; au.resetToken = opts.token || '';
    $('#au-server').value = state.data.sync.server || window.anjam.defaultServer || $('#acc-server').value || 'https://anjam.abolfazltafakori.com';
    $('#au-email').value = state.data.sync.email || $('#au-email').value || '';
    $('#au-pass').value = ''; $('#au-pass2').value = ''; $('#au-invite').value = '';
    $('#auth-done').hidden = true; $('#auth-form').hidden = false;
    $('#auth-skip').hidden = !opts.firstRun; $('#auth-close').hidden = !!opts.firstRun;
    $('#auth').hidden = false; $('#settings').hidden = true;
    renderAuth(); probeServer();
    setTimeout(() => ($('#au-email').value ? $('#au-pass') : $('#au-server').value ? $('#au-email') : $('#au-server')).focus(), 30);
  }
  function closeAuth() { $('#auth').hidden = true; }
  async function probeServer() {
    au.serverInfo = null; const s = serverUrl(); if (!/^https?:\/\//.test(s)) return renderAuth();
    try { au.serverInfo = await api(s, '/api/health'); } catch { au.serverInfo = { error: true }; }
    renderAuth();
  }
  function renderAuth() {
    const m = au.mode; const info = au.serverInfo || {};
    $$('#auth-tabs button').forEach((b) => b.classList.toggle('active', b.dataset.mode === m));
    $('#auth-tabs').hidden = m === 'forgot' || m === 'reset';
    $('#auth-title').textContent = t({ signin: 'tSignin', signup: 'tSignup', forgot: 'tForgot', reset: 'tReset' }[m]);
    $('#auth-sub').textContent = t({ signin: 'sSignin', signup: 'sSignup', forgot: 'sForgot', reset: 'sReset' }[m]);
    $('#auth-submit').textContent = t({ signin: 'bSignin', signup: 'bSignup', forgot: 'bForgot', reset: 'bReset' }[m]);
    $('#f-server').hidden = m === 'reset' || (!!window.anjam.defaultServer && !window.anjam.isNative && !state.data.sync.server);
    $('#f-name').hidden = m !== 'signup';
    $('#f-email').hidden = m === 'reset';
    $('#f-pass').hidden = m === 'forgot';
    $('#f-pass2').hidden = m !== 'signup' && m !== 'reset';
    $('#f-invite').hidden = !(m === 'signup' && info.registration === 'invite');
    $('#au-strength').hidden = m !== 'signup' && m !== 'reset';
    $('#au-pass').autocomplete = m === 'signin' ? 'current-password' : 'new-password';
    $('#auth-forgot').hidden = m !== 'signin';
    $('#auth-err').textContent = m === 'signup' && info.registration === 'closed' ? t('errClosed') : info.error ? t('errNet') : '';
    $$('.f').forEach((f) => { f.classList.remove('invalid'); const e = f.querySelector('em'); if (e) e.textContent = ''; });
  }
  function fieldError(id, msg) { const f = $('#' + id); f.classList.toggle('invalid', !!msg); f.querySelector('em').textContent = msg || ''; return !msg; }
  const strongEnough = (p) => p.length >= 8 && /[0-9]/.test(p) && /[a-zA-Z\u0600-\u06FF]/.test(p);
  function strength(p) { let n = 0; if (p.length >= 8) n++; if (/[0-9]/.test(p) && /[a-zA-Z\u0600-\u06FF]/.test(p)) n++; if (p.length >= 12) n++; if (/[^\w\u0600-\u06FF]/.test(p)) n++; return p ? Math.max(1, n) : 0; }
  function validateAuth() {
    const m = au.mode; let ok = true;
    const server = serverUrl(), email = $('#au-email').value.trim(), pass = $('#au-pass').value, pass2 = $('#au-pass2').value, name = $('#au-name').value.trim(), invite = $('#au-invite').value.trim();
    if (!$('#f-server').hidden) ok = fieldError('f-server', /^https?:\/\/.+/.test(server) ? '' : t('vServer')) && ok;
    if (m !== 'reset') ok = fieldError('f-email', !email ? t('vRequired') : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : t('vEmail')) && ok;
    if (m === 'signup') ok = fieldError('f-name', name ? '' : t('vRequired')) && ok;
    if (m === 'signin') ok = fieldError('f-pass', pass ? '' : t('vRequired')) && ok;
    if (m === 'signup' || m === 'reset') { ok = fieldError('f-pass', strongEnough(pass) ? '' : t('vPass')) && ok; ok = fieldError('f-pass2', pass2 === pass ? '' : t('vMatch')) && ok; }
    if (!$('#f-invite').hidden) ok = fieldError('f-invite', invite ? '' : t('vInvite')) && ok;
    return ok ? { server, email, pass, name, invite } : null;
  }
  async function submitAuth(e) {
    e.preventDefault(); $('#auth-err').textContent = '';
    const v = validateAuth(); if (!v) return;
    const btn = $('#auth-submit'); btn.disabled = true;
    try {
      if (au.mode === 'forgot') { const r = await api(v.server, '/api/auth/forgot', { email: v.email }); return showAuthDone(t(r.mailed ? 'doneForgotMail' : 'doneForgotNoMail')); }
      let res;
      if (au.mode === 'signin') res = await api(v.server, '/api/auth/login', { email: v.email, password: v.pass });
      else if (au.mode === 'signup') res = await api(v.server, '/api/auth/register', { email: v.email, password: v.pass, name: v.name, invite: v.invite.toUpperCase() });
      else res = await api(v.server, '/api/auth/reset', { token: au.resetToken, password: v.pass });
      state.data.sync = { server: v.server, token: res.token, email: res.user.email, name: res.user.name, cursor: 0, lastSync: 0 };
      for (const x of state.data.tasks) dirty.add(x.id); for (const x of state.data.lists) dirty.add(x.id); dirty.add('settings');
      window.anjam.save(state.data); renderAccount(); syncNow();
      if (au.mode === 'signin') closeAuth(); else showAuthDone(t(au.mode === 'signup' ? 'doneSignup' : 'doneReset'));
    } catch (err) {
      const code = err.code;
      if (code === 'email_taken') fieldError('f-email', t('errTaken')); else if (code === 'invite_required') fieldError('f-invite', t('errInvite')); else if (code === 'weak_password') fieldError('f-pass', t('vPass'));
      else $('#auth-err').textContent = errText(err);
    } finally { btn.disabled = false; }
  }
  function showAuthDone(text) { $('#auth-form').hidden = true; $('#auth-done').hidden = false; $('#auth-done-text').textContent = text; }
  function bindAuth() {
    $$('#auth-tabs button').forEach((b) => b.onclick = () => { au.mode = b.dataset.mode; renderAuth(); });
    $('#auth-form').onsubmit = submitAuth;
    $('#auth-close').onclick = closeAuth;
    $('#auth-done-btn').onclick = () => { closeAuth(); if (state.data.sync.token) { $('#settings').hidden = false; } };
    $('#auth-forgot').onclick = (e) => { e.preventDefault(); au.mode = 'forgot'; renderAuth(); };
    $('#auth-skip').onclick = (e) => { e.preventDefault(); localStorage.setItem('anjam-auth-skipped', '1'); closeAuth(); };
    $('#au-server').onchange = probeServer;
    $('#au-eye').onclick = () => { const p = $('#au-pass'); p.type = p.type === 'password' ? 'text' : 'password'; };
    $('#au-pass').oninput = () => { $('#au-strength').dataset.n = strength($('#au-pass').value); };
    $$('#auth-form .field-input').forEach((i) => i.addEventListener('input', () => { const f = i.closest('.f'); if (f && f.classList.contains('invalid')) fieldError(f.id, ''); }));
  }

  // ---------- Account (settings) ----------
  function signOut() { state.data.sync = { ...state.data.sync, token: '', cursor: 0, lastSync: 0 }; dirty.clear(); window.anjam.save(state.data); setSyncStatus('idle'); }
  function renderAccount() {
    const on = signedIn();
    $('#account-out').hidden = on; $('#account-in').hidden = !on;
    if (!on) { if (!$('#acc-server').value) $('#acc-server').value = state.data.sync.server || window.anjam.defaultServer || 'https://anjam.abolfazltafakori.com'; }
    else {
      $('#acc-who').textContent = `${state.data.sync.name ? state.data.sync.name + ' · ' : ''}${state.data.sync.email}`;
      $('#acc-last').textContent = `${t('lastSync')}: ${state.data.sync.lastSync ? fmtDateTime(state.data.sync.lastSync) : t('never')}` + (syncUI.error ? ` · ${syncUI.error}` : '');
    }
    $('#sync-status').textContent = !on ? '' : syncUI.status === 'busy' ? t('syncing') : syncUI.status === 'err' ? t('syncErr') : syncUI.status === 'ok' ? t('synced') : '';
    let dot = $('#settings-btn .sync-dot');
    if (!on) { if (dot) dot.remove(); return; }
    if (!dot) { dot = document.createElement('span'); dot.className = 'sync-dot'; $('#settings-btn').appendChild(dot); }
    dot.className = 'sync-dot' + (syncUI.status === 'err' ? ' err' : syncUI.status === 'busy' ? ' busy' : '');
  }
  async function saveProfile() {
    $('#pr-err').textContent = '';
    const name = $('#pr-name').value.trim(), cur = $('#pr-cur').value, nw = $('#pr-new').value;
    if (nw && !strongEnough(nw)) { $('#pr-err').textContent = t('vPass'); return; }
    if (nw && !cur) { $('#pr-err').textContent = t('vRequired'); return; }
    try {
      const r = await api(state.data.sync.server, '/api/me', nw ? { name, currentPassword: cur, newPassword: nw } : { name }, state.data.sync.token);
      state.data.sync.name = r.user.name; if (r.token) state.data.sync.token = r.token;
      window.anjam.save(state.data); renderAccount(); $('#profile').hidden = true; showToast(t('profileSaved'));
    } catch (e) { $('#pr-err').textContent = errText(e); }
  }
  async function deleteAccount() {
    const cur = $('#pr-cur').value; if (!cur) { $('#pr-err').textContent = t('currentPassword') + ': ' + t('vRequired'); return; }
    if (!confirm(t('confirmDeleteAccount'))) return;
    try { await api(state.data.sync.server, '/api/me/delete', { password: cur }, state.data.sync.token); $('#profile').hidden = true; signOut(); state.data.sync.email = ''; state.data.sync.name = ''; window.anjam.save(state.data); renderAccount(); }
    catch (e) { $('#pr-err').textContent = errText(e); }
  }
  function bindAccount() {
    $('#acc-open').onclick = () => openAuth('signin');
    $('#acc-server').onchange = () => { state.data.sync.server = $('#acc-server').value.trim().replace(/\/+$/, ''); window.anjam.save(state.data); };
    $('#acc-sync').onclick = () => syncNow();
    $('#acc-logout').onclick = signOut;
    $('#acc-profile').onclick = () => { $('#pr-name').value = state.data.sync.name || ''; $('#pr-cur').value = ''; $('#pr-new').value = ''; $('#pr-err').textContent = ''; $('#profile').hidden = false; };
    $('#profile-close').onclick = () => { $('#profile').hidden = true; };
    $('#pr-save').onclick = saveProfile; $('#pr-delete').onclick = deleteAccount;
    window.addEventListener('online', () => scheduleSync(500));
    bindAuth(); renderAccount();
    // Web: password-reset link (?reset=TOKEN) and first-run sign-in prompt
    const params = new URLSearchParams(location.search);
    if (params.get('reset')) { history.replaceState(null, '', location.pathname); openAuth('reset', { token: params.get('reset') }); }
    else if (params.get('invite')) { history.replaceState(null, '', location.pathname); openAuth('signup', { firstRun: !signedIn() }); $('#au-invite').value = params.get('invite').toUpperCase(); }
    // First run on every platform (Windows, web, Android): sign in / sign up, or continue without an account.
    else if (!signedIn() && !localStorage.getItem('anjam-auth-skipped') && !state.data.tasks.length) openAuth('signin', { firstRun: true });
  }

  // ---------- Updates (desktop) ----------
  let upd = { state: 'idle', version: '', percent: 0 };
  function renderUpdate() {
    const pill = $('#update-pill'); const text = $('#update-text'); const inst = $('#update-install');
    if (!window.anjam.update) { pill.hidden = true; text.textContent = t('upWeb'); $('#update-check').hidden = true; inst.hidden = true; return; }
    const v = { v: upd.version, p: num(upd.percent) };
    const msg = { idle: '', checking: t('upChecking'), uptodate: t('upToDate'), available: fmt('upAvailable', v), downloading: fmt('upDownloading', v), ready: fmt('upReady', v), error: t('upError') + (upd.message ? ` — ${upd.message}` : '') }[upd.state] || '';
    text.textContent = msg;
    inst.hidden = upd.state !== 'ready';
    $('#update-check').disabled = upd.state === 'checking' || upd.state === 'downloading';
    pill.hidden = !(upd.state === 'ready' || upd.state === 'downloading');
    pill.classList.toggle('quiet', upd.state === 'downloading');
    $('#update-pill-text').textContent = upd.state === 'ready' ? fmt('upReady', v) : fmt('upDownloading', v);
  }
  function bindUpdates() {
    window.anjam.version().then((v) => { $('#app-version').textContent = 'v' + v; });
    if (!window.anjam.update) return renderUpdate();
    window.anjam.update.onStatus((s) => { upd = s; renderUpdate(); });
    window.anjam.update.status().then((s) => { upd = s; renderUpdate(); });
    $('#update-check').onclick = () => window.anjam.update.check();
    $('#update-install').onclick = () => window.anjam.update.install();
    $('#update-pill').onclick = () => { if (upd.state === 'ready') window.anjam.update.install(); else { $('#settings').hidden = false; } };
  }

  // ---------- Reminders ----------
  function checkReminders() {
    if (!state.data.settings.notify) return;
    const now = new Date(); const today = isoLocal(now); const hm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    let changed = false;
    state.data.tasks.forEach((x) => {
      if (x.done || !x.reminder || !x.time || x.notifiedAt) return;
      if ((x.due && x.due < today) || (x.due === today && x.time <= hm) || (!x.due && x.time <= hm)) {
        window.anjam.notify({ title: `${t('reminderTitle')} · ${t('appName')}`, body: x.title + (x.due ? `\n${fmtDate(x.due)} · ${fmtTime(x.time)}` : ''), id: x.id });
        x.notifiedAt = Date.now(); changed = true;
      }
    });
    if (changed) save();
  }

  // ---------- Navigation helpers ----------
  function setView(view, opts = {}) {
    state.view = view; state.listId = opts.listId || null; state.tag = opts.tag || null;
    state.query = ''; $('#search').value = '';
    $('#app').classList.remove('sidebar-open');
    render();
  }
  function toggleLang() { state.data.settings.lang = lang() === 'fa' ? 'en' : 'fa'; state.data.settings.settingsUpdatedAt = Date.now(); dirty.add('settings'); applyLang(); save(); render(); }
  function toggleRail() { state.data.settings.railCollapsed = !state.data.settings.railCollapsed; applyLang(); save(); render(); }
  const isNarrowDetail = () => window.matchMedia('(max-width: 1180px)').matches;
  function updateScrim() {
    const drawer = $('#app').classList.contains('sidebar-open');
    const detail = !!getTask(state.selectedId) && isNarrowDetail();
    $('#backdrop').hidden = !(drawer || detail);
  }
  function focusRow(delta) {
    const rows = $$('.row'); if (!rows.length) return;
    let i = rows.findIndex((r) => r.dataset.id === state.focusId);
    i = i < 0 ? (delta > 0 ? 0 : rows.length - 1) : Math.max(0, Math.min(rows.length - 1, i + delta));
    rows.forEach((r) => { r.tabIndex = -1; }); rows[i].tabIndex = 0; rows[i].focus(); state.focusId = rows[i].dataset.id;
    rows[i].scrollIntoView({ block: 'nearest' });
  }

  // ============================================================
  // Init
  // ============================================================
  async function init() {
    state.data = normalize(await window.anjam.load());
    snapshotSeen();
    applyLang();

    $$('.nav-item[data-view], .tabbar button[data-view]').forEach((b) => b.onclick = () => setView(b.dataset.view));
    $('#tab-lists').onclick = () => { $('#app').classList.toggle('sidebar-open'); updateScrim(); };
    $('#tab-more').onclick = openPalette;
    $('#rail-toggle').onclick = toggleRail;
    $('#menu-btn').onclick = () => { $('#app').classList.toggle('sidebar-open'); updateScrim(); };
    $('#backdrop').onclick = () => { $('#app').classList.remove('sidebar-open'); if (isNarrowDetail()) state.selectedId = null; render(); };
    window.addEventListener('resize', updateScrim);
    $('#list-add').onclick = () => openListDialog();
    $('#list-dialog-close').onclick = () => { $('#list-dialog').hidden = true; };
    $('#list-save').onclick = saveList; $('#list-delete').onclick = deleteList;
    $('#list-name').onkeydown = (e) => { if (e.key === 'Enter') saveList(); };
    $('#settings-btn').onclick = () => { $('#settings').hidden = false; };
    $('#settings-close').onclick = () => { $('#settings').hidden = true; };
    $$('.overlay').forEach((o) => o.addEventListener('mousedown', (e) => { if (e.target === o) o.hidden = true; }));
    const touchSettings = () => { state.data.settings.settingsUpdatedAt = Date.now(); dirty.add('settings'); };
    $$('#set-lang button').forEach((b) => b.onclick = () => { state.data.settings.lang = b.dataset.v; touchSettings(); applyLang(); save(); render(); });
    $$('#set-cal button').forEach((b) => b.onclick = () => { state.data.settings.calendar = b.dataset.v; touchSettings(); applyLang(); save(); render(); });
    $('#set-notify').onchange = (e) => { state.data.settings.notify = e.target.checked; touchSettings(); save(); };
    bindAccount(); bindUpdates();
    $('#palette-btn').onclick = openPalette;
    $('#palette-q').oninput = () => { pal.index = 0; renderPalette(); };
    $('#palette-q').onkeydown = (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); pal.index = Math.min(pal.items.length - 1, pal.index + 1); renderPalette(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); pal.index = Math.max(0, pal.index - 1); renderPalette(); }
      else if (e.key === 'Enter') { e.preventDefault(); runPalette(pal.index); }
    };

    const qa = $('#qa-input');
    const chips = () => {
      const raw = qa.value; qa.closest('.capture-line').classList.toggle('has-text', !!raw.trim());
      const w = $('#qa-chips'); if (!raw.trim()) { w.innerHTML = ''; return; }
      const p = parseQuick(raw); const out = [];
      if (p.due) out.push(`<span class="pill">${icon('calendar')} ${esc(relDue(p.due).text)}</span>`);
      if (p.time) out.push(`<span class="pill">${icon('clock')} ${esc(fmtTime(p.time))}</span>`);
      if (p.priority) out.push(`<span class="pill red">${icon('flag')} ${esc(t('prio')[p.priority])}</span>`);
      if (p.listId) { const l = getList(p.listId); out.push(`<span class="pill list"><i class="dot" style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${l.color}"></i> ${esc(l.name)}</span>`); }
      p.tags.forEach((g) => out.push(`<span class="pill" dir="auto">#${esc(g)}</span>`));
      w.innerHTML = out.join('');
    };
    qa.oninput = chips;
    qa.onkeydown = (e) => { if (e.key === 'Enter') { if (addTask(qa.value)) { qa.value = ''; chips(); } } else if (e.key === 'ArrowDown') { e.preventDefault(); focusRow(1); } };
    $('#qa-add').onclick = () => { if (addTask(qa.value)) { qa.value = ''; chips(); } qa.focus(); };
    $('#search').oninput = (e) => { state.query = e.target.value; render(); };
    $('#clear-done').onclick = clearCompleted;
    $('#toast-undo').onclick = undo;
    $('#exp-pdf').onclick = exportPdf; $('#exp-csv').onclick = exportCsv; $('#exp-md').onclick = exportMd; $('#exp-json').onclick = exportJson; $('#imp-json').onclick = importJson;
    bindDetail(); bindPicker();

    document.addEventListener('keydown', (e) => {
      const mod = e.ctrlKey || e.metaKey; const k = e.key.toLowerCase();
      const inField = /^(input|textarea|select)$/i.test(document.activeElement.tagName);
      if (mod && k === 'k') { e.preventDefault(); $('#palette').hidden ? openPalette() : closePalette(); return; }
      if (mod && k === 'n') { e.preventDefault(); if (state.view === 'report' || state.view === 'done') setView('all'); qa.focus(); return; }
      if (mod && k === 'f') { e.preventDefault(); $('#search').focus(); $('#search').select(); return; }
      if (mod && e.shiftKey && k === 'l') { e.preventDefault(); toggleLang(); return; }
      if (mod && k === 'e') { e.preventDefault(); setView('report'); return; }
      if (mod && k === '\\') { e.preventDefault(); toggleRail(); return; }
      if (e.key === 'Escape') {
        if (!$('#auth').hidden && !$('#auth-close').hidden) closeAuth();
        else if (!$('#profile').hidden) $('#profile').hidden = true;
        else if (!$('#palette').hidden) closePalette();
        else if (!$('#datepicker').hidden) closePicker();
        else if (!$('#settings').hidden) $('#settings').hidden = true;
        else if (!$('#list-dialog').hidden) $('#list-dialog').hidden = true;
        else if ($('#app').classList.contains('sidebar-open')) { $('#app').classList.remove('sidebar-open'); updateScrim(); }
        else if (state.query) { state.query = ''; $('#search').value = ''; render(); }
        else if (state.selectedId) closeDetail();
        else if (inField) document.activeElement.blur();
        return;
      }
      if (inField) return;
      const row = document.activeElement.closest && document.activeElement.closest('.row');
      if (e.key === 'ArrowDown') { e.preventDefault(); focusRow(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); focusRow(-1); }
      else if (row && e.key === 'Enter') { e.preventDefault(); openDetail(row.dataset.id); }
      else if (row && e.key === ' ') { e.preventDefault(); const x = getTask(row.dataset.id); if (x) toggleDone(x.id, !x.done, row); }
      else if (row && (e.key === 'Delete' || e.key === 'Backspace')) { e.preventDefault(); deleteTask(row.dataset.id); }
    });
    window.addEventListener('beforeunload', () => save(true));
    let lastDay = todayIso();
    setInterval(() => { if (todayIso() !== lastDay) { lastDay = todayIso(); render(); } checkReminders(); }, 30000);
    setInterval(() => scheduleSync(0), 60000);
    scheduleSync(300);

    window.anjam.onOpenTask((id) => { if (getTask(id)) { setView('all'); openDetail(id); } });
    render();
    checkReminders();
    qa.focus();
  }
  init();
})();
