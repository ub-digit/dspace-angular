import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { ContextHelpToggleComponent } from '../../../../app/header/context-help-toggle/context-help-toggle.component';
import { ThemedNavbarComponent } from '../../../../app/navbar/themed-navbar.component';
import { ThemedSearchNavbarComponent } from '../../../../app/search-navbar/themed-search-navbar.component';
import { ThemedAuthNavMenuComponent } from '../../../../app/shared/auth-nav-menu/themed-auth-nav-menu.component';
import { HostWindowService } from '../../../../app/shared/host-window.service';
import { ImpersonateNavbarComponent } from '../../../../app/shared/impersonate-navbar/impersonate-navbar.component';
import { ThemedLangSwitchComponent } from '../../../../app/shared/lang-switch/themed-lang-switch.component';
import { MenuService } from '../../../../app/shared/menu/menu.service';
import { MenuID } from '../../../../app/shared/menu/menu-id.model';
import { HeaderComponent } from './header.component';

describe('GUPEA HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let mobile$: BehaviorSubject<boolean>;
  let collapsed$: BehaviorSubject<boolean>;
  let menuService: jasmine.SpyObj<MenuService>;

  beforeEach(async () => {
    mobile$ = new BehaviorSubject(false);
    collapsed$ = new BehaviorSubject(true);
    menuService = jasmine.createSpyObj('MenuService', ['isMenuCollapsed', 'toggleMenu']);
    menuService.isMenuCollapsed.and.returnValue(collapsed$);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: MenuService, useValue: menuService },
        { provide: HostWindowService, useValue: { isUpTo: () => mobile$ } },
      ],
    }).overrideComponent(HeaderComponent, {
      remove: {
        imports: [
          ContextHelpToggleComponent,
          ImpersonateNavbarComponent,
          ThemedAuthNavMenuComponent,
          ThemedLangSwitchComponent,
          ThemedNavbarComponent,
          ThemedSearchNavbarComponent,
        ],
      },
      add: { schemas: [NO_ERRORS_SCHEMA] },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
  });

  it('shows the institutional logo in an accessible home link', () => {
    const logo = fixture.debugElement.query(By.css('#header-logo')).nativeElement as HTMLImageElement;
    expect(logo.getAttribute('src')).toBe('assets/gupea/images/gupea-logo.svg');
    expect(logo.getAttribute('alt')).toBe('menu.header.image.logo');
    expect(logo.closest('a').getAttribute('href')).toBe('/home');
    expect(logo.closest('a').getAttribute('aria-label')).toBe('home.title');
  });

  it('retains desktop navigation and all current DSpace header controls', () => {
    expect(fixture.debugElement.query(By.css('#desktop-navbar ds-navbar'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('#navbar-toggler'))).toBeNull();
    for (const selector of ['ds-search-navbar', 'ds-lang-switch', 'ds-context-help-toggle', 'ds-impersonate-navbar', 'ds-auth-nav-menu']) {
      expect(fixture.debugElement.query(By.css(selector))).not.toBeNull();
    }
  });

  it('switches to the mobile toggle and keeps its expansion state accessible', () => {
    mobile$.next(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#desktop-navbar'))).toBeNull();
    const toggle = fixture.debugElement.query(By.css('#navbar-toggler'));
    expect(toggle.attributes['aria-controls']).toBe('collapsible-mobile-navbar');
    expect(toggle.attributes['aria-expanded']).toBe('false');
    collapsed$.next(false);
    fixture.detectChanges();
    expect(toggle.nativeElement.getAttribute('aria-expanded')).toBe('true');
  });

  it('delegates mobile menu toggling to the public menu service', () => {
    mobile$.next(true);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('#navbar-toggler')).triggerEventHandler('click');
    expect(menuService.toggleMenu).toHaveBeenCalledWith(MenuID.PUBLIC);
  });
});
