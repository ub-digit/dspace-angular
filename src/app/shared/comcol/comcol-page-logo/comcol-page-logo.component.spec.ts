import { TestBed } from '@angular/core/testing';
import { Bitstream } from '@dspace/core/shared/bitstream.model';

import { ComcolPageLogoComponent } from './comcol-page-logo.component';

describe('ComcolPageLogoComponent', () => {
  it('uses the GUPEA 8.x SVG sizing and aspect ratio when a logo fails to load', () => {
    const fixture = TestBed.createComponent(ComcolPageLogoComponent);
    fixture.componentRef.setInput('logo', Object.assign(new Bitstream(), {
      _links: { content: { href: '/missing-logo.png' } },
    }));
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    const image = host.querySelector('img');
    image.dispatchEvent(new Event('error'));

    const svg = new DOMParser().parseFromString(decodeURIComponent(image.src.split(',')[1]), 'image/svg+xml');
    expect(svg.documentElement.getAttribute('viewBox')).toBe('0 0 93 120');
    expect(svg.documentElement.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet');
    expect(svg.documentElement.hasAttribute('width')).toBeFalse();
    expect(svg.documentElement.hasAttribute('height')).toBeFalse();
  });
});
