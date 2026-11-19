import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { MarkdownViewerComponent } from '../../../../../app/shared/markdown-viewer/markdown-viewer.component';
import { HomeNewsComponent as BaseComponent } from '../../../../dspace/app/home-page/home-news/home-news.component';

@Component({
  selector: 'ds-themed-home-news',
  styleUrls: ['../../../../dspace/app/home-page/home-news/home-news.component.scss'],
  templateUrl: './home-news.component.html',
  imports: [
    AsyncPipe,
    MarkdownViewerComponent,
    TranslatePipe,
  ],
})

/**
 * Component to render the news section on the home page
 */
export class HomeNewsComponent extends BaseComponent {}
