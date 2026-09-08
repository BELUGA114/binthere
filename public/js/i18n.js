// i18n.js — English/Chinese localization for the web client (CSP-safe, no
// build step). English is the source language: index.html ships English text
// and every translatable element names its dictionary key via a data-i18n
// (textContent), data-i18n-ph (placeholder), data-i18n-al (aria-label) or
// data-i18n-alt (alt) attribute.
//
// Resolution order: saved preference (written only by an explicit toggle, so
// auto-detection keeps tracking the browser until the visitor commits), else
// the browser's languages. This module is a dependency of app.js, so it
// evaluates before any view becomes visible (all views ship hidden in the
// HTML) and the translated strings land before the content is first painted.
//
// Dynamic strings go through t() in app.js. Switching languages re-applies the
// static strings and calls the onLangChange listeners so the live view can
// re-render its dynamic labels (see retranslate() in app.js).

const STORAGE_KEY = 'binthere:lang';
const BCP47 = { en: 'en', zh: 'zh-CN' };

export const STRINGS = {
  en: {
    // document chrome
    title: 'binthere · zero-knowledge paste',
    metaDesc: 'Encrypted, zero-knowledge pastebin. Your text is encrypted in your browser; the server never sees it.',
    langToggleAria: 'Switch language',

    // announcement bar
    announceLabel: 'Announcement',
    announceTag: 'New',
    announceTxt: 'Why I don’t trust pastebins either',
    announceClose: 'Dismiss announcement',

    // topbar
    brandHome: 'binthere — home',
    ghLabel: 'binthere on GitHub',
    newPaste: 'new paste',
    themeToggle: 'Toggle light/dark theme',

    // create view
    eyebrowCreate: 'private by design',
    sayItOnce: 'Say it once.',
    sealed: 'Sealed.',
    createSubtitle: 'Your note stays yours. Read once, then self-destructs.',
    editorPh: 'Write or paste your note… Only the recipient with the link can decrypt it.',
    editorLabel: 'Note content',
    lockLabel: 'Protect with a password',
    password: 'Password',
    createLabel: 'Encrypt and create link',
    createLink: 'Create link',
    featuresLabel: 'How binthere protects your note',
    featPrivate: 'Private',
    featE2e: 'End-to-end encrypted',
    featOnetime: 'One-time view',
    featAuto: 'Auto-deletes in 24 hours',

    // password modal
    modalTitle: 'Paste password',
    modalSub: 'This password will be required to unlock this paste.',
    pwPh: 'Enter a password',
    pwConfirmPh: 'Repeat the password',
    pwAria: 'Password',
    pwConfirmAria: 'Repeat password',
    showPw: 'Show password',
    hidePw: 'Hide password',
    cancel: 'Cancel',
    create: 'Create',
    msgEnterPwOrCancel: 'Enter a password, or cancel.',
    msgPwTooLong: 'Password is too long — 128 characters max.',
    msgPwMismatch: 'Passwords do not match — repeat the same password in both fields.',

    // success view
    eyebrowSealed: 'sealed',
    shareLink: 'Share your link',
    successNote: 'Send this to the one person who should read it — it self-destructs the moment it’s opened. The key that unlocks it lives inside the link itself, so keep the whole link private and never send it back to us.',
    successNoteBurn: 'Anyone with this link can read the note once.',
    sealLabel: 'scan to open · one-time read',
    qrAlt: 'QR code for the paste link',
    copyLink: 'copy link',
    openLink: 'Open link',
    createAnother: 'Create another',
    deleteNow: 'Delete now',
    confirmOpen: 'Uses the one view — open?',
    confirmDelete: 'Permanently delete?',
    msgDeleting: 'Deleting…',
    msgDeleted: 'Deleted',
    msgPasteDeleted: 'This paste has been deleted.',
    toastDeleted: 'deleted',
    copiedFlash: 'copied',
    failedFlash: 'failed',

    // password prompt view
    eyebrowLocked: 'locked',
    enterPw: 'Enter the password',
    decryptPh: 'Enter password',
    decrypt: 'Decrypt',
    pwSubBurn: 'This single-use note is password-protected. It is destroyed only once the correct password unlocks it.',
    pwSubNormal: 'This note is protected by a password in addition to the key in the link.',
    msgEnterPw: 'Please enter a password.',
    msgWrongPw: 'Wrong password — try again. If you are sure it is correct, the link may be corrupted or altered.',

    // paste view
    copyText: 'Copy text',
    raw: 'Raw',
    rawBtn: 'Raw',
    renderedBtn: 'Rendered',
    pillMarkdown: 'markdown',
    pillCode: 'code',
    pillOnetime: 'one-time view · now deleted',
    toastCopied: 'copied to clipboard',
    toastCopyFailed: 'copy failed',

    // status view
    loading: 'loading…',
    revealNote: 'Reveal note',
    deletesIn: 'Deletes in',
    createNew: 'Create new paste',
    expired: 'expired',

    // footer
    cryptoAria: 'Cryptography',
    footKey: 'Key stays in the URL',
    footerSource: 'Source',
    footerThreat: 'Threat Model',
    footerSecurity: 'Security',
    footerDeveloper: 'Developer',

    // dynamic messages (app.js)
    errMalformed: 'This link is malformed — check that it was copied completely.',
    errMissingKey: 'This link is missing its decryption key.',
    errDecrypt: 'Could not decrypt this note. The link may be corrupted or altered.',
    errMalformedServer: 'Could not read this note — the server response was malformed.',
    errLinkIncomplete: 'Could not decrypt this note — the link may be incomplete or corrupted. The note was not opened and still exists.',
    msgTypeSomething: 'Type something first.',
    msgEncrypting: 'Encrypting…',
    msgDecrypting: 'Decrypting…',
    msgChecking: 'checking…',
    burnOnceOnly: 'This note can only be viewed once.',
    expiredNote: 'This note has expired — it can no longer be opened.',
    errOffline: 'Could not reach the server — check your connection and try again.',
    errGone: 'This paste has expired or was already opened.',
    errGoneOrNever: 'This paste has expired, was already opened, or never existed.',
    err429: 'Too many pastes from your network — please wait a moment.',
    err413: 'That document is too large.',
    errTooLarge: 'That document is too large (1 MiB max).',
    errServer: 'Server error. Please try again.',
    errGeneric: 'Something went wrong. Please try again.',
  },

  zh: {
    // document chrome
    title: 'binthere · 零知识加密便签',
    metaDesc: '端到端加密的零知识便签。文字在浏览器中完成加密；服务器永远看不到内容。',
    langToggleAria: '切换语言',

    // announcement bar
    announceLabel: '公告',
    announceTag: '新',
    announceTxt: '为什么我也不信任 pastebin',
    announceClose: '关闭公告',

    // topbar
    brandHome: 'binthere — 首页',
    ghLabel: 'binthere 的 GitHub 仓库',
    newPaste: '新建便签',
    themeToggle: '切换浅色 / 深色主题',

    // create view
    eyebrowCreate: '隐私始于设计',
    sayItOnce: '只说一次。',
    sealed: '封缄。',
    createSubtitle: '便签始终属于你。读一次，随后自行销毁。',
    editorPh: '写下或粘贴你的便签……只有持有链接的收件人才能解密。',
    editorLabel: '便签内容',
    lockLabel: '用密码保护',
    password: '密码',
    createLabel: '加密并生成链接',
    createLink: '生成链接',
    featuresLabel: 'binthere 如何保护你的便签',
    featPrivate: '私密',
    featE2e: '端到端加密',
    featOnetime: '一次性阅读',
    featAuto: '24 小时后自动删除',

    // password modal
    modalTitle: '便签密码',
    modalSub: '解锁这条便签时需要输入此密码。',
    pwPh: '输入密码',
    pwConfirmPh: '再次输入密码',
    pwAria: '密码',
    pwConfirmAria: '再次输入密码',
    showPw: '显示密码',
    hidePw: '隐藏密码',
    cancel: '取消',
    create: '创建',
    msgEnterPwOrCancel: '请输入密码，或取消。',
    msgPwTooLong: '密码过长——最多 128 个字符。',
    msgPwMismatch: '两次输入的密码不一致——请在两个输入框中输入相同的密码。',

    // success view
    eyebrowSealed: '已封缄',
    shareLink: '分享你的链接',
    successNote: '把它发给那个唯一应该读到的人——链接一旦被打开便会自毁。解锁密钥就藏在链接本身之中，请保管好完整链接，也绝不要把它发回本站。',
    successNoteBurn: '任何持有此链接的人都可以阅读这条便签一次。',
    sealLabel: '扫码打开 · 只读一次',
    qrAlt: '便签链接的二维码',
    copyLink: '复制链接',
    openLink: '打开链接',
    createAnother: '再写一条',
    deleteNow: '立即删除',
    confirmOpen: '将消耗唯一一次阅读——打开？',
    confirmDelete: '确定永久删除？',
    msgDeleting: '删除中……',
    msgDeleted: '已删除',
    msgPasteDeleted: '这条便签已删除。',
    toastDeleted: '已删除',
    copiedFlash: '已复制',
    failedFlash: '失败',

    // password prompt view
    eyebrowLocked: '已锁定',
    enterPw: '输入密码',
    decryptPh: '输入密码',
    decrypt: '解密',
    pwSubBurn: '这条一次性便签受密码保护。只有输入正确的密码、成功解锁后它才会被销毁。',
    pwSubNormal: '除链接中的密钥外，这条便签还额外受密码保护。',
    msgEnterPw: '请输入密码。',
    msgWrongPw: '密码错误，请重试。如果你确定密码无误，那么链接可能已损坏或被篡改。',

    // paste view
    copyText: '复制文本',
    raw: '原文',
    rawBtn: '原文',
    renderedBtn: '渲染后',
    pillMarkdown: 'markdown',
    pillCode: '代码',
    pillOnetime: '一次性阅读 · 已删除',
    toastCopied: '已复制到剪贴板',
    toastCopyFailed: '复制失败',

    // status view
    loading: '加载中……',
    revealNote: '查看便签',
    deletesIn: '删除倒计时',
    createNew: '新建便签',
    expired: '已过期',

    // footer
    cryptoAria: '加密方式',
    footKey: '密钥只存于链接之中',
    footerSource: '源码',
    footerThreat: '威胁模型',
    footerSecurity: '安全',
    footerDeveloper: '开发者',

    // dynamic messages (app.js)
    errMalformed: '链接格式不正确——请检查是否复制完整。',
    errMissingKey: '此链接缺少解密密钥。',
    errDecrypt: '无法解密这条便签。链接可能已损坏或被篡改。',
    errMalformedServer: '无法读取这条便签——服务器响应格式异常。',
    errLinkIncomplete: '无法解密这条便签——链接可能不完整或已损坏。便签尚未被打开，仍然存在。',
    msgTypeSomething: '请先输入内容。',
    msgEncrypting: '加密中……',
    msgDecrypting: '解密中……',
    msgChecking: '检查中……',
    burnOnceOnly: '这条便签只能查看一次。',
    expiredNote: '这条便签已过期——无法再打开。',
    errOffline: '无法连接服务器——请检查网络后重试。',
    errGone: '便签已过期或已被打开。',
    errGoneOrNever: '便签已过期、已被打开，或从未存在。',
    err429: '你所在网络创建的便签过多——请稍候再试。',
    err413: '内容过大。',
    errTooLarge: '内容过大（上限 1 MiB）。',
    errServer: '服务器错误，请重试。',
    errGeneric: '出错了，请重试。',
  },
};

