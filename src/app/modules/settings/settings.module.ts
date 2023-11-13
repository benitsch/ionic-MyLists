import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SettingsPage} from "@modules/settings/pages/settings/settings.page";
import {SettingsPageRoutingModule} from './settings-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {
}
