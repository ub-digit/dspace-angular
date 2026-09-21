import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'linkify',
  standalone: true,
})
export class LinkifyPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';

    // Step 1: Escape HTML special characters to neutralize rogue tags/scripts
    const escapedText = value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // Step 2: Match valid URLs (including those followed by trailing punctuation)
    const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;

    // Step 3: Replace URLs with safe <a> tags
    const linkified = escapedText.replace(urlRegex, (url) => {
      // url is already HTML-escaped from Step 1
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    // Step 4: Safely trust HTML since all non-anchor tags are escaped
    return this.sanitizer.bypassSecurityTrustHtml(linkified);
  }
}
