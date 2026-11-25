/* eslint-disable dspace-angular-ts/themed-component-usages */
import { HeaderComponent } from './app/header/header.component';
import { HomeNewsComponent } from './app/home-page/home-news/home-news.component';
import { TopLevelCommunityListComponent } from './app/home-page/top-level-community-list/top-level-community-list.component';
import { LogInComponent } from './app/shared/log-in/log-in.component';

/**
 * GUPEA eager overrides; other components are supplied by the DSpace parent theme.
 */
export const COMPONENTS = [
  HeaderComponent,
  HomeNewsComponent,
  LogInComponent,
  TopLevelCommunityListComponent,
];
