import { AuthService } from '@dspace/core/auth/auth.service';
import { AuthMethod } from '@dspace/core/auth/models/auth.method';
import { AuthMethodType } from '@dspace/core/auth/models/auth.method-type';
import { CoreState } from '@dspace/core/core-state.model';
import { Store } from '@ngrx/store';
import {
  firstValueFrom,
  of,
} from 'rxjs';

import { AuthMethodsService } from '../../../../../app/shared/log-in/services/auth-methods.service';
import { LogInComponent } from './log-in.component';

describe('GUPEA LogInComponent', () => {
  it('suppresses password sign-in and passes the caller exclusion to DSpace', async () => {
    const oidc = new AuthMethod(AuthMethodType.Oidc, 1);
    const password = new AuthMethod(AuthMethodType.Password, 0);
    const authMethodsService = jasmine.createSpyObj<AuthMethodsService>('AuthMethodsService', {
      getAuthMethods: of([password, oidc]),
    });
    const store = jasmine.createSpyObj<Store<CoreState>>('Store', { pipe: of(undefined) });
    const component = new LogInComponent(store, {} as AuthService, authMethodsService);
    component.excludedAuthMethod = AuthMethodType.Shibboleth;
    component.ngOnInit();

    expect(authMethodsService.getAuthMethods).toHaveBeenCalledWith(jasmine.any(Map), AuthMethodType.Shibboleth);
    expect(await firstValueFrom(component.authMethods)).toEqual([oidc]);
  });
});
