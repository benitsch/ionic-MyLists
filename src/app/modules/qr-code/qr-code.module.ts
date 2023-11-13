import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {QrCodePage} from "@modules/qr-code/pages/qr-code/qr-code.page";
import {QrCodePageRoutingModule} from './qr-code-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrCodePageRoutingModule,
  ],
  declarations: [QrCodePage]
})
export class QrCodePageModule {
}
