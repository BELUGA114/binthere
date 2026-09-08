// i18n.test.js — dictionary coverage and static translation (happy-dom).
//
// Guards against the two drift failure modes of a hand-maintained dictionary:
// a data-i18n key in index.html with no entry in either language (UI that
// silently stays untranslated), and an en/zh key mismatch (a missing or
// orphaned translation). applyStatic itself is exercised against a fixture
// DOM so the textContent / placeholder / aria-label / alt plumbing is tested,
// not just the data.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect, beforeEach } from 'vitest';
import { STRINGS, t, setLang } from '../public/js/i18n.js';

const html = readFileSync(join(process.cwd(), 'public/index.html'), 'utf8');

/** Every data-i18n / -ph / -al / -alt key referenced by the page. */
function htmlKeys() {
  const keys = new Set();
  for (const m of html.matchAll(/data-i18n(?:-(?:ph|al|alt))?="([^"]+)"/g)) keys.add(m[1]);
  return keys;
}

describe('dictionary', () => {
  it('en and zh define exactly the same keys', () => {
    expect(Object.keys(STRINGS.zh).sort()).toEqual(Object.keys(STRINGS.en).sort());
  });

  it('every value is a non-empty string in both languages', () => {
    for (const [lang, dict] of Object.entries(STRINGS)) {
      for (const [key, value] of Object.entries(dict)) {
        expect(typeof value === 'string' && value.length > 0, `${lang}.${key}`).toBe(true);
      }
    }
  });

  it('every data-i18n key in index.html exists in both dictionaries', () => {
    const keys = htmlKeys();
    expect(keys.size).toBeGreaterThan(50); // the page really is annotated
    for (const key of keys) {
      expect(STRINGS.en[key], `en.${key}`).toBeDefined();
      expect(STRINGS.zh[key], `zh.${key}`).toBeDefined();
    }
  });
});

describe('t() and applyStatic()', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.lang = 'en';
    setLang('en'); // normalize whatever the previous test left active
  });

  it('translates textContent, placeholder, aria-label and alt, and the document chrome', () => {
    document.body.innerHTML = '<button data-i18n="cancel">Cancel</button>'
      + '<input data-i18n-ph="pwPh" data-i18n-al="pwAria">'
      + '<img data-i18n-alt="qrAlt" alt="">';
    setLang('zh');
    expect(document.querySelector('button').textContent).toBe(STRINGS.zh.cancel);
    expect(document.querySelector('input').placeholder).toBe(STRINGS.zh.pwPh);
    expect(document.querySelector('input').getAttribute('aria-label')).toBe(STRINGS.zh.pwAria);
    expect(document.querySelector('img').getAttribute('alt')).toBe(STRINGS.zh.qrAlt);
    expect(document.documentElement.lang).toBe('zh-CN');
    expect(document.title).toBe(STRINGS.zh.title);
  });

  it('t() follows the active language and falls back to the key', () => {
    setLang('zh');
    expect(t('cancel')).toBe(STRINGS.zh.cancel);
    setLang('en');
    expect(t('cancel')).toBe(STRINGS.en.cancel);
    expect(t('no-such-key')).toBe('no-such-key');
  });

  it('setLang persists the choice for an explicit toggle', () => {
    setLang('zh');
    expect(localStorage.getItem('binthere:lang')).toBe('zh');
    setLang('en');
    expect(localStorage.getItem('binthere:lang')).toBe('en');
  });
});
