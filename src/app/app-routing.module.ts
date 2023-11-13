import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {HomePageModule} from '@modules/home/home.module';
import {SettingsPageModule} from "@modules/settings/settings.module";
import {ListPageModule} from "@modules/list/list.module";
import {StoresPageModule} from "@modules/stores/stores.module";
import {QrCodePageModule} from "@modules/qr-code/qr-code.module";

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('@modules/home/home.module').then((m): typeof HomePageModule => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'list/:id',
    loadChildren: () => import('./modules/list/list.module').then((m): typeof ListPageModule => m.ListPageModule)
  },
  {
    path: 'stores',
    loadChildren: () => import('./modules/stores/stores.module').then((m): typeof StoresPageModule => m.StoresPageModule)
  },
  {
    path: 'qr-code',
    loadChildren: () => import('./modules/qr-code/qr-code.module').then((m): typeof QrCodePageModule => m.QrCodePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./modules/settings/settings.module').then((m): typeof SettingsPageModule => m.SettingsPageModule)
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
