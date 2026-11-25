import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { AuthMethodType } from '@dspace/core/auth/models/auth.method-type';
import { map } from 'rxjs';

import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { LogInContainerComponent } from '../../../../../app/shared/log-in/container/log-in-container.component';
import { LogInComponent as BaseComponent } from '../../../../../app/shared/log-in/log-in.component';

@Component({
  selector: 'ds-themed-log-in',
  templateUrl: '../../../../../app/shared/log-in/log-in.component.html',
  styleUrls: ['../../../../../app/shared/log-in/log-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    LogInContainerComponent,
    ThemedLoadingComponent,
  ],
})
/** Shows the available non-password sign-in methods for GUPEA. */
export class LogInComponent extends BaseComponent {
  /** Preserve caller exclusions and hide password sign-in in the GUPEA UI. */
  override ngOnInit(): void {
    super.ngOnInit();
    this.authMethods = this.authMethods.pipe(
      map(methods => methods.filter(method => method.authMethodType !== AuthMethodType.Password)),
    );
  }
}
