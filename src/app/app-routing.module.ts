import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {HomePageModule} from '@modules/home/home.module';
import {SettingsPageModule} from "@modules/settings/settings.module";
import {ListPageModule} from "@modules/list/list.module";
import {StoresPageModule} from "@modules/stores/stores.module";
import {QrCodePageModule} from "@modules/qr-code/qr-code.module";
import {LoginPageModule} from "@modules/login/login.module";
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
  emailVerified,
  AuthPipeGenerator
} from "@angular/fire/auth-guard";
import {ForgotPasswordPageModule} from "@modules/forgot-password/forgot-password.module";
import {RegisterPageModule} from "@modules/register/register.module";
import {map} from "rxjs";
import {User} from "@angular/fire/auth";
import {UserEditPageModule} from "@modules/user-edit/user-edit.module";

const redirectVerifiedUser: AuthPipeGenerator = () =>
  map((user: User | null) => user?.emailVerified ? ['home'] : true);

const redirectUnauthorizedOrUnverifiedUser: AuthPipeGenerator = () =>
  map((user: User | null) => {
    if (!user) {
      return ['']
    }
    return user.emailVerified ? true : [''];
  });

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@modules/login/login.module').then((m): typeof LoginPageModule => m.LoginPageModule),
    ...canActivate(redirectVerifiedUser),
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./modules/forgot-password/forgot-password.module').then((m): typeof ForgotPasswordPageModule => m.ForgotPasswordPageModule),
    ...canActivate(redirectVerifiedUser),
  },
  {
    path: 'register',
    loadChildren: () => import('./modules/register/register.module').then((m): typeof RegisterPageModule => m.RegisterPageModule),
    ...canActivate(redirectVerifiedUser),
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then((m): typeof HomePageModule => m.HomePageModule),
    ...canActivate(redirectUnauthorizedOrUnverifiedUser),
  },
  {
    path: 'list/:id',
    loadChildren: () => import('./modules/list/list.module').then((m): typeof ListPageModule => m.ListPageModule),
    ...canActivate(redirectUnauthorizedOrUnverifiedUser),
  },
  {
    path: 'stores',
    loadChildren: () => import('./modules/stores/stores.module').then((m): typeof StoresPageModule => m.StoresPageModule),
    ...canActivate(redirectUnauthorizedOrUnverifiedUser),
  },
  {
    path: 'user-edit',
    loadChildren: () => import('./modules/user-edit/user-edit.module').then((m): typeof UserEditPageModule => m.UserEditPageModule),
    ...canActivate(redirectUnauthorizedOrUnverifiedUser),
  },
  {
    path: 'qr-code',
    loadChildren: () => import('./modules/qr-code/qr-code.module').then((m): typeof QrCodePageModule => m.QrCodePageModule),
    ...canActivate(redirectUnauthorizedOrUnverifiedUser),
  },
  {
    path: 'settings',
    loadChildren: () => import('./modules/settings/settings.module').then((m): typeof SettingsPageModule => m.SettingsPageModule),
    ...canActivate(redirectUnauthorizedOrUnverifiedUser),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
