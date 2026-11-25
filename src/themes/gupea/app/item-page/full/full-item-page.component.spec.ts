import {
  AsyncPipe,
  KeyValuePipe,
} from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActivatedRoute,
  provideRouter,
  RouterLink,
} from '@angular/router';
import { NotifyInfoService } from '@dspace/core/coar-notify/notify-info/notify-info.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { SignpostingDataService } from '@dspace/core/data/signposting-data.service';
import { LinkHeadService } from '@dspace/core/services/link-head.service';
import { ServerResponseService } from '@dspace/core/services/server-response.service';
import { Item } from '@dspace/core/shared/item.model';
import { createSuccessfulRemoteDataObject } from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { LinkifyPipe } from '../../../../../app/shared/utils/linkify.pipe';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { FullItemPageComponent } from './full-item-page.component';

describe('GUPEA full item metadata', () => {
  it('uses the last key segment as the accessible name and linkifies only constituent articles', () => {
    const url = 'https://example.org/article';
    const value = `Article: ${url}`;
    const item = Object.assign(new Item(), {
      uuid: 'test-item',
      metadata: {
        'dc.description': [{ value }],
        'dc.relation.haspart': [{ value }],
      },
    });

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { data: of({ dso: createSuccessfulRemoteDataObject(item) }) } },
        { provide: AuthorizationDataService, useValue: { isAuthorized: () => of(false) } },
        { provide: ItemDataService, useValue: {} },
        { provide: LinkHeadService, useValue: {} },
        { provide: NotifyInfoService, useValue: { isCoarConfigEnabled: () => of(false) } },
        { provide: ServerResponseService, useValue: {} },
        { provide: SignpostingDataService, useValue: {} },
      ],
    }).overrideComponent(FullItemPageComponent, {
      set: {
        imports: [AsyncPipe, KeyValuePipe, LinkifyPipe, RouterLink, TranslateModule, VarDirective],
        schemas: [NO_ERRORS_SCHEMA],
      },
    });

    const fixture = TestBed.createComponent(FullItemPageComponent);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    const hasPartHeader = host.querySelector('th[aria-label="haspart"]');
    expect(hasPartHeader?.getAttribute('scope')).toBe('row');
    expect(hasPartHeader?.querySelector('[aria-hidden="true"]')?.textContent).toBe('dc.relation.haspart');
    const hasPartLink = hasPartHeader?.closest('tr')?.querySelector('a');
    expect(hasPartLink?.getAttribute('href')).toBe(url);
    expect(hasPartLink?.target).toBe('_blank');
    expect(hasPartLink?.rel).toBe('noopener noreferrer');
    const descriptionRow = host.querySelector('th[aria-label="description"]')?.closest('tr');
    expect(descriptionRow?.querySelector('td')?.textContent).toBe(value);
    expect(descriptionRow?.querySelector('a')).toBeNull();
  });
});
