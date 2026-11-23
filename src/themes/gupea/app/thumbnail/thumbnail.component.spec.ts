import { TestBed } from '@angular/core/testing';
import { AuthService } from '@dspace/core/auth/auth.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { FileService } from '@dspace/core/shared/file.service';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ThemedLoadingComponent } from '../../../../app/shared/loading/themed-loading.component';
import { ThumbnailComponent } from './thumbnail.component';

describe('GUPEA thumbnail', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: AuthorizationDataService, useValue: {} },
        { provide: FileService, useValue: {} },
      ],
    }).overrideComponent(ThumbnailComponent, {
      remove: { imports: [ThemedLoadingComponent] },
      add: { imports: [MockComponent(ThemedLoadingComponent)] },
    });
  });

  it('renders no placeholder when a thumbnail is missing', () => {
    const fixture = TestBed.createComponent(ThumbnailComponent);
    fixture.componentRef.setInput('thumbnail', null);
    fixture.detectChanges();

    const thumbnail: HTMLElement = fixture.nativeElement;
    expect(thumbnail.querySelector('.thumbnail')?.children.length).toBe(0);
  });

  it('renders the image when a thumbnail is available', () => {
    const fixture = TestBed.createComponent(ThumbnailComponent);
    const href = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const bitstream = Object.assign(new Bitstream(), { _links: { content: { href } } });
    fixture.componentRef.setInput('thumbnail', bitstream);
    fixture.detectChanges();

    const thumbnail: HTMLElement = fixture.nativeElement;
    expect(thumbnail.querySelector('img')?.getAttribute('src')).toBe(href);
    fixture.componentInstance.successHandler();
    fixture.detectChanges();
    expect(thumbnail.querySelector('img')?.classList.contains('d-none')).toBeFalse();
  });
});
