/* Anjam — renderer */
(() => {
  'use strict';

  // ============================================================
  // i18n
  // ============================================================
  const I18N = {
    fa: {
      favorites: 'علاقه‌مندی‌ها', favorite: 'افزودن به علاقه‌مندی‌ها', unfavorite: 'حذف از علاقه‌مندی‌ها', copyLink: 'کپی پیوند', linkCopied: 'پیوند کپی شد', trash: 'سطل زباله', moveToTrash: 'انتقال به سطل زباله', restore: 'بازگردانی', deleteForever: 'حذف برای همیشه', confirmForever: 'این لیست و کارهایش برای همیشه حذف شود؟', trashSearch: 'جستجو در سطل زباله', trashEmpty: 'سطل زباله خالی است', trashNote: 'لیست‌های داخل سطل زباله بعد از ۳۰ روز خودکار حذف می‌شوند.', movedToTrash: 'به سطل زباله منتقل شد', restored: 'بازگردانده شد', customizeSidebar: 'شخصی‌سازی نوار کناری', done2: 'تمام', addIcon: 'افزودن آیکون', addCover: 'افزودن کاور', addDesc: 'افزودن توضیح', changeCover: 'تغییر کاور', removeCover: 'حذف', descPh: 'توضیحی برای این لیست بنویسید…', emoji: 'ایموجی', gallery: 'گالری', filterPh: 'فیلتر…', lockDb: 'قفل لیست', unlockDb: 'باز کردن قفل', locked: 'قفل', fullWidth: 'تمام‌عرض', lockedHint: 'این لیست قفل است؛ برای ویرایش قفل را باز کنید.',
      searchSettings: 'جستجوی تنظیمات', spAccount: 'حساب', spAccountSub: 'پروفایل، ورود و همگام‌سازی', spPrefs: 'ترجیحات', spPrefsSub: 'ظاهر و رفتار انجام را انتخاب کنید', spGeneral: 'عمومی', spGeneralSub: 'فضاهای کاری شما و تنظیمات آن‌ها', spPeople: 'اعضا', spPeopleSub: 'اعضای فضاهای کاری مشترک و نقش‌هایشان', spData: 'داده و پشتیبان', spDataSub: 'خروجی بگیرید یا از پشتیبان بازیابی کنید', spApp: 'برنامه', spAbout: 'درباره', aboutSub: 'انجام — کارها، ساده و دقیق', spProfile: 'پروفایل', spSync: 'همگام‌سازی', spSyncState: 'وضعیت', spSession: 'نشست', signOutHint: 'از حساب روی این دستگاه خارج می‌شوید؛ داده‌های محلی می‌ماند.', serverHint: 'نشانی سروری که حساب شما روی آن است.', themeHint: 'پوستهٔ برنامه روی این دستگاه', spLangTime: 'زبان و زمان', langHint: 'زبان رابط کاربری و اعداد', showDone: 'نمایش انجام‌شده‌ها', showDoneHint: 'کارهای انجام‌شده در نماها هم دیده شوند', notifySub: 'تعیین کنید کی و چطور خبردار شوید', spInApp: 'اعلان‌های دستگاه', expPdfHint: 'گزارش چاپی از وضعیت کارها', expCsvHint: 'برای اکسل و گوگل‌شیت', expMdHint: 'فهرست متنی کارها', spBackup: 'پشتیبان', expJsonHint: 'همهٔ کارها، لیست‌ها و تنظیمات', impJsonHint: 'داده‌های فعلی با فایل پشتیبان جایگزین می‌شود', export: 'خروجی', updatesSub: 'نسخهٔ برنامه و دریافت نسخهٔ تازه', spVersion: 'نسخه', shortcutsSub: 'با صفحه‌کلید سریع‌تر کار کنید', spDownloads: 'دانلود نسخه‌ها', spWsName: 'نام فضای کاری', spWsPersonal: 'فضای شخصی شما؛ فقط خودتان می‌بینید.', spWsShared: '{n} لیست · نقش شما: {r}', spManage: 'مدیریت', spNoWs: 'هنوز فضای مشترکی ندارید.', spNoSignIn: 'برای فضاهای مشترک باید وارد حساب شوید.', spMembersOf: 'اعضای {w}',
      home: 'خانه', calendarView: 'تقویم', searchAsk: 'جستجو', upcomingSide: 'پیش‌رو', recents: 'اخیر', sharedSec: 'مشترک', privateSec: 'شخصی', startCollab: 'شروع همکاری', noShared: 'هنوز لیست مشترکی ندارید', accountMenu: 'حساب و فضای کاری',
      gMorning: 'صبح بخیر', gAfternoon: 'ظهر بخیر', gEvening: 'عصر بخیر', gNight: 'شب بخیر', subHome: '{a} کار برای امروز · {b} کار این هفته', subCalendar: '{n} کار با تاریخ', emptyHome: 'این هفته کاری نمانده', emptyCalendar: 'کاری با تاریخ ندارید', yourLists: 'لیست‌ها', tasksOpen: '{n} باز',
      mRename: 'تغییر نام', mDuplicate: 'کپی لیست', mMove: 'انتقال به فضای کاری', mDeleteList: 'حذف لیست', mInvite: 'دعوت اعضا', mLogout: 'خروج از حساب', mSignIn: 'ورود / ثبت‌نام', mNewWorkspace: 'فضای کاری جدید', mWorkspaces: 'فضاهای کاری', mCopyOk: 'کپی شد', mAccount: 'حساب',
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
      personalWS: 'شخصی', newSharedWS: '+ فضای مشترک جدید (با نام این لیست)', workspace: 'فضای کاری', shareTitle: 'اشتراک‌گذاری', shareHint: 'با ایمیلِ حسابی که در همین سرور ثبت‌نام کرده به اشتراک بگذارید.', addMember: 'افزودن', role_owner: 'مالک', role_editor: 'ویرایشگر', role_viewer: 'بیننده', viewer: 'فقط دیدن', remove: 'حذف', leave: 'خروج از فضا', deleteWS: 'حذف فضای مشترک', errNoUser: 'حسابی با این ایمیل روی سرور نیست', readOnly: 'این لیست فقط خواندنی است', share: 'اشتراک',
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
      favorites: 'Favorites', favorite: 'Add to Favorites', unfavorite: 'Remove from Favorites', copyLink: 'Copy link', linkCopied: 'Link copied', trash: 'Trash', moveToTrash: 'Move to Trash', restore: 'Restore', deleteForever: 'Delete forever', confirmForever: 'Delete this list and its tasks forever?', trashSearch: 'Search lists in Trash', trashEmpty: 'Trash is empty', trashNote: 'Once a list has been in Trash for 30 days, it will be deleted automatically.', movedToTrash: 'Moved to Trash', restored: 'Restored', customizeSidebar: 'Customize sidebar', done2: 'Done', addIcon: 'Add icon', addCover: 'Add cover', addDesc: 'Add description', changeCover: 'Change cover', removeCover: 'Remove', descPh: 'Write a description for this list…', emoji: 'Emoji', gallery: 'Gallery', filterPh: 'Filter…', lockDb: 'Lock list', unlockDb: 'Unlock list', locked: 'Locked', fullWidth: 'Full width', lockedHint: 'This list is locked; unlock it to edit.',
      searchSettings: 'Search settings', spAccount: 'Account', spAccountSub: 'Profile, sign-in and sync', spPrefs: 'Preferences', spPrefsSub: 'Choose how Anjam looks and behaves', spGeneral: 'General', spGeneralSub: 'Your workspaces and their settings', spPeople: 'People', spPeopleSub: 'Members of your shared workspaces and their roles', spData: 'Data & backup', spDataSub: 'Export, or restore from a backup', spApp: 'App', spAbout: 'About', aboutSub: 'Anjam — tasks, simple and precise', spProfile: 'Profile', spSync: 'Sync', spSyncState: 'Status', spSession: 'Session', signOutHint: 'Signs out on this device; local data stays.', serverHint: 'The server your account lives on.', themeHint: 'Theme for Anjam on this device', spLangTime: 'Language & time', langHint: 'Interface language and digits', showDone: 'Show completed', showDoneHint: 'Completed tasks stay visible in views', notifySub: 'Decide when and how you want to be notified', spInApp: 'Device notifications', expPdfHint: 'A printable status report', expCsvHint: 'For Excel and Google Sheets', expMdHint: 'A plain-text task list', spBackup: 'Backup', expJsonHint: 'All tasks, lists and settings', impJsonHint: 'Replaces current data with the backup file', export: 'Export', updatesSub: 'App version and getting the latest one', spVersion: 'Version', shortcutsSub: 'Work faster with the keyboard', spDownloads: 'Downloads', spWsName: 'Workspace name', spWsPersonal: 'Your personal space; only you see it.', spWsShared: '{n} lists · your role: {r}', spManage: 'Manage', spNoWs: 'No shared workspaces yet.', spNoSignIn: 'Sign in to use shared workspaces.', spMembersOf: 'Members of {w}',
      home: 'Home', calendarView: 'Calendar', searchAsk: 'Search', upcomingSide: 'Upcoming', recents: 'Recents', sharedSec: 'Shared', privateSec: 'Private', startCollab: 'Start collaborating', noShared: 'No shared lists yet', accountMenu: 'Account & workspace',
      gMorning: 'Good morning', gAfternoon: 'Good afternoon', gEvening: 'Good evening', gNight: 'Good night', subHome: '{a} tasks today · {b} this week', subCalendar: '{n} dated tasks', emptyHome: 'Nothing left this week', emptyCalendar: 'No dated tasks yet', yourLists: 'Lists', tasksOpen: '{n} open',
      mRename: 'Rename', mDuplicate: 'Duplicate list', mMove: 'Move to workspace', mDeleteList: 'Delete list', mInvite: 'Invite members', mLogout: 'Log out', mSignIn: 'Sign in / Sign up', mNewWorkspace: 'New workspace', mWorkspaces: 'Workspaces', mCopyOk: 'Copied', mAccount: 'Account',
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
      personalWS: 'Personal', newSharedWS: '+ New shared space (named after this list)', workspace: 'Workspace', shareTitle: 'Sharing', shareHint: 'Share with the e-mail of an account registered on this server.', addMember: 'Add', role_owner: 'owner', role_editor: 'editor', role_viewer: 'viewer', viewer: 'view only', remove: 'Remove', leave: 'Leave space', deleteWS: 'Delete shared space', errNoUser: 'No account with this e-mail on the server', readOnly: 'This list is read-only', share: 'Share',
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
  const EXTRA_I18N = {
    fa: {
      inbox: 'صندوق ورودی', all: 'همه کارها', views: 'نماها', vList: 'فهرست', vTable: 'جدول', vBoard: 'برد', vCalendar: 'تقویم',
      filter: 'فیلتر', sort: 'مرتب‌سازی', new: 'جدید', theme: 'ظاهر', thSystem: 'سیستم', thLight: 'روشن', thDark: 'تیره',
      showDone: 'نمایش انجام‌شده‌ها', sortDue: 'بر اساس سررسید', sortPriority: 'بر اساس اولویت', sortTitle: 'بر اساس عنوان', sortCreated: 'جدیدترین',
      titleCol: 'عنوان', empty: 'خالی', noPriority: 'بدون اولویت', editTags: 'ویرایش برچسب‌ها…', noLists: 'هنوز لیستی ندارید', noTags: 'برچسبی نیست',
      shared: 'مشترک', savedShort: 'ذخیره شد', notifyDesc: 'یادآور کارها با اعلان سیستم', aCollapse: 'نوار کناری', more: 'بیشتر',
    },
    en: {
      views: 'Views', vList: 'List', vTable: 'Table', vBoard: 'Board', vCalendar: 'Calendar',
      filter: 'Filter', sort: 'Sort', new: 'New', theme: 'Appearance', thSystem: 'System', thLight: 'Light', thDark: 'Dark',
      showDone: 'Show completed', sortDue: 'By due date', sortPriority: 'By priority', sortTitle: 'By title', sortCreated: 'Newest first',
      titleCol: 'Name', empty: 'Empty', noPriority: 'No priority', editTags: 'Edit tags…', noLists: 'No lists yet', noTags: 'No tags',
      shared: 'shared', savedShort: 'Saved', notifyDesc: 'Task reminders as system notifications', aCollapse: 'Sidebar', more: 'More', all: 'All tasks',
    },
  };
  Object.assign(I18N.fa, EXTRA_I18N.fa); Object.assign(I18N.en, EXTRA_I18N.en);
  const LIST_COLORS = ['#9e1b34', '#d9962b', '#3f8f5b', '#4f7fc2', '#7c5cbf', '#c7508a', '#2a9d9f', '#8a6d4b', '#6b7280', '#e0673a'];

  // ============================================================
  // State
  // ============================================================
  const state = {
    data: null,
    view: 'home', listId: null, tag: null, query: '',
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
  const kindOf = (id) => (getList(id) ? 'database' : 'item');
  function stampChanges() {
    const now = Date.now(); const present = new Set();
    for (const kind of ['tasks', 'lists']) for (const x of state.data[kind]) {
      present.add(x.id);
      const s = serial(x);
      if (seen.get(x.id) !== s) { if (seen.has(x.id) || !x.updatedAt) x.updatedAt = now; seen.set(x.id, s); dirty.add(x.id); }
    }
    for (const id of [...seen.keys()]) if (!present.has(id)) { const ts = seen.get(id); seen.delete(id); let meta = {}; try { meta = JSON.parse(ts); } catch {} state.data.tombstones[id] = { at: now, kind: meta.color !== undefined && meta.title === undefined ? 'database' : 'item', workspaceId: meta.workspaceId || workspaceOfTask(meta) }; dirty.add(id); }
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
    const d = { version: 4, settings: { lang: 'fa', calendar: 'jalali', notify: true, railCollapsed: false, theme: 'system', modes: {}, sort: 'due', showDone: false }, workspaces: [], lists: [], tasks: [], tombstones: {}, sync: { server: '', token: '', email: '', name: '', cursors: {}, lastSync: 0 } };
    if (data && typeof data === 'object') {
      const s = data.settings || {};
      if (s.lang === 'en' || s.lang === 'fa') d.settings.lang = s.lang;
      d.settings.calendar = s.calendar === 'gregorian' || s.calendar === 'jalali' ? s.calendar : (d.settings.lang === 'fa' ? 'jalali' : 'gregorian');
      if (typeof s.notify === 'boolean') d.settings.notify = s.notify;
      if (typeof s.railCollapsed === 'boolean') d.settings.railCollapsed = s.railCollapsed;
      if (['system', 'light', 'dark'].includes(s.theme)) d.settings.theme = s.theme;
      if (s.modes && typeof s.modes === 'object') d.settings.modes = { ...s.modes };
      if (['due', 'priority', 'title', 'created'].includes(s.sort)) d.settings.sort = s.sort;
      if (typeof s.showDone === 'boolean') d.settings.showDone = s.showDone;
      if (data.tombstones && typeof data.tombstones === 'object') for (const [id, v] of Object.entries(data.tombstones)) d.tombstones[id] = typeof v === 'object' ? v : { at: Number(v) || Date.now(), kind: 'item', workspaceId: '' };
      if (data.sync && typeof data.sync === 'object') { d.sync = { ...d.sync, ...data.sync }; if (!d.sync.cursors || typeof d.sync.cursors !== 'object') d.sync.cursors = {}; delete d.sync.cursor; }
      if (Array.isArray(data.workspaces)) d.workspaces = data.workspaces.filter((w) => w && w.id).map((w) => ({ id: String(w.id), name: String(w.name || ''), personal: !!w.personal, role: w.role || 'owner', ownerId: w.ownerId || '' }));
      if (Array.isArray(data.lists)) d.lists = data.lists.filter((l) => l && typeof l.name === 'string' && l.name.trim()).map((l, i) => ({ id: String(l.id || uid()), name: l.name.trim(), color: /^#[0-9a-f]{6}$/i.test(l.color || '') ? l.color : LIST_COLORS[i % LIST_COLORS.length], order: Number.isFinite(l.order) ? l.order : i, updatedAt: Number(l.updatedAt) || 0, workspaceId: typeof l.workspaceId === 'string' ? l.workspaceId : '', icon: typeof l.icon === 'string' ? l.icon : '', cover: typeof l.cover === 'string' ? l.cover : '', desc: typeof l.desc === 'string' ? l.desc : '', favorite: !!l.favorite, locked: !!l.locked, trashedAt: Number(l.trashedAt) || 0 }));
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
  const sortedLists = () => state.data.lists.filter((l) => !l.trashedAt).sort((a, b) => a.order - b.order);
  const trashedLists = () => state.data.lists.filter((l) => l.trashedAt).sort((a, b) => b.trashedAt - a.trashedAt);
  const inTrash = (x) => { const l = x.listId && getList(x.listId); return !!(l && l.trashedAt); };
  const liveTasks = () => state.data.tasks.filter((x) => !inTrash(x));
  const personalWS = () => state.data.workspaces.find((w) => w.personal) || null;
  const getWS = (id) => state.data.workspaces.find((w) => w.id === id);
  // Every list lives in a workspace; tasks inherit it from their list (Inbox = personal workspace).
  const workspaceOfList = (l) => (l && l.workspaceId) || (personalWS() ? personalWS().id : '');
  const workspaceOfTask = (x) => (x && x.listId && getList(x.listId) ? workspaceOfList(getList(x.listId)) : (personalWS() ? personalWS().id : ''));
  const canWriteWS = (id) => { const w = getWS(id); return !w || w.role === 'owner' || w.role === 'editor'; };
  const canWriteList = (l) => !l.locked && canWriteWS(workspaceOfList(l));

  // ============================================================
  // Task operations
  // ============================================================
  function addTask(raw, preset = {}) {
    const p = parseQuick(raw);
    if (preset.listId) p.listId = preset.listId;
    if (preset.due !== undefined && !p.due) p.due = preset.due;
    if (!p.title) return false;
    const minOrder = state.data.tasks.reduce((m, x) => Math.min(m, x.order), 0);
    const task = {
      id: uid(), title: p.title, notes: '', listId: p.listId || (state.view === 'list' ? state.listId : null),
      due: p.due || (state.view === 'today' && preset.due === undefined ? todayIso() : ''), time: p.time, reminder: !!p.time, notifiedAt: null, repeat: 'none',
      priority: p.priority, tags: p.tags.slice(), subtasks: [], done: false, createdAt: Date.now(), completedAt: null, order: minOrder - 1,
    };
    if (state.view === 'tag' && state.tag && !task.tags.includes(state.tag)) task.tags.push(state.tag);
    if (task.listId && !canWriteList(getList(task.listId))) { showToast(t('readOnly')); return false; }
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
    state.data.tasks = liveTasks().filter((x) => !x.done);
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
    let list = liveTasks();
    if (q) list = list.filter((x) => x.title.toLowerCase().includes(q) || x.notes.toLowerCase().includes(q) || x.tags.some((g) => g.toLowerCase().includes(q)) || x.subtasks.some((s) => s.title.toLowerCase().includes(q)));
    else { const sd = state.data.settings.showDone; const od = (x) => sd || !x.done; switch (state.view) {
      case 'inbox': list = list.filter((x) => od(x) && !x.listId); break;
      case 'today': list = list.filter((x) => od(x) && x.due && x.due <= today && (!x.done || x.completedAt && isoLocal(new Date(x.completedAt)) === today)); break;
      case 'home': { const wk = addDays(today, 7); list = list.filter((x) => od(x) && x.due && x.due <= wk && (!x.done || x.completedAt && isoLocal(new Date(x.completedAt)) === today)); break; }
      case 'calendar': list = list.filter((x) => od(x) && x.due); break;
      case 'upcoming': list = list.filter((x) => od(x) && x.due && x.due > today); break;
      case 'all': list = list.filter(od); break;
      case 'done': list = list.filter((x) => x.done); break;
      case 'list': list = list.filter((x) => od(x) && x.listId === state.listId); break;
      case 'tag': list = list.filter((x) => od(x) && x.tags.includes(state.tag)); break;
    } }
    return sortTasks(list);
  }
  function sortTasks(list) {
    const mode = state.data.settings.sort;
    return list.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      if (mode === 'priority' && a.priority !== b.priority) return b.priority - a.priority;
      if (mode === 'title') return a.title.localeCompare(b.title, numLocale());
      if (mode === 'created') return b.createdAt - a.createdAt;
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
    $$('#set-theme button').forEach((b) => b.classList.toggle('active', b.dataset.v === state.data.settings.theme));
    $('#set-notify').checked = state.data.settings.notify;
    $('#cal-preview').textContent = fmtDate(todayIso(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + '  ·  ' + fmtDateAlt(todayIso());
    $('#d-time').lang = l === 'fa' ? 'fa-IR' : 'en-GB';
    $('#ws-mark').textContent = l === 'fa' ? 'ا' : 'A';
    applyTheme();
  }
  const sysDark = window.matchMedia('(prefers-color-scheme: dark)');
  function applyTheme() {
    const th = state.data.settings.theme;
    const root = document.documentElement;
    if (th === 'light' || th === 'dark') root.dataset.theme = th; else delete root.dataset.theme;
    root.classList.toggle('sys-dark', th === 'system' && sysDark.matches);
  }
  sysDark.addEventListener('change', () => { if (state.data) applyTheme(); });

  // ---- view modes (list / table / board / calendar), per view, persisted ----
  const MODES = ['list', 'table', 'board', 'calendar'];
  const viewKey = () => (state.view === 'list' ? 'list:' + state.listId : state.view === 'tag' ? 'tag:' + state.tag : state.view);
  const modeOf = () => { if (state.query || state.view === 'home') return 'list'; if (state.view === 'calendar') return 'calendar'; const m = state.data.settings.modes[viewKey()]; return MODES.includes(m) ? m : (state.view === 'upcoming' ? 'calendar' : 'list'); };
  function setMode(m) { state.data.settings.modes[viewKey()] = m; save(); render(); }

  function render() {
    $('#app').classList.toggle('rail-collapsed', state.data.settings.railCollapsed);
    $('#rail-open').hidden = !state.data.settings.railCollapsed && !window.matchMedia('(max-width: 760px)').matches;
    renderRail();
    renderHead();
    const isReport = state.view === 'report' && !state.query;
    $('#report').hidden = !isReport;
    $('#db').hidden = isReport;
    const mode = isReport ? null : modeOf();
    $('#page').classList.toggle('wide', mode === 'board' || mode === 'table' || mode === 'calendar' || (state.view === 'list' && !!wideCfg()[state.listId]));
    $$('#view-tabs button').forEach((b) => b.setAttribute('aria-selected', b.dataset.mode === mode));
    $('#view-tabs').hidden = !!state.query || ['done', 'home', 'calendar'].includes(state.view);
    const isHome = state.view === 'home' && !state.query;
    $('#home-cards').hidden = !isHome;
    if (isHome) renderHomeCards();
    $('#filter-btn').hidden = state.view === 'done' || !!state.query;
    $('#filter-btn').classList.toggle('on', state.data.settings.showDone);
    $('#sort-btn').classList.toggle('on', state.data.settings.sort !== 'due');
    $('#task-list').hidden = mode !== 'list';
    $('#table').hidden = mode !== 'table';
    $('#board').hidden = mode !== 'board';
    $('#calendar').hidden = mode !== 'calendar';
    if (isReport) renderReport();
    else if (mode === 'table') renderTable();
    else if (mode === 'board') renderBoard();
    else if (mode === 'calendar') renderCalendar();
    else renderRows();
    if (state.view === 'done' || state.view === 'report') closeCapture();
    renderDetail();
    renderSyncPill();
    updateScrim();
  }

  function renderRail() {
    const today = todayIso();
    const open = liveTasks().filter((x) => !x.done);
    const set = (id, n) => { $(id).textContent = n ? num(n) : ''; };
    set('#count-inbox', open.filter((x) => !x.listId).length);
    set('#count-today', open.filter((x) => x.due && x.due <= today).length);
    set('#count-upcoming', open.filter((x) => x.due && x.due > today).length);
    set('#count-all', open.length);
    set('#count-done', liveTasks().length - open.length);
    set('#count-trash', trashedLists().length);
    const activeView = state.query ? null : state.view;
    $$('.nav-item[data-view], .tabbar button[data-view], .side-tab[data-view], .side-inbox').forEach((b) => b.classList.toggle('active', b.dataset.view === activeView));
    $('#tab-lists').classList.toggle('active', $('#app').classList.contains('sidebar-open'));
    $('#ws-name').textContent = signedIn() && state.data.sync.name ? state.data.sync.name : t('appName');

    // Favorites (starred lists), starred lists on top
    const fw = $('#fav-items'); fw.innerHTML = '';
    const favs = sortedLists().filter((l) => l.favorite);
    $('#side-fav-sec').hidden = !favs.length;
    favs.forEach((l) => { const b = document.createElement('button'); b.className = 'rail-item' + (activeView === 'list' && state.listId === l.id ? ' active' : ''); b.innerHTML = `${listMark(l)}<span class="nav-label" dir="auto">${esc(l.name)}</span>`; b.onclick = () => setView('list', { listId: l.id }); fw.appendChild(b); });
    applySideCfg();
    // Upcoming: the next three dated tasks, shown as a small agenda
    const up = $('#side-upcoming'); up.innerHTML = '';
    const soon = open.filter((x) => x.due && x.due >= today).sort((a, b) => (a.due + (a.time || '')).localeCompare(b.due + (b.time || ''))).slice(0, 3);
    $('#side-upcoming-sec').hidden = !soon.length;
    soon.forEach((x) => {
      const b = document.createElement('button'); b.className = 'side-up';
      const r = relDue(x.due);
      b.innerHTML = `<span class="side-up-day">${esc(fmtDate(x.due, { day: 'numeric' }))}</span><span class="side-up-body"><span class="side-up-title" dir="auto">${esc(x.title)}</span><span class="side-up-sub">${esc(r.text)}${x.time ? ' · ' + esc(fmtTime(x.time)) : ''}</span></span>`;
      b.onclick = () => { setView(x.listId ? 'list' : 'today', { listId: x.listId }); state.selectedId = x.id; render(); };
      up.appendChild(b);
    });
    // Recents: last lists / tags opened on this device
    const rw = $('#side-recents'); rw.innerHTML = '';
    const rec = recents().filter((r) => (r.view === 'list' && getList(r.listId)) || (r.view === 'tag' && counts0(open)[r.tag]));
    $('#side-recents-sec').hidden = !rec.length;
    rec.forEach((r) => {
      const b = document.createElement('button'); b.className = 'rail-item';
      if (r.view === 'list') { const l = getList(r.listId); b.innerHTML = `<span class="dot" style="background:${l.color}"></span><span class="nav-label" dir="auto">${esc(l.name)}</span>`; b.onclick = () => setView('list', { listId: l.id }); }
      else { b.innerHTML = `${icon('tag')}<span class="nav-label" dir="auto">${esc(r.tag)}</span>`; b.onclick = () => setView('tag', { tag: r.tag }); }
      rw.appendChild(b);
    });
    // Shared: lists grouped by shared workspace; Private: the personal lists
    const lists = sortedLists();
    const listBtn = (l) => {
      const n = open.filter((x) => x.listId === l.id).length;
      const b = document.createElement('button');
      b.className = 'rail-item' + (activeView === 'list' && state.listId === l.id ? ' active' : '');
      b.title = l.name;
      b.innerHTML = `${listMark(l)}<span class="nav-label" dir="auto">${esc(l.name)}</span><span class="count">${n ? num(n) : ''}</span><span class="ibtn xs rail-edit" role="button" title="${esc(t('more'))}">${icon('more')}</span>`;
      b.onclick = (e) => { if (e.target.closest('.rail-edit')) return listRailMenu(l, e.target.closest('.rail-edit')); setView('list', { listId: l.id }); };
      b.oncontextmenu = (e) => { e.preventDefault(); listRailMenu(l, e); };
      // drag to reorder
      b.draggable = canWriteList(l);
      b.ondragstart = (e) => { drag.listId = l.id; e.dataTransfer.effectAllowed = 'move'; b.classList.add('dragging'); };
      b.ondragend = () => { drag.listId = null; b.classList.remove('dragging'); $$('.rail-item.drop-after,.rail-item.drop-before').forEach((x) => x.classList.remove('drop-after', 'drop-before')); };
      b.ondragover = (e) => { if (!drag.listId || drag.listId === l.id) return; e.preventDefault(); const r = b.getBoundingClientRect(); const after = e.clientY > r.top + r.height / 2; b.classList.toggle('drop-after', after); b.classList.toggle('drop-before', !after); };
      b.ondragleave = () => b.classList.remove('drop-after', 'drop-before');
      b.ondrop = (e) => { e.preventDefault(); if (!drag.listId || drag.listId === l.id) return; const r = b.getBoundingClientRect(); const after = e.clientY > r.top + r.height / 2; const ids = sortedLists().map((x) => x.id).filter((id) => id !== drag.listId); const at = ids.indexOf(l.id) + (after ? 1 : 0); ids.splice(at, 0, drag.listId); ids.forEach((id, i) => { const x = getList(id); if (x.order !== i) x.order = i; }); save(); render(); };
      return b;
    };
    const sw = $('#shared-items'); sw.innerHTML = '';
    const shared = state.data.workspaces.filter((w) => !w.personal);
    shared.forEach((w) => {
      const hd = document.createElement('button'); hd.className = 'rail-group';
      hd.innerHTML = `${icon('users')}<span class="nav-label" dir="auto">${esc(w.name)}</span>${w.role === 'viewer' ? `<span class="count">${esc(t('viewer'))}</span>` : ''}`;
      hd.title = t('shareTitle'); hd.onclick = () => openShareDialog(w.id); sw.appendChild(hd);
      lists.filter((l) => workspaceOfList(l) === w.id).forEach((l) => sw.appendChild(listBtn(l)));
    });
    if (!shared.length) { const b = document.createElement('button'); b.className = 'rail-item rail-add'; b.innerHTML = `${icon('plus')}<span class="nav-label">${esc(t('startCollab'))}</span>`; b.onclick = startCollab; sw.appendChild(b); }
    const lw = $('#list-items'); lw.innerHTML = '';
    const pid = personalWS() ? personalWS().id : '';
    lists.filter((l) => !l.workspaceId || workspaceOfList(l) === pid || !getWS(workspaceOfList(l))).forEach((l) => lw.appendChild(listBtn(l)));
    { const b = document.createElement('button'); b.className = 'rail-item rail-add'; b.innerHTML = `${icon('plus')}<span class="nav-label">${esc(t('newList'))}</span>`; b.onclick = () => openListDialog(); lw.appendChild(b); }
    const counts = counts0(open);
    const tw = $('#tag-items'); tw.innerHTML = '';
    const names = Object.keys(counts).sort((a, b) => a.localeCompare(b, numLocale()));
    $('#side-tags-sec').hidden = !names.length;
    names.forEach((name) => {
      const b = document.createElement('button');
      b.className = 'rail-item' + (activeView === 'tag' && state.tag === name ? ' active' : '');
      b.title = '#' + name;
      b.innerHTML = `${icon('tag')}<span class="nav-label" dir="auto">${esc(name)}</span><span class="count">${num(counts[name])}</span>`;
      b.onclick = () => setView('tag', { tag: name });
      tw.appendChild(b);
    });
  }

  const counts0 = (open) => { const c = {}; open.forEach((x) => x.tags.forEach((g) => { c[g] = (c[g] || 0) + 1; })); return c; };
  const recents = () => { try { const r = JSON.parse(localStorage.getItem('anjam.recents') || '[]'); return Array.isArray(r) ? r : []; } catch { return []; } };
  function pushRecent(r) {
    const key = (x) => x.view + ':' + (x.listId || x.tag || '');
    const list = [r, ...recents().filter((x) => key(x) !== key(r))].slice(0, 3);
    try { localStorage.setItem('anjam.recents', JSON.stringify(list)); } catch {}
  }
  function startCollab() { if (!signedIn()) return openAuth('signin'); openListDialog(); setTimeout(() => { const s = $('#list-ws'); if (s && !$('#list-ws-wrap').hidden) s.value = '__new'; }, 0); }
  function duplicateList(id) {
    const l = getList(id); if (!l) return;
    const nid = uid();
    state.data.lists.push({ id: nid, name: l.name + ' 2', color: l.color, order: state.data.lists.length, workspaceId: l.workspaceId || '' });
    state.data.tasks.filter((x) => x.listId === id && !x.done).forEach((x) => state.data.tasks.push({ ...x, id: uid(), listId: nid, createdAt: Date.now(), updatedAt: Date.now(), subtasks: x.subtasks.map((s) => ({ ...s, id: uid() })), tags: x.tags.slice() }));
    save(); setView('list', { listId: nid });
  }
  // Home: list cards (link columns), then this week's tasks below
  function renderHomeCards() {
    const w = $('#home-cards'); w.innerHTML = '';
    const open = liveTasks().filter((x) => !x.done);
    const lists = sortedLists();
    if (!lists.length) return;
    const groups = [{ name: t('yourLists'), items: lists.filter((l) => { const ws = getWS(workspaceOfList(l)); return !ws || ws.personal; }) }, ...state.data.workspaces.filter((x) => !x.personal).map((ws) => ({ name: ws.name, items: lists.filter((l) => workspaceOfList(l) === ws.id) }))].filter((g) => g.items.length);
    groups.forEach((g) => {
      const col = document.createElement('div'); col.className = 'home-col';
      col.innerHTML = `<h3 class="home-h" dir="auto">${esc(g.name)}</h3>`;
      g.items.forEach((l) => {
        const n = open.filter((x) => x.listId === l.id).length;
        const b = document.createElement('button'); b.className = 'home-link';
        b.innerHTML = `<span class="dot" style="background:${l.color}"></span><span class="home-link-name" dir="auto">${esc(l.name)}</span><span class="count">${n ? esc(fmt('tasksOpen', { n: num(n) })) : ''}</span>`;
        b.onclick = () => setView('list', { listId: l.id }); col.appendChild(b);
      });
      w.appendChild(col);
    });
  }

  const VIEW_ICON = { home: 'home', calendar: 'calendar', inbox: 'inbox', today: 'sun', upcoming: 'calendar', all: 'layers', done: 'check-circle', report: 'chart', tag: 'tag' };
  function renderHead() {
    const today = todayIso();
    const open = liveTasks().filter((x) => !x.done);
    let title, sub, ico = icon(VIEW_ICON[state.view] || 'layers');
    const crumbs = [];
    if (state.query) { title = t('search'); sub = fmt('subSearch', { q: state.query }); ico = icon('search'); }
    else switch (state.view) {
      case 'inbox': title = t('inbox'); sub = fmt('subInbox', { n: num(open.filter((x) => !x.listId).length) }); break;
      case 'home': { const hr = new Date().getHours(); const g = t(hr < 12 ? 'gMorning' : hr < 16 ? 'gAfternoon' : hr < 20 ? 'gEvening' : 'gNight'); const nm = signedIn() && state.data.sync.name ? state.data.sync.name.split(' ')[0] : ''; title = nm ? `${g}، ${nm}`.replace('، ', lang() === 'fa' ? '، ' : ', ') : g; sub = `${fmtDate(today, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${fmt('subHome', { a: num(open.filter((x) => x.due && x.due <= today).length), b: num(open.filter((x) => x.due && x.due > today && x.due <= addDays(today, 7)).length) })}`; break; }
      case 'calendar': title = t('calendarView'); sub = fmt('subCalendar', { n: num(open.filter((x) => x.due).length) }); break;
      case 'today': title = t('today'); sub = `${fmtDate(today, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${fmt('subToday', { n: num(open.filter((x) => x.due && x.due <= today).length) })}`; break;
      case 'upcoming': title = t('upcoming'); sub = fmt('subUpcoming', { n: num(open.filter((x) => x.due && x.due > today).length) }); break;
      case 'all': title = t('all'); sub = fmt('subAll', { n: num(open.length) }); break;
      case 'done': title = t('completed'); sub = fmt('subDone', { n: num(state.data.tasks.length - open.length) }); break;
      case 'report': title = t('report'); sub = t('subReport'); break;
      case 'list': { const l = getList(state.listId); title = l ? l.name : ''; sub = fmt('subList', { n: num(open.filter((x) => x.listId === state.listId).length) }); if (l) { ico = l.icon ? `<span class="emoji-icon">${esc(l.icon)}</span>` : `<span class="dot" style="background:${l.color}"></span>`; if (l.locked) sub += ` · ${icon('lock')} ${esc(t('locked'))}`; const w = getWS(workspaceOfList(l)); if (w && !w.personal) { crumbs.push({ label: w.name, icon: icon('users'), run: () => openShareDialog(w.id) }); sub += ` · ${esc(t('shared'))}`; } else crumbs.push({ label: t('lists') }); } break; }
      case 'tag': title = '#' + state.tag; sub = fmt('subTag', { n: num(open.filter((x) => x.tags.includes(state.tag)).length) }); crumbs.push({ label: t('tags') }); break;
    }
    crumbs.push({ label: title, icon: ico });
    $('#view-title').textContent = title; $('#view-sub').innerHTML = sub;
    $('#page-icon').innerHTML = ico;
    const c = $('#crumb'); c.innerHTML = '';
    crumbs.forEach((cr, i) => {
      if (i) { const s = document.createElement('span'); s.className = 'sep'; s.textContent = '›'; c.appendChild(s); }
      const b = document.createElement('button'); b.innerHTML = `${cr.icon || ''}<span dir="auto">${esc(cr.label)}</span>`; if (cr.run) b.onclick = cr.run; c.appendChild(b);
    });
    // Page chrome: hover actions (icon / cover / description), cover strip, editable description, star + link in the topbar
    const l = state.view === 'list' && getList(state.listId);
    const editable = l && canWriteWS(workspaceOfList(l));
    $('#page-actions').hidden = !editable;
    if (editable) { $('#pa-icon').hidden = !!l.icon; $('#pa-cover').hidden = !!l.cover; $('#pa-desc').hidden = !!l.desc || state.descOpen === l.id; }
    const cov = $('#page-cover'); cov.hidden = !(l && l.cover); cov.className = 'page-cover' + (l && l.cover ? ' cover-' + l.cover : ''); cov.querySelectorAll('.cover-btn').forEach((b) => { b.hidden = !editable; });
    $('#page').classList.toggle('has-cover', !!(l && l.cover));
    const desc = $('#view-desc'); const showDesc = l && (l.desc || state.descOpen === l.id);
    desc.hidden = !showDesc; if (showDesc && document.activeElement !== desc) desc.textContent = l.desc || ''; desc.contentEditable = editable ? 'true' : 'false';
    $('#page-icon').classList.toggle('clickable', !!editable);
    $('#fav-btn').hidden = !l; $('#link-btn').hidden = !!state.query || state.view === 'report';
    if (l) { $('#fav-btn').classList.toggle('on', !!l.favorite); $('#fav-btn').title = t(l.favorite ? 'unfavorite' : 'favorite'); }
    // share: only for a list inside a workspace (signed in)
    const ws = l && signedIn() ? getWS(workspaceOfList(l)) : null;
    $('#share-btn').hidden = !ws;
    $('#share-btn').onclick = () => { if (ws.personal) openListDialog(l.id); else openShareDialog(ws.id); };
  }

  // ---- shared helpers for all views ----
  const dueBadge = (task) => {
    if (!task.due) return task.time ? `<span>${icon('clock')}${esc(fmtTime(task.time))}</span>` : '';
    const r = relDue(task.due);
    return `<span class="due ${task.done ? '' : r.cls}">${icon('calendar')}${esc(r.text)}${task.time ? ' · ' + esc(fmtTime(task.time)) : ''}</span>`;
  };
  const prioChip = (p) => (p ? `<span class="chip p${p}">${esc(t('prio')[p])}</span>` : '');
  const listBadge = (task) => { const l = task.listId && getList(task.listId); return l ? `<span class="list"><i style="background:${l.color}"></i><span dir="auto">${esc(l.name)}</span></span>` : ''; };
  const subBadge = (task) => { if (!task.subtasks.length) return ''; const d = task.subtasks.filter((s) => s.done).length; return `<span class="sub${d === task.subtasks.length ? ' full' : ''}">${icon('subtask')}${num(d)}/${num(task.subtasks.length)}</span>`; };
  const tagChips = (task) => task.tags.map((g) => `<span class="chip purple" dir="auto">#${esc(g)}</span>`).join('');
  const emptyKey = () => (state.query ? 'emptySearch' : ({ home: 'emptyHome', calendar: 'emptyCalendar', inbox: 'emptyInbox', today: 'emptyToday', upcoming: 'emptyUpcoming', all: 'emptyAll', done: 'emptyDone', list: 'emptyList', tag: 'emptyTag' })[state.view]);
  function showEmpty(list) {
    $('#empty').hidden = list.length > 0;
    if (!list.length) {
      $('#empty .empty-text').textContent = t(emptyKey());
      $('#empty .empty-hint').hidden = state.view === 'done' || !!state.query;
      $('#empty-new').hidden = state.view === 'done' || !!state.query;
    }
    $('#list-actions').hidden = !(state.view === 'done' && list.length && !state.query);
  }
  const canEdit = (task) => { const l = task.listId && getList(task.listId); return !(l && l.locked) && canWriteWS(workspaceOfTask(task)); };

  // ---- list view ----
  function renderRows() {
    const list = visibleTasks();
    const wrap = $('#task-list'); wrap.innerHTML = '';
    showEmpty(list);
    const grouped = !state.query && ['home', 'today', 'all', 'upcoming', 'list', 'tag', 'inbox'].includes(state.view) && state.data.settings.sort === 'due';
    let last = null, groupCounts = {};
    if (grouped) list.forEach((x) => { const g = groupKey(x); groupCounts[g] = (groupCounts[g] || 0) + 1; });
    list.forEach((task) => {
      if (grouped) {
        const g = groupKey(task);
        if (g && g !== last) {
          if (last) wrap.appendChild(newRowEl(last));
          const h = document.createElement('div');
          h.className = 'group ' + g;
          h.innerHTML = `${icon('chevron-down')}<span>${esc(t(g))}</span><span class="n">${num(groupCounts[g])}</span>`;
          wrap.appendChild(h); last = g;
        }
      }
      wrap.appendChild(rowEl(task));
    });
    if (list.length && state.view !== 'done' && !state.query) wrap.appendChild(newRowEl(last));
    if (state.focusId && !list.some((x) => x.id === state.focusId)) state.focusId = null;
  }
  const GROUP_DUE = { overdue: () => todayIso(), today: () => todayIso(), tomorrow: () => addDays(todayIso(), 1), thisWeek: () => addDays(todayIso(), 2), later: () => addDays(todayIso(), 8), noDate: () => '' };
  function newRowEl(group) {
    const b = document.createElement('button'); b.className = 'row-new';
    b.innerHTML = `${icon('plus')}<span>${esc(t('new'))}</span>`;
    b.onclick = () => openCapture(group && GROUP_DUE[group] ? { due: GROUP_DUE[group]() } : {});
    return b;
  }

  function rowEl(task) {
    const el = document.createElement('div');
    el.className = `row${task.done ? ' done' : ''}${task.id === state.selectedId ? ' selected' : ''}`;
    el.dataset.id = task.id; el.setAttribute('role', 'listitem'); el.tabIndex = task.id === (state.focusId || state.selectedId) ? 0 : -1;
    el.draggable = !task.done && !state.query;
    const meta = [];
    if (task.priority) meta.push(prioChip(task.priority));
    if (task.tags.length) meta.push(tagChips(task));
    const sb = subBadge(task); if (sb) meta.push(sb);
    if (task.repeat !== 'none') meta.push(`<span>${icon('repeat')}${esc(t('repeatShort')[task.repeat])}</span>`);
    const db = dueBadge(task); if (db) meta.push(db);
    if (state.view !== 'list') meta.push(listBadge(task));
    if (task.notes.trim()) meta.push(`<span>${icon('notes')}</span>`);
    if (task.done && task.completedAt) meta.push(`<span>${icon('check')}${esc(fmtDateTime(task.completedAt))}</span>`);
    el.innerHTML = `
      <span class="row-grip">${icon('grip')}</span>
      <label class="cbx"><input type="checkbox" ${task.done ? 'checked' : ''} tabindex="-1"><span class="cb">${icon('check')}</span></label>
      <div class="row-main"><div class="row-title">${esc(task.title)}</div><span class="row-open">${icon('expand')}${esc(t('open'))}</span></div>
      <div class="row-meta">${meta.join('')}</div>
      <button class="ibtn xs danger row-del" tabindex="-1" title="${esc(t('delete'))}">${icon('trash')}</button>`;
    el.querySelector('input').addEventListener('change', (e) => toggleDone(task.id, e.target.checked, el));
    el.querySelector('.row-main').addEventListener('click', () => openDetail(task.id));
    el.querySelector('.row-del').addEventListener('click', (e) => { e.stopPropagation(); deleteTask(task.id); });
    el.addEventListener('focus', () => { state.focusId = task.id; });
    el.addEventListener('contextmenu', (e) => { e.preventDefault(); taskMenu(task, e); });
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
      src.due = task.due;
      const siblings = visibleTasks().filter((x) => x.id !== src.id && groupKey(x) === groupKey(task));
      const idx = siblings.findIndex((x) => x.id === task.id);
      siblings.splice(before ? idx : idx + 1, 0, src);
      siblings.forEach((x, i) => { x.order = i; });
      save(); render();
    });
    return el;
  }
  const drag = { id: null, listId: null };

  // ---- table view ----
  function renderTable() {
    const list = visibleTasks();
    const wrap = $('#table'); showEmpty(list);
    if (!list.length) { wrap.innerHTML = ''; return; }
    const grouped = !state.query && state.data.settings.sort === 'due' && ['home', 'today', 'all', 'upcoming', 'list', 'tag', 'inbox'].includes(state.view);
    const showList = state.view !== 'list';
    const head = `<thead><tr><th style="width:44%">${icon('notes')}${esc(t('titleCol'))}</th><th>${icon('calendar')}${esc(t('due'))}</th><th>${icon('flag')}${esc(t('priority'))}</th>${showList ? `<th>${icon('list')}${esc(t('list'))}</th>` : ''}<th>${icon('tag')}${esc(t('tags'))}</th><th>${icon('subtask')}${esc(t('subtasks'))}</th><th></th></tr></thead>`;
    let body = '', last = null;
    const cols = 6 + (showList ? 1 : 0);
    list.forEach((x) => {
      if (grouped) { const g = groupKey(x); if (g && g !== last) { body += `<tr class="t-group ${g}"><th colspan="${cols}">${esc(t(g))}</th></tr>`; last = g; } }
      const d = x.subtasks.filter((s) => s.done).length;
      const l = x.listId && getList(x.listId);
      body += `<tr class="${x.done ? 'done' : ''}${x.id === state.selectedId ? ' selected' : ''}" data-id="${x.id}">
        <td class="title-cell"><div class="t-title-wrap"><label class="cbx"><input type="checkbox" ${x.done ? 'checked' : ''}><span class="cb">${icon('check')}</span></label><span class="t-title" data-act="open">${esc(x.title)}</span><span class="row-open" data-act="open">${icon('expand')}${esc(t('open'))}</span></div></td>
        <td><button class="cell-btn ${x.due ? '' : 'empty'}" data-act="due">${x.due ? dueBadge(x) : esc(t('empty'))}</button></td>
        <td><button class="cell-btn ${x.priority ? '' : 'empty'}" data-act="prio">${x.priority ? prioChip(x.priority) : esc(t('empty'))}</button></td>
        ${showList ? `<td><button class="cell-btn ${l ? '' : 'empty'}" data-act="list">${l ? `<span class="dot" style="background:${l.color}"></span><span dir="auto">${esc(l.name)}</span>` : esc(t('inbox'))}</button></td>` : ''}
        <td><button class="cell-btn ${x.tags.length ? '' : 'empty'}" data-act="tags"><span class="tags">${x.tags.length ? tagChips(x) : esc(t('empty'))}</span></button></td>
        <td>${x.subtasks.length ? `<span class="row-meta">${subBadge(x)}</span>` : `<span class="cell-btn empty" data-act="open">${esc(t('empty'))}</span>`}</td>
        <td><button class="ibtn xs" data-act="menu">${icon('more')}</button></td></tr>`;
    });
    if (state.view !== 'done' && !state.query) body += `<tr class="t-new" data-new="1"><td colspan="${cols}">${icon('plus')}${esc(t('new'))}</td></tr>`;
    wrap.innerHTML = `<table class="table">${head}<tbody>${body}</tbody></table>`;
    wrap.querySelectorAll('tr[data-id]').forEach((tr) => {
      const x = getTask(tr.dataset.id);
      tr.querySelector('input[type=checkbox]').onchange = (e) => toggleDone(x.id, e.target.checked);
      tr.onclick = (e) => {
        const a = e.target.closest('[data-act]'); if (!a) return;
        const act = a.dataset.act;
        if (act === 'open') openDetail(x.id);
        else if (act === 'due') openPicker(a, x.due, (iso) => { x.due = iso; save(); render(); });
        else if (act === 'prio') prioMenu(x, a);
        else if (act === 'list') listMenu(x, a);
        else if (act === 'tags') tagsMenu(x, a);
        else if (act === 'menu') taskMenu(x, a);
      };
      tr.oncontextmenu = (e) => { e.preventDefault(); taskMenu(x, e); };
    });
    const nr = wrap.querySelector('tr[data-new]'); if (nr) nr.onclick = () => openCapture();
  }

  // ---- board view (grouped by priority, drag between columns) ----
  function renderBoard() {
    const list = visibleTasks();
    const wrap = $('#board'); showEmpty(list);
    wrap.innerHTML = '';
    if (!list.length) return;
    const cols = [3, 2, 1, 0];
    cols.forEach((p) => {
      const items = list.filter((x) => x.priority === p);
      const col = document.createElement('section'); col.className = 'col'; col.dataset.p = p;
      col.innerHTML = `<div class="col-head">${p ? prioChip(p) : `<span class="chip">${esc(t('noPriority'))}</span>`}<span class="n">${num(items.length)}</span><button class="ibtn xs" title="${esc(t('new'))}">${icon('plus')}</button></div>`;
      col.querySelector('.ibtn').onclick = () => openCapture({ priority: p });
      items.forEach((x) => {
        const c = document.createElement('article'); c.className = `card${x.done ? ' done' : ''}${x.id === state.selectedId ? ' selected' : ''}`; c.draggable = !x.done;
        const meta = [dueBadge(x), subBadge(x), state.view !== 'list' ? listBadge(x) : '', tagChips(x), x.repeat !== 'none' ? `<span>${icon('repeat')}</span>` : ''].filter(Boolean).join('');
        c.innerHTML = `<div class="card-title"><label class="cbx"><input type="checkbox" ${x.done ? 'checked' : ''}><span class="cb">${icon('check')}</span></label><span>${esc(x.title)}</span></div>${meta ? `<div class="card-meta">${meta}</div>` : ''}`;
        c.querySelector('input').onchange = (e) => toggleDone(x.id, e.target.checked);
        c.onclick = (e) => { if (e.target.closest('.cbx')) return; openDetail(x.id); };
        c.oncontextmenu = (e) => { e.preventDefault(); taskMenu(x, e); };
        c.addEventListener('dragstart', (e) => { drag.id = x.id; c.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
        c.addEventListener('dragend', () => { drag.id = null; $$('.col').forEach((k) => k.classList.remove('drop')); });
        col.appendChild(c);
      });
      const nb = document.createElement('button'); nb.className = 'col-new'; nb.innerHTML = `${icon('plus')}<span>${esc(t('new'))}</span>`; nb.onclick = () => openCapture({ priority: p }); col.appendChild(nb);
      col.addEventListener('dragover', (e) => { if (!drag.id) return; e.preventDefault(); col.classList.add('drop'); });
      col.addEventListener('dragleave', () => col.classList.remove('drop'));
      col.addEventListener('drop', (e) => { e.preventDefault(); col.classList.remove('drop'); const x = getTask(drag.id); if (x && x.priority !== p) { x.priority = p; save(); render(); } });
      wrap.appendChild(col);
    });
  }

  // ---- calendar view (month grid, drag to reschedule) ----
  const calState = { y: 0, m: 0 };
  function renderCalendar() {
    const wrap = $('#calendar');
    const all = visibleTasks(); showEmpty(all.length ? all : []); $('#empty').hidden = true;
    if (!calState.y) { const p = isoToParts(todayIso()); calState.y = p.y; calState.m = p.m; }
    const jal = cal() === 'jalali'; const months = jal ? t('jMonths') : t('gMonths');
    const firstDow = jal ? 6 : 0; const wd = jal ? t('wdSat') : t('wdSun');
    const len = monthLen(calState.y, calState.m);
    const startDow = new Date(partsToIso(calState.y, calState.m, 1) + 'T00:00:00').getDay();
    const offset = (startDow - firstDow + 7) % 7; const today = todayIso();
    const byDay = {}; all.forEach((x) => { if (x.due) (byDay[x.due] = byDay[x.due] || []).push(x); });
    const firstIso = addDays(partsToIso(calState.y, calState.m, 1), -offset);
    const cells = Math.ceil((offset + len) / 7) * 7;
    let grid = wd.map((w) => `<div class="cal-wd">${w}</div>`).join('');
    for (let i = 0; i < cells; i++) {
      const iso = addDays(firstIso, i); const inMonth = i >= offset && i < offset + len;
      const dow = i % 7; const holiday = jal ? dow === 6 : dow === 0;
      const dayNum = inMonth ? i - offset + 1 : isoToParts(iso).d;
      const evs = (byDay[iso] || []);
      const shown = evs.slice(0, 4);
      grid += `<div class="cal-day${inMonth ? '' : ' other'}${iso === today ? ' today' : ''}${holiday ? ' holiday' : ''}" data-iso="${iso}"><span class="cal-d">${num(dayNum)}</span>${shown.map((x) => `<div class="cal-ev${x.done ? ' done' : ''}${x.priority === 3 ? ' p3' : ''}" data-id="${x.id}" draggable="${!x.done}" title="${esc(x.title)}"><i style="${x.listId && getList(x.listId) ? `background:${getList(x.listId).color}` : ''}"></i><span dir="auto">${esc(x.title)}</span></div>`).join('')}${evs.length > 4 ? `<span class="cal-more">+${num(evs.length - 4)}</span>` : ''}</div>`;
    }
    wrap.innerHTML = `<div class="cal-head"><button class="ibtn" id="cal-prev">${icon('chevron', 'flip-rtl')}</button><button class="ibtn" id="cal-next">${icon('chevron', 'flip-ltr')}</button><span class="cal-title">${esc(months[calState.m - 1])} ${num(calState.y).replace(/[,٬]/g, '')}</span><button class="tbtn today-btn" id="cal-today">${esc(t('today'))}</button></div><div class="cal-grid">${grid}</div>`;
    $('#cal-prev').onclick = () => { calState.m -= 1; if (calState.m < 1) { calState.m = 12; calState.y -= 1; } renderCalendar(); };
    $('#cal-next').onclick = () => { calState.m += 1; if (calState.m > 12) { calState.m = 1; calState.y += 1; } renderCalendar(); };
    $('#cal-today').onclick = () => { const p = isoToParts(todayIso()); calState.y = p.y; calState.m = p.m; renderCalendar(); };
    wrap.querySelectorAll('.cal-day').forEach((d) => {
      d.onclick = (e) => { const ev = e.target.closest('.cal-ev'); if (ev) return openDetail(ev.dataset.id); openCapture({ due: d.dataset.iso }); };
      d.addEventListener('dragover', (e) => { if (!drag.id) return; e.preventDefault(); d.classList.add('drop'); });
      d.addEventListener('dragleave', () => d.classList.remove('drop'));
      d.addEventListener('drop', (e) => { e.preventDefault(); d.classList.remove('drop'); const x = getTask(drag.id); if (x && x.due !== d.dataset.iso) { x.due = d.dataset.iso; save(); render(); } });
    });
    wrap.querySelectorAll('.cal-ev').forEach((ev) => {
      ev.addEventListener('dragstart', (e) => { drag.id = ev.dataset.id; e.dataTransfer.effectAllowed = 'move'; });
      ev.addEventListener('dragend', () => { drag.id = null; $$('.cal-day').forEach((k) => k.classList.remove('drop')); });
      ev.oncontextmenu = (e) => { e.preventDefault(); const x = getTask(ev.dataset.id); if (x) taskMenu(x, e); };
    });
  }

  // ---- popover menu (single instance) ----
  const menu = { open: false, onClose: null };
  function openMenu(anchor, items, opts = {}) {
    const el = $('#menu'); el.innerHTML = '';
    if (opts.title) { const h = document.createElement('div'); h.className = 'menu-title'; h.textContent = opts.title; el.appendChild(h); }
    items.forEach((it) => {
      if (it === '-') { const s = document.createElement('div'); s.className = 'menu-sep'; el.appendChild(s); return; }
      const b = document.createElement('button'); b.className = 'menu-item' + (it.on ? ' on' : '') + (it.danger ? ' danger' : ''); b.setAttribute('role', 'menuitem');
      b.innerHTML = `${it.color ? `<span class="dot" style="background:${it.color}"></span>` : it.icon ? icon(it.icon) : ''}<span dir="auto">${esc(it.label)}</span>${it.hint ? `<span class="mi-hint">${esc(it.hint)}</span>` : ''}`;
      b.onclick = () => { closeMenu(); it.run && it.run(); };
      el.appendChild(b);
    });
    el.hidden = false; menu.open = true;
    const point = anchor instanceof MouseEvent ? { left: anchor.clientX, right: anchor.clientX, top: anchor.clientY, bottom: anchor.clientY } : anchor.getBoundingClientRect();
    const w = el.offsetWidth, h = el.offsetHeight;
    let left = document.documentElement.dir === 'rtl' ? point.right - w : point.left; left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    let top = point.bottom + 4; if (top + h > window.innerHeight - 8) top = Math.max(8, point.top - h - 4);
    el.style.left = left + 'px'; el.style.top = top + 'px';
    const first = el.querySelector('.menu-item'); if (first && !(anchor instanceof MouseEvent)) first.focus();
  }
  function closeMenu() { $('#menu').hidden = true; menu.open = false; }
  const prioMenu = (x, a) => openMenu(a, [3, 2, 1, 0].map((p) => ({ label: p ? t('prio')[p] : t('none'), icon: p ? 'flag' : 'x', hint: p ? '!' + p : '', on: x.priority === p, run: () => { x.priority = p; save(); render(); } })), { title: t('priority') });
  const listMenu = (x, a) => openMenu(a, [{ label: t('inbox'), icon: 'inbox', on: !x.listId, run: () => { x.listId = null; save(); render(); } }, ...sortedLists().filter(canWriteList).map((l) => ({ label: l.name, color: l.color, on: x.listId === l.id, run: () => { x.listId = l.id; save(); render(); } }))], { title: t('list') });
  const tagsMenu = (x, a) => {
    const all = new Set(); state.data.tasks.forEach((q) => q.tags.forEach((g) => all.add(g))); x.tags.forEach((g) => all.add(g));
    const items = [...all].sort().map((g) => ({ label: '#' + g, icon: 'tag', on: x.tags.includes(g), run: () => { x.tags = x.tags.includes(g) ? x.tags.filter((q) => q !== g) : [...x.tags, g]; save(); render(); } }));
    items.push('-', { label: t('editTags'), icon: 'plus', run: () => { openDetail(x.id); setTimeout(() => $('#d-tags').focus(), 250); } });
    openMenu(a, items, { title: t('tags') });
  };
  const dueMenu = (x, a) => { const td = todayIso(); openMenu(a, [{ label: t('today'), icon: 'sun', run: () => { x.due = td; save(); render(); } }, { label: t('tomorrow'), icon: 'calendar', run: () => { x.due = addDays(td, 1); save(); render(); } }, { label: t('nextWeek'), icon: 'calendar', run: () => { x.due = addDays(td, 7); save(); render(); } }, { label: t('pickDate'), icon: 'calendar', run: () => openPicker(a, x.due, (iso) => { x.due = iso; save(); render(); }) }, '-', { label: t('noDate'), icon: 'x', run: () => { x.due = ''; save(); render(); } }], { title: t('due') }); };
  function taskMenu(x, a) {
    openMenu(a, [
      { label: t('open'), icon: 'expand', hint: 'Enter', run: () => openDetail(x.id) },
      { label: x.done ? t('notDone') : t('done'), icon: 'check-circle', hint: 'Space', run: () => toggleDone(x.id, !x.done) },
      '-',
      { label: t('due'), icon: 'calendar', run: () => dueMenu(x, a) },
      { label: t('priority'), icon: 'flag', run: () => prioMenu(x, a) },
      { label: t('list'), icon: 'list', run: () => listMenu(x, a) },
      { label: t('tags'), icon: 'tag', run: () => tagsMenu(x, a) },
      '-',
      { label: t('delete'), icon: 'trash', hint: 'Del', danger: true, run: () => deleteTask(x.id) },
    ]);
  }

  // ---- inline capture ----
  const capture = { open: false, preset: {} };
  function openCapture(preset = {}) {
    if (state.view === 'done' || state.view === 'report') setView('all');
    capture.open = true; capture.preset = preset;
    $('#capture').hidden = false; $('#app').classList.remove('sidebar-open'); updateScrim();
    const qa = $('#qa-input'); qa.value = ''; renderChips();
    setTimeout(() => { qa.focus(); qa.scrollIntoView({ block: 'nearest' }); }, 20);
  }
  function closeCapture() { capture.open = false; capture.preset = {}; $('#capture').hidden = true; $('#qa-chips').innerHTML = ''; }
  function effectiveQuick(raw) {
    const p = parseQuick(raw);
    if (!p.due && capture.preset.due !== undefined) p.due = capture.preset.due;
    if (!p.priority && capture.preset.priority) p.priority = capture.preset.priority;
    return p;
  }
  function renderChips() {
    const raw = $('#qa-input').value; const w = $('#qa-chips');
    if (!raw.trim()) { w.innerHTML = ''; return; }
    const p = effectiveQuick(raw); const out = [];
    if (p.due) out.push(`<span class="pill">${icon('calendar')} ${esc(relDue(p.due).text)}</span>`);
    if (p.time) out.push(`<span class="pill">${icon('clock')} ${esc(fmtTime(p.time))}</span>`);
    if (p.priority) out.push(`<span class="pill p${p.priority}">${icon('flag')} ${esc(t('prio')[p.priority])}</span>`);
    if (p.listId) { const l = getList(p.listId); out.push(`<span class="pill"><i class="dot" style="background:${l.color}"></i> ${esc(l.name)}</span>`); }
    p.tags.forEach((g) => out.push(`<span class="pill tag" dir="auto">#${esc(g)}</span>`));
    w.innerHTML = out.join('');
  }
  function submitCapture() {
    const qa = $('#qa-input'); const raw = qa.value;
    const p = effectiveQuick(raw); if (!p.title) return false;
    const rebuilt = [p.title, p.due ? p.due : '', p.time || '', p.priority ? '!' + p.priority : '', ...p.tags.map((g) => '#' + g)].filter(Boolean).join(' ');
    const ok = addTask(rebuilt, { listId: p.listId, due: p.due });
    if (ok) { qa.value = ''; renderChips(); qa.focus(); }
    return ok;
  }

  // ---- sync pill (topbar) ----
  function renderSyncPill() {
    const pill = $('#sync-pill'); const on = signedIn();
    pill.hidden = !on && navigator.onLine;
    pill.className = 'sync-pill' + (syncUI.status === 'busy' ? ' busy' : syncUI.status === 'err' ? ' err' : !navigator.onLine ? ' off' : '');
    pill.title = syncUI.error || '';
    $('#sync-pill-text').textContent = !navigator.onLine ? t('offline') : syncUI.status === 'busy' ? t('syncing') : syncUI.status === 'err' ? t('syncErr') : state.data.sync.lastSync ? t('synced') : t('syncNow');
    pill.querySelector('use').setAttribute('href', navigator.onLine ? '#i-sync' : '#i-wifi-off');
  }

  // ---------- Detail ----------
  function openDetail(id) { state.selectedId = id; state.focusId = id; closeMenu(); $('#detail').classList.remove('full'); render(); }
  function closeDetail() { state.selectedId = null; render(); const r = state.focusId && document.querySelector(`.row[data-id="${state.focusId}"]`); if (r) r.focus(); }
  function autoGrow(ta) { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; }
  function renderDetail() {
    const task = getTask(state.selectedId);
    $('#detail').hidden = !task;
    $('#app').classList.toggle('peek-open', !!task);
    if (!task) return;
    const ae = document.activeElement;
    $('#d-done').checked = task.done;
    if (ae !== $('#d-title')) { $('#d-title').value = task.title; autoGrow($('#d-title')); }
    if (ae !== $('#d-notes')) { $('#d-notes').value = task.notes; autoGrow($('#d-notes')); }
    const l = task.listId && getList(task.listId);
    $('#d-list-name').innerHTML = l ? `<i style="background:${l.color}"></i><span dir="auto">${esc(l.name)}</span>` : `${icon('inbox')}${esc(t('inbox'))}`;
    $('#d-due-text').textContent = task.due ? fmtDate(task.due, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : t('empty');
    $('#d-due-text').classList.toggle('placeholder', !task.due);
    $('#d-due-alt').textContent = task.due ? fmtDateAlt(task.due) : '';
    $('#d-time').value = task.time; $('#d-reminder').checked = task.reminder; $('#d-reminder-wrap').style.opacity = task.time ? 1 : .45;
    $('#d-repeat').value = task.repeat;
    $$('#d-prio button').forEach((b) => b.classList.toggle('active', +b.dataset.p === task.priority));
    const sel = $('#d-listsel');
    sel.innerHTML = `<option value="">${esc(t('inbox'))}</option>` + sortedLists().map((x) => `<option value="${x.id}">${esc(x.name)}</option>`).join('');
    sel.value = task.listId || '';
    if (ae !== $('#d-tags')) $('#d-tags').value = task.tags.join(' ');
    const done = task.subtasks.filter((s) => s.done).length;
    $('#d-sub-progress').textContent = task.subtasks.length ? `${num(done)} / ${num(task.subtasks.length)}` : '';
    $('#d-sub-bar').hidden = !task.subtasks.length;
    $('#d-sub-bar i').style.width = task.subtasks.length ? (done / task.subtasks.length * 100) + '%' : '0';
    const sw = $('#d-subtasks'); sw.innerHTML = '';
    task.subtasks.forEach((s) => {
      const row = document.createElement('div'); row.className = 'subtask' + (s.done ? ' done' : '');
      row.innerHTML = `<label class="cbx"><input type="checkbox" ${s.done ? 'checked' : ''}><span class="cb">${icon('check')}</span></label><input type="text" dir="auto" value="${esc(s.title)}"><button class="ibtn xs danger">${icon('x')}</button>`;
      row.querySelector('input[type=checkbox]').onchange = (e) => { s.done = e.target.checked; save(); render(); };
      const ti = row.querySelector('input[type=text]');
      ti.oninput = (e) => { s.title = e.target.value; save(); };
      ti.onblur = () => { if (!s.title.trim()) { task.subtasks = task.subtasks.filter((x) => x !== s); save(); render(); } };
      ti.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); $('#d-sub-input').focus(); } };
      row.querySelector('button').onclick = () => { task.subtasks = task.subtasks.filter((x) => x !== s); save(); render(); };
      sw.appendChild(row);
    });
    $('#d-meta').textContent = fmtDateTime(task.createdAt) + (task.completedAt ? ` · ${t('completedAt')}: ${fmtDateTime(task.completedAt)}` : '');
    const ro = !canEdit(task);
    $('#detail').classList.toggle('readonly', ro);
    $$('#detail input, #detail textarea, #detail select, #detail .seg button').forEach((el) => { el.disabled = ro; });
  }
  let savedTimer = null;
  const flashSaved = () => { $('#d-saved').textContent = t('savedShort'); clearTimeout(savedTimer); savedTimer = setTimeout(() => { $('#d-saved').textContent = ''; }, 1500); };
  function bindDetail() {
    const cur = () => getTask(state.selectedId);
    const upd = (fn) => { const x = cur(); if (!x) return; fn(x); save(); flashSaved(); };
    $('#detail-close').onclick = closeDetail;
    $('#detail-expand').onclick = () => $('#detail').classList.toggle('full');
    $('#detail-delete').onclick = () => deleteTask(state.selectedId);
    $('#d-done').onchange = (e) => toggleDone(state.selectedId, e.target.checked);
    $('#d-title').oninput = (e) => { upd((x) => { x.title = e.target.value.replace(/\n/g, ' '); autoGrow(e.target); }); const x = cur(); const r = x && document.querySelector(`.row[data-id="${x.id}"] .row-title`); if (r) r.textContent = x.title; };
    $('#d-title').onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); $('#d-notes').focus(); } };
    $('#d-title').onblur = () => { const x = cur(); if (x && !x.title.trim()) { x.title = '…'; save(); render(); } else render(); };
    $('#d-notes').oninput = (e) => upd((x) => { x.notes = e.target.value; autoGrow(e.target); });
    $('#d-due').onclick = (e) => { const x = cur(); if (x) openPicker(e.currentTarget, x.due, (iso) => { x.due = iso; save(); render(); }); };
    $('#d-time').onchange = (e) => { upd((x) => { x.time = e.target.value || ''; if (!x.time) x.reminder = false; else if (!x.reminder) x.reminder = true; x.notifiedAt = null; }); render(); };
    $('#d-reminder').onchange = (e) => upd((x) => { x.reminder = e.target.checked; x.notifiedAt = null; });
    $('#d-repeat').onchange = (e) => { upd((x) => { x.repeat = e.target.value; if (x.repeat !== 'none' && !x.due) x.due = todayIso(); }); render(); };
    $$('#d-prio button').forEach((b) => b.onclick = () => { upd((x) => { x.priority = +b.dataset.p; }); render(); });
    $('#d-listsel').onchange = (e) => { upd((x) => { x.listId = e.target.value || null; }); render(); };
    $('#d-tags').onchange = (e) => { upd((x) => { x.tags = [...new Set(e.target.value.split(/[\s,،]+/).map((s) => s.replace(/^#/, '').trim()).filter(Boolean))]; }); render(); };
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
    $('#list-delete').hidden = !l || !canWriteList(l);
    listDlg.workspaceId = l ? workspaceOfList(l) : (state.view === 'list' && getList(state.listId) ? workspaceOfList(getList(state.listId)) : (personalWS() ? personalWS().id : ''));
    renderListWorkspaces();
    renderSwatches();
    $('#list-dialog').hidden = false;
    setTimeout(() => $('#list-name').focus(), 30);
  }
  function renderSwatches() {
    $('#list-colors').innerHTML = LIST_COLORS.map((c) => `<button class="swatch${c === listDlg.color ? ' active' : ''}" style="background:${c}" data-c="${c}"></button>`).join('');
    $$('#list-colors .swatch').forEach((b) => b.onclick = () => { listDlg.color = b.dataset.c; renderSwatches(); });
  }
  function renderListWorkspaces() {
    const wrap = $('#list-ws-wrap'); const sel = $('#list-ws');
    const writable = state.data.workspaces.filter((w) => w.role !== 'viewer');
    wrap.hidden = !signedIn() || writable.length < 1;
    sel.innerHTML = writable.map((w) => `<option value="${w.id}">${esc(w.personal ? t('personalWS') : w.name)}</option>`).join('') + `<option value="__new">${esc(t('newSharedWS'))}</option>`;
    sel.value = writable.some((w) => w.id === listDlg.workspaceId) ? listDlg.workspaceId : (writable[0] ? writable[0].id : '');
    $('#list-share').hidden = !signedIn() || !listDlg.workspaceId || (getWS(listDlg.workspaceId) || {}).personal;
  }
  async function saveList() {
    const name = $('#list-name').value.trim(); if (!name) { $('#list-name').focus(); return; }
    let wsId = listDlg.workspaceId;
    if (!$('#list-ws-wrap').hidden) {
      wsId = $('#list-ws').value;
      if (wsId === '__new') {
        try { const r = await api(state.data.sync.server, '/api/workspaces', { name: $('#list-name').value.trim() }, state.data.sync.token); state.data.workspaces.push({ ...r.workspace }); wsId = r.workspace.id; }
        catch (e) { showToast(errText(e)); return; }
      }
    }
    if (listDlg.id) { const l = getList(listDlg.id); l.name = name; l.color = listDlg.color; if (wsId) l.workspaceId = wsId; }
    else { const id = uid(); state.data.lists.push({ id, name, color: listDlg.color, order: state.data.lists.length, workspaceId: wsId || '' }); state.view = 'list'; state.listId = id; }
    $('#list-dialog').hidden = true; save(); render();
  }

  // ---------- sharing (workspace members) ----------
  const share = { wsId: '' };
  async function openShareDialog(wsId) {
    share.wsId = wsId; const w = getWS(wsId); if (!w) return;
    $('#share-title').textContent = `${t('shareTitle')} · ${w.name}`;
    $('#share-add-wrap').hidden = w.role !== 'owner';
    $('#share-error').textContent = ''; $('#share-email').value = '';
    $('#share-dialog').hidden = false; $('#list-dialog').hidden = true;
    await renderMembers();
  }
  async function renderMembers() {
    const w = getWS(share.wsId); const box = $('#share-members'); box.innerHTML = '…';
    try {
      const r = await api(state.data.sync.server, `/api/workspaces/${share.wsId}/members`, null, state.data.sync.token);
      box.innerHTML = r.members.map((m) => `<div class="member"><span class="member-who"><b dir="auto">${esc(m.name)}</b><span dir="ltr">${esc(m.email)}</span></span><span class="member-role">${esc(t('role_' + m.role))}</span>${w.role === 'owner' && m.role !== 'owner' ? `<button class="ibtn sm danger" data-rm="${m.userId}" title="${esc(t('remove'))}">${icon('x')}</button>` : m.userId !== w.ownerId && m.email === state.data.sync.email ? `<button class="btn ghost" data-rm="${m.userId}">${esc(t('leave'))}</button>` : ''}</div>`).join('');
      $$('#share-members [data-rm]').forEach((b) => b.onclick = async () => { try { await api(state.data.sync.server, `/api/workspaces/${share.wsId}/members/${b.dataset.rm}`, null, state.data.sync.token, 'DELETE'); if (b.dataset.rm !== w.ownerId && b.textContent.trim() === t('leave')) { $('#share-dialog').hidden = true; } await renderMembers(); scheduleSync(0); } catch (e) { $('#share-error').textContent = errText(e); } });
    } catch (e) { box.innerHTML = `<div class="hint">${esc(errText(e))}</div>`; }
  }
  function bindShare() {
    $('#share-close').onclick = () => { $('#share-dialog').hidden = true; };
    $('#list-share').onclick = () => openShareDialog(listDlg.workspaceId);
    $('#list-ws').onchange = () => { listDlg.workspaceId = $('#list-ws').value; $('#list-share').hidden = listDlg.workspaceId === '__new' || !getWS(listDlg.workspaceId) || getWS(listDlg.workspaceId).personal; };
    $('#share-add').onclick = async () => {
      $('#share-error').textContent = '';
      try { await api(state.data.sync.server, `/api/workspaces/${share.wsId}/members`, { email: $('#share-email').value.trim(), role: $('#share-role').value }, state.data.sync.token); $('#share-email').value = ''; await renderMembers(); }
      catch (e) { $('#share-error').textContent = e.code === 'user_not_found' ? t('errNoUser') : errText(e); }
    };
    $('#share-email').onkeydown = (e) => { if (e.key === 'Enter') $('#share-add').click(); };
    $('#share-delete-ws').onclick = async () => {
      const w = getWS(share.wsId); if (!w || w.role !== 'owner') return;
      try { await api(state.data.sync.server, `/api/workspaces/${share.wsId}`, null, state.data.sync.token, 'DELETE'); state.data.workspaces = state.data.workspaces.filter((x) => x.id !== share.wsId); $('#share-dialog').hidden = true; scheduleSync(0); render(); }
      catch (e) { $('#share-error').textContent = errText(e); }
    };
  }
  function deleteList() { if (!listDlg.id) return; $('#list-dialog').hidden = true; trashList(listDlg.id); }
  // Trash: a list keeps its tasks and disappears from everywhere until restored or deleted forever
  function trashList(id) {
    const l = getList(id); if (!l) return;
    l.trashedAt = Date.now(); l.favorite = false;
    if (state.view === 'list' && state.listId === id) { state.view = 'home'; state.listId = null; }
    state.undo = { restore: () => { l.trashedAt = 0; } };
    save(); render(); showToast(t('movedToTrash'), true);
  }
  function restoreList(id) { const l = getList(id); if (!l) return; l.trashedAt = 0; save(); render(); renderTrash(); showToast(t('restored')); }
  function deleteListForever(id) {
    if (!confirm(t('confirmForever'))) return;
    state.data.tasks = state.data.tasks.filter((x) => x.listId !== id);
    state.data.lists = state.data.lists.filter((l) => l.id !== id);
    save(); render(); renderTrash();
  }
  function purgeTrash() { const cut = Date.now() - 30 * 864e5; const gone = state.data.lists.filter((l) => l.trashedAt && l.trashedAt < cut).map((l) => l.id); if (!gone.length) return; state.data.tasks = state.data.tasks.filter((x) => !gone.includes(x.listId)); state.data.lists = state.data.lists.filter((l) => !gone.includes(l.id)); }
  function renderTrash() {
    const q = $('#trash-q').value.trim().toLowerCase();
    const box = $('#trash-list'); box.innerHTML = '';
    const items = trashedLists().filter((l) => !q || l.name.toLowerCase().includes(q));
    if (!items.length) { box.innerHTML = `<div class="trash-empty">${esc(t('trashEmpty'))}</div>`; return; }
    items.forEach((l) => {
      const n = state.data.tasks.filter((x) => x.listId === l.id).length;
      const row = document.createElement('div'); row.className = 'trash-row';
      row.innerHTML = `${listMark(l)}<span class="trash-name" dir="auto">${esc(l.name)}</span><span class="count">${n ? num(n) : ''}</span><button class="ibtn xs" data-act="restore" title="${esc(t('restore'))}">${icon('restore')}</button><button class="ibtn xs danger" data-act="forever" title="${esc(t('deleteForever'))}">${icon('trash')}</button>`;
      row.querySelector('[data-act=restore]').onclick = () => restoreList(l.id);
      row.querySelector('[data-act=forever]').onclick = () => deleteListForever(l.id);
      box.appendChild(row);
    });
  }
  function toggleFavorite(id) { const l = getList(id); if (!l) return; l.favorite = !l.favorite; save(); render(); }
  const listMark = (l) => l.icon ? `<span class="emoji-mark">${esc(l.icon)}</span>` : `<span class="dot" style="background:${l.color}"></span>`;
  function copyLink(view, opts = {}) {
    const hash = view === 'list' ? '#/list/' + opts.listId : view === 'tag' ? '#/tag/' + encodeURIComponent(opts.tag) : '#/' + view;
    const base = state.data.sync.server || DEFAULT_SERVER || (location.protocol.startsWith('http') ? location.origin : '');
    const url = (base ? base.replace(/\/$/, '') + '/' : '') + hash;
    try { navigator.clipboard.writeText(url); showToast(t('linkCopied')); } catch { showToast(url); }
  }
  // Generic anchored popover (icon picker, cover picker, trash, customize)
  const pop = { el: null };
  function openPop(id, anchor, opts = {}) {
    closePop(); const el = $(id); el.hidden = false; pop.el = el;
    const r = anchor.getBoundingClientRect(); const w = el.offsetWidth, hgt = el.offsetHeight;
    let left = opts.align === 'end' ? r.right - w : r.left; if (document.documentElement.dir === 'rtl' && opts.align !== 'end') left = r.right - w;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    let top = opts.above ? r.top - hgt - 6 : r.bottom + 6; if (top + hgt > window.innerHeight - 8) top = Math.max(8, r.top - hgt - 6); if (top < 8) top = 8;
    el.style.left = left + 'px'; el.style.top = top + 'px';
    const inp = el.querySelector('input[type=search]'); if (inp) { inp.value = ''; setTimeout(() => inp.focus(), 20); }
  }
  function closePop() { if (pop.el) { pop.el.hidden = true; pop.el = null; } }
  document.addEventListener('mousedown', (e) => { if (pop.el && !e.target.closest('.pop') && !e.target.closest('#trash-btn,#customize-btn,#page-icon,#pa-icon,#pa-cover,#cover-change')) closePop(); });
  const EMOJI = '📋 ✅ 📝 📌 🎯 ⭐ 🔥 💡 🧠 📚 📖 ✏️ 🖊️ 📁 🗂️ 🗓️ ⏰ ⏳ 🔔 💼 🏢 🏠 🏡 🛒 🧺 🍎 🥗 🍳 ☕ 🧘 🏃 🚴 ⚽ 🏋️ 💊 🩺 🧾 💳 💰 📈 📊 🧮 🛠️ ⚙️ 🧰 💻 🖥️ 📱 🌐 🔐 🚀 ✈️ 🚗 🗺️ 🧳 🎒 🎁 🎉 🎂 🎓 🎨 🎵 🎬 📷 🌱 🌿 🌳 🌸 🌞 🌙 ❤️ 💜 💙 💚 🧡 🐱 🐶 🐟 🦋 👶 👪 🧑‍💻 🤝 🙏 ✨ 🔖 🧩 🏆 🥇 🧹 🧼 🪴 🛏️ 🍽️ 🧯 🔑 📦 🚚 🏪 🏦 🏥 🏫'.split(' ');
  function renderEmoji(q = '') {
    const g = $('#emoji-grid'); g.innerHTML = '';
    EMOJI.forEach((e) => { const b = document.createElement('button'); b.className = 'emoji-btn'; b.textContent = e; b.onclick = () => { const l = getList(state.listId); if (l) { l.icon = e; save(); render(); } closePop(); }; g.appendChild(b); });
  }
  const COVERS = ['ruby', 'gold', 'forest', 'ocean', 'violet', 'rose', 'slate', 'sunset', 'dawn', 'night', 'mint', 'sand'];
  function renderCovers() {
    const g = $('#cover-grid'); g.innerHTML = '';
    COVERS.forEach((c) => { const b = document.createElement('button'); b.className = 'cover-swatch cover-' + c; b.onclick = () => { const l = getList(state.listId); if (l) { l.cover = c; save(); render(); } closePop(); }; g.appendChild(b); });
  }
  const SIDE_SECS = ['upcoming', 'recents', 'views', 'tags'];
  const sideCfg = () => { try { return { upcoming: true, recents: true, views: true, tags: true, ...JSON.parse(localStorage.getItem('anjam.sidebar') || '{}') }; } catch { return { upcoming: true, recents: true, views: true, tags: true }; } };
  function applySideCfg() { const c = sideCfg(); $('#side-upcoming-sec').classList.toggle('cz-hidden', !c.upcoming); $('#side-recents-sec').classList.toggle('cz-hidden', !c.recents); $('#nav').closest('.side-section').classList.toggle('cz-hidden', !c.views); $('#side-tags-sec').classList.toggle('cz-hidden', !c.tags); }

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
    picker.value = value || ''; picker.onPick = onPick; picker.anchor = anchor; closeMenu();
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
    $('#dp-tomorrow').onclick = () => { picker.onPick && picker.onPick(addDays(todayIso(), 1)); closePicker(); };
    $('#dp-nextweek').onclick = () => { picker.onPick && picker.onPick(addDays(todayIso(), 7)); closePicker(); };
    $('#dp-clear').onclick = () => { picker.onPick && picker.onPick(''); closePicker(); };
    document.addEventListener('mousedown', (e) => { if (!$('#datepicker').hidden && !e.target.closest('#datepicker') && !(picker.anchor && picker.anchor.contains && picker.anchor.contains(e.target))) closePicker(); });
  }

  // ---------- Command palette ----------
  const pal = { items: [], index: 0 };
  function openPalette() { $('#palette').hidden = false; $('#palette-q').value = ''; renderPalette(); setTimeout(() => $('#palette-q').focus(), 20); }
  function closePalette() { $('#palette').hidden = true; }
  function paletteItems(q) {
    const items = [];
    const views = [['inbox', 'inbox'], ['today', 'sun'], ['upcoming', 'calendar'], ['all', 'layers'], ['done', 'check-circle'], ['report', 'chart']];
    const settingsDlg = () => { $('#settings').hidden = false; };
    const actions = [
      { label: t('aNewTask'), icon: 'plus', hint: 'Ctrl N', run: () => openCapture() },
      ...MODES.map((m) => ({ label: t('v' + m[0].toUpperCase() + m.slice(1)), icon: m === 'calendar' ? 'calendar' : m, run: () => setMode(m) })),
      { label: t('aNewList'), icon: 'list', run: () => openListDialog() },
      { label: t('aToggleLang'), icon: 'lang', hint: 'Ctrl Shift L', run: toggleLang },
      { label: t('aCalendar'), icon: 'calendar', run: () => { state.data.settings.calendar = cal() === 'jalali' ? 'gregorian' : 'jalali'; applyLang(); save(); render(); } },
      { label: t('aCollapse'), icon: 'panel', run: toggleRail },
      { label: t('aExportPdf'), icon: 'file', run: exportPdf },
      { label: t('aBackup'), icon: 'download', run: exportJson },
      { label: t('aSettings'), icon: 'settings', run: settingsDlg },
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
  async function api(server, pathname, body, token, method) {
    const r = await fetch(server.replace(/\/+$/, '') + pathname, { method: method || (body ? 'POST' : 'GET'), headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: body ? JSON.stringify(body) : undefined });
    let json = null; try { json = await r.json(); } catch {}
    if (!r.ok) { const e = new Error((json && json.error) || 'http_' + r.status); e.code = (json && json.error) || 'http_' + r.status; throw e; }
    return json;
  }
  function setSyncStatus(status, error) { syncUI.status = status; syncUI.error = error || ''; renderAccount(); renderSyncPill(); }
  async function syncNow() {
    if (!signedIn() || syncing) return;
    syncing = true; setSyncStatus('busy');
    try {
      stampChanges();
      const pws = personalWS();
      const changes = [];
      for (const id of dirty) {
        if (id === 'settings') continue;
        const task = getTask(id); const list = getList(id);
        if (list) { if (!list.workspaceId && pws) list.workspaceId = pws.id; changes.push({ kind: 'database', id, workspaceId: workspaceOfList(list), data: { name: list.name, color: list.color, order: list.order, icon: list.icon || '', cover: list.cover || '', desc: list.desc || '', favorite: !!list.favorite, locked: !!list.locked, trashedAt: list.trashedAt || 0 }, updatedAt: list.updatedAt }); }
        else if (task) changes.push({ kind: 'item', id, workspaceId: workspaceOfTask(task), data: { ...task, databaseId: task.listId || '' }, updatedAt: task.updatedAt });
        else if (state.data.tombstones[id]) { const tb = state.data.tombstones[id]; changes.push({ kind: tb.kind || 'item', id, workspaceId: tb.workspaceId || (pws ? pws.id : ''), updatedAt: tb.at, deleted: true }); }
      }
      const res = await api(state.data.sync.server, '/api/sync', { cursors: state.data.sync.cursors || {}, changes: changes.filter((c) => c.workspaceId) }, state.data.sync.token);
      dirty.clear();
      for (const c of changes) if (c.deleted) delete state.data.tombstones[c.id];
      let changed = false;
      // workspaces (membership may have changed)
      const wsJson = JSON.stringify(res.workspaces); if (wsJson !== JSON.stringify(state.data.workspaces)) { state.data.workspaces = res.workspaces; changed = true; }
      const mine = new Set(res.workspaces.map((w) => w.id));
      for (const c of res.changes) {
        const isList = c.kind === 'database';
        const arr = isList ? state.data.lists : state.data.tasks;
        const i = arr.findIndex((x) => x.id === c.id); const local = i >= 0 ? arr[i] : null;
        if (c.deleted) {
          if (local && local.updatedAt <= c.updatedAt) { arr.splice(i, 1); seen.delete(c.id); changed = true; }
          continue;
        }
        if (!c.data) continue;
        if (!local || local.updatedAt < c.updatedAt) {
          const d = c.data;
          const item = isList ? { id: c.id, name: d.name, color: d.color, order: d.order, workspaceId: c.workspaceId, updatedAt: c.updatedAt, icon: d.icon || '', cover: d.cover || '', desc: d.desc || '', favorite: !!d.favorite, locked: !!d.locked, trashedAt: Number(d.trashedAt) || 0 }
            : { ...d, id: c.id, listId: d.databaseId || d.listId || null, updatedAt: c.updatedAt };
          delete item.databaseId;
          if (i >= 0) arr[i] = item; else arr.push(item);
          seen.set(c.id, serial(item)); changed = true;
        }
      }
      // drop data of workspaces we no longer belong to
      const before = state.data.lists.length + state.data.tasks.length;
      state.data.lists = state.data.lists.filter((l) => !l.workspaceId || mine.has(l.workspaceId));
      const listIds = new Set(state.data.lists.map((l) => l.id));
      state.data.tasks = state.data.tasks.filter((x) => !x.listId || listIds.has(x.listId));
      if (before !== state.data.lists.length + state.data.tasks.length) changed = true;
      state.data.sync.cursors = res.cursors; state.data.sync.lastSync = Date.now();
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
  // Server address stamped into this build by the download server (APK signing block / installer file name),
  // else the web origin; a stamped build never asks the user for it.
  let DEFAULT_SERVER = '';
  const serverUrl = () => ($('#au-server').value || state.data.sync.server || DEFAULT_SERVER || '').trim().replace(/\/+$/, '');
  function openAuth(mode, opts = {}) {
    au.mode = mode; au.resetToken = opts.token || '';
    $('#au-server').value = state.data.sync.server || DEFAULT_SERVER || $('#acc-server').value || '';
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
    $('#f-server').hidden = m === 'reset' || (!!DEFAULT_SERVER && !state.data.sync.server); // stamped builds: no server field
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
      // Switching to a different account on this device: its local copy belongs to the previous account.
      if (state.data.sync.email && state.data.sync.email !== res.user.email) { state.data.lists = []; state.data.tasks = []; state.data.tombstones = {}; dirty.clear(); state.selectedId = null; }
      state.data.sync = { server: v.server, token: res.token, email: res.user.email, name: res.user.name, cursors: {}, lastSync: 0 };
      state.data.workspaces = []; for (const l of state.data.lists) l.workspaceId = '';
      for (const x of state.data.tasks) dirty.add(x.id); for (const x of state.data.lists) dirty.add(x.id);
      try { const w = await api(v.server, '/api/workspaces', null, res.token); state.data.workspaces = w.workspaces; } catch {}
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
  function signOut() { state.data.sync = { ...state.data.sync, token: '', cursors: {}, lastSync: 0 }; dirty.clear(); window.anjam.save(state.data); setSyncStatus('idle'); }
  function renderAccount() {
    const on = signedIn();
    $('#account-out').hidden = on; $('#account-in').hidden = !on;
    if (!on) { if (!$('#acc-server').value) $('#acc-server').value = state.data.sync.server || DEFAULT_SERVER || ''; }
    else {
      $('#acc-who').textContent = `${state.data.sync.name ? state.data.sync.name + ' · ' : ''}${state.data.sync.email}`;
      $('#acc-avatar').textContent = (state.data.sync.name || state.data.sync.email || '?').trim().charAt(0).toUpperCase();
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
    if (view === 'list' || view === 'tag') pushRecent({ view, listId: state.listId, tag: state.tag });
    try { const want = view === 'list' ? '#/list/' + state.listId : view === 'tag' ? '#/tag/' + encodeURIComponent(state.tag) : '#/' + view; if (location.hash !== want) history.replaceState(null, '', want); } catch {}
    state.query = ''; $('#search').value = ''; $('#search-wrap').classList.remove('has-q'); $('#search-clear').hidden = true;
    $('#app').classList.remove('sidebar-open');
    closeCapture(); closeMenu();
    $('#scroller').scrollTop = 0;
    render();
  }
  function toggleLang() { state.data.settings.lang = lang() === 'fa' ? 'en' : 'fa'; state.data.settings.settingsUpdatedAt = Date.now(); dirty.add('settings'); applyLang(); save(); render(); }
  function toggleRail() { state.data.settings.railCollapsed = !state.data.settings.railCollapsed; save(); render(); }
  const isPhone = () => window.matchMedia('(max-width: 760px)').matches;
  function updateScrim() {
    const drawer = $('#app').classList.contains('sidebar-open');
    const detail = !!getTask(state.selectedId) && window.matchMedia('(max-width: 1100px)').matches;
    $('#backdrop').hidden = !(drawer || detail);
    $('#tab-lists').classList.toggle('active', drawer);
  }
  function focusRow(delta) {
    const rows = $$('.row'); if (!rows.length) return;
    let i = rows.findIndex((r) => r.dataset.id === state.focusId);
    i = i < 0 ? (delta > 0 ? 0 : rows.length - 1) : Math.max(0, Math.min(rows.length - 1, i + delta));
    rows.forEach((r) => { r.tabIndex = -1; }); rows[i].tabIndex = 0; rows[i].focus(); state.focusId = rows[i].dataset.id;
    rows[i].scrollIntoView({ block: 'nearest' });
  }
  function filterMenu(a) {
    const s = state.data.settings;
    openMenu(a, [{ label: t('showDone'), icon: 'check-circle', on: s.showDone, run: () => { s.showDone = !s.showDone; save(); render(); } }], { title: t('filter') });
  }
  function sortMenu(a) {
    const s = state.data.settings;
    const opts = [['due', 'calendar', 'sortDue'], ['priority', 'flag', 'sortPriority'], ['title', 'notes', 'sortTitle'], ['created', 'clock', 'sortCreated']];
    openMenu(a, opts.map(([k, ic, lb]) => ({ label: t(lb), icon: ic, on: s.sort === k, run: () => { s.sort = k; save(); render(); } })), { title: t('sort') });
  }
  // Settings window: nav on the start side, one pane at a time
  function showPane(name) {
    $$('.stw-item').forEach((b) => b.classList.toggle('active', b.dataset.pane === name));
    $$('.stw-pane').forEach((p) => { p.hidden = p.dataset.pane !== name; });
    $('.stw-body').scrollTop = 0;
    $('.stw').classList.add('pane-open');
    if (name === 'general') renderSpWorkspaces();
    if (name === 'people') renderSpPeople();
    if (name === 'about') { $('#sp-about-version').textContent = $('#app-version').textContent || ''; $('#sp-about-server').textContent = state.data.sync.server || DEFAULT_SERVER || '—'; const dl = $('#sp-about-dl'); const srv = state.data.sync.server || DEFAULT_SERVER; dl.hidden = !srv; if (srv) dl.href = srv.replace(/\/$/, '') + '/download'; }
  }
  function openSettings(pane = 'account') {
    $('#settings').hidden = false;
    $('#sp-name').textContent = signedIn() ? (state.data.sync.name || state.data.sync.email) : t('appName');
    $('#sp-avatar').textContent = (signedIn() ? (state.data.sync.name || state.data.sync.email) : t('appName')).trim().charAt(0).toUpperCase();
    $('#set-showdone').checked = !!state.data.settings.showDone;
    $('#sp-q').value = ''; $$('.stw-item').forEach((b) => { b.hidden = false; });
    showPane(pane);
  }
  function renderSpWorkspaces() {
    const w = $('#sp-workspaces'); w.innerHTML = '';
    if (!signedIn()) { w.innerHTML = `<p class="stw-empty">${esc(t('spNoSignIn'))}</p>`; return; }
    state.data.workspaces.forEach((ws) => {
      const n = state.data.lists.filter((l) => workspaceOfList(l) === ws.id).length;
      const row = document.createElement('div'); row.className = 'stw-row';
      row.innerHTML = `<div class="stw-k"><b dir="auto">${esc(ws.personal ? t('personalWS') : ws.name)}</b><p>${esc(ws.personal ? t('spWsPersonal') : fmt('spWsShared', { n: num(n), r: t('role_' + (ws.role || 'editor')) }))}</p></div><div class="stw-v">${ws.personal ? '' : `<button class="btn">${esc(t('spManage'))}</button>`}</div>`;
      const b = row.querySelector('button'); if (b) b.onclick = () => openShareDialog(ws.id);
      w.appendChild(row);
    });
    const add = document.createElement('div'); add.className = 'stw-row';
    add.innerHTML = `<div class="stw-k"><b>${esc(t('mNewWorkspace'))}</b><p>${esc(t('startCollab'))}</p></div><div class="stw-v"><button class="btn primary">${icon('plus')}<span>${esc(t('mNewWorkspace'))}</span></button></div>`;
    add.querySelector('button').onclick = startCollab; w.appendChild(add);
  }
  async function renderSpPeople() {
    const w = $('#sp-people'); w.innerHTML = '';
    if (!signedIn()) { w.innerHTML = `<p class="stw-empty">${esc(t('spNoSignIn'))}</p>`; return; }
    const shared = state.data.workspaces.filter((x) => !x.personal);
    if (!shared.length) { w.innerHTML = `<p class="stw-empty">${esc(t('spNoWs'))}</p>`; return; }
    for (const ws of shared) {
      const h = document.createElement('h2'); h.className = 'stw-h'; h.textContent = fmt('spMembersOf', { w: ws.name }); w.appendChild(h);
      let members = [];
      try { const r = await api(state.data.sync.server, '/api/workspaces/' + ws.id + '/members', null, state.data.sync.token); members = r.members || []; } catch {}
      members.forEach((m) => {
        const row = document.createElement('div'); row.className = 'stw-row';
        row.innerHTML = `<div class="stw-k stw-member"><span class="avatar xs">${esc((m.name || m.email || '?').trim().charAt(0).toUpperCase())}</span><div><b dir="auto">${esc(m.name || m.email)}</b><p dir="ltr">${esc(m.email || '')}</p></div></div><div class="stw-v"><span class="chip gray">${esc(t('role_' + (m.role || 'editor')))}</span></div>`;
        w.appendChild(row);
      });
      const row = document.createElement('div'); row.className = 'stw-row';
      row.innerHTML = `<div class="stw-k"><b>${esc(t('mInvite'))}</b><p>${esc(t('shareHint'))}</p></div><div class="stw-v"><button class="btn">${esc(t('spManage'))}</button></div>`;
      row.querySelector('button').onclick = () => openShareDialog(ws.id); w.appendChild(row);
    }
  }

  const wideCfg = () => { try { return JSON.parse(localStorage.getItem('anjam.wide') || '{}'); } catch { return {}; } };
  function listRailMenu(l, a) {
    const w = canWriteList(l);
    openMenu(a, [
      { label: t(l.favorite ? 'unfavorite' : 'favorite'), icon: 'star', on: l.favorite, run: () => toggleFavorite(l.id) },
      '-',
      { label: t('copyLink'), icon: 'link', run: () => copyLink('list', { listId: l.id }) },
      ...(w ? [
        { label: t('mDuplicate'), icon: 'file', run: () => duplicateList(l.id) },
        { label: t('mRename'), icon: 'edit', run: () => openListDialog(l.id) },
        { label: t('mMove'), icon: 'arrow', run: () => openListDialog(l.id) },
        '-',
        { label: t('moveToTrash'), icon: 'trash', danger: true, run: () => trashList(l.id) },
      ] : []),
    ], { title: t('list') });
  }
  function moreMenu(a) {
    const l = state.view === 'list' && !state.query ? getList(state.listId) : null;
    const listItems = l && canWriteWS(workspaceOfList(l)) ? [
      { label: t(l.favorite ? 'unfavorite' : 'favorite'), icon: 'star', on: l.favorite, run: () => toggleFavorite(l.id) },
      { label: t('copyLink'), icon: 'link', run: () => copyLink('list', { listId: l.id }) },
      '-',
      { label: t('mRename'), icon: 'edit', run: () => openListDialog(l.id) },
      { label: t('mDuplicate'), icon: 'file', run: () => duplicateList(l.id) },
      { label: t('mMove'), icon: 'arrow', run: () => openListDialog(l.id) },
      { label: t('fullWidth'), icon: 'expand', on: !!wideCfg()[l.id], run: () => { const c = wideCfg(); c[l.id] = !c[l.id]; try { localStorage.setItem('anjam.wide', JSON.stringify(c)); } catch {} render(); } },
      { label: t(l.locked ? 'unlockDb' : 'lockDb'), icon: l.locked ? 'unlock' : 'lock', on: l.locked, run: () => { l.locked = !l.locked; save(); render(); } },
      '-',
      { label: t('moveToTrash'), icon: 'trash', danger: true, run: () => trashList(l.id) },
      '-',
    ] : l ? [{ label: t('copyLink'), icon: 'link', run: () => copyLink('list', { listId: l.id }) }, '-'] : [{ label: t('copyLink'), icon: 'link', run: () => copyLink(state.view, { tag: state.tag }) }, '-'];
    openMenu(a, [
      ...listItems,
      { label: t('aNewList'), icon: 'list', run: () => openListDialog() },
      { label: t('aToggleLang'), icon: 'lang', hint: 'Ctrl Shift L', run: toggleLang },
      { label: t('aCalendar'), icon: 'calendar', run: () => { state.data.settings.calendar = cal() === 'jalali' ? 'gregorian' : 'jalali'; applyLang(); save(); render(); } },
      '-',
      { label: t('aExportPdf'), icon: 'file', run: exportPdf },
      { label: 'CSV', icon: 'download', run: exportCsv },
      { label: 'Markdown', icon: 'download', run: exportMd },
      { label: t('aBackup'), icon: 'download', run: exportJson },
      { label: t('impJson'), icon: 'upload', run: importJson },
      '-',
      { label: t('report'), icon: 'chart', hint: 'Ctrl E', run: () => setView('report') },
      { label: t('aSettings'), icon: 'settings', run: () => openSettings() },
    ]);
  }
  function routeFromHash() {
    const m = /^#\/(list|tag|home|calendar|today|upcoming|all|done|inbox|report)(?:\/(.+))?$/.exec(location.hash || '');
    if (!m) return false;
    if (m[1] === 'list') { const l = getList(m[2]); if (!l || l.trashedAt) return false; if (state.view === 'list' && state.listId === l.id) return true; setView('list', { listId: l.id }); }
    else if (m[1] === 'tag') { const tg = decodeURIComponent(m[2] || ''); if (state.view === 'tag' && state.tag === tg) return true; setView('tag', { tag: tg }); }
    else { if (state.view === m[1]) return true; setView(m[1]); }
    return true;
  }
  function setQuery(q) {
    state.query = q; $('#search-wrap').classList.toggle('has-q', !!q); $('#search-clear').hidden = !q; render();
  }

  // ============================================================
  // Init
  // ============================================================
  async function init() {
    if (window.anjam.ready) { try { await window.anjam.ready; } catch {} }
    DEFAULT_SERVER = window.anjam.getDefaultServer ? (await window.anjam.getDefaultServer()) || '' : (window.anjam.defaultServer || '');
    state.data = normalize(await window.anjam.load());
    purgeTrash();
    snapshotSeen();
    applyLang();

    $$('.nav-item[data-view], .tabbar button[data-view], .side-tab[data-view]').forEach((b) => b.onclick = () => setView(b.dataset.view));
    routeFromHash();
    const toggleDrawer = () => { $('#app').classList.toggle('sidebar-open'); updateScrim(); };
    $('#tab-lists').onclick = toggleDrawer;
    $('#tab-search').onclick = () => { $('#scroller').scrollTop = 0; $('#search').focus(); };
    $('#rail-toggle').onclick = () => (isPhone() ? toggleDrawer() : toggleRail()); $('#rail-open').onclick = () => (isPhone() ? toggleDrawer() : toggleRail());
    $('#nav-search').onclick = openPalette;
    $('#ws-btn').onclick = (e) => openMenu(e.currentTarget, [
      { label: signedIn() ? (state.data.sync.name || state.data.sync.email) : t('appName'), hint: signedIn() ? state.data.sync.email : '', icon: 'user', run: () => { if (signedIn()) openSettings('account'); else openAuth('signin'); } },
      '-',
      { label: t('aSettings'), icon: 'settings', run: () => openSettings() },
      { label: t('mInvite'), icon: 'users', run: startCollab },
      '-',
      ...state.data.workspaces.map((w) => ({ label: w.personal ? t('privateSec') : w.name, icon: w.personal ? 'user' : 'users', hint: w.personal ? '' : t('role_' + (w.role || 'editor')), run: () => { if (!w.personal) openShareDialog(w.id); } })),
      { label: t('mNewWorkspace'), icon: 'plus', run: startCollab },
      '-',
      signedIn() ? { label: t('mLogout'), icon: 'arrow', run: () => { signOut(); render(); } } : { label: t('mSignIn'), icon: 'user', run: () => openAuth('signin') },
    ]);
    $('#side-inbox').onclick = () => setView('inbox');
    $('#fav-btn').onclick = () => { if (state.view === 'list') toggleFavorite(state.listId); };
    $('#link-btn').onclick = () => copyLink(state.view, { listId: state.listId, tag: state.tag });
    $('#trash-btn').onclick = (e) => { renderTrash(); openPop('#trash-pop', e.currentTarget, { above: true }); };
    $('#trash-q').oninput = renderTrash;
    $('#customize-btn').onclick = (e) => { const c = sideCfg(); $$('#customize-pop input[data-sec]').forEach((i) => { i.checked = !!c[i.dataset.sec]; }); openPop('#customize-pop', e.currentTarget, { above: true }); };
    $$('#customize-pop input[data-sec]').forEach((i) => i.onchange = () => { const c = sideCfg(); c[i.dataset.sec] = i.checked; try { localStorage.setItem('anjam.sidebar', JSON.stringify(c)); } catch {} applySideCfg(); });
    $('#customize-done').onclick = closePop;
    const openIconPop = (e) => { if (state.view !== 'list') return; const l = getList(state.listId); if (!l || !canWriteWS(workspaceOfList(l))) return; renderEmoji(); $('#icon-remove').hidden = !l.icon; openPop('#icon-pop', e.currentTarget); };
    $('#page-icon').onclick = openIconPop; $('#pa-icon').onclick = openIconPop;
    $('#icon-q').oninput = (e) => { const q = e.target.value.trim(); $$('#emoji-grid .emoji-btn').forEach((b) => { b.hidden = !!q && !b.textContent.includes(q); }); };
    $('#icon-remove').onclick = () => { const l = getList(state.listId); if (l) { l.icon = ''; save(); render(); } closePop(); };
    const openCoverPop = (e) => { renderCovers(); openPop('#cover-pop', e.currentTarget, { align: 'end' }); };
    $('#pa-cover').onclick = openCoverPop; $('#cover-change').onclick = openCoverPop;
    $('#cover-clear').onclick = () => { const l = getList(state.listId); if (l) { l.cover = ''; save(); render(); } closePop(); };
    $('#cover-remove').onclick = () => { const l = getList(state.listId); if (l) { l.cover = ''; save(); render(); } };
    $('#pa-desc').onclick = () => { state.descOpen = state.listId; render(); setTimeout(() => $('#view-desc').focus(), 20); };
    $('#view-desc').onblur = () => { const l = getList(state.listId); if (!l) return; const v = $('#view-desc').textContent.trim(); if (v !== (l.desc || '')) { l.desc = v; save(); } state.descOpen = null; render(); };
    $('#view-desc').onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#view-desc').blur(); } if (e.key === 'Escape') { $('#view-desc').blur(); } };
    window.addEventListener('hashchange', routeFromHash);
    if ($('#side-compose')) $('#side-compose').onclick = () => openCapture(state.view === 'today' || state.view === 'home' ? { due: todayIso() } : {});
    $('#shared-add').onclick = startCollab;
    $('#backdrop').onclick = () => { $('#app').classList.remove('sidebar-open'); if (state.selectedId) state.selectedId = null; render(); };
    window.addEventListener('resize', updateScrim);
    $('#list-add').onclick = () => openListDialog();
    $('#list-dialog-close').onclick = () => { $('#list-dialog').hidden = true; };
    $('#list-save').onclick = saveList; $('#list-delete').onclick = deleteList;
    $('#list-name').onkeydown = (e) => { if (e.key === 'Enter') saveList(); };
    $('#settings-btn').onclick = () => openSettings();
    $('#settings-close').onclick = () => { $('#settings').hidden = true; };
    $('#settings-close-m').onclick = () => { $('#settings').hidden = true; };
    $('#settings-back').onclick = () => { $('.stw').classList.remove('pane-open'); };
    $$('.stw-item').forEach((b) => b.onclick = () => showPane(b.dataset.pane));
    $('#sp-q').oninput = (e) => { const q = e.target.value.trim().toLowerCase(); $$('.stw-item').forEach((b) => { b.hidden = !!q && !b.textContent.toLowerCase().includes(q); }); };
    $('#set-showdone').onchange = (e) => { state.data.settings.showDone = e.target.checked; touchSettings(); save(); render(); };
    $('#sp-exp-pdf').onclick = exportPdf; $('#sp-exp-csv').onclick = exportCsv; $('#sp-exp-md').onclick = exportMd; $('#sp-exp-json').onclick = exportJson; $('#sp-imp-json').onclick = importJson;
    $$('.overlay').forEach((o) => o.addEventListener('mousedown', (e) => { if (e.target === o) o.hidden = true; }));
    const touchSettings = () => { state.data.settings.settingsUpdatedAt = Date.now(); dirty.add('settings'); };
    $$('#set-lang button').forEach((b) => b.onclick = () => { state.data.settings.lang = b.dataset.v; touchSettings(); applyLang(); save(); render(); });
    $$('#set-cal button').forEach((b) => b.onclick = () => { state.data.settings.calendar = b.dataset.v; calState.y = 0; touchSettings(); applyLang(); save(); render(); });
    $$('#set-theme button').forEach((b) => b.onclick = () => { state.data.settings.theme = b.dataset.v; applyLang(); save(); });
    $('#set-notify').onchange = (e) => { state.data.settings.notify = e.target.checked; touchSettings(); save(); };
    bindAccount(); bindUpdates(); bindShare();
    $('#palette-btn').onclick = openPalette;
    $('#more-btn').onclick = (e) => moreMenu(e.currentTarget);
    $('#filter-btn').onclick = (e) => filterMenu(e.currentTarget);
    $('#sort-btn').onclick = (e) => sortMenu(e.currentTarget);
    $$('#view-tabs button').forEach((b) => b.onclick = () => setMode(b.dataset.mode));
    $('#sync-pill').onclick = () => { if (signedIn()) syncNow(); else openSettings('account'); };
    window.addEventListener('offline', renderSyncPill);
    $('#palette-q').oninput = () => { pal.index = 0; renderPalette(); };
    $('#palette-q').onkeydown = (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); pal.index = Math.min(pal.items.length - 1, pal.index + 1); renderPalette(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); pal.index = Math.max(0, pal.index - 1); renderPalette(); }
      else if (e.key === 'Enter') { e.preventDefault(); runPalette(pal.index); }
    };

    const qa = $('#qa-input');
    qa.oninput = renderChips;
    qa.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); submitCapture(); } else if (e.key === 'Escape') { e.preventDefault(); closeCapture(); } else if (e.key === 'ArrowDown') { e.preventDefault(); focusRow(1); } };
    qa.onblur = () => { setTimeout(() => { if (!qa.value.trim() && document.activeElement !== qa && !document.activeElement.closest('#capture')) closeCapture(); }, 150); };
    $('#qa-add').onclick = () => submitCapture();
    $('#qa-cancel').onclick = closeCapture;
    ['#qa-open', '#new-task-btn', '#fab', '#empty-new'].forEach((s) => { const el = $(s); if (el) el.onclick = () => openCapture(state.view === 'today' || state.view === 'home' ? { due: todayIso() } : {}); });
    $('#qa-menu').onclick = (e) => openMenu(e.currentTarget, [
      { label: t('today'), icon: 'sun', run: () => openCapture({ due: todayIso() }) },
      { label: t('tomorrow'), icon: 'calendar', run: () => openCapture({ due: addDays(todayIso(), 1) }) },
      { label: t('noDate'), icon: 'inbox', run: () => openCapture({ due: '' }) },
      '-',
      { label: t('aNewList'), icon: 'list', run: () => openListDialog() },
    ]);
    $('#search').oninput = (e) => setQuery(e.target.value);
    $('#search-clear').onclick = () => { $('#search').value = ''; setQuery(''); };
    $('#clear-done').onclick = clearCompleted;
    $('#toast-undo').onclick = undo;
    $('#exp-pdf').onclick = exportPdf; $('#exp-csv').onclick = exportCsv; $('#exp-md').onclick = exportMd; $('#exp-json').onclick = exportJson; $('#imp-json').onclick = importJson;
    bindDetail(); bindPicker();
    document.addEventListener('mousedown', (e) => { if (menu.open && !e.target.closest('#menu')) closeMenu(); });
    window.addEventListener('resize', () => { if (menu.open) closeMenu(); });

    document.addEventListener('keydown', (e) => {
      const mod = e.ctrlKey || e.metaKey; const k = e.key.toLowerCase();
      const inField = /^(input|textarea|select)$/i.test(document.activeElement.tagName);
      if (mod && k === 'k') { e.preventDefault(); $('#palette').hidden ? openPalette() : closePalette(); return; }
      if (mod && k === 'n') { e.preventDefault(); openCapture(state.view === 'today' || state.view === 'home' ? { due: todayIso() } : {}); return; }
      if (!mod && !inField && (e.key === 'c' || e.key === 'C')) { e.preventDefault(); openCapture(state.view === 'today' || state.view === 'home' ? { due: todayIso() } : {}); return; }
      if (mod && k === 'f') { e.preventDefault(); $('#search').focus(); $('#search').select(); return; }
      if (mod && e.shiftKey && k === 'l') { e.preventDefault(); toggleLang(); return; }
      if (mod && k === 'e') { e.preventDefault(); setView('report'); return; }
      if (mod && k === '\\') { e.preventDefault(); toggleRail(); return; }
      if (e.key === 'Escape') {
        if (menu.open) closeMenu();
        else if (!$('#auth').hidden && !$('#auth-close').hidden) closeAuth();
        else if (!$('#profile').hidden) $('#profile').hidden = true;
        else if (!$('#palette').hidden) closePalette();
        else if (!$('#datepicker').hidden) closePicker();
        else if (!$('#settings').hidden) $('#settings').hidden = true;
        else if (!$('#list-dialog').hidden) $('#list-dialog').hidden = true;
        else if (!$('#share-dialog').hidden) $('#share-dialog').hidden = true;
        else if ($('#app').classList.contains('sidebar-open')) { $('#app').classList.remove('sidebar-open'); updateScrim(); }
        else if (capture.open) closeCapture();
        else if (state.query) { $('#search').value = ''; setQuery(''); }
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
    $('#app').classList.remove('booting');
    checkReminders();
  }
  init();
})();
