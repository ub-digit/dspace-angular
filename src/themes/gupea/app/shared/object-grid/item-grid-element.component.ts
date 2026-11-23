import { Component } from '@angular/core';
import { Context } from '@dspace/core/shared/context.model';
import { Item } from '@dspace/core/shared/item.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';

import { listableObjectComponent } from '../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemGridElementComponent as BaseComponent } from '../../../../../app/shared/object-grid/item-grid-element/item-types/item/item-grid-element.component';
import { ItemSearchResultGridElementComponent } from './item-search-result-grid-element.component';

/** Apply the GUPEA grid card to direct item collections. */
@listableObjectComponent('Publication', ViewMode.GridElement, Context.Any, 'gupea')
@listableObjectComponent(Item, ViewMode.GridElement, Context.Any, 'gupea')
@Component({
  selector: 'ds-item-grid-element',
  styleUrls: ['../../../../../app/shared/object-grid/item-grid-element/item-types/item/item-grid-element.component.scss'],
  templateUrl: '../../../../../app/shared/object-grid/item-grid-element/item-types/item/item-grid-element.component.html',
  imports: [
    ItemSearchResultGridElementComponent,
  ],
})
export class ItemGridElementComponent extends BaseComponent {}
