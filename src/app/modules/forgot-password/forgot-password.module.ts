import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ForgotPasswordPage} from "@modules/forgot-password/pages/forgot-password/forgot-password.page";
import {ForgotPasswordPageRoutingModule} from './forgot-password-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotPasswordPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ForgotPasswordPage]
})
export class ForgotPasswordPageModule {
}
