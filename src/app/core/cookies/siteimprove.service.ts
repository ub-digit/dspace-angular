import {
  DOCUMENT,
  inject,
  Injectable,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
} from '@angular/router';
import { filter } from 'rxjs';

type SiteimproveCommand = ['notrack', boolean] | ['trackdynamic', { url: string; ref: string; title: string }];
type SiteimproveWindow = Window & { _sz?: SiteimproveCommand[] };

/** Connects the consent manager and Angular navigation to Siteimprove Analytics. */
@Injectable({ providedIn: 'root' })
export class SiteimproveService {
  private readonly document = inject(DOCUMENT);
  private readonly window = this.document.defaultView as SiteimproveWindow;
  private consent = false;
  private script?: HTMLScriptElement;
  private previousUrl?: string;

  constructor() {
    inject(Router).events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(),
    ).subscribe(() => this.trackNavigation());
  }

  /** Load the production script on consent and stop tracking when consent is withdrawn. */
  setConsent(granted: boolean): void {
    if (granted === this.consent || !this.window) {
      return;
    }
    this.consent = granted;

    if (this.script) {
      this.send(['notrack', !granted]);
      if (granted && this.previousUrl) {
        this.previousUrl = this.currentPageUrl();
      }
      return;
    }

    if (granted) {
      this.send(['notrack', false]);
      const script = this.document.createElement('script');
      script.id = 'siteimprove-analytics';
      script.async = true;
      script.src = 'https://siteimproveanalytics.com/js/siteanalyze_7340.js';
      script.addEventListener('load', () => {
        // The vendor script records the initial page view itself.
        this.previousUrl = this.currentPageUrl();
      }, { once: true });
      script.addEventListener('error', () => {
        script.remove();
        this.script = undefined;
        this.consent = false;
      }, { once: true });
      this.script = script;
      this.document.body.appendChild(script);
    }
  }

  private trackNavigation(): void {
    if (!this.consent || !this.previousUrl) {
      return;
    }
    const url = this.currentPageUrl();
    if (url !== this.previousUrl) {
      this.send(['trackdynamic', { url, ref: this.previousUrl, title: this.document.title }]);
      this.previousUrl = url;
    }
  }

  private currentPageUrl(): string {
    const { origin, pathname } = this.window.location;
    return origin + pathname;
  }

  private send(command: SiteimproveCommand): void {
    (this.window._sz ??= []).push(command);
  }
}
