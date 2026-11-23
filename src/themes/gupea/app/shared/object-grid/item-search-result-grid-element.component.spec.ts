import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { Item } from '@dspace/core/shared/item.model';
import { ItemSearchResult } from '@dspace/core/shared/object-collection/item-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { CollectionElementLinkType } from '../../../../../app/shared/object-collection/collection-element-link.type';
import { getListableObjectComponent } from '../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { TruncatableService } from '../../../../../app/shared/truncatable/truncatable.service';
import { LISTABLE_COMPONENTS } from '../../../lazy-listable-components';
import { ItemGridElementComponent } from './item-grid-element.component';
import { ItemSearchResultGridElementComponent } from './item-search-result-grid-element.component';

describe('GUPEA item grid cards', () => {
  const item = Object.assign(new Item(), { id: 'test-item', uuid: 'test-item', metadata: {} });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: DSONameService, useValue: { getHitHighlights: () => ({ value: 'Test item' }) } },
        { provide: BitstreamDataService, useValue: {} },
        {
          provide: TruncatableService,
          useValue: {
            collapse: () => undefined,
            isCollapsed: () => of(true),
          },
        },
      ],
    });
  });

  it('registers the GUPEA cards for generic items and publications', () => {
    expect(LISTABLE_COMPONENTS).toContain(ItemGridElementComponent);
    expect(LISTABLE_COMPONENTS).toContain(ItemSearchResultGridElementComponent);

    for (const type of [Item, 'Publication']) {
      expect(getListableObjectComponent([type], ViewMode.GridElement, undefined, 'gupea'))
        .toBe(ItemGridElementComponent);
    }

    for (const type of [ItemSearchResult, 'PublicationSearchResult']) {
      expect(getListableObjectComponent([type], ViewMode.GridElement, undefined, 'gupea'))
        .toBe(ItemSearchResultGridElementComponent);
    }
  });

  it('renders a linked search result without a thumbnail or an extra image link', () => {
    const fixture = TestBed.createComponent(ItemSearchResultGridElementComponent);
    fixture.componentRef.setInput('object', Object.assign(new ItemSearchResult(), {
      indexableObject: item,
      hitHighlights: {},
    }));
    fixture.componentRef.setInput('showLabel', false);
    fixture.detectChanges();

    const card: HTMLElement = fixture.nativeElement;
    expect(card.querySelector('ds-thumbnail, .card-img-top')).toBeNull();
    expect(Array.from(card.querySelectorAll('a'), link => link.getAttribute('href')))
      .toEqual(['/items/test-item']);
  });

  it('renders an unlinked direct item without a thumbnail or a navigation link', () => {
    const fixture = TestBed.createComponent(ItemGridElementComponent);
    fixture.componentRef.setInput('object', item);
    fixture.componentRef.setInput('showLabel', false);
    fixture.componentRef.setInput('linkType', CollectionElementLinkType.None);
    fixture.detectChanges();

    const card: HTMLElement = fixture.nativeElement;
    expect(card.querySelector('.card-title')?.textContent).toBe('Test item');
    expect(card.querySelector('ds-thumbnail, .card-img-top, a')).toBeNull();
  });
});
