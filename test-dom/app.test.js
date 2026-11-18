// app.test.js — exercise the merged controller against the real page and crypto.
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { encryptPaste } from '../public/js/crypto.js';

const api = vi.hoisted(() => ({
  createPaste: vi.fn(), fetchPaste: vi.fn(), fetchPasteMeta: vi.fn(),
  consumePaste: vi.fn(), deletePaste: vi.fn(),
}));
vi.mock('../public/js/api.js', async (importOriginal) => ({
  ...await importOriginal(), ...api,
}));
// Import the controller explicitly; the fixture must not fetch page assets.
const html = readFileSync('public/index.html', 'utf8')
  .replace(/<script\b[\s\S]*?<\/script>/gi, '')
  .replace(/<link\b[^>]*>/gi, '');
let body;

beforeEach(async () => {
  vi.resetModules();
  vi.resetAllMocks();
  localStorage.clear();
  document.body.innerHTML = html;
  const encrypted = await encryptPaste({ text: 'const answer = 42;' });
  body = encrypted.body;
  body.meta.created = Math.floor(Date.now() / 1000);
  history.replaceState(null, '', `/p/b${'A'.repeat(22)}#${encrypted.fragment}`);
  api.fetchPasteMeta.mockResolvedValue({ v: body.v, wk: body.wk, adata: body.adata, meta: body.meta });
  api.consumePaste.mockResolvedValue(body);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function reveal() {
  await import('../public/js/app.js');
  await vi.waitFor(() => expect(document.querySelector('#status-actions').hidden).toBe(false));
  document.querySelector('#reveal-burn').click();
}

describe('merged paste controls', () => {
  it('keeps source, toggle state and download content intact across language changes', async () => {
    const { setLang, t } = await import('../public/js/i18n.js');
    setLang('en');
    await reveal();
    await vi.waitFor(() => expect(document.querySelector('#view-paste').hidden).toBe(false));
    const content = document.querySelector('#paste-content');
    const raw = document.querySelector('#toggle-raw');
    const download = document.querySelector('#download-content');
    expect(content.textContent).toBe('const answer = 42;');
    expect(content.querySelector('.tok-kw').textContent).toBe('const');
    expect(raw.hidden).toBe(false);
    raw.click();
    expect(raw.getAttribute('aria-pressed')).toBe('true');
    expect(content.querySelector('span')).toBeNull();
    setLang('zh');
    expect(raw.textContent).toBe(t('renderedBtn'));
    expect(download.textContent).toBe('下载');
    expect(content.textContent).toBe('const answer = 42;');

    const createUrl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:binthere-test');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () {
      expect(this.download).toBe('binthere-paste.js');
    });
    download.click();
    expect(await createUrl.mock.calls[0][0].text()).toBe('const answer = 42;');
    expect(click).toHaveBeenCalledTimes(1);
    expect(document.querySelector('#toast').textContent).toBe(t('toastDownloadStarted'));
    expect(api.consumePaste).toHaveBeenCalledTimes(1);
  });

  it.each([
    [404, 'response', 404, 'errNotFound'],
    [410, 'response', 410, 'errGone'],
    [429, 'response', 429, 'errConsume429'],
    [503, 'unknown', 503, 'errConsumeServer'],
    [0, 'unknown', null, 'errConsumeUnknown'],
    [502, 'unknown', 200, 'errConsumeUnknown'],
    [403, 'response', 403, 'errConsumeRejected'],
    [0, 'not-sent', null, 'errConsumeNotSent'],
  ])('translates consume outcome HTTP %i without retrying', async (status, state, responseStatus, key) => {
    const { ApiError } = await import('../public/js/api.js');
    const { setLang, t } = await import('../public/js/i18n.js');
    setLang('en');
    api.consumePaste.mockRejectedValue(new ApiError('test', status, state, responseStatus));
    await reveal();
    const expected = () => t(key).replace('{status}', String(responseStatus ?? status));
    await vi.waitFor(() => expect(document.querySelector('#status-msg').textContent).toBe(expected()));
    setLang('zh');
    expect(document.querySelector('#status-msg').textContent).toBe(expected());
    expect(api.consumePaste).toHaveBeenCalledTimes(1);
  });
});
