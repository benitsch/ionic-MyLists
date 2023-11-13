import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {StoresPage} from "@modules/stores/pages/stores/stores.page";
import {StoresPageRoutingModule} from './stores-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoresPageRoutingModule,
  ],
  declarations: [StoresPage]
})
export class StoresPageModule {
}
