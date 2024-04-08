import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {UserEditPage} from "@modules/user-edit/pages/user-edit/user-edit.page";
import {UserEditPageRoutingModule} from './user-edit-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserEditPageRoutingModule,
  ],
  declarations: [UserEditPage]
})
export class UserEditPageModule {
}
