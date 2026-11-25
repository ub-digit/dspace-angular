import {
  Pipe,
  PipeTransform,
} from '@angular/core';
import escape from 'lodash/escape';

/**
 * Render explicit HTTP(S) URLs in plain metadata while escaping the input as text.
 */
@Pipe({ name: 'dsLinkify' })
export class LinkifyPipe implements PipeTransform {
  /** Return HTML for Angular to sanitize at the binding. */
  transform(value: string | null | undefined): string {
    const text = value ?? '';
    const urlPattern = /\bhttps?:\/\/[^\s<>"'`\\]+/gi;
    let result = '';
    let offset = 0;

    for (const match of text.matchAll(urlPattern)) {
      const index = match.index;
      let url = match[0].replace(/[.,;:!?]+$/, '');

      // Keep balanced brackets, such as those in Wikipedia titles or IPv6 hosts.
      while (/[)\]}]$/.test(url)) {
        const closing = url.at(-1);
        const opening = { ')': '(', ']': '[', '}': '{' }[closing];
        if (url.split(closing).length <= url.split(opening).length) {
          break;
        }
        url = url.slice(0, -1).replace(/[.,;:!?]+$/, '');
      }

      let href: string;
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          continue;
        }
        href = parsed.href;
      } catch {
        continue;
      }

      result += escape(text.slice(offset, index));
      result += `<a href="${escape(href)}" target="_blank" rel="noopener noreferrer">${escape(url)}</a>`;
      offset = index + url.length;
    }

    return result + escape(text.slice(offset));
  }
}
