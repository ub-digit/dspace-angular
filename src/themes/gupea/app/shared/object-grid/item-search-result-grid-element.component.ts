import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Context } from '@dspace/core/shared/context.model';
import { ItemSearchResult } from '@dspace/core/shared/object-collection/item-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { TranslateModule } from '@ngx-translate/core';

import { focusShadow } from '../../../../../app/shared/animations/focus';
import { MetadataDirective } from '../../../../../app/shared/metadata.directive';
import { ThemedBadgesComponent } from '../../../../../app/shared/object-collection/shared/badges/themed-badges.component';
import { listableObjectComponent } from '../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemSearchResultGridElementComponent as BaseComponent } from '../../../../../app/shared/object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component';
import { TruncatableComponent } from '../../../../../app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../app/shared/truncatable/truncatable-part/truncatable-part.component';

@listableObjectComponent('PublicationSearchResult', ViewMode.GridElement, Context.Any, 'gupea')
@listableObjectComponent(ItemSearchResult, ViewMode.GridElement, Context.Any, 'gupea')
@Component({
  selector: 'ds-item-search-result-grid-element',
  styleUrls: ['../../../../../app/shared/object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component.scss'],
  templateUrl: './item-search-result-grid-element.component.html',
  animations: [focusShadow],
  imports: [
    AsyncPipe,
    MetadataDirective,
    RouterLink,
    ThemedBadgesComponent,
    TranslateModule,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
})
/** GUPEA item search grid card. */
export class ItemSearchResultGridElementComponent extends BaseComponent {}