function detect() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'zh') return saved;
  } catch {
    /* storage disabled — fall through to the browser's languages */
  }
  const langs = navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language || 'en'];
  return langs.some((l) => /^zh\b/i.test(l)) ? 'zh' : 'en';
}

let lang = detect();

/** Look up `key` in the active language, falling back to English, then the key. */
export function t(key) {
  return (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key] || key;
}

/** Translate every static [data-i18n*] element plus <html lang>/<title>/meta. */
export function applyStatic() {
  for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
  for (const el of document.querySelectorAll('[data-i18n-ph]')) el.placeholder = t(el.dataset.i18nPh);
  for (const el of document.querySelectorAll('[data-i18n-al]')) el.setAttribute('aria-label', t(el.dataset.i18nAl));
  for (const el of document.querySelectorAll('[data-i18n-alt]')) el.setAttribute('alt', t(el.dataset.i18nAlt));
  document.documentElement.lang = BCP47[lang];
  document.title = t('title');
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', t('metaDesc'));
}

const listeners = new Set();

/** Register a callback fired (after applyStatic) whenever the language changes. */
export function onLangChange(fn) {
  listeners.add(fn);
}

export function setLang(next) {
  if (next !== 'en' && next !== 'zh') return;
  if (next === lang) return;
  lang = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* storage disabled — the choice lasts for this page load only */
  }
  applyStatic();
  paintToggle();
  for (const fn of listeners) fn();
}

// The toggle shows the language you would switch TO, not the current one —
// the label is what the click does.
function paintToggle() {
  const btn = document.getElementById('langToggle');
  if (!btn) return;
  btn.textContent = lang === 'zh' ? 'EN' : '中';
  btn.setAttribute('aria-label', t('langToggleAria'));
}

applyStatic();
paintToggle();
const toggle = document.getElementById('langToggle');
if (toggle) toggle.addEventListener('click', () => setLang(lang === 'zh' ? 'en' : 'zh'));

// announce.js (a classic deferred script) runs before this module; it waits on
// this flag/event so the announcement bar is never revealed with untranslated
// text. If this module fails to load, the bar simply stays hidden.
document.documentElement.dataset.i18nReady = '1';
document.dispatchEvent(new CustomEvent('i18n:ready'));
