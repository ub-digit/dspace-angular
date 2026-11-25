import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  NavigationEnd,
  Router,
} from '@angular/router';
import { Subject } from 'rxjs';

import { SiteimproveService } from './siteimprove.service';

describe('SiteimproveService', () => {
  let service: SiteimproveService;
  let analyticsDocument: Document;
  let navigation: Subject<NavigationEnd>;
  let analyticsWindow: { location: { origin: string; pathname: string }; _sz?: unknown[] };

  beforeEach(() => {
    analyticsDocument = document.implementation.createHTMLDocument('GUPEA');
    analyticsWindow = { location: { origin: 'https://example.org', pathname: '/home' } };
    Object.defineProperty(analyticsDocument, 'defaultView', { value: analyticsWindow });
    navigation = new Subject<NavigationEnd>();
    TestBed.configureTestingModule({
      providers: [
        { provide: DOCUMENT, useValue: analyticsDocument },
        { provide: Router, useValue: { events: navigation } },
      ],
    });
    service = TestBed.inject(SiteimproveService);
  });

  it('inserts the production analytics script only after consent, once', () => {
    service.setConsent(false);
    expect(analyticsDocument.querySelector('script')).toBeNull();
    expect(analyticsWindow._sz).toBeUndefined();

    service.setConsent(true);
    service.setConsent(true);
    service.setConsent(false);
    service.setConsent(true);

    const scripts = analyticsDocument.querySelectorAll('script');
    expect(scripts.length).toBe(1);
    expect(scripts[0].src).toBe('https://siteimproveanalytics.com/js/siteanalyze_7340.js');
    expect(analyticsWindow._sz).toEqual([
      ['notrack', false],
      ['notrack', true],
      ['notrack', false],
    ]);
  });

  it('tracks subsequent changes of page once and stops on withdrawal', () => {
    service.setConsent(true);
    analyticsDocument.querySelector('script').dispatchEvent(new Event('load'));
    navigation.next(new NavigationEnd(1, '/home', '/home'));
    expect(analyticsWindow._sz.length).toBe(1);

    analyticsWindow.location.pathname = '/items/example';
    analyticsDocument.title = 'GUPEA item';
    navigation.next(new NavigationEnd(2, '/items/example', '/items/example'));
    navigation.next(new NavigationEnd(3, '/items/example', '/items/example'));
    expect(analyticsWindow._sz).toEqual([
      ['notrack', false],
      ['trackdynamic', {
        url: 'https://example.org/items/example',
        ref: 'https://example.org/home',
        title: 'GUPEA item',
      }],
    ]);

    service.setConsent(false);
    analyticsWindow.location.pathname = '/search';
    navigation.next(new NavigationEnd(4, '/search', '/search'));
    expect(analyticsWindow._sz.slice(2)).toEqual([['notrack', true]]);
  });
});
