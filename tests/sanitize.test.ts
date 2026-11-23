import { describe, expect, it } from 'vitest';
import {
  SAFE_FALLBACK_AVATAR_SVG,
  SAFE_FALLBACK_PET_SVG,
  escapeAttr,
  escapeHtml,
  isSafeDeepLink,
  sanitizeAudioSrc,
  sanitizeImageSrc,
  sanitizeTelUrl,
  sanitizeUrl,
  validateUploadedFile,
} from '../src/utils/sanitize.ts';

describe('sanitize utilities', () => {
  it('escapes HTML special characters and attribute backticks', () => {
    const payload = `<img src=x onerror="alert('xss')" data-x=\`1\`>`;
    expect(escapeHtml(payload)).toBe(
      '&lt;img src=x onerror=&quot;alert(&#39;xss&#39;)&quot; data-x=`1`&gt;'
    );
    expect(escapeAttr(payload)).toBe(
      '&lt;img src=x onerror=&quot;alert(&#39;xss&#39;)&quot; data-x=&#96;1&#96;&gt;'
    );
  });

  it('allows https/http/blob/relative URLs and blocks javascript/data-html schemes', () => {
    expect(sanitizeUrl('https://example.com/cat.png')).toBe('https://example.com/cat.png');
    expect(sanitizeUrl('/assets/logo.png')).toBe('/assets/logo.png');
    expect(sanitizeUrl('blob:https://meow.app/1234')).toBe('blob:https://meow.app/1234');

    expect(sanitizeUrl('javascript:alert(1)', 'FALLBACK')).toBe('FALLBACK');
    expect(sanitizeUrl('vbscript:msgbox(1)', 'FALLBACK')).toBe('FALLBACK');
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>', 'FALLBACK')).toBe('FALLBACK');
    expect(sanitizeUrl('java\u0000script:alert(1)', 'FALLBACK')).toBe('FALLBACK');
    expect(sanitizeUrl('//evil.example/payload', 'FALLBACK')).toBe('FALLBACK');
  });

  it('sanitizes image sources and rejects arbitrary SVG data URLs', () => {
    expect(sanitizeImageSrc(SAFE_FALLBACK_AVATAR_SVG)).toBe(SAFE_FALLBACK_AVATAR_SVG);
    expect(sanitizeImageSrc('data:image/png;base64,iVBORw0KGgo=')).toBe(
      'data:image/png;base64,iVBORw0KGgo='
    );
    expect(sanitizeImageSrc('data:image/svg+xml,<svg onload=alert(1)>')).toBe(
      SAFE_FALLBACK_PET_SVG
    );
    expect(sanitizeImageSrc('javascript:alert(1)')).toBe(SAFE_FALLBACK_PET_SVG);
  });

  it('sanitizes audio sources strictly to safe audio data URLs or http(s)/blob', () => {
    expect(sanitizeAudioSrc('data:audio/webm;base64,GkXfo59ChoEB')).toBe(
      'data:audio/webm;base64,GkXfo59ChoEB'
    );
    expect(sanitizeAudioSrc('https://cdn.example.com/voice.ogg')).toBe(
      'https://cdn.example.com/voice.ogg'
    );
    expect(sanitizeAudioSrc('javascript:alert(1)')).toBe('');
    expect(sanitizeAudioSrc('data:text/html;base64,PHNjcmlwdD4=')).toBe('');
  });

  it('sanitizes telephone links and strips unsafe characters', () => {
    expect(sanitizeTelUrl('+20 100-123-4567')).toBe('tel:+201001234567');
    expect(sanitizeTelUrl('01012345678;ext=1')).toBe('tel:010123456781');
    expect(sanitizeTelUrl('123')).toBe('#');
    expect(sanitizeTelUrl('javascript:alert(1)')).toBe('#');
  });

  it('validates uploaded files by MIME type and size limits', () => {
    expect(
      validateUploadedFile({ name: 'cat.jpg', type: 'image/jpeg', size: 200_000 }, 'image').valid
    ).toBe(true);
    expect(
      validateUploadedFile({ name: 'bad.svg', type: 'image/svg+xml', size: 1024 }, 'image').valid
    ).toBe(false);
    expect(
      validateUploadedFile({ name: 'huge.png', type: 'image/png', size: 20 * 1024 * 1024 }, 'image')
        .valid
    ).toBe(false);
    expect(
      validateUploadedFile({ name: 'empty.pdf', type: 'application/pdf', size: 0 }, 'document').valid
    ).toBe(false);
    expect(
      validateUploadedFile({ name: 'doc.pdf', type: 'application/pdf', size: 1024 }, 'document').valid
    ).toBe(true);
    expect(
      validateUploadedFile({ name: 'script.html', type: 'text/html', size: 512 }, 'document').valid
    ).toBe(false);
  });

  it('validates allowed OAuth deep links only', () => {
    expect(isSafeDeepLink('com.meow.app://auth-callback?code=abc')).toBe(true);
    expect(isSafeDeepLink('com.meow.app://other-host?code=abc')).toBe(false);
    expect(isSafeDeepLink('evil://auth-callback?code=abc')).toBe(false);
    expect(isSafeDeepLink('javascript:alert(1)')).toBe(false);
  });
});
